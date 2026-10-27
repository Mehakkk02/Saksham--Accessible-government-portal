/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import {
  computeAccommodations,
  evaluateDocument,
  type UIAdaptations,
  type VerificationResult,
  type BarrierOption,
  BARRIERS_DATA,
} from '../src/utils/accessibility';
import {
  type SlotId,
  type SlotStatus,
  type DocumentSlotRecord,
  INITIAL_DOCUMENTS_STATE,
  calculateReadiness,
} from '../src/utils/documentChecklist';
import { speakText, stopSpeaking as stopGlobalSpeaking } from '../src/utils/speech';
import { appStorage } from '../src/utils/storage';

export type BarrierId = 'reading' | 'hearing' | 'travel' | 'caregiver';

export type ScreenId =
  | 'home'
  | 'onboarding'
  | 'barriers'
  | 'document'
  | 'documents'
  | 'formprep'
  | 'form-prep'
  | 'visit-help'
  | 'book-help'
  | 'track'
  | 'summary'
  | 'dashboard';

export type BookingStatus = 'idle' | 'requested' | 'scheduled' | 'confirmed' | 'completed';
export type ApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'dispatched';

const PREFERENCES_STORAGE_KEY = 'saksham_ui_preferences';

interface SavedPreferences {
  barriers?: BarrierId[];
  fontSize?: 'normal' | 'large' | 'xlarge';
  highContrast?: boolean;
  language?: 'en' | 'hi';
  caregiverMode?: boolean;
  portalReferenceNumber?: string;
}

function loadSavedPreferences(): SavedPreferences {
  if (typeof window === 'undefined') return {};
  try {
    const raw = appStorage.getItem(PREFERENCES_STORAGE_KEY, 'local');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function persistPreferences(prefs: SavedPreferences) {
  if (typeof window === 'undefined') return;
  try {
    const existing = loadSavedPreferences();
    appStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify({ ...existing, ...prefs }), 'local');
  } catch (e) {
    // ignore quota/storage errors
  }
}

export interface SakshamState {
  // Barrier preferences
  barriers: BarrierId[];
  toggleBarrier: (barrierId: BarrierId) => void;
  hasBarrier: (barrierId: BarrierId) => boolean;
  clearBarriers: () => void;
  selectPreset: (barriers: BarrierId[]) => void;

  // Screen navigation & app view
  activeScreen: ScreenId;
  setActiveScreen: (screen: ScreenId) => void;

  // Placeholders for Phases 2 and 3
  bookingStatus: BookingStatus;
  setBookingStatus: (status: BookingStatus) => void;
  applicationStatus: ApplicationStatus;
  setApplicationStatus: (status: ApplicationStatus) => void;

  // Phase 3 Official Portal Timeline
  portalReferenceNumber: string;
  setPortalReferenceNumber: (ref: string) => void;
  isPortalSubmitted: boolean;
  confirmPortalSubmission: (ref?: string) => void;
  hasVisitedHospital: boolean;
  confirmHospitalVisit: (visited?: boolean) => void;
  demoAdvancedStage: 'none' | 'verification' | 'approved' | 'ready_download';
  simulateNextStatus: () => void;
  correctionsRequested: boolean;
  correctionReason: string;
  setCorrectionsRequested: (requested: boolean, reason?: string) => void;
  resetPortalTimeline: () => void;

  // Accessibility & UI adaptation settings
  highContrast: boolean;
  toggleHighContrast: () => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  setFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  caregiverMode: boolean;
  toggleCaregiverMode: () => void;

  // Voice narration / Web Speech assistant state
  isSpeaking: boolean;
  currentSpeechText: string;
  speechSpeed: number; // 0.85 = slower, 1 = normal
  setSpeechSpeed: (speed: number) => void;
  startSpeaking: (text: string) => void;
  stopSpeaking: () => void;
  missingHindiVoiceNotice: boolean;
  dismissMissingHindiVoiceNotice: () => void;

  // Document scanning & AI verification state
  scanState: 'idle' | 'uploading' | 'scanning' | 'success' | 'failure';
  scannedImageUrl: string | null;
  uploadedFileName: string | null;
  scanScenario: 'authentic' | 'blurry';
  verificationResult: VerificationResult | null;
  setScanScenario: (scenario: 'authentic' | 'blurry') => void;
  startDocumentScan: (fileUrl?: string, fileName?: string) => Promise<void>;
  resetDocumentScan: () => void;

  // Phase 3A: Document Readiness Checklist
  documents: Record<string, any>;
  updateDocumentSlot: (slotId: string, updates: Record<string, any>) => void;
  setSlotHospitalAssessment: (slotId: string) => void;
  setSlotSkipped: (slotId: string) => void;
  resetDocumentChecklist: () => void;

  // Phase 6: Strict Privacy Data Reset
  clearUserData: () => void;

  // Computed helper for quick access
  getAdaptations: () => UIAdaptations;
}

const initialSaved = loadSavedPreferences();

export const useSakshamStore = create<SakshamState>((set, get) => ({
  barriers: initialSaved.barriers ?? ['reading'],
  activeScreen: 'home',

  // Placeholders for Phases 2 & 3
  bookingStatus: 'idle',
  setBookingStatus: (bookingStatus) => set({ bookingStatus }),

  applicationStatus: 'draft',
  setApplicationStatus: (applicationStatus) => set({ applicationStatus }),

  // Phase 3 Official Portal Timeline
  portalReferenceNumber: initialSaved.portalReferenceNumber ?? 'UDID-2024-88912-DL',
  setPortalReferenceNumber: (ref) => {
    persistPreferences({ portalReferenceNumber: ref });
    set({ portalReferenceNumber: ref });
  },
  isPortalSubmitted: false,
  confirmPortalSubmission: (ref) =>
    set((state) => ({
      isPortalSubmitted: true,
      portalReferenceNumber: ref || state.portalReferenceNumber,
    })),
  hasVisitedHospital: false,
  confirmHospitalVisit: (visited = true) => set({ hasVisitedHospital: visited }),
  demoAdvancedStage: 'none',
  simulateNextStatus: () => {
    set((state) => {
      let nextStage: 'none' | 'verification' | 'approved' | 'ready_download' = 'verification';
      if (state.demoAdvancedStage === 'none') {
        nextStage = 'verification';
      } else if (state.demoAdvancedStage === 'verification') {
        nextStage = 'approved';
      } else if (state.demoAdvancedStage === 'approved') {
        nextStage = 'ready_download';
      } else {
        nextStage = 'ready_download';
      }
      return {
        hasVisitedHospital: true,
        isPortalSubmitted: true,
        demoAdvancedStage: nextStage,
        correctionsRequested: false,
      };
    });
  },
  correctionsRequested: false,
  correctionReason:
    'State Medical Board requested a clearer photo of the official hospital seal and doctor registration signature.',
  setCorrectionsRequested: (requested, reason) =>
    set((state) => ({
      correctionsRequested: requested,
      correctionReason: reason || state.correctionReason,
      demoAdvancedStage: requested ? 'verification' : state.demoAdvancedStage,
      hasVisitedHospital: requested ? true : state.hasVisitedHospital,
      isPortalSubmitted: requested ? true : state.isPortalSubmitted,
    })),
  resetPortalTimeline: () =>
    set({
      isPortalSubmitted: false,
      hasVisitedHospital: false,
      demoAdvancedStage: 'none',
      correctionsRequested: false,
    }),
  
  toggleBarrier: (barrierId: BarrierId) => {
    set((state) => {
      const exists = state.barriers.includes(barrierId);
      const newBarriers = exists
        ? state.barriers.filter((b) => b !== barrierId)
        : [...state.barriers, barrierId];
      
      const hasReading = newBarriers.includes('reading');
      const newFontSize = hasReading ? 'large' : state.fontSize === 'xlarge' ? 'xlarge' : 'normal';

      persistPreferences({ barriers: newBarriers, fontSize: newFontSize });
      return {
        barriers: newBarriers,
        fontSize: newFontSize,
      };
    });
  },

  hasBarrier: (barrierId: BarrierId) => {
    return get().barriers.includes(barrierId);
  },

  clearBarriers: () => {
    persistPreferences({ barriers: [] });
    set({ barriers: [] });
  },

  selectPreset: (barriers: BarrierId[]) => {
    persistPreferences({ barriers });
    set({ barriers });
  },

  setActiveScreen: (screen) => {
    stopGlobalSpeaking();
    set({ activeScreen: screen, isSpeaking: false, currentSpeechText: '' });
  },

  highContrast: initialSaved.highContrast ?? false,
  toggleHighContrast: () => {
    set((state) => {
      const next = !state.highContrast;
      persistPreferences({ highContrast: next });
      return { highContrast: next };
    });
  },

  fontSize: initialSaved.fontSize ?? 'large',
  setFontSize: (fontSize) => {
    persistPreferences({ fontSize });
    set({ fontSize });
  },

  language: initialSaved.language ?? 'en',
  setLanguage: (language) => {
    persistPreferences({ language });
    set({ language });
  },

  caregiverMode: initialSaved.caregiverMode ?? false,
  toggleCaregiverMode: () => {
    set((state) => {
      const next = !state.caregiverMode;
      persistPreferences({ caregiverMode: next });
      return { caregiverMode: next };
    });
  },

  // Voice assistant state
  isSpeaking: false,
  currentSpeechText: '',
  speechSpeed: 0.95,
  missingHindiVoiceNotice: false,
  dismissMissingHindiVoiceNotice: () => set({ missingHindiVoiceNotice: false }),
  setSpeechSpeed: (speed) => set({ speechSpeed: speed }),

  startSpeaking: (text: string) => {
    const result = speakText(text, {
      lang: get().language,
      rate: get().speechSpeed,
      onStart: () => set({ isSpeaking: true, currentSpeechText: text }),
      onEnd: () => set({ isSpeaking: false, currentSpeechText: '' }),
      onError: () => set({ isSpeaking: false, currentSpeechText: '' }),
    });

    if (result.missingHindiVoice && get().language === 'hi') {
      set({ missingHindiVoiceNotice: true });
    }
  },

  stopSpeaking: () => {
    stopGlobalSpeaking();
    set({ isSpeaking: false, currentSpeechText: '' });
  },

  // Document scanning
  scanState: 'idle',
  scannedImageUrl: null,
  uploadedFileName: null,
  scanScenario: 'authentic',
  verificationResult: null,

  setScanScenario: (scanScenario) => set({ scanScenario }),

  startDocumentScan: async (fileUrl?: string, fileName?: string) => {
    const previewUrl = fileUrl || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80';
    const name = fileName || 'Government_Disability_Medical_Board_Certificate.jpg';

    set({
      scanState: 'uploading',
      scannedImageUrl: previewUrl,
      uploadedFileName: name,
      verificationResult: null,
    });

    setTimeout(() => {
      set({ scanState: 'scanning' });

      setTimeout(() => {
        const scenario = get().scanScenario;
        const result = evaluateDocument({
          hasHospitalSeal: scenario === 'authentic',
          isClearResolution: scenario === 'authentic',
          hasMedicalRegNumber: true,
          hasDisabilityPercent: true,
        });

        set({
          scanState: result.isValid ? 'success' : 'failure',
          verificationResult: result,
        });

        if (get().hasBarrier('reading')) {
          const speechSummary = result.isValid
            ? `Document successfully checked. Hospital seal, medical council registration, and locomotor disability confirmed. Ready for fast-track ID generation.`
            : `Attention. Your document photo is blurry and the official hospital seal could not be verified. Please take a clearer picture in bright light.`;
          get().startSpeaking(speechSummary);
        }
      }, 2200);
    }, 400);
  },

  resetDocumentScan: () => {
    const current = get().documents as Record<SlotId, DocumentSlotRecord>;
    if (typeof window !== 'undefined' && current) {
      Object.values(current).forEach((doc) => {
        if (doc?.previewUrl && doc.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(doc.previewUrl);
        }
      });
    }
    set({
      scanState: 'idle',
      scannedImageUrl: null,
      uploadedFileName: null,
      verificationResult: null,
      documents: { ...INITIAL_DOCUMENTS_STATE },
    });
  },

  // Phase 3A: Document Readiness Checklist
  documents: { ...INITIAL_DOCUMENTS_STATE },
  updateDocumentSlot: (slotId: string, updates: Record<string, any>) => {
    set((state) => {
      const prevDoc = state.documents[slotId as SlotId] || { slotId: slotId as SlotId, status: 'not_added' };
      if (updates.previewUrl && prevDoc.previewUrl && prevDoc.previewUrl !== updates.previewUrl) {
        if (typeof window !== 'undefined' && prevDoc.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(prevDoc.previewUrl);
        }
      }
      const newDocuments = {
        ...state.documents,
        [slotId]: {
          ...prevDoc,
          ...updates,
        },
      };
      const readiness = calculateReadiness(newDocuments as Record<SlotId, DocumentSlotRecord>);
      return {
        documents: newDocuments,
        scanState: readiness.canContinue ? 'success' : state.scanState === 'success' ? 'idle' : state.scanState,
      };
    });
  },

  setSlotHospitalAssessment: (slotId: string) => {
    set((state) => {
      const prevDoc = state.documents[slotId as SlotId];
      if (prevDoc?.previewUrl && prevDoc.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(prevDoc.previewUrl);
      }
      const newDocuments = {
        ...state.documents,
        [slotId]: {
          slotId: slotId as SlotId,
          status: 'skipped' as SlotStatus,
          isHospitalAssessment: true,
          fileName: 'Will be assessed at the hospital',
        },
      };
      const readiness = calculateReadiness(newDocuments as Record<SlotId, DocumentSlotRecord>);
      return {
        documents: newDocuments,
        scanState: readiness.canContinue ? 'success' : state.scanState,
      };
    });
  },

  setSlotSkipped: (slotId: string) => {
    set((state) => {
      const prevDoc = state.documents[slotId as SlotId];
      if (prevDoc?.previewUrl && prevDoc.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(prevDoc.previewUrl);
      }
      const newDocuments = {
        ...state.documents,
        [slotId]: {
          slotId: slotId as SlotId,
          status: 'skipped' as SlotStatus,
          fileName: undefined,
        },
      };
      return { documents: newDocuments };
    });
  },

  resetDocumentChecklist: () => {
    const current = get().documents as Record<SlotId, DocumentSlotRecord>;
    if (typeof window !== 'undefined' && current) {
      Object.values(current).forEach((doc) => {
        if (doc?.previewUrl && doc.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(doc.previewUrl);
        }
      });
    }
    set({
      documents: { ...INITIAL_DOCUMENTS_STATE },
      scanState: 'idle',
    });
  },

  // Phase 6: Strict Privacy Data Reset
  clearUserData: () => {
    const current = get().documents as Record<SlotId, DocumentSlotRecord>;
    if (typeof window !== 'undefined') {
      if (current) {
        Object.values(current).forEach((doc) => {
          if (doc?.previewUrl && doc.previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(doc.previewUrl);
          }
        });
      }
      try {
        appStorage.clear('session');
      } catch (e) {
        // ignore
      }
    }
    stopGlobalSpeaking();
    set({
      documents: { ...INITIAL_DOCUMENTS_STATE },
      scanState: 'idle',
      scannedImageUrl: null,
      uploadedFileName: null,
      verificationResult: null,
      isPortalSubmitted: false,
      hasVisitedHospital: false,
      demoAdvancedStage: 'none',
      correctionsRequested: false,
      isSpeaking: false,
      currentSpeechText: '',
    });
  },

  getAdaptations: () => computeAccommodations(get().barriers),
}));

export { BARRIERS_DATA };
