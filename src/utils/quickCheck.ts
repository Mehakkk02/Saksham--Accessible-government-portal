/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface QuickCheckAnswer {
  difficulty: 'walking' | 'seeing' | 'hearing_speaking' | 'learning_memory' | 'multiple_other' | '';
  sinceWhen: 'from_birth' | 'many_years' | 'recent' | '';
  doctorAssessed: 'assessed_yes' | 'assessed_no' | 'not_sure' | '';
  certificateStatus: 'has_valid' | 'has_expired_old' | 'none' | '';
  appliedBefore: 'first_time' | 'applied_before' | '';
}

export type QuickCheckRoute = 'documents' | 'assessment' | 'help_centre';

export interface QuickCheckResult {
  route: QuickCheckRoute;
  titleEn: string;
  titleHi: string;
  summaryEn: string;
  summaryHi: string;
  nextStepTextEn: string;
  nextStepTextHi: string;
  targetScreen: 'documents' | 'visit-help';
  disclaimerEn: string;
  disclaimerHi: string;
}

export interface QuickCheckQuestion {
  id: keyof QuickCheckAnswer;
  titleEn: string;
  titleHi: string;
  helperEn: string;
  helperHi: string;
  options: {
    value: string;
    labelEn: string;
    labelHi: string;
    descEn?: string;
    descHi?: string;
  }[];
}

export const QUICK_CHECK_DISCLAIMER_EN =
  'Guidance only. This is not a medical, legal or official eligibility decision. Saksham does not decide percentages or diagnoses. The government medical board at the hospital makes all final decisions.';

export const QUICK_CHECK_DISCLAIMER_HI =
  'केवल मार्गदर्शन के लिए। यह कोई चिकित्सकीय, कानूनी या आधिकारिक निर्णय नहीं है। सक्षम कोई प्रतिशत या निदान तय नहीं करता। अस्पताल का सरकारी मेडिकल बोर्ड ही अंतिम निर्णय लेता है।';

export const QUICK_CHECK_QUESTIONS: QuickCheckQuestion[] = [
  {
    id: 'difficulty',
    titleEn: '1. What type of daily difficulty do you experience?',
    titleHi: '1. आपको दैनिक जीवन में किस प्रकार की कठिनाई होती है?',
    helperEn: 'Select the option that best matches. Broad categories only.',
    helperHi: 'जो सबसे अधिक मेल खाता हो उसे चुनें। केवल सामान्य श्रेणियां।',
    options: [
      {
        value: 'walking',
        labelEn: 'Walking or moving hands/feet',
        labelHi: 'चलने-फिरने या हाथ-पैर में परेशानी',
        descEn: 'Locomotor or movement challenges',
        descHi: 'शारीरिक या चलने-फिरने में चुनौती',
      },
      {
        value: 'seeing',
        labelEn: 'Seeing (low vision or blind)',
        labelHi: 'देखने में परेशानी (कम दिखाई देना या दृष्टिहीनता)',
        descEn: 'Vision difficulties with or without glasses',
        descHi: 'चश्मे के साथ या बिना देखने में कठिनाई',
      },
      {
        value: 'hearing_speaking',
        labelEn: 'Hearing or speaking',
        labelHi: 'सुनने या बोलने में परेशानी',
        descEn: 'Hearing loss, speech or communication difficulty',
        descHi: 'कम सुनाई देना या बोलने में परेशानी',
      },
      {
        value: 'learning_memory',
        labelEn: 'Learning, understanding or remembering',
        labelHi: 'सीखने, समझने या याद रखने में परेशानी',
        descEn: 'Intellectual or cognitive challenges',
        descHi: 'बौद्धिक या समझने में कठिनाई',
      },
      {
        value: 'multiple_other',
        labelEn: 'Multiple difficulties or other',
        labelHi: 'एक से अधिक या अन्य परेशानी',
        descEn: 'More than one difficulty or condition',
        descHi: 'एक से अधिक परेशानियाँ या अन्य स्थिति',
      },
    ],
  },
  {
    id: 'sinceWhen',
    titleEn: '2. Since when have you had this condition?',
    titleHi: '2. यह परेशानी आपको कब से है?',
    helperEn: 'Approximate duration helps determine existing records.',
    helperHi: 'अनुमानित समय जिससे आपके पुराने रिकॉर्ड की स्थिति समझ आए।',
    options: [
      {
        value: 'from_birth',
        labelEn: 'Since birth',
        labelHi: 'जन्म से',
        descEn: 'Congenital condition',
        descHi: 'जन्म से मौजूद स्थिति',
      },
      {
        value: 'many_years',
        labelEn: 'For several years',
        labelHi: 'कई वर्षों से',
        descEn: 'Long-standing condition',
        descHi: 'लंबे समय से चली आ रही परेशानी',
      },
      {
        value: 'recent',
        labelEn: 'Recently (after illness or injury)',
        labelHi: 'हाल ही में (चोट या बीमारी के बाद)',
        descEn: 'Newer condition, may need fresh hospital assessment',
        descHi: 'हाल की स्थिति, नए अस्पताल परीक्षण की आवश्यकता हो सकती है',
      },
    ],
  },
  {
    id: 'doctorAssessed',
    titleEn: '3. Has a government doctor or specialist examined this before?',
    titleHi: '3. क्या किसी सरकारी डॉक्टर या विशेषज्ञ ने पहले इसकी जाँच की है?',
    helperEn: 'Medical records from government hospitals speed up verification.',
    helperHi: 'सरकारी अस्पताल की रिपोर्ट होने से सत्यापन आसान होता है।',
    options: [
      {
        value: 'assessed_yes',
        labelEn: 'Yes, I have hospital papers or prescriptions',
        labelHi: 'हाँ, मेरे पास अस्पताल के पर्चे या रिपोर्ट हैं',
        descEn: 'You have medical history ready',
        descHi: 'आपके पास चिकित्सीय इतिहास उपलब्ध है',
      },
      {
        value: 'assessed_no',
        labelEn: 'No, not yet examined by a specialist',
        labelHi: 'नहीं, अभी तक डॉक्टर से औपचारिक जाँच नहीं हुई',
        descEn: 'You can be examined at the district hospital visit',
        descHi: 'जिला अस्पताल जाकर मेडिकल बोर्ड से जाँच करवा सकते हैं',
      },
      {
        value: 'not_sure',
        labelEn: 'Not sure / Papers are misplaced',
        labelHi: 'निश्चित नहीं / कागज़ात खो गए हैं',
        descEn: 'Help centres or the hospital can guide you',
        descHi: 'मदद केंद्र या अस्पताल आपका मार्गदर्शन कर सकते हैं',
      },
    ],
  },
  {
    id: 'certificateStatus',
    titleEn: '4. Do you already have a disability certificate?',
    titleHi: '4. क्या आपके पास पहले से कोई दिव्यांगता प्रमाण पत्र है?',
    helperEn: 'State disability certificates can be converted to digital UDID cards.',
    helperHi: 'राज्य सरकार के पुराने प्रमाण पत्र को डिजिटल UDID में बदला जा सकता है।',
    options: [
      {
        value: 'has_valid',
        labelEn: 'Yes, I have an existing valid certificate',
        labelHi: 'हाँ, मेरे पास मान्य प्रमाण पत्र है',
        descEn: 'Permanent or currently valid state certificate',
        descHi: 'स्थायी या वैध राज्य प्रमाण पत्र',
      },
      {
        value: 'has_expired_old',
        labelEn: 'Yes, but it is expired or temporary',
        labelHi: 'हाँ, लेकिन वह पुराना या अस्थायी है',
        descEn: 'Needs reassessment for renewal',
        descHi: 'नवीनीकरण के लिए पुनर्मूल्यांकन की आवश्यकता है',
      },
      {
        value: 'none',
        labelEn: 'No / Never had one',
        labelHi: 'नहीं, कभी कोई प्रमाण पत्र नहीं बना',
        descEn: 'Applying as a fresh applicant',
        descHi: 'पहली बार नए आवेदक के रूप में',
      },
    ],
  },
  {
    id: 'appliedBefore',
    titleEn: '5. Have you ever applied on the official Swavlamban portal before?',
    titleHi: '5. क्या आपने पहले कभी आधिकारिक स्वावलंबन पोर्टल पर आवेदन किया है?',
    helperEn: 'Helps determine whether you need a new application or tracking.',
    helperHi: 'यह जानने में मदद करता है कि नया आवेदन चाहिए या पुराना ट्रैक करना है।',
    options: [
      {
        value: 'first_time',
        labelEn: 'No, applying for the first time',
        labelHi: 'नहीं, पहली बार आवेदन कर रहे हैं',
        descEn: 'You will fill a fresh form and upload documents',
        descHi: 'आप नया फॉर्म भरेंगे और दस्तावेज़ अपलोड करेंगे',
      },
      {
        value: 'applied_before',
        labelEn: 'Yes, applied before (need renewal, card lost or tracking)',
        labelHi: 'हाँ, पहले आवेदन किया था (नवीनीकरण, कार्ड खोया या ट्रैकिंग)',
        descEn: 'You may already have an enrolment or reference number',
        descHi: 'आपके पास पहले से संदर्भ संख्या हो सकती है',
      },
    ],
  },
];

export function evaluateQuickCheck(answers: QuickCheckAnswer): QuickCheckResult {
  // If user has a valid certificate and is applying for first time or conversion
  if (answers.certificateStatus === 'has_valid') {
    return {
      route: 'documents',
      titleEn: 'You may already have what you need, start with documents',
      titleHi: 'आपके पास आवश्यक जानकारी हो सकती है, दस्तावेज़ों से शुरुआत करें',
      summaryEn:
        'Because you already have a valid disability certificate, you can prepare your photo, ID, address proof, and scan your existing certificate to apply directly on the portal.',
      summaryHi:
        'क्योंकि आपके पास पहले से वैध प्रमाण पत्र है, आप अपनी फोटो, पहचान, पते का प्रमाण और पुराने प्रमाण पत्र को तैयार करके पोर्टल पर सीधा आवेदन कर सकते हैं।',
      nextStepTextEn: 'Go to Document Checklist',
      nextStepTextHi: 'दस्तावेज़ चेकलिस्ट देखें',
      targetScreen: 'documents',
      disclaimerEn: QUICK_CHECK_DISCLAIMER_EN,
      disclaimerHi: QUICK_CHECK_DISCLAIMER_HI,
    };
  }

  // If user has no certificate, or never assessed, or recent condition
  if (
    answers.certificateStatus === 'none' ||
    answers.doctorAssessed === 'assessed_no' ||
    answers.sinceWhen === 'recent'
  ) {
    return {
      route: 'assessment',
      titleEn: 'You may need an assessment at a hospital',
      titleHi: 'आपको अस्पताल में मेडिकल बोर्ड जाँच की आवश्यकता हो सकती है',
      summaryEn:
        'You can apply on the portal without an existing certificate by choosing "Will be assessed at hospital". The hospital will schedule a date for the government medical board to examine you.',
      summaryHi:
        'आप बिना पुराने प्रमाण पत्र के भी पोर्टल पर आवेदन कर सकते हैं। "अस्पताल में जाँच होगी" विकल्प चुनें। जिला अस्पताल का सरकारी मेडिकल बोर्ड आपको जाँच की तिथि देगा।',
      nextStepTextEn: 'Check Hospital Visit Prep & Help',
      nextStepTextHi: 'अस्पताल यात्रा की तैयारी और सहायता देखें',
      targetScreen: 'visit-help',
      disclaimerEn: QUICK_CHECK_DISCLAIMER_EN,
      disclaimerHi: QUICK_CHECK_DISCLAIMER_HI,
    };
  }

  // Complicated cases, expired certificates, or unsure
  return {
    route: 'help_centre',
    titleEn: 'Not sure, ask at a help centre',
    titleHi: 'संदेह की स्थिति में, पास के सहायता केंद्र से सलाह लें',
    summaryEn:
      'Because your records may be expired or need renewal, visiting a local Common Service Centre (CSC) or District Welfare Office can help you choose the right renewal path.',
    summaryHi:
      'क्योंकि आपका प्रमाण पत्र पुराना हो सकता है या नवीनीकरण की ज़रूरत है, नज़दीकी कॉमन सर्विस सेंटर (CSC) या ज़िला कल्याण कार्यालय से निःशुल्क मार्गदर्शन लेना सबसे अच्छा रहेगा।',
    nextStepTextEn: 'View Free Help Centers & Guidance',
    nextStepTextHi: 'मुफ़्त सहायता केंद्र और मार्गदर्शन देखें',
    targetScreen: 'visit-help',
    disclaimerEn: QUICK_CHECK_DISCLAIMER_EN,
    disclaimerHi: QUICK_CHECK_DISCLAIMER_HI,
  };
}
