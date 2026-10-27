/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { BarrierId } from '../../store/useSakshamStore';

export type JourneyStepId = 'barriers' | 'document' | 'book-help' | 'track' | 'summary';

export interface JourneyStepDef {
  id: JourneyStepId;
  stepNumber: number;
  label: string;
  shortLabel: string;
  description: string;
}

/**
 * Exact 5-step journey stepper as required:
 * Barriers -> Document -> Book help -> Track -> Summary
 */
export const JOURNEY_STEPS: JourneyStepDef[] = [
  {
    id: 'barriers',
    stepNumber: 1,
    label: 'Barriers',
    shortLabel: 'Barriers',
    description: 'Select accessibility accommodations & requirements',
  },
  {
    id: 'document',
    stepNumber: 2,
    label: 'Document',
    shortLabel: 'Document',
    description: 'AI Laplacian scan of hospital disability certificate',
  },
  {
    id: 'book-help',
    stepNumber: 3,
    label: 'Book help',
    shortLabel: 'Book help',
    description: 'Help request (demo): the hospital still decides the date.',
  },
  {
    id: 'track',
    stepNumber: 4,
    label: 'Track',
    shortLabel: 'Track',
    description: 'Live application timeline and government status',
  },
  {
    id: 'summary',
    stepNumber: 5,
    label: 'Summary',
    shortLabel: 'Summary',
    description: 'Official digital UDID card pass and entitlements receipt',
  },
];

/**
 * Checks if the "Book help" step is needed.
 * Requirement: Shown only when "travel" or "caregiver" is selected.
 * Otherwise it shows "Skipped (not needed)", still openable.
 */
export function isBookHelpNeeded(barriers: BarrierId[]): boolean {
  return barriers.includes('travel') || barriers.includes('caregiver');
}

// Backward-compatible alias
export const isVisitHelpNeeded = isBookHelpNeeded;

export interface ReachabilityResult {
  allowed: boolean;
  reason?: string;
}

import { calculateReadiness, type DocumentSlotRecord, type SlotId } from './documentChecklist';

export interface JourneyContext {
  barriers: BarrierId[];
  scanPassed: boolean;
  bookingStatus: string;
  documents?: Record<SlotId, DocumentSlotRecord> | Record<string, any>;
}

/**
 * Evaluates whether a user can navigate to a specific step.
 * Steps that are not yet reachable are disabled with a reason.
 */
export function checkStepReachability(
  targetStep: JourneyStepId,
  context: JourneyContext
): ReachabilityResult {
  // Step 1: Barriers is always reachable
  if (targetStep === 'barriers') {
    return { allowed: true };
  }

  // Step 2: Document is always reachable
  if (targetStep === 'document') {
    return { allowed: true };
  }

  // Step 3: Book help is openable even if skipped ("Skipped (not needed)")
  if (targetStep === 'book-help') {
    return { allowed: true };
  }

  const docsMet = context.documents ? calculateReadiness(context.documents as any).canContinue : false;
  const isDocReady = context.scanPassed || docsMet;

  // Step 4: Track requires document readiness check first
  if (targetStep === 'track') {
    if (!isDocReady) {
      return {
        allowed: false,
        reason: 'Complete document readiness check in Step 2 to track your application',
      };
    }
    return { allowed: true };
  }

  // Step 5: Summary requires document readiness check first
  if (targetStep === 'summary') {
    if (!isDocReady) {
      return {
        allowed: false,
        reason: 'Complete document readiness check in Step 2 to view your UDID summary',
      };
    }
    return { allowed: true };
  }

  return { allowed: true };
}

/**
 * Helper to normalize any screen alias to a canonical JourneyStepId.
 */
export function normalizeJourneyStep(screen: string): JourneyStepId {
  if (screen === 'onboarding' || screen === 'barriers') return 'barriers';
  if (screen === 'document' || screen === 'documents') return 'document';
  if (screen === 'book-help' || screen === 'visit-help') return 'book-help';
  if (screen === 'track') return 'track';
  if (screen === 'summary' || screen === 'dashboard') return 'summary';
  return 'barriers';
}

/**
 * Determines whether a step is completed to show a checkmark icon (not color alone).
 */
export function isStepCompleted(
  step: JourneyStepId,
  activeStep: string,
  context: JourneyContext
): boolean {
  const currentCanonical = normalizeJourneyStep(activeStep);
  const stepIdx = JOURNEY_STEPS.findIndex((s) => s.id === step);
  const currentIdx = JOURNEY_STEPS.findIndex((s) => s.id === currentCanonical);

  if (activeStep === 'home') return false;

  switch (step) {
    case 'barriers':
      // Completed once user moves past barriers
      return currentIdx > 0;
    case 'document': {
      const docOk = context.scanPassed || (context.documents ? calculateReadiness(context.documents as any).canContinue : false);
      return docOk && currentIdx > 1;
    }
    case 'book-help':
      // Completed if not needed (skipped), or booking confirmed, or progressed past
      return (
        !isBookHelpNeeded(context.barriers) ||
        context.bookingStatus === 'confirmed' ||
        context.bookingStatus === 'scheduled' ||
        currentIdx > 2
      );
    case 'track':
      // Completed if moved to summary
      return currentIdx > 3;
    case 'summary':
      return false; // Terminal step
    default:
      return false;
  }
}
