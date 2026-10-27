/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ChecklistItem {
  id: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  required: boolean;
  isCaregiverSpecific?: boolean;
}

export interface GlossaryItem {
  id: string;
  term: string;
  termHi: string;
  meaning: string;
  meaningHi: string;
}

export interface HelpCenter {
  id: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
}

export const FRAUD_WARNING = {
  en: 'Applying is free. Never pay anyone to get a UDID. If someone asks for money, do not pay and tell a trusted person or local welfare office.',
  hi: 'यूडीआईडी आवेदन बिल्कुल मुफ्त है। यूडीआईडी कार्ड पाने के लिए किसी को भी पैसे न दें। यदि कोई पैसे मांगता है, तो भुगतान न करें और अपने किसी विश्वसनीय व्यक्ति या स्थानीय समाज कल्याण कार्यालय को सूचित करें।',
};

export const PERMANENT_VS_TEMPORARY_INFO = {
  disclaimer: {
    en: 'General information. Confirm details on the official portal.',
    hi: 'सामान्य जानकारी। आधिकारिक पोर्टल पर विवरण की पुष्टि करें।',
  },
  permanent: {
    title: {
      en: 'Permanent UDID Card',
      hi: 'स्थायी यूडीआईडी कार्ड (Permanent)',
    },
    description: {
      en: 'Issued when the medical board determines that the disability condition is non-progressive or permanent (usually after age 18 or for irreversible conditions). It does not need periodic renewal.',
      hi: 'यह तब जारी किया जाता है जब मेडिकल बोर्ड यह निर्धारित करता है कि दिव्यांगता स्थायी या अपरिवर्तनीय है। इसे समय-समय पर नवीनीकृत करने की आवश्यकता नहीं होती है।',
    },
  },
  temporary: {
    title: {
      en: 'Temporary / Valid-for-Years UDID Card',
      hi: 'अस्थायी / समय-सीमा वाला यूडीआईडी कार्ड (Temporary)',
    },
    description: {
      en: 'Issued when a condition may change or improve over time, or for children whose assessment needs reassessment upon turning 18. The card has a validity period (e.g. 5 years) and will need a reassessment before expiry.',
      hi: 'यह तब जारी किया जाता है जब स्थिति में सुधार या परिवर्तन की संभावना हो, या बच्चों के लिए जिन्हें 18 वर्ष का होने पर दोबारा मूल्यांकन की आवश्यकता हो। इसमें एक वैधता अवधि (जैसे 5 वर्ष) होती है।',
    },
  },
};

export const GLOSSARY_ITEMS: GlossaryItem[] = [
  {
    id: 'udid',
    term: 'UDID (Unique Disability ID)',
    termHi: 'यूडीआईडी (UDID)',
    meaning: 'A national photo identity card and unique number issued by the Department of Empowerment of Persons with Disabilities (DEPwD) that proves disability status across all states and welfare schemes.',
    meaningHi: 'दिव्यांगजन सशक्तिकरण विभाग (DEPwD) द्वारा जारी किया जाने वाला एक विशिष्ट पहचान पत्र और संख्या, जो सभी राज्यों और कल्याणकारी योजनाओं में मान्य है।',
  },
  {
    id: 'cmo',
    term: 'CMO (Chief Medical Officer)',
    termHi: 'सीएमओ (Chief Medical Officer)',
    meaning: 'The head government doctor of a district who oversees the district hospital, medical boards, and the official approval of disability certificates.',
    meaningHi: 'जिले का मुख्य सरकारी चिकित्सा अधिकारी जो जिला अस्पताल, मेडिकल बोर्ड और दिव्यांगता प्रमाण पत्रों की आधिकारिक स्वीकृति की निगरानी करता है।',
  },
  {
    id: 'notified_hospital',
    term: 'Notified Hospital',
    termHi: 'अधिसूचित अस्पताल (Notified Hospital)',
    meaning: 'A designated government hospital authorized by the state government where the specialist medical board evaluates disability percentage in person.',
    meaningHi: 'राज्य सरकार द्वारा अधिकृत एक निर्दिष्ट सरकारी अस्पताल, जहाँ विशेषज्ञ मेडिकल बोर्ड व्यक्तिगत रूप से दिव्यांगता प्रतिशत का आकलन करता है।',
  },
  {
    id: 'assessment',
    term: 'Assessment',
    termHi: 'मूल्यांकन (Medical Assessment)',
    meaning: 'A medical check-up conducted by government specialist doctors to measure and record the type and percentage of disability according to national guidelines.',
    meaningHi: 'सरकारी विशेषज्ञ डॉक्टरों द्वारा किया जाने वाला मेडिकल परीक्षण, जिसमें राष्ट्रीय दिशानिर्देशों के अनुसार दिव्यांगता के प्रकार और प्रतिशत को मापा जाता है।',
  },
  {
    id: 'reference_number',
    term: 'Reference Number / Application Number',
    termHi: 'संदर्भ संख्या (Application / Reference Number)',
    meaning: 'An acknowledgment number given by the official Swavlamban portal after you submit your application online. You use it to track your real status on the government site.',
    meaningHi: 'आधिकारिक स्वावलंबन पोर्टल पर ऑनलाइन फॉर्म जमा करने के बाद मिलने वाली पावती संख्या। इसका उपयोग सरकारी पोर्टल पर अपनी वास्तविक स्थिति देखने के लिए किया जाता है।',
  },
];

export const HELP_CENTERS: HelpCenter[] = [
  {
    id: 'csc',
    title: 'Common Service Centres (CSC / Digital Seva)',
    titleHi: 'कॉमन सर्विस सेंटर (CSC / जन सेवा केंद्र)',
    description: 'Village-level and neighbourhood government digital kiosks equipped with scanners and internet access to help you upload documents onto the portal.',
    descriptionHi: 'गाँव और मोहल्ले के सरकारी डिजिटल केंद्र जहाँ इंटरनेट और स्कैनर उपलब्ध होते हैं, जो पोर्टल पर दस्तावेज़ अपलोड करने में मदद कर सकते हैं।',
  },
  {
    id: 'sewa_kendra',
    title: 'Sewa Kendras / Suvidha Centres',
    titleHi: 'सेवा केंद्र / सुविधा केंद्र',
    description: 'State citizen service centres that offer direct in-person help for welfare schemes, document scanning, and government applications.',
    descriptionHi: 'राज्य के नागरिक सुविधा केंद्र जो सरकारी कल्याणकारी योजनाओं और ऑनलाइन फॉर्म भरने के लिए प्रत्यक्ष सहायता प्रदान करते हैं।',
  },
  {
    id: 'welfare_office',
    title: 'District Social Welfare / Disability Office',
    titleHi: 'जिला समाज कल्याण / दिव्यांगजन सशक्तिकरण कार्यालय',
    description: 'The official district department located near the collectorate or CMO office responsible for disability pensions, aids, and UDID facilitation.',
    descriptionHi: 'कलेक्ट्रेट या सीएमओ कार्यालय के पास स्थित जिला विभाग जो दिव्यांगता पेंशन, सहायक उपकरण और यूडीआईडी सहायता के लिए जिम्मेदार है।',
  },
  {
    id: 'institution',
    title: 'School, College, or Employer HR',
    titleHi: 'स्कूल, कॉलेज या नियोक्ता (कार्यालय)',
    description: 'Special educators, equal-opportunity cells, or administrative desks in recognized schools and colleges can assist students and staff in preparing forms.',
    descriptionHi: 'मान्यता प्राप्त स्कूलों और कॉलेजों में विशेष शिक्षक या सहायता प्रकोष्ठ छात्रों और कर्मचारियों को फॉर्म तैयार करने में सहायता कर सकते हैं।',
  },
];

export const HELP_CENTERS_NOTE = {
  en: 'Availability varies. Ask locally.',
  hi: 'सुविधाओं की उपलब्धता स्थान के अनुसार भिन्न हो सकती है। स्थानीय स्तर पर पूछताछ करें।',
};

/**
 * Generates the "What to carry" checklist based on the applicant's accommodations and state.
 */
export function getWhatToCarryChecklist(options: {
  hasCaregiver: boolean;
  language?: 'en' | 'hi';
}): ChecklistItem[] {
  const items: ChecklistItem[] = [
    {
      id: 'portal_receipt',
      title: 'Printed application receipt from official portal',
      titleHi: 'पोर्टल से मुद्रित (प्रिंटेड) आवेदन पावती / रसीद',
      description: 'The acknowledgement slip generated after submitting online on swavlambancard.gov.in showing your reference number.',
      descriptionHi: 'स्वावलंबन पोर्टल पर आवेदन जमा करने के बाद प्राप्त रसीद जिसमें संदर्भ संख्या होती है।',
      required: true,
    },
    {
      id: 'original_id',
      title: 'Original Photo ID Proof and Address Proof',
      titleHi: 'मूल फोटो पहचान पत्र और पते का प्रमाण',
      description: 'Original government-issued card (such as Aadhaar, Voter ID, or Ration card) plus one self-attested photocopy.',
      descriptionHi: 'मूल सरकारी पहचान पत्र (जैसे आधार कार्ड, वोटर कार्ड या राशन कार्ड) और एक स्व-हस्ताक्षरित फोटोकॉपी।',
      required: true,
    },
    {
      id: 'medical_reports',
      title: 'Existing medical reports & certificates (if any)',
      titleHi: 'मौजूदा मेडिकल रिपोर्ट और पुराने प्रमाण पत्र (यदि कोई हो)',
      description: 'Hospital discharge summaries, diagnostic tests, therapy records, or old disability certificates to assist the doctors.',
      descriptionHi: 'अस्पताल के डिस्चार्ज सारांश, टेस्ट रिपोर्ट या पुराने प्रमाण पत्र ताकि डॉक्टरों को मूल्यांकन में सुविधा हो।',
      required: false,
    },
    {
      id: 'passport_photos',
      title: '2-4 Recent Passport-Size Photographs',
      titleHi: '2 से 4 हाल की पासपोर्ट साइज फोटो',
      description: 'Clear colour photos with white background showing your full face (and disability assistive aid if visible).',
      descriptionHi: 'सादे बैकग्राउंड वाली स्पष्ट रंगीन फोटो जिसमें चेहरा साफ दिखाई दे।',
      required: true,
    },
  ];

  if (options.hasCaregiver) {
    items.push({
      id: 'caregiver_id',
      title: "Caregiver's original ID proof & relationship proof",
      titleHi: 'देखभालकर्ता (Caregiver) का मूल पहचान पत्र',
      description: "Original photo ID card of the assisting relative or caregiver named in the application form.",
      descriptionHi: 'आवेदन में नामित सहायता करने वाले रिश्तेदार या देखभालकर्ता का मूल फोटो पहचान पत्र।',
      required: true,
      isCaregiverSpecific: true,
    });
  }

  return items;
}

/**
 * Builds the polite text message that an applicant who cannot travel can copy
 * to communicate with the hospital or medical board.
 * Note: Saksham NEVER sends this message automatically.
 */
export function generateHospitalRequestMessage(params: {
  applicantName?: string;
  preferredSlot?: string;
  referenceNumber?: string;
  reason?: string;
  language?: 'en' | 'hi';
}): string {
  const name = params.applicantName?.trim() || 'Applicant';
  const slot = params.preferredSlot || 'Flexible morning slot';
  const ref = params.referenceNumber ? ` (Portal Application Ref: ${params.referenceNumber})` : '';

  if (params.language === 'hi') {
    return (
      `आदरणीय मुख्य चिकित्सा अधिकारी (CMO) / मेडिकल बोर्ड,\n` +
      `मेरा नाम ${name} है${ref}। ` +
      `गंभीर शारीरिक/स्वास्थ्य सीमाओं के कारण मुझे अस्पताल आने-जाने में अत्यधिक कठिनाई है। ` +
      `मैंने आधिकारिक स्वावलंबन पोर्टल पर यूडीआईडी के लिए आवेदन किया है। ` +
      `कृपया मार्गदर्शन करें कि क्या मेरे मामले में गृह-मूल्यांकन (Home Assessment) या विशेष सहायता उपलब्ध हो सकती है। ` +
      `सुविधाजनक समय: ${slot}। ` +
      `धन्यवाद।`
    );
  }

  return (
    `Respected Chief Medical Officer (CMO) / Medical Board,\n` +
    `My name is ${name}${ref}. ` +
    `Due to severe travel and mobility limitations, I am unable to easily visit the hospital in person. ` +
    `I have initiated my UDID application on the official Swavlamban portal. ` +
    `I respectfully request information on whether a doorstep / home medical assessment or special assistance is available in our district for my case. ` +
    `Preferred time window: ${slot}. ` +
    `Thank you.`
  );
}

/**
 * Builds shareable caregiver text containing help centers and guidance.
 */
export function generateHelpCentersShareText(language: 'en' | 'hi' = 'en'): string {
  if (language === 'hi') {
    return (
      `यूडीआईडी (दिव्यांगता पहचान पत्र) आवेदन सहायता केंद्र:\n` +
      `1. कॉमन सर्विस सेंटर (CSC / जन सेवा केंद्र) - दस्तावेज़ स्कैनिंग और पोर्टल अपलोड\n` +
      `2. सेवा केंद्र / सुविधा केंद्र - नागरिक सहायता काउंटर\n` +
      `3. जिला समाज कल्याण कार्यालय - कलेक्ट्रेट या सीएमओ कार्यालय के पास\n` +
      `4. स्कूल / कॉलेज / कार्यस्थल सहायता प्रकोष्ठ\n\n` +
      `नोट: सुविधाएं स्थान के अनुसार बदल सकती हैं। कृपया नजदीकी केंद्र पर पता करें।\n` +
      `सावधानी: यूडीआईडी आवेदन निःशुल्क है। किसी को पैसे न दें।`
    );
  }

  return (
    `UDID Application Help & Support Centres:\n` +
    `1. Common Service Centres (CSC / Digital Seva) - Document scanning & portal upload\n` +
    `2. Sewa Kendras / Suvidha Centres - In-person citizen assistance\n` +
    `3. District Social Welfare / Disability Office - Near District Magistrate / CMO office\n` +
    `4. School / College / Employer HR support desks\n\n` +
    `Note: Availability varies. Ask locally.\n` +
    `Safety reminder: Applying for UDID is completely free. Never pay anyone to get a card.`
  );
}
