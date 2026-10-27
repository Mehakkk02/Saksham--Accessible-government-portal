/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BarrierOption {
  id: 'reading' | 'hearing' | 'travel' | 'caregiver';
  title: string;
  subtitle: string;
  description: string;
  iconName: 'EyeOff' | 'EarOff' | 'Wheelchair' | 'Users';
  tag: string;
  voicePrompt: string;
}

export const BARRIERS_DATA: BarrierOption[] = [
  {
    id: 'reading',
    title: 'I cannot read easily',
    subtitle: 'Visual & Cognitive Assistance',
    description: 'We will activate high-contrast modes, large clear fonts, audio narration, and plain-language summaries.',
    iconName: 'EyeOff',
    tag: 'Audio + High Contrast',
    voicePrompt: 'Option one: I cannot read easily. Select this for voice narration, larger fonts, and simplified text.',
  },
  {
    id: 'hearing',
    title: 'I cannot hear',
    subtitle: 'Visual Cues & Haptic Alerts',
    description: 'We will provide visual alerts, video sign guides, closed captions, and SMS-first appointment reminders.',
    iconName: 'EarOff',
    tag: 'Visual Only + Captions',
    voicePrompt: 'Option two: I cannot hear. Select this for visual-only guidance, clear status indicators, and SMS alerts.',
  },
  {
    id: 'travel',
    title: 'I cannot travel',
    subtitle: 'Home Visit & Doorstep Verification',
    description: 'Government medical board will schedule home verification or biometric capture at your doorstep.',
    iconName: 'Wheelchair',
    tag: 'Doorstep Verification',
    voicePrompt: 'Option three: I cannot travel. Select this to request doorstep verification by a government medical team.',
  },
  {
    id: 'caregiver',
    title: 'I need a caregiver',
    subtitle: 'Co-Applicant & Shared Access',
    description: 'Grant a trusted family member or caregiver permission to manage your application and receive updates.',
    iconName: 'Users',
    tag: 'Caregiver Assisted',
    voicePrompt: 'Option four: I need a caregiver. Select this to add a co-signer or caregiver to assist you with the process.',
  },
];

export interface UIAdaptations {
  largeText: boolean;
  highContrast: boolean;
  voiceFirst: boolean;
  visualAlertsOnly: boolean;
  doorstepAssistance: boolean;
  caregiverCoSign: boolean;
  activeBarrierCount: number;
}

export function computeAccommodations(selectedBarriers: string[]): UIAdaptations {
  const set = new Set(selectedBarriers);
  return {
    largeText: set.has('reading'),
    highContrast: set.has('reading'),
    voiceFirst: set.has('reading'),
    visualAlertsOnly: set.has('hearing'),
    doorstepAssistance: set.has('travel'),
    caregiverCoSign: set.has('caregiver'),
    activeBarrierCount: selectedBarriers.length,
  };
}

export interface DocumentVerificationInput {
  hasHospitalSeal: boolean;
  isClearResolution: boolean;
  hasMedicalRegNumber: boolean;
  hasDisabilityPercent: boolean;
}

export interface ExtractedDocumentData {
  applicantName: string;
  disabilityType: string;
  disabilityPercentage: string;
  issuingHospital: string;
  certificateNumber: string;
  verifiedDate?: string;
  doctorRegistration: string;
}

export interface VerificationResult {
  isValid: boolean;
  confidenceScore: number;
  badge: 'AUTHENTIC' | 'NEEDS_RESUBMISSION';
  feedbackTitle: string;
  feedbackMessage: string;
  extractedData?: ExtractedDocumentData;
  missingItems?: string[];
}

export function evaluateDocument(input: DocumentVerificationInput): VerificationResult {
  const { hasHospitalSeal, isClearResolution, hasMedicalRegNumber, hasDisabilityPercent } = input;

  const missingItems: string[] = [];
  if (!hasHospitalSeal) missingItems.push("Official hospital or medical board seal");
  if (!isClearResolution) missingItems.push("Sharp image resolution without blur or glare");
  if (!hasMedicalRegNumber) missingItems.push("Medical council registration number of the certifying doctor");
  if (!hasDisabilityPercent) missingItems.push("Disability percentage figure (e.g., 40% or above)");

  const isApproved = hasHospitalSeal && isClearResolution && hasMedicalRegNumber && hasDisabilityPercent;

  if (isApproved) {
    return {
      isValid: true,
      confidenceScore: 98.4,
      badge: 'AUTHENTIC',
      feedbackTitle: 'Document Clarity Check Passed',
      feedbackMessage: 'All clear! Your government medical disability certificate image looks clear with visible seals, valid medical registration, and legible disability percentage.',
      extractedData: {
        applicantName: 'Aarav Sharma',
        disabilityType: 'Locomotor Disability (Bilateral)',
        disabilityPercentage: '65% (Permanent)',
        issuingHospital: 'All India Institute of Medical Sciences (AIIMS)',
        certificateNumber: 'UDID-CERT-2024-88912',
        verifiedDate: '26 Oct 2026',
        doctorRegistration: 'MCI-REG-94821',
      },
    };
  }

  return {
    isValid: false,
    confidenceScore: 42.1,
    badge: 'NEEDS_RESUBMISSION',
    feedbackTitle: 'Document Needs Better Photo',
    feedbackMessage: `We could not clearly detect some required details: ${missingItems.join(', ')}. Please retake the photo in bright daylight on a flat surface without camera flash reflection.`,
    missingItems,
  };
}
