/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FormPrepData {
  // Section 1: Who is filling
  fillingFor: 'myself' | 'someone_else';
  caregiverName: string;
  caregiverRelation: string;
  applicantConsent: boolean;

  // Section 2: Personal Details
  fullName: string;
  dob: string;
  gender: 'male' | 'female' | 'transgender' | 'other' | '';
  mobileNumber: string;
  email: string;

  // Section 3: Address
  state: string;
  district: string;
  villageTown: string;
  pinCode: string;

  // Section 4: Disability Details
  disabilityCategory: string;
  isNotSureDisability: boolean;

  // Section 5: Hospital Choice
  hospitalChoice: string;
  isHospitalNotDecided: boolean;
}

export const INITIAL_FORM_PREP_DATA: FormPrepData = {
  fillingFor: 'myself',
  caregiverName: '',
  caregiverRelation: '',
  applicantConsent: false,

  fullName: '',
  dob: '',
  gender: '',
  mobileNumber: '',
  email: '',

  state: '',
  district: '',
  villageTown: '',
  pinCode: '',

  disabilityCategory: '',
  isNotSureDisability: false,

  hospitalChoice: '',
  isHospitalNotDecided: false,
};

export const DISABILITY_CATEGORIES_PLAIN = [
  { id: 'locomotor', labelEn: 'Locomotor / Physical movement disability', labelHi: 'चलने-फिरने / शारीरिक गति में कठिनाई' },
  { id: 'visual', labelEn: 'Visual impairment / Low vision / Blindness', labelHi: 'दृष्टिबाधित / कम रोशनी / अंधापन' },
  { id: 'hearing', labelEn: 'Hearing impairment / Deaf / Hard of hearing', labelHi: 'श्रवण बाधित / सुनने में कठिनाई' },
  { id: 'speech', labelEn: 'Speech and language disability', labelHi: 'वाणी और भाषा संबंधी दिव्यांगता' },
  { id: 'intellectual', labelEn: 'Intellectual or learning disability', labelHi: 'बौद्धिक या सीखने में कठिनाई' },
  { id: 'neurological', labelEn: 'Neurological / Mental health condition', labelHi: 'न्यूरोलॉजिकल / मानसिक स्वास्थ्य स्थिति' },
  { id: 'multiple', labelEn: 'Multiple disabilities', labelHi: 'बहु-दिव्यांगता (एक से अधिक)' },
  { id: 'not_sure', labelEn: 'Not sure, ask the doctor', labelHi: 'पक्का नहीं पता, डॉक्टर से पूछेंगे' },
];

export const CAREGIVER_RELATIONS = [
  { id: 'parent', labelEn: 'Parent (Father/Mother)', labelHi: 'माता / पिता' },
  { id: 'spouse', labelEn: 'Spouse (Husband/Wife)', labelHi: 'पति / पत्नी' },
  { id: 'sibling', labelEn: 'Brother / Sister', labelHi: 'भाई / बहन' },
  { id: 'child', labelEn: 'Son / Daughter', labelHi: 'पुत्र / पुत्री' },
  { id: 'guardian', labelEn: 'Legal Guardian', labelHi: 'कानूनी अभिभावक' },
  { id: 'social_worker', labelEn: 'Social Worker / Helper', labelHi: 'सामाजिक कार्यकर्ता / सहायक' },
  { id: 'other', labelEn: 'Other relative or friend', labelHi: 'अन्य संबंधी या मित्र' },
];

export const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam',
  'Bihar', 'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export const GENDERS = [
  { id: 'male', labelEn: 'Male', labelHi: 'पुरुष' },
  { id: 'female', labelEn: 'Female', labelHi: 'महिला' },
  { id: 'transgender', labelEn: 'Transgender', labelHi: 'ट्रांसजेंडर' },
  { id: 'other', labelEn: 'Other / Prefer not to say', labelHi: 'अन्य' },
];

/**
 * Strict Privacy Rule: Personal form-prep answers (name, address, phone, etc.)
 * remain in volatile memory ONLY. NEVER persisted to localStorage or sessionStorage.
 */
let inMemoryFormPrepData: FormPrepData = { ...INITIAL_FORM_PREP_DATA };

export function saveFormPrepToSession(data: FormPrepData): void {
  inMemoryFormPrepData = { ...data };
}

export function loadFormPrepFromSession(): FormPrepData {
  return { ...inMemoryFormPrepData };
}

export function clearFormPrepFromSession(): void {
  inMemoryFormPrepData = { ...INITIAL_FORM_PREP_DATA };
}

export interface ValidationResult {
  isValid: boolean;
  messageEn?: string;
  messageHi?: string;
}

/**
 * Validates mobile number (Indian 10-digit format)
 */
export function validateMobileNumber(mobile: string): ValidationResult {
  let digits = mobile.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  if (!digits) {
    return {
      isValid: false,
      messageEn: 'Mobile number is required for portal SMS updates',
      messageHi: 'पोर्टल एसएमएस अपडेट के लिए मोबाइल नंबर आवश्यक है',
    };
  }
  if (digits.length !== 10) {
    return {
      isValid: false,
      messageEn: 'Mobile number must be exactly 10 digits',
      messageHi: 'मोबाइल नंबर ठीक 10 अंकों का होना चाहिए',
    };
  }
  return { isValid: true };
}

/**
 * Validates PIN code (Indian 6-digit postal code)
 */
export function validatePinCode(pin: string): ValidationResult {
  const digits = pin.replace(/\D/g, '');
  if (!digits) {
    return {
      isValid: false,
      messageEn: 'PIN code is required',
      messageHi: 'पिन कोड आवश्यक है',
    };
  }
  if (digits.length !== 6) {
    return {
      isValid: false,
      messageEn: 'PIN code must be exactly 6 digits',
      messageHi: 'पिन कोड ठीक 6 अंकों का होना चाहिए',
    };
  }
  return { isValid: true };
}

/**
 * Formats data into a list of key-value answers for the cheat sheet.
 */
export function generateAnswerList(data: FormPrepData, lang: 'en' | 'hi' = 'en'): Array<{
  fieldId: string;
  fieldNameEn: string;
  fieldNameHi: string;
  value: string;
  displayValue: string;
}> {
  const list: Array<{
    fieldId: string;
    fieldNameEn: string;
    fieldNameHi: string;
    value: string;
    displayValue: string;
  }> = [];

  // Who is filling
  list.push({
    fieldId: 'fillingFor',
    fieldNameEn: 'Applicant / Submitter',
    fieldNameHi: 'आवेदन भरने वाला',
    value: data.fillingFor === 'myself' ? 'Applicant (Self)' : 'Caregiver on behalf of applicant',
    displayValue: data.fillingFor === 'myself'
      ? (lang === 'hi' ? 'आवेदक स्वयं' : 'Applicant (Self)')
      : (lang === 'hi' ? `सहायक/देखभालकर्ता (${data.caregiverName}, ${data.caregiverRelation})` : `Caregiver (${data.caregiverName}, ${data.caregiverRelation})`),
  });

  if (data.fillingFor === 'someone_else') {
    list.push({
      fieldId: 'caregiverName',
      fieldNameEn: 'Caregiver Name',
      fieldNameHi: 'सहायक का नाम',
      value: data.caregiverName || 'Not specified',
      displayValue: data.caregiverName || (lang === 'hi' ? 'उल्लेख नहीं' : 'Not specified'),
    });
    list.push({
      fieldId: 'caregiverRelation',
      fieldNameEn: 'Relation to Applicant',
      fieldNameHi: 'आवेदक से संबंध',
      value: data.caregiverRelation || 'Caregiver',
      displayValue: data.caregiverRelation || (lang === 'hi' ? 'सहायक' : 'Caregiver'),
    });
    list.push({
      fieldId: 'applicantConsent',
      fieldNameEn: 'Applicant Consent',
      fieldNameHi: 'आवेदक की सहमति',
      value: data.applicantConsent ? 'Agreed by applicant' : 'Pending agreement',
      displayValue: data.applicantConsent
        ? (lang === 'hi' ? 'आवेदक सहमत है' : 'Agreed by applicant')
        : (lang === 'hi' ? 'सहमति प्रतीक्षारत' : 'Pending agreement'),
    });
  }

  // Personal details
  list.push({
    fieldId: 'fullName',
    fieldNameEn: 'Full Name (as on ID)',
    fieldNameHi: 'पूरा नाम (पहचान पत्र अनुसार)',
    value: data.fullName || '',
    displayValue: data.fullName || (lang === 'hi' ? 'खाली' : 'Not filled'),
  });

  list.push({
    fieldId: 'dob',
    fieldNameEn: 'Date of Birth',
    fieldNameHi: 'जन्म तिथि',
    value: data.dob || '',
    displayValue: data.dob || (lang === 'hi' ? 'खाली' : 'Not filled'),
  });

  list.push({
    fieldId: 'gender',
    fieldNameEn: 'Gender',
    fieldNameHi: 'लिंग',
    value: data.gender || '',
    displayValue: data.gender
      ? GENDERS.find((g) => g.id === data.gender)?.[lang === 'hi' ? 'labelHi' : 'labelEn'] || data.gender
      : (lang === 'hi' ? 'खाली' : 'Not filled'),
  });

  list.push({
    fieldId: 'mobileNumber',
    fieldNameEn: 'Mobile Number',
    fieldNameHi: 'मोबाइल नंबर',
    value: data.mobileNumber || '',
    displayValue: data.mobileNumber || (lang === 'hi' ? 'खाली' : 'Not filled'),
  });

  if (data.email) {
    list.push({
      fieldId: 'email',
      fieldNameEn: 'Email Address',
      fieldNameHi: 'ईमेल पता',
      value: data.email,
      displayValue: data.email,
    });
  }

  // Address
  list.push({
    fieldId: 'state',
    fieldNameEn: 'State / UT',
    fieldNameHi: 'राज्य / केंद्र शासित प्रदेश',
    value: data.state || '',
    displayValue: data.state || (lang === 'hi' ? 'खाली' : 'Not filled'),
  });

  list.push({
    fieldId: 'district',
    fieldNameEn: 'District',
    fieldNameHi: 'जिला',
    value: data.district || '',
    displayValue: data.district || (lang === 'hi' ? 'खाली' : 'Not filled'),
  });

  list.push({
    fieldId: 'villageTown',
    fieldNameEn: 'Village / Town / City',
    fieldNameHi: 'गांव / कस्बा / शहर',
    value: data.villageTown || '',
    displayValue: data.villageTown || (lang === 'hi' ? 'खाली' : 'Not filled'),
  });

  list.push({
    fieldId: 'pinCode',
    fieldNameEn: 'PIN Code',
    fieldNameHi: 'पिन कोड',
    value: data.pinCode || '',
    displayValue: data.pinCode || (lang === 'hi' ? 'खाली' : 'Not filled'),
  });

  // Disability details
  list.push({
    fieldId: 'disabilityCategory',
    fieldNameEn: 'Disability Category',
    fieldNameHi: 'दिव्यांगता श्रेणी',
    value: data.isNotSureDisability
      ? 'Not sure, ask the doctor (Hospital will assess)'
      : data.disabilityCategory || 'To be decided by hospital',
    displayValue: data.isNotSureDisability
      ? (lang === 'hi' ? 'पक्का नहीं पता, अस्पताल में तय होगा' : 'Not sure, ask the doctor (Hospital will assess)')
      : data.disabilityCategory || (lang === 'hi' ? 'अस्पताल द्वारा निर्धारित' : 'To be decided by hospital'),
  });

  // Hospital Choice
  list.push({
    fieldId: 'hospitalChoice',
    fieldNameEn: 'Preferred Hospital for Assessment',
    fieldNameHi: 'जांच हेतु पसंदीदा अस्पताल',
    value: data.isHospitalNotDecided
      ? 'Not decided (Select nearest notified hospital on portal)'
      : data.hospitalChoice || 'Nearest Civil Hospital',
    displayValue: data.isHospitalNotDecided
      ? (lang === 'hi' ? 'तय नहीं (पोर्टल पर निकटतम अस्पताल चुनें)' : 'Not decided (Select nearest notified hospital on portal)')
      : data.hospitalChoice || (lang === 'hi' ? 'निकटतम सिविल अस्पताल' : 'Nearest Civil Hospital'),
  });

  return list;
}

/**
 * Creates full formatted text suitable for "Copy All"
 */
export function formatAllAnswersText(data: FormPrepData, lang: 'en' | 'hi' = 'en'): string {
  const items = generateAnswerList(data, lang);
  const header = lang === 'hi'
    ? '=== सक्षम (SAKSHAM) - स्वावलंबन पोर्टल आवेदन उत्तर शीट ===\nनोट: इन उत्तरों को आधिकारिक स्वावलंबन पोर्टल (swavlambancard.gov.in) पर कॉपी करें।\n'
    : '=== SAKSHAM - SWAVLAMBAN UDID PORTAL ANSWER SHEET ===\nNote: Copy each answer into the official portal (swavlambancard.gov.in).\n';

  const body = items
    .map((item) => `${lang === 'hi' ? item.fieldNameHi : item.fieldNameEn}: ${item.value}`)
    .join('\n');

  const footer = lang === 'hi'
    ? '\n\nमहत्वपूर्ण: सक्षम कोई गोपनीय डेटा (आधार नंबर, बैंक विवरण, ओटीपी या पासवर्ड) नहीं मांगता है।'
    : '\n\nImportant: Saksham never requests Aadhaar numbers, bank details, OTPs, or passwords.';

  return header + body + footer;
}

/**
 * Strict Privacy: Personal form prep data remains in volatile memory only. Never persisted.
 */
export function loadFormPrepData(): FormPrepData | null {
  return inMemoryFormPrepData ? { ...inMemoryFormPrepData } : null;
}

/**
 * Strict Privacy: Personal form prep data remains in volatile memory only. Never persisted.
 */
export function saveFormPrepData(data: FormPrepData): void {
  inMemoryFormPrepData = { ...data };
}

