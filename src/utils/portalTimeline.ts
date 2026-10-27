/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PortalStageId =
  | 'started'
  | 'documents_ready'
  | 'submitted_portal'
  | 'hospital_visit'
  | 'verification'
  | 'approved'
  | 'ready_download';

export interface PortalStageDef {
  id: PortalStageId;
  stageNumber: number;
  title: string;
  shortTitle: string;
  description: string;
  actor: 'app_state' | 'user_confirmed' | 'demo_advanced';
}

export const PORTAL_STAGES: PortalStageDef[] = [
  {
    id: 'started',
    stageNumber: 1,
    title: '1. Started in Saksham',
    shortTitle: 'Started',
    description: 'Accessibility profile configured and application begun.',
    actor: 'app_state',
  },
  {
    id: 'documents_ready',
    stageNumber: 2,
    title: '2. Documents ready',
    shortTitle: 'Documents ready',
    description: 'Documents checked for clarity and readiness in Saksham.',
    actor: 'app_state',
  },
  {
    id: 'submitted_portal',
    stageNumber: 3,
    title: '3. Submitted on the official portal',
    shortTitle: 'Submitted on portal',
    description: 'Application submitted on Swavlamban portal with reference number.',
    actor: 'user_confirmed',
  },
  {
    id: 'hospital_visit',
    stageNumber: 4,
    title: '4. Visit hospital / CMO office (with printed receipt)',
    shortTitle: 'Hospital / CMO visit',
    description: 'In-person medical assessment attended with printed application receipt.',
    actor: 'user_confirmed',
  },
  {
    id: 'verification',
    stageNumber: 5,
    title: '5. Verification and assessment',
    shortTitle: 'Verification & assessment',
    description: 'Medical board specialist evaluation and document authentication.',
    actor: 'demo_advanced',
  },
  {
    id: 'approved',
    stageNumber: 6,
    title: '6. Approved',
    shortTitle: 'Approved',
    description: 'State Medical Authority approved disability certificate & ID issuance.',
    actor: 'demo_advanced',
  },
  {
    id: 'ready_download',
    stageNumber: 7,
    title: '7. e-UDID ready to download on the portal',
    shortTitle: 'e-UDID ready to download',
    description: 'Unique Disability ID card ready for download on official portal.',
    actor: 'demo_advanced',
  },
];

export interface PortalTimelineContext {
  scanPassed: boolean;
  isPortalSubmitted: boolean;
  portalReferenceNumber: string;
  hasVisitedHospital: boolean;
  demoAdvancedStage: 'none' | 'verification' | 'approved' | 'ready_download';
  correctionsRequested: boolean;
  correctionReason?: string;
}

export type StageDisplayStatus = 'completed' | 'current' | 'corrections_requested' | 'locked';

/**
 * Computes the display status of each of the 7 stages based on the portal timeline rules:
 * - Stages 1-2 derive from app state.
 * - Stages 3-4 are user-confirmed.
 * - Stages 5-7 advance only through the Demo tools "Simulate next status" button.
 * - If correctionsRequested is true during verification, stage 5 shows corrections_requested.
 */
export function getStageStatus(
  stageId: PortalStageId,
  context: PortalTimelineContext
): StageDisplayStatus {
  const {
    scanPassed,
    isPortalSubmitted,
    hasVisitedHospital,
    demoAdvancedStage,
    correctionsRequested,
  } = context;

  switch (stageId) {
    case 'started':
      // Always completed once user is in Saksham
      return 'completed';

    case 'documents_ready':
      return scanPassed ? 'completed' : 'current';

    case 'submitted_portal':
      if (!scanPassed) return 'locked';
      return isPortalSubmitted ? 'completed' : 'current';

    case 'hospital_visit':
      if (!isPortalSubmitted) return 'locked';
      return hasVisitedHospital ? 'completed' : 'current';

    case 'verification':
      if (!hasVisitedHospital) return 'locked';
      if (demoAdvancedStage === 'none') return 'current';
      if (correctionsRequested && demoAdvancedStage === 'verification') {
        return 'corrections_requested';
      }
      if (demoAdvancedStage === 'verification') return 'current';
      return 'completed'; // approved or ready_download

    case 'approved':
      if (demoAdvancedStage === 'none' || demoAdvancedStage === 'verification') {
        return 'locked';
      }
      if (demoAdvancedStage === 'approved') return 'current';
      return 'completed'; // ready_download

    case 'ready_download':
      if (demoAdvancedStage === 'ready_download') return 'completed';
      return 'locked';

    default:
      return 'locked';
  }
}

/**
 * Pure helper for "Simulate next status" button in Demo tools.
 * Only advances stages 5-7.
 */
export function getNextSimulatedStage(
  currentStage: 'none' | 'verification' | 'approved' | 'ready_download',
  hasVisitedHospital: boolean
): 'none' | 'verification' | 'approved' | 'ready_download' {
  if (!hasVisitedHospital) {
    return 'none';
  }
  if (currentStage === 'none') {
    return 'verification';
  }
  if (currentStage === 'verification') {
    return 'approved';
  }
  if (currentStage === 'approved') {
    return 'ready_download';
  }
  return 'ready_download';
}
