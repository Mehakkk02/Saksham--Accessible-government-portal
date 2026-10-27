/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MAX_UPLOAD_KB } from '../../lib/config';

export type SlotId = 'photo' | 'id_proof' | 'address_proof' | 'certificate' | 'signature';

export type SlotStatus = 'not_added' | 'checking' | 'looks_good' | 'retake_needed' | 'skipped';

export interface DocumentMetrics {
  blurScore?: number;
  brightnessScore?: number;
  width?: number;
  height?: number;
  fileSizeBytes?: number;
  compressedSizeBytes?: number;
}

export interface DocumentSlotRecord {
  slotId: SlotId;
  status: SlotStatus;
  fileName?: string;
  previewUrl?: string; // Blob or Object URL
  metrics?: DocumentMetrics;
  failureReason?: string;
  failureReasonHi?: string;
  isHospitalAssessment?: boolean;
}

export interface SlotDefinition {
  id: SlotId;
  slotNumber: number;
  titleEn: string;
  titleHi: string;
  subtitleEn: string;
  subtitleHi: string;
  tipsEn: string[];
  tipsHi: string[];
  isMandatory: boolean;
  allowHospitalAssessment?: boolean;
  conditionalNoteEn?: string;
  conditionalNoteHi?: string;
}

export const DOCUMENT_SLOTS: SlotDefinition[] = [
  {
    id: 'photo',
    slotNumber: 1,
    titleEn: 'Passport-size photo',
    titleHi: 'पासपोर्ट साइज फोटो',
    subtitleEn: 'Recent front-facing color photo',
    subtitleHi: 'हाल की रंगीन पासपोर्ट फोटो',
    tipsEn: [
      'Plain light-colored background (white or off-white).',
      'Face clearly visible looking directly at the camera.',
      'No dark glasses, caps, or shadow on eyes.',
    ],
    tipsHi: [
      'सादा हल्का बैकग्राउंड (सफेद या हल्का रंग)।',
      'चेहरा पूरी तरह से स्पष्ट और सीधा दिखे।',
      'धूप का चश्मा या टोपी न पहनें।',
    ],
    isMandatory: true,
  },
  {
    id: 'id_proof',
    slotNumber: 2,
    titleEn: 'ID proof',
    titleHi: 'पहचान प्रमाण (आईडी प्रूफ)',
    subtitleEn: 'Aadhaar, Voter ID, PAN, or Driving License',
    subtitleHi: 'आधार कार्ड, वोटर आईडी, पैन कार्ड या ड्राइविंग लाइसेंस',
    tipsEn: [
      'Aadhaar card, Voter card, or government identity card.',
      'Full name and date of birth must be clearly readable.',
      'Ensure all 4 corners of the identity card are visible.',
    ],
    tipsHi: [
      'आधार कार्ड, वोटर कार्ड या सरकारी पहचान पत्र।',
      'नाम और जन्मतिथि स्पष्ट रूप से पढ़ने योग्य होनी चाहिए।',
      'कार्ड के चारों कोने फ्रेम में हों।',
    ],
    isMandatory: true,
  },
  {
    id: 'address_proof',
    slotNumber: 3,
    titleEn: 'Address proof',
    titleHi: 'पते का प्रमाण (एड्रेस प्रूफ)',
    subtitleEn: 'Aadhaar, utility bill, or domicile certificate',
    subtitleHi: 'आधार कार्ड, बिजली बिल या निवास प्रमाण पत्र',
    tipsEn: [
      'Aadhaar, electricity bill, ration card, or domicile certificate.',
      'Address must match your current permanent or communication address.',
      'Document text must be sharp and legible.',
    ],
    tipsHi: [
      'आधार कार्ड, बिजली बिल, राशन कार्ड या मूल निवास प्रमाण पत्र।',
      'पता आपके वर्तमान पते से मेल खाना चाहिए।',
      'दस्तावेज़ का पाठ स्पष्ट होना चाहिए।',
    ],
    isMandatory: true,
  },
  {
    id: 'certificate',
    slotNumber: 4,
    titleEn: 'Disability / medical certificate',
    titleHi: 'दिव्यांगता / मेडिकल प्रमाणपत्र',
    subtitleEn: 'From civil hospital or medical board, if already issued',
    subtitleHi: 'सरकारी अस्पताल या मेडिकल बोर्ड से (यदि पहले से है)',
    tipsEn: [
      'Disability certificate or Civil Surgeon assessment report.',
      'Hospital seal and doctor registration number should be clear.',
      'If you do not have one yet, choose "I don\'t have one yet" to be assessed at the hospital.',
    ],
    tipsHi: [
      'दिव्यांगता प्रमाणपत्र या सिविल सर्जन रिपोर्ट।',
      'अस्पताल की मुहर और डॉक्टर का नंबर स्पष्ट होना चाहिए।',
      'यदि आपके पास अभी नहीं है, तो "मेरे पास अभी नहीं है" चुनें।',
    ],
    isMandatory: false, // Can be satisfied via "I don't have one yet"
    allowHospitalAssessment: true,
  },
  {
    id: 'signature',
    slotNumber: 5,
    titleEn: 'Signature or thumb impression',
    titleHi: 'हस्ताक्षर या अंगूठे का निशान',
    subtitleEn: 'Only if the portal asks. Check the portal\'s upload page.',
    subtitleHi: 'केवल यदि पोर्टल मांगे। पोर्टल का अपलोड पेज देखें।',
    tipsEn: [
      'Sign with dark blue or black ink on clean white paper.',
      'Or provide a clean, unsmudged thumb impression.',
      'Optional: upload only if requested by your state portal.',
    ],
    tipsHi: [
      'सादे सफेद कागज पर नीली या काली स्याही से हस्ताक्षर करें।',
      'या साफ, बिना फैले अंगूठे का निशान लगाएं।',
      'वैकल्पिक: केवल तभी अपलोड करें जब आपके राज्य का पोर्टल मांगे।',
    ],
    isMandatory: false,
    conditionalNoteEn: 'Only if the portal asks. Check the portal\'s upload page.',
    conditionalNoteHi: 'केवल यदि पोर्टल मांगे। पोर्टल का अपलोड पेज देखें।',
  },
];

export const INITIAL_DOCUMENTS_STATE: Record<SlotId, DocumentSlotRecord> = {
  photo: { slotId: 'photo', status: 'not_added' },
  id_proof: { slotId: 'id_proof', status: 'not_added' },
  address_proof: { slotId: 'address_proof', status: 'not_added' },
  certificate: { slotId: 'certificate', status: 'not_added' },
  signature: { slotId: 'signature', status: 'not_added' },
};

/**
 * Evaluates readiness of document slots.
 * Ready condition: slot status is 'looks_good' OR marked 'isHospitalAssessment'.
 * Mandatory condition for "Continue": photo, id_proof, and address_proof are good,
 * and certificate is either good or marked "Will be assessed at the hospital".
 */
export function calculateReadiness(documents: Record<SlotId, DocumentSlotRecord>): {
  readyCount: number;
  totalCount: number;
  isMandatoryReady: boolean;
  canContinue: boolean;
  statusSummaryEn: string;
  statusSummaryHi: string;
} {
  const slotKeys: SlotId[] = ['photo', 'id_proof', 'address_proof', 'certificate', 'signature'];
  let readyCount = 0;

  for (const key of slotKeys) {
    const doc = documents[key];
    if (doc) {
      if (doc.status === 'looks_good' || doc.isHospitalAssessment) {
        readyCount++;
      }
    }
  }

  const photoReady = documents.photo?.status === 'looks_good';
  const idReady = documents.id_proof?.status === 'looks_good';
  const addressReady = documents.address_proof?.status === 'looks_good';
  const certificateReady =
    documents.certificate?.status === 'looks_good' ||
    documents.certificate?.isHospitalAssessment === true ||
    documents.certificate?.status === 'skipped';

  const isMandatoryReady = photoReady && idReady && addressReady && certificateReady;

  return {
    readyCount,
    totalCount: 5,
    isMandatoryReady,
    canContinue: isMandatoryReady,
    statusSummaryEn: `${readyCount} of 5 ready`,
    statusSummaryHi: `5 में से ${readyCount} तैयार हैं`,
  };
}

/**
 * Plain-language diagnostic messages.
 * STRICT RULE: Do NOT read or extract any data from documents.
 * Never claim a document is genuine. Say "Photo looks clear", not "verified".
 */
export function getDiagnosticMessage(
  passed: boolean,
  failureType?: 'blur' | 'dark' | 'bright' | 'resolution' | 'generic',
  lang: 'en' | 'hi' = 'en'
): { text: string; audioText: string } {
  if (passed) {
    return {
      text: lang === 'hi' ? 'फोटो स्पष्ट दिख रही है' : 'Photo looks clear',
      audioText:
        lang === 'hi'
          ? 'फोटो स्पष्ट दिख रही है। गुणवत्ता जांच सफल रही।'
          : 'Photo looks clear. Quality check passed.',
    };
  }

  switch (failureType) {
    case 'blur':
      return {
        text:
          lang === 'hi'
          ? 'फोटो बहुत धुंधली है। फोन को स्थिर रखें और फोकस करने के लिए स्क्रीन पर टैप करें।'
          : 'Too blurry. Hold the phone steady and tap to focus.',
        audioText:
          lang === 'hi'
          ? 'फोटो बहुत धुंधली है। फोन को स्थिर रखें और दोबारा खींचें।'
          : 'Too blurry. Hold the phone steady and tap to focus.',
      };
    case 'dark':
      return {
        text:
          lang === 'hi'
          ? 'फोटो बहुत अंधेरी है। कृपया रोशनी की तरफ मुंह करें या लाइट जलाएं।'
          : 'Image is too dark. Please face a light source or turn on room lights.',
        audioText:
          lang === 'hi'
          ? 'फोटो में पर्याप्त रोशनी नहीं है। कृपया लाइट में फोटो लें।'
          : 'Image is too dark. Please face a light source.',
      };
    case 'bright':
      return {
        text:
          lang === 'hi'
          ? 'फोटो में बहुत चमक (ग्लैयर) है। सीधे फ्लैश से बचें।'
          : 'Image is too bright. Please reduce glare and avoid direct flashlight reflection.',
        audioText:
          lang === 'hi'
          ? 'फोटो में बहुत चमक है। सीधे फ्लैश से बचें।'
          : 'Image is too bright. Please reduce glare.',
      };
    case 'resolution':
      return {
        text:
          lang === 'hi'
          ? 'रिज़ॉल्यूशन बहुत कम है। कैमरे को दस्तावेज़ के पास लाएं।'
          : 'Image resolution is too low. Please hold the camera closer to the document.',
        audioText:
          lang === 'hi'
          ? 'इमेज का साइज बहुत छोटा है। कैमरे को पास लाएं।'
          : 'Image resolution is too low. Please hold camera closer.',
      };
    default:
      return {
        text:
          lang === 'hi'
          ? 'फोटो की गुणवत्ता सही नहीं है। कृपया स्पष्ट फोटो दोबारा लें।'
          : 'Quality check needs improvement. Please retake a clear photo.',
        audioText:
          lang === 'hi'
          ? 'कृपया स्पष्ट फोटो दोबारा लें।'
          : 'Please retake a clear photo in good light.',
      };
  }
}

/**
 * Client-side downscale and JPEG recompress via Canvas to under MAX_UPLOAD_KB.
 * The original never leaves the device.
 */
export async function compressImageToTargetKb(
  imageSource: HTMLImageElement | HTMLCanvasElement | ImageBitmap,
  targetKb: number = MAX_UPLOAD_KB
): Promise<{
  blob: Blob;
  downloadUrl: string;
  sizeKb: number;
  width: number;
  height: number;
}> {
  if (typeof document === 'undefined') {
    throw new Error('Canvas compression only runs in browser');
  }

  const sourceWidth = 'naturalWidth' in imageSource ? imageSource.naturalWidth : imageSource.width;
  const sourceHeight = 'naturalHeight' in imageSource ? imageSource.naturalHeight : imageSource.height;

  const targetBytes = targetKb * 1024;
  let currentWidth = sourceWidth;
  let currentHeight = sourceHeight;

  // Initial cap on max dimension to 1280px for standard portal requirements
  const maxDimension = 1280;
  if (currentWidth > maxDimension || currentHeight > maxDimension) {
    const scale = Math.min(maxDimension / currentWidth, maxDimension / currentHeight);
    currentWidth = Math.round(currentWidth * scale);
    currentHeight = Math.round(currentHeight * scale);
  }

  const canvas = document.createElement('canvas');
  canvas.width = currentWidth;
  canvas.height = currentHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas 2d context');
  }

  ctx.drawImage(imageSource, 0, 0, currentWidth, currentHeight);

  // Iterative compression stepping through quality and downscaling if needed
  let quality = 0.85;
  let blob: Blob | null = null;

  for (let attempt = 0; attempt < 6; attempt++) {
    blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/jpeg', quality);
    });

    if (blob && blob.size <= targetBytes) {
      break;
    }

    if (quality > 0.45) {
      quality -= 0.15;
    } else {
      // Downscale canvas dimensions by 80%
      currentWidth = Math.max(320, Math.round(currentWidth * 0.8));
      currentHeight = Math.max(320, Math.round(currentHeight * 0.8));
      canvas.width = currentWidth;
      canvas.height = currentHeight;
      ctx.drawImage(imageSource, 0, 0, currentWidth, currentHeight);
      quality = 0.75;
    }
  }

  if (!blob) {
    throw new Error('Failed to compress image');
  }

  const downloadUrl = URL.createObjectURL(blob);
  const sizeKb = Number((blob.size / 1024).toFixed(1));

  return {
    blob,
    downloadUrl,
    sizeKb,
    width: currentWidth,
    height: currentHeight,
  };
}

/**
 * Returns TTS reading text for a given slot.
 */
export function getSlotSpeechText(
  slot: SlotDefinition,
  record: DocumentSlotRecord | undefined,
  lang: 'en' | 'hi' = 'en'
): string {
  const isHi = lang === 'hi';
  const title = isHi ? slot.titleHi : slot.titleEn;
  const status = record?.status || 'not_added';

  let statusStr = '';
  if (record?.isHospitalAssessment) {
    statusStr = isHi ? 'अस्पताल में जांच होगी' : 'Will be assessed at the hospital';
  } else {
    switch (status) {
      case 'looks_good':
        statusStr = isHi ? 'फोटो स्पष्ट दिख रही है' : 'Photo looks clear';
        break;
      case 'retake_needed':
        statusStr = isHi
          ? `दोबारा फोटो लेने की आवश्यकता है: ${record?.failureReasonHi || record?.failureReason || 'धुंधली फोटो'}`
          : `Retake needed: ${record?.failureReason || 'Image quality needs improvement'}`;
        break;
      case 'checking':
        statusStr = isHi ? 'जांच हो रही है' : 'Checking document quality';
        break;
      case 'skipped':
        statusStr = isHi ? 'छोड़ दिया गया' : 'Skipped';
        break;
      default:
        statusStr = isHi ? 'अभी नहीं जोड़ा गया' : 'Not added yet';
        break;
    }
  }

  const tips = isHi ? slot.tipsHi.join('. ') : slot.tipsEn.join('. ');

  if (isHi) {
    return `दस्तावेज़ ${slot.slotNumber}: ${title}. स्थिति: ${statusStr}. सुझाव: ${tips}`;
  }
  return `Slot ${slot.slotNumber}: ${title}. Current status: ${statusStr}. Tips: ${tips}`;
}
