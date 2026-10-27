/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Volume2,
  Mic,
  Copy,
  Check,
  Printer,
  Trash2,
  AlertCircle,
  ExternalLink,
  Lock,
  Sparkles,
  Info,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import { useSakshamStore } from '../store/useSakshamStore';
import {
  INITIAL_FORM_PREP_DATA,
  saveFormPrepToSession,
  loadFormPrepFromSession,
  clearFormPrepFromSession,
  validateMobileNumber,
  validatePinCode,
  generateAnswerList,
  formatAllAnswersText,
  DISABILITY_CATEGORIES_PLAIN,
  CAREGIVER_RELATIONS,
  INDIAN_STATES,
  GENDERS,
  type FormPrepData,
} from '../utils/formPrep';
import { VoiceAssistant } from './VoiceAssistant';

export const FormPrepView: React.FC = () => {
  const {
    setActiveScreen,
    startSpeaking,
    stopSpeaking,
    isSpeaking,
    language,
    setLanguage,
    highContrast,
  } = useSakshamStore();

  const isHi = language === 'hi';

  // Load from in-memory session state on initial render (volatile memory only)
  const [formData, setFormData] = useState<FormPrepData>(() => loadFormPrepFromSession());
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [validationError, setValidationError] = useState<string>('');
  const [srAnnouncement, setSrAnnouncement] = useState<string>('');
  const [copiedFieldId, setCopiedFieldId] = useState<string | null>(null);
  const [allCopied, setAllCopied] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [isListeningSpeech, setIsListeningSpeech] = useState<boolean>(false);

  // Feature detect SpeechRecognition for optional Dictate button
  const [hasSpeechRecognition, setHasSpeechRecognition] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setHasSpeechRecognition(true);
      }
    }
  }, []);

  // Sync to in-memory session state whenever form data changes (volatile memory only)
  useEffect(() => {
    saveFormPrepToSession(formData);
  }, [formData]);

  const announce = (text: string) => {
    setSrAnnouncement(text);
    startSpeaking(text);
  };

  /**
   * Question Steps definition:
   * Dynamic: if "myself", caregiver steps are skipped.
   */
  interface StepDef {
    id: string;
    questionNumber: number;
    titleEn: string;
    titleHi: string;
    promptEn: string;
    promptHi: string;
    hintEn?: string;
    hintHi?: string;
    sectionEn: string;
    sectionHi: string;
  }

  const isCaregiver = formData.fillingFor === 'someone_else';

  // Build the active steps array based on who is filling
  const steps: StepDef[] = [
    {
      id: 'who_filling',
      questionNumber: 1,
      titleEn: 'Who is filling this application?',
      titleHi: 'यह आवेदन कौन भर रहा है?',
      promptEn: 'Question 1: Who is filling this application? Choose Myself if you are the applicant, or Someone else if you are a caregiver assisting.',
      promptHi: 'प्रश्न 1: यह आवेदन कौन भर रहा है? यदि आप स्वयं आवेदक हैं तो "मैं स्वयं" चुनें, या सहायक हैं तो "कोई अन्य" चुनें।',
      sectionEn: 'Applicant Information',
      sectionHi: 'आवेदक जानकारी',
    },
    ...(isCaregiver
      ? [
          {
            id: 'caregiver_details',
            questionNumber: 2,
            titleEn: 'Caregiver details and applicant consent',
            titleHi: 'सहायक का विवरण और आवेदक की सहमति',
            promptEn: 'Caregiver details: Enter your full name, your relationship to the applicant, and confirm applicant consent.',
            promptHi: 'सहायक विवरण: अपना पूरा नाम, आवेदक से संबंध दर्ज करें और आवेदक की सहमति की पुष्टि करें।',
            hintEn: 'The official portal requires caregiver relationship details when applying on behalf of a person with disability.',
            hintHi: 'पोर्टल पर किसी अन्य व्यक्ति की ओर से आवेदन करते समय सहायक का विवरण आवश्यक होता है।',
            sectionEn: 'Caregiver Details',
            sectionHi: 'सहायक विवरण',
          },
        ]
      : []),
    {
      id: 'full_name',
      questionNumber: isCaregiver ? 3 : 2,
      titleEn: 'What is the applicant\'s full name?',
      titleHi: 'आवेदक का पूरा नाम क्या है?',
      promptEn: `Question ${isCaregiver ? 3 : 2}: What is the applicant's full name? Enter the exact name as shown on your identity proof or certificate.`,
      promptHi: `प्रश्न ${isCaregiver ? 3 : 2}: आवेदक का पूरा नाम क्या है? पहचान प्रमाण पत्र के अनुसार सही नाम दर्ज करें।`,
      hintEn: 'Enter exactly as printed on Aadhaar, Voter ID, or medical report.',
      hintHi: 'पहचान पत्र या अस्पताल रिपोर्ट के अनुसार हूबहू दर्ज करें।',
      sectionEn: 'Personal Details',
      sectionHi: 'व्यक्तिगत विवरण',
    },
    {
      id: 'dob',
      questionNumber: isCaregiver ? 4 : 3,
      titleEn: 'Date of birth',
      titleHi: 'जन्म तिथि',
      promptEn: `Question ${isCaregiver ? 4 : 3}: What is the date of birth?`,
      promptHi: `प्रश्न ${isCaregiver ? 4 : 3}: जन्म तिथि क्या है?`,
      hintEn: 'Used for official government records and age verification.',
      hintHi: 'सरकारी रिकॉर्ड और आयु सत्यापन के लिए उपयोग किया जाता है।',
      sectionEn: 'Personal Details',
      sectionHi: 'व्यक्तिगत विवरण',
    },
    {
      id: 'gender',
      questionNumber: isCaregiver ? 5 : 4,
      titleEn: 'Gender',
      titleHi: 'लिंग',
      promptEn: `Question ${isCaregiver ? 5 : 4}: Select gender: Male, Female, Transgender, or Other.`,
      promptHi: `प्रश्न ${isCaregiver ? 5 : 4}: लिंग चुनें: पुरुष, महिला, ट्रांसजेंडर या अन्य।`,
      sectionEn: 'Personal Details',
      sectionHi: 'व्यक्तिगत विवरण',
    },
    {
      id: 'mobile',
      questionNumber: isCaregiver ? 6 : 5,
      titleEn: 'Mobile number for SMS updates',
      titleHi: 'एसएमएस अपडेट हेतु मोबाइल नंबर',
      promptEn: `Question ${isCaregiver ? 6 : 5}: What is your 10-digit mobile number? The government portal will send status updates here.`,
      promptHi: `प्रश्न ${isCaregiver ? 6 : 5}: आपका 10 अंकों का मोबाइल नंबर क्या है? सरकारी पोर्टल इस पर स्थिति अपडेट भेजेगा।`,
      hintEn: 'Enter 10-digit number. Used on the portal to receive application status SMS.',
      hintHi: '10 अंकों का नंबर दर्ज करें। पोर्टल आवेदन की स्थिति का एसएमएस इसी पर भेजेगा।',
      sectionEn: 'Personal Details',
      sectionHi: 'व्यक्तिगत विवरण',
    },
    {
      id: 'email',
      questionNumber: isCaregiver ? 7 : 6,
      titleEn: 'Email address (Optional)',
      titleHi: 'ईमेल पता (वैकल्पिक)',
      promptEn: `Question ${isCaregiver ? 7 : 6}: What is your email address? This is optional.`,
      promptHi: `प्रश्न ${isCaregiver ? 7 : 6}: आपका ईमेल पता क्या है? यह वैकल्पिक है।`,
      hintEn: 'Optional: leave blank if you do not have or use email.',
      hintHi: 'वैकल्पिक: यदि आपके पास ईमेल नहीं है तो इसे खाली छोड़ सकते हैं।',
      sectionEn: 'Personal Details',
      sectionHi: 'व्यक्तिगत विवरण',
    },
    {
      id: 'state',
      questionNumber: isCaregiver ? 8 : 7,
      titleEn: 'State or Union Territory',
      titleHi: 'राज्य या केंद्र शासित प्रदेश',
      promptEn: `Question ${isCaregiver ? 8 : 7}: Select your State or Union Territory.`,
      promptHi: `प्रश्न ${isCaregiver ? 8 : 7}: अपना राज्य या केंद्र शासित प्रदेश चुनें।`,
      sectionEn: 'Address Details',
      sectionHi: 'पते का विवरण',
    },
    {
      id: 'district',
      questionNumber: isCaregiver ? 9 : 8,
      titleEn: 'District',
      titleHi: 'जिला',
      promptEn: `Question ${isCaregiver ? 9 : 8}: What is your district?`,
      promptHi: `प्रश्न ${isCaregiver ? 9 : 8}: आपका जिला कौन सा है?`,
      sectionEn: 'Address Details',
      sectionHi: 'पते का विवरण',
    },
    {
      id: 'village_town',
      questionNumber: isCaregiver ? 10 : 9,
      titleEn: 'Village, Town, or City with Locality',
      titleHi: 'गांव, कस्बा या शहर और पता',
      promptEn: `Question ${isCaregiver ? 10 : 9}: Enter your village, town, or city address.`,
      promptHi: `प्रश्न ${isCaregiver ? 10 : 9}: अपना गांव, कस्बा या शहर का पता दर्ज करें।`,
      hintEn: 'Your permanent or current communication address.',
      hintHi: 'आपका स्थाई या वर्तमान निवास का पता।',
      sectionEn: 'Address Details',
      sectionHi: 'पते का विवरण',
    },
    {
      id: 'pin_code',
      questionNumber: isCaregiver ? 11 : 10,
      titleEn: 'PIN code',
      titleHi: 'पिन कोड',
      promptEn: `Question ${isCaregiver ? 11 : 10}: What is your 6-digit postal PIN code?`,
      promptHi: `प्रश्न ${isCaregiver ? 11 : 10}: आपका 6 अंकों का डाक पिन कोड क्या है?`,
      hintEn: '6-digit postal code where physical card can be dispatched.',
      hintHi: '6 अंकों का पिन कोड जहां डाक द्वारा कार्ड भेजा जाएगा।',
      sectionEn: 'Address Details',
      sectionHi: 'पते का विवरण',
    },
    {
      id: 'disability_details',
      questionNumber: isCaregiver ? 12 : 11,
      titleEn: 'Disability category',
      titleHi: 'दिव्यांगता श्रेणी',
      promptEn: `Question ${isCaregiver ? 12 : 11}: Choose a plain-language disability category, or select Not sure, ask the doctor. Note: Your certificate or hospital decides this.`,
      promptHi: `प्रश्न ${isCaregiver ? 12 : 11}: सरल भाषा में दिव्यांगता श्रेणी चुनें, या "पक्का नहीं पता, डॉक्टर से पूछेंगे" चुनें। नोट: आपका प्रमाणपत्र या अस्पताल ही इसे तय करता है।`,
      hintEn: 'Your certificate or the hospital decides this. Saksham does not make or imply a medical diagnosis.',
      hintHi: 'आपका प्रमाणपत्र या अस्पताल ही इसे तय करता है। सक्षम कोई मेडिकल निदान नहीं करता।',
      sectionEn: 'Disability Details',
      sectionHi: 'दिव्यांगता विवरण',
    },
    {
      id: 'hospital_choice',
      questionNumber: isCaregiver ? 13 : 12,
      titleEn: 'Hospital choice for assessment',
      titleHi: 'जांच हेतु अस्पताल का चयन',
      promptEn: `Question ${isCaregiver ? 13 : 12}: Hospital choice. The assessment is done at a notified hospital in the home district or where the person is treated. Type a hospital name, or select Not decided.`,
      promptHi: `प्रश्न ${isCaregiver ? 13 : 12}: अस्पताल का चयन। जांच गृह जिले या जहां इलाज चल रहा है, वहां के सरकारी अस्पताल में होती है। अस्पताल का नाम लिखें या "तय नहीं" चुनें।`,
      hintEn: 'The assessment is done at a notified hospital in the home district or where the person is treated. Do not worry if not decided yet.',
      hintHi: 'जांच गृह जिले के अधिसूचित सरकारी अस्पताल में होती है। यदि अभी तय नहीं है तो चिंता न करें।',
      sectionEn: 'Hospital Choice',
      sectionHi: 'अस्पताल चयन',
    },
  ];

  const totalQuestions = steps.length;
  const isAnswerSheet = currentStepIndex >= totalQuestions;
  const currentStep = steps[currentStepIndex] || steps[0];

  // Auto-read question on user navigation if reading barrier is present
  const handleReadCurrentQuestion = () => {
    if (isAnswerSheet) {
      const summary = isHi
        ? 'समीक्षा और उत्तर शीट। आपके सभी उत्तर तैयार हैं। प्रत्येक उत्तर के पास कॉपी बटन है, या कॉपी ऑल दबाकर सभी उत्तर कॉपी करें।'
        : 'Review and answer sheet. All your answers are prepared. Use the copy button next to each field, or tap Copy All to copy everything.';
      announce(summary);
    } else {
      const speech = isHi ? currentStep.promptHi : currentStep.promptEn;
      announce(speech);
    }
  };

  /**
   * Validate current step before advancing
   */
  const validateCurrentStep = (): boolean => {
    setValidationError('');

    if (currentStep.id === 'caregiver_details') {
      if (!formData.caregiverName.trim()) {
        const msg = isHi ? 'कृपया सहायक का नाम दर्ज करें' : 'Please enter the caregiver name';
        setValidationError(msg);
        announce(msg);
        return false;
      }
      if (!formData.applicantConsent) {
        const msg = isHi
          ? 'कृपया पुष्टि करें कि आवेदक इस सहायता से सहमत है'
          : 'Please confirm that the applicant agrees to this help';
        setValidationError(msg);
        announce(msg);
        return false;
      }
    }

    if (currentStep.id === 'full_name') {
      if (!formData.fullName.trim()) {
        const msg = isHi ? 'कृपया आवेदक का पूरा नाम दर्ज करें' : 'Please enter the applicant full name';
        setValidationError(msg);
        announce(msg);
        return false;
      }
    }

    if (currentStep.id === 'mobile') {
      const res = validateMobileNumber(formData.mobileNumber);
      if (!res.isValid) {
        const msg = isHi ? res.messageHi! : res.messageEn!;
        setValidationError(msg);
        announce(msg);
        return false;
      }
    }

    if (currentStep.id === 'pin_code') {
      const res = validatePinCode(formData.pinCode);
      if (!res.isValid) {
        const msg = isHi ? res.messageHi! : res.messageEn!;
        setValidationError(msg);
        announce(msg);
        return false;
      }
    }

    if (currentStep.id === 'disability_details') {
      if (!formData.disabilityCategory && !formData.isNotSureDisability) {
        const msg = isHi
          ? 'कृपया एक श्रेणी चुनें या "पक्का नहीं पता" चुनें'
          : 'Please select a category or choose "Not sure, ask the doctor"';
        setValidationError(msg);
        announce(msg);
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStepIndex < totalQuestions) {
        setCurrentStepIndex(currentStepIndex + 1);
        setValidationError('');
      }
    }
  };

  const handleBack = () => {
    setValidationError('');
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else {
      setActiveScreen('documents');
    }
  };

  /**
   * Optional Speech Recognition Dictation
   */
  const handleToggleDictate = () => {
    if (!hasSpeechRecognition) return;

    if (isListeningSpeech) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListeningSpeech(false);
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = isHi ? 'hi-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListeningSpeech(true);
        announce(isHi ? 'सुन रहा हूँ, बोलिए...' : 'Listening, please speak...');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          applyDictatedText(currentStep.id, transcript);
          announce(
            isHi
              ? `दर्ज किया गया: ${transcript}`
              : `Recorded: ${transcript}`
          );
        }
        setIsListeningSpeech(false);
      };

      recognition.onerror = () => {
        setIsListeningSpeech(false);
      };

      recognition.onend = () => {
        setIsListeningSpeech(false);
      };

      recognition.start();
    } catch (e) {
      setIsListeningSpeech(false);
    }
  };

  const applyDictatedText = (stepId: string, text: string) => {
    switch (stepId) {
      case 'full_name':
        setFormData((prev) => ({ ...prev, fullName: text }));
        break;
      case 'caregiver_details':
        setFormData((prev) => ({ ...prev, caregiverName: text }));
        break;
      case 'district':
        setFormData((prev) => ({ ...prev, district: text }));
        break;
      case 'village_town':
        setFormData((prev) => ({ ...prev, villageTown: text }));
        break;
      case 'mobile':
        setFormData((prev) => ({ ...prev, mobileNumber: text.replace(/\D/g, '') }));
        break;
      case 'pin_code':
        setFormData((prev) => ({ ...prev, pinCode: text.replace(/\D/g, '') }));
        break;
      case 'hospital_choice':
        setFormData((prev) => ({ ...prev, hospitalChoice: text, isHospitalNotDecided: false }));
        break;
      default:
        break;
    }
  };

  /**
   * Copy to clipboard helper
   */
  const handleCopyField = async (fieldId: string, value: string, name: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedFieldId(fieldId);
      const msg = isHi ? `${name} कॉपी किया गया` : `${name} copied to clipboard`;
      setSrAnnouncement(msg);
      setTimeout(() => setCopiedFieldId(null), 2000);
    } catch (e) {
      console.warn('Clipboard write error:', e);
    }
  };

  const handleCopyAll = async () => {
    const allText = formatAllAnswersText(formData, language);
    try {
      await navigator.clipboard.writeText(allText);
      setAllCopied(true);
      const msg = isHi
        ? 'सभी उत्तर कॉपी किए गए! अब स्वावलंबन पोर्टल पर पेस्ट करें।'
        : 'All answers copied! Ready to paste into the official portal.';
      announce(msg);
      setTimeout(() => setAllCopied(false), 3000);
    } catch (e) {
      console.warn('Clipboard write error:', e);
    }
  };

  const handleClearData = () => {
    clearFormPrepFromSession();
    setFormData({ ...INITIAL_FORM_PREP_DATA });
    setCurrentStepIndex(0);
    setShowClearConfirm(false);
    const msg = isHi
      ? 'आपका तैयार किया गया सभी डेटा डिवाइस से हटा दिया गया है।'
      : 'All your prepared form data has been cleared from this device.';
    announce(msg);
  };

  return (
    <div
      className={`min-h-screen w-full p-4 sm:p-6 md:p-10 flex flex-col items-center justify-start relative overflow-hidden transition-colors duration-500 ${
        highContrast
          ? 'bg-slate-950 text-slate-100'
          : 'bg-gradient-to-br from-indigo-50 via-sky-50 to-blue-100 text-slate-800'
      }`}
    >
      {/* Screen Reader Live Assertive Announcement */}
      <div
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        data-testid="formprep-live-region"
      >
        {srAnnouncement}
      </div>

      {/* Main Glassmorphic Wrapper */}
      <motion.main
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`w-full max-w-4xl rounded-3xl p-5 sm:p-8 md:p-10 backdrop-blur-md transition-all relative ${
          highContrast
            ? 'bg-slate-900/95 border-2 border-yellow-400 shadow-2xl text-white'
            : 'bg-white/85 border border-white/60 shadow-xl'
        }`}
      >
        {/* Navigation & Header Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/70 mb-6 no-print">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={isHi ? 'पीछे जाएं' : 'Go back'}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {isHi ? 'फॉर्म तैयारी साथी' : 'Form Prep Buddy'}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {isAnswerSheet
                    ? isHi ? 'समीक्षा व उत्तर शीट' : 'Review & Answer Sheet'
                    : `Question ${currentStep.questionNumber} of ${totalQuestions}`}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                {isAnswerSheet
                  ? isHi ? 'आपकी स्वावलंबन उत्तर शीट' : 'Your UDID Portal Answer Sheet'
                  : isHi ? currentStep.titleHi : currentStep.titleEn}
              </h1>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-xs"
              aria-label="Toggle language between English and Hindi"
            >
              {language === 'en' ? 'हिन्दी में भरें' : 'Fill in English'}
            </button>

            <button
              type="button"
              onClick={handleReadCurrentQuestion}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200 shadow-xs"
              aria-label="Read question aloud"
            >
              <Volume2 className="w-3.5 h-3.5 text-blue-600" />
              <span>{isHi ? 'दोबारा सुनें' : 'Read again'}</span>
            </button>

            {hasSpeechRecognition && !isAnswerSheet && (
              <button
                type="button"
                onClick={handleToggleDictate}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs border ${
                  isListeningSpeech
                    ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                }`}
                title="Dictate answer using your microphone"
                aria-label="Dictate answer with voice"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{isListeningSpeech ? (isHi ? 'सुन रहा हूँ...' : 'Listening...') : (isHi ? 'बोलकर भरें' : 'Dictate')}</span>
              </button>
            )}
          </div>
        </header>

        {/* ------------------------------------------------------------- */}
        {/* Strict Privacy Non-Negotiable Banner */}
        {/* ------------------------------------------------------------- */}
        <section
          aria-label="Privacy Guarantee"
          className="mb-6 p-4 rounded-2xl bg-slate-100/90 border border-slate-300/80 text-slate-800 text-xs leading-relaxed flex items-start gap-3 no-print"
        >
          <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-slate-900">
              {isHi
                ? 'गोपनीयता नियम: हम कभी भी आधार नंबर, बैंक खाता, ओटीपी या पासवर्ड नहीं मांगते।'
                : 'Privacy Rule: We NEVER ask for or store your Aadhaar number, bank details, OTP, or passwords.'}
            </p>
            <p className="text-slate-600 mt-0.5">
              {isHi
                ? 'यह डेटा केवल आपके ब्राउज़र मेमोरी में अस्थायी रूप से रहता है। किसी सर्वर पर नहीं भेजा जाता।'
                : 'All answers stay strictly inside your browser session. Never sent to any server.'}
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* Progress Bar (Question X of Y) */}
        {/* ------------------------------------------------------------- */}
        {!isAnswerSheet && (
          <div className="mb-6 no-print">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1.5">
              <span>
                {isHi
                  ? `प्रश्न ${currentStep.questionNumber} का ${totalQuestions}`
                  : `Question ${currentStep.questionNumber} of ${totalQuestions}`}
              </span>
              <span className="text-blue-700 font-extrabold">
                {isHi ? currentStep.sectionHi : currentStep.sectionEn}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep.questionNumber / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* Inline Validation Announcement */}
        {/* ------------------------------------------------------------- */}
        {validationError && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 flex items-center gap-2.5 text-xs font-bold"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{validationError}</span>
          </motion.div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* Step-by-Step Question Body */}
        {/* ------------------------------------------------------------- */}
        {!isAnswerSheet && (
          <div className="space-y-6">
            {/* Step 1: Who is filling this? */}
            {currentStep.id === 'who_filling' && (
              <div className="space-y-4">
                <p className="text-sm sm:text-base font-semibold text-slate-700">
                  {isHi
                    ? 'कृपया चुनें कि यह फॉर्म कौन भर रहा है:'
                    : 'Please select who is preparing this form:'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((p) => ({ ...p, fillingFor: 'myself' }));
                      announce(isHi ? 'मैं स्वयं' : 'Myself');
                    }}
                    className={`p-5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                      formData.fillingFor === 'myself'
                        ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-slate-900">
                        {isHi ? 'मैं स्वयं (आवेदक)' : 'Myself (The Applicant)'}
                      </span>
                      {formData.fillingFor === 'myself' && (
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      {isHi
                        ? 'मैं अपनी दिव्यांगता पहचान पत्र के लिए जानकारी स्वयं भर रहा हूँ।'
                        : 'I am preparing the answers for my own disability ID application.'}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData((p) => ({ ...p, fillingFor: 'someone_else' }));
                      announce(isHi ? 'कोई अन्य (सहायक)' : 'Someone else');
                    }}
                    className={`p-5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                      formData.fillingFor === 'someone_else'
                        ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-slate-900">
                        {isHi ? 'कोई अन्य (सहायक / परिवार)' : 'Someone else (Caregiver / Family)'}
                      </span>
                      {formData.fillingFor === 'someone_else' && (
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      {isHi
                        ? 'मैं परिवार के सदस्य या मित्र की सहायता कर रहा हूँ।'
                        : 'I am helping a family member, child, or person with disability.'}
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* Step 1b (If someone else): Caregiver name, relation, switch-style consent */}
            {currentStep.id === 'caregiver_details' && (
              <div className="space-y-5">
                <div>
                  <label htmlFor="caregiver-name-input" className="block text-sm font-bold text-slate-800 mb-1.5">
                    {isHi ? 'सहायक / देखभालकर्ता का पूरा नाम:' : 'Caregiver full name:'}
                  </label>
                  <input
                    id="caregiver-name-input"
                    type="text"
                    value={formData.caregiverName}
                    onChange={(e) => setFormData({ ...formData, caregiverName: e.target.value })}
                    placeholder={isHi ? 'उदा. सुनीता शर्मा' : 'e.g. Sunita Sharma'}
                    className="w-full text-base sm:text-lg p-4 rounded-2xl border border-slate-300 bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-xs"
                  />
                </div>

                <div>
                  <label htmlFor="caregiver-relation-select" className="block text-sm font-bold text-slate-800 mb-1.5">
                    {isHi ? 'आवेदक से संबंध:' : 'Relationship to applicant:'}
                  </label>
                  <select
                    id="caregiver-relation-select"
                    value={formData.caregiverRelation}
                    onChange={(e) => setFormData({ ...formData, caregiverRelation: e.target.value })}
                    className="w-full text-base p-4 rounded-2xl border border-slate-300 bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-xs"
                  >
                    <option value="">{isHi ? '-- संबंध चुनें --' : '-- Select relationship --'}</option>
                    {CAREGIVER_RELATIONS.map((r) => (
                      <option key={r.id} value={r.labelEn}>
                        {isHi ? r.labelHi : r.labelEn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Switch-style consent button: "The applicant agrees to this help" */}
                <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-bold text-sm text-teal-950 block">
                      {isHi ? 'आवेदक की सहमति:' : 'Applicant consent:'}
                    </span>
                    <span className="text-xs text-teal-800 mt-0.5 block">
                      {isHi
                        ? 'आवेदक इस सहायता और विवरण भरे जाने से सहमत है।'
                        : 'The applicant agrees to this help and understands the details being prepared.'}
                    </span>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={formData.applicantConsent}
                    onClick={() => {
                      const next = !formData.applicantConsent;
                      setFormData({ ...formData, applicantConsent: next });
                      announce(
                        next
                          ? isHi ? 'सहमति चालू की गई' : 'Consent confirmed'
                          : isHi ? 'सहमति बंद की गई' : 'Consent removed'
                      );
                    }}
                    className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-teal-500/30 ${
                      formData.applicantConsent ? 'bg-teal-600' : 'bg-slate-300'
                    }`}
                  >
                    <span className="sr-only">The applicant agrees to this help</span>
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        formData.applicantConsent ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Full Name */}
            {currentStep.id === 'full_name' && (
              <div className="space-y-3">
                <label htmlFor="fullname-input" className="block text-sm font-bold text-slate-800">
                  {isHi ? 'आवेदक का पूरा नाम (पहचान पत्र अनुसार):' : 'Full Name (as on identity card):'}
                </label>
                <input
                  id="fullname-input"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder={isHi ? 'उदा. राहुल कुमार' : 'e.g. Rahul Kumar'}
                  className="w-full text-base sm:text-xl p-4 sm:p-5 rounded-2xl border border-slate-300 bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-semibold shadow-xs"
                />
                <p className="text-xs text-slate-500">
                  {isHi ? currentStep.hintHi : currentStep.hintEn}
                </p>
              </div>
            )}

            {/* Step 3: Date of Birth */}
            {currentStep.id === 'dob' && (
              <div className="space-y-3">
                <label htmlFor="dob-input" className="block text-sm font-bold text-slate-800">
                  {isHi ? 'जन्म तिथि चुनें:' : 'Select Date of Birth:'}
                </label>
                <input
                  id="dob-input"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full text-base sm:text-lg p-4 rounded-2xl border border-slate-300 bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-xs"
                />
                <p className="text-xs text-slate-500">
                  {isHi ? currentStep.hintHi : currentStep.hintEn}
                </p>
              </div>
            )}

            {/* Step 4: Gender */}
            {currentStep.id === 'gender' && (
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-800">
                  {isHi ? 'लिंग चुनें:' : 'Select Gender:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {GENDERS.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, gender: g.id as any });
                        announce(isHi ? g.labelHi : g.labelEn);
                      }}
                      className={`p-4 rounded-2xl border-2 font-bold text-sm sm:text-base text-center transition-all ${
                        formData.gender === g.id
                          ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-sm'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {isHi ? g.labelHi : g.labelEn}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Mobile Number */}
            {currentStep.id === 'mobile' && (
              <div className="space-y-3">
                <label htmlFor="mobile-input" className="block text-sm font-bold text-slate-800">
                  {isHi ? '10 अंकों का मोबाइल नंबर:' : '10-digit Mobile Number:'}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">
                    +91
                  </span>
                  <input
                    id="mobile-input"
                    type="tel"
                    maxLength={10}
                    value={formData.mobileNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setFormData({ ...formData, mobileNumber: val });
                    }}
                    placeholder="9876543210"
                    className="w-full text-base sm:text-xl pl-16 pr-4 py-4 rounded-2xl border border-slate-300 bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono font-bold tracking-wider shadow-xs"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  {isHi ? currentStep.hintHi : currentStep.hintEn}
                </p>
              </div>
            )}

            {/* Step 6: Email (Optional) */}
            {currentStep.id === 'email' && (
              <div className="space-y-3">
                <label htmlFor="email-input" className="block text-sm font-bold text-slate-800">
                  {isHi ? 'ईमेल पता (वैकल्पिक):' : 'Email Address (Optional):'}
                </label>
                <input
                  id="email-input"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="applicant@example.com"
                  className="w-full text-base sm:text-lg p-4 rounded-2xl border border-slate-300 bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-xs"
                />
                <p className="text-xs text-slate-500">
                  {isHi ? currentStep.hintHi : currentStep.hintEn}
                </p>
              </div>
            )}

            {/* Step 7: State */}
            {currentStep.id === 'state' && (
              <div className="space-y-3">
                <label htmlFor="state-select" className="block text-sm font-bold text-slate-800">
                  {isHi ? 'राज्य / केंद्र शासित प्रदेश चुनें:' : 'Select State / Union Territory:'}
                </label>
                <select
                  id="state-select"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full text-base p-4 rounded-2xl border border-slate-300 bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-xs"
                >
                  <option value="">{isHi ? '-- राज्य चुनें --' : '-- Select state --'}</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Step 8: District */}
            {currentStep.id === 'district' && (
              <div className="space-y-3">
                <label htmlFor="district-input" className="block text-sm font-bold text-slate-800">
                  {isHi ? 'जिला का नाम दर्ज करें:' : 'Enter District Name:'}
                </label>
                <input
                  id="district-input"
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder={isHi ? 'उदा. दक्षिण दिल्ली, पटना, जयपुर' : 'e.g. South Delhi, Patna, Jaipur'}
                  className="w-full text-base sm:text-lg p-4 rounded-2xl border border-slate-300 bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-xs"
                />
              </div>
            )}

            {/* Step 9: Village / Town */}
            {currentStep.id === 'village_town' && (
              <div className="space-y-3">
                <label htmlFor="village-input" className="block text-sm font-bold text-slate-800">
                  {isHi ? 'गांव, कस्बा या शहर और पता:' : 'Village, Town, or City with Address:'}
                </label>
                <textarea
                  id="village-input"
                  rows={3}
                  value={formData.villageTown}
                  onChange={(e) => setFormData({ ...formData, villageTown: e.target.value })}
                  placeholder={isHi ? 'मकान संख्या, गली, गांव या कॉलोनी' : 'House no, Street, Colony, Village or City'}
                  className="w-full text-base p-4 rounded-2xl border border-slate-300 bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-xs"
                />
                <p className="text-xs text-slate-500">
                  {isHi ? currentStep.hintHi : currentStep.hintEn}
                </p>
              </div>
            )}

            {/* Step 10: PIN Code */}
            {currentStep.id === 'pin_code' && (
              <div className="space-y-3">
                <label htmlFor="pincode-input" className="block text-sm font-bold text-slate-800">
                  {isHi ? '6 अंकों का पिन कोड:' : '6-digit Postal PIN Code:'}
                </label>
                <input
                  id="pincode-input"
                  type="text"
                  maxLength={6}
                  value={formData.pinCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setFormData({ ...formData, pinCode: val });
                  }}
                  placeholder="110001"
                  className="w-full text-base sm:text-xl p-4 rounded-2xl border border-slate-300 bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono font-bold tracking-widest shadow-xs"
                />
                <p className="text-xs text-slate-500">
                  {isHi ? currentStep.hintHi : currentStep.hintEn}
                </p>
              </div>
            )}

            {/* Step 11: Disability Details (Plain-language picker + "Not sure, ask the doctor") */}
            {currentStep.id === 'disability_details' && (
              <div className="space-y-4">
                {/* Mandatory disclaimer note: Your certificate or hospital decides this */}
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="font-semibold leading-relaxed">
                    {isHi
                      ? 'महत्वपूर्ण: आपका प्रमाणपत्र या अस्पताल ही इसे तय करता है। सक्षम कोई निदान नहीं करता।'
                      : 'Important Note: Your certificate or the hospital decides this. Saksham does not make or imply a medical diagnosis.'}
                  </p>
                </div>

                <div className="space-y-2.5">
                  {DISABILITY_CATEGORIES_PLAIN.map((c) => {
                    const isSelected =
                      c.id === 'not_sure'
                        ? formData.isNotSureDisability
                        : formData.disabilityCategory === c.labelEn && !formData.isNotSureDisability;

                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          if (c.id === 'not_sure') {
                            setFormData({
                              ...formData,
                              isNotSureDisability: true,
                              disabilityCategory: 'Not sure, ask the doctor',
                            });
                            announce(isHi ? 'पक्का नहीं पता, डॉक्टर से पूछेंगे' : 'Not sure, ask the doctor');
                          } else {
                            setFormData({
                              ...formData,
                              isNotSureDisability: false,
                              disabilityCategory: c.labelEn,
                            });
                            announce(isHi ? c.labelHi : c.labelEn);
                          }
                        }}
                        className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/80 text-blue-950 font-bold shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="text-sm sm:text-base">
                          {isHi ? c.labelHi : c.labelEn}
                        </span>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 12: Hospital choice */}
            {currentStep.id === 'hospital_choice' && (
              <div className="space-y-4">
                {/* Short explainer */}
                <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-blue-950 text-xs sm:text-sm leading-relaxed">
                  <p className="font-bold">
                    {isHi ? 'अस्पताल निर्धारण प्रक्रिया:' : 'How hospital selection works:'}
                  </p>
                  <p className="text-blue-900 mt-0.5">
                    {isHi
                      ? 'जांच गृह जिले के अधिसूचित सरकारी अस्पताल या जहां इलाज चल रहा है, वहां होती है। आपको पहले से अस्पताल सूची याद रखने की आवश्यकता नहीं है।'
                      : 'The assessment is done at a notified hospital in your home district or where you receive treatment. The official portal lets you pick from the state\'s designated list.'}
                  </p>
                </div>

                <div>
                  <label htmlFor="hospital-input" className="block text-sm font-bold text-slate-800 mb-1.5">
                    {isHi ? 'अस्पताल का नाम (यदि ज्ञात हो):' : 'Hospital name (if known / preferred):'}
                  </label>
                  <input
                    id="hospital-input"
                    type="text"
                    disabled={formData.isHospitalNotDecided}
                    value={formData.hospitalChoice}
                    onChange={(e) => setFormData({ ...formData, hospitalChoice: e.target.value })}
                    placeholder={isHi ? 'उदा. जिला सिविल अस्पताल, एम्स, मेडिकल कॉलेज' : 'e.g. District Civil Hospital, AIIMS, Medical College'}
                    className={`w-full text-base sm:text-lg p-4 rounded-2xl border transition-all shadow-xs ${
                      formData.isHospitalNotDecided
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                        : 'border-slate-300 bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600'
                    }`}
                  />
                </div>

                {/* "Not decided" option */}
                <button
                  type="button"
                  onClick={() => {
                    const next = !formData.isHospitalNotDecided;
                    setFormData({
                      ...formData,
                      isHospitalNotDecided: next,
                      hospitalChoice: next ? 'Not decided (Select on portal)' : '',
                    });
                    announce(
                      next
                        ? isHi ? 'अस्पताल तय नहीं चुना गया' : 'Hospital not decided selected'
                        : isHi ? 'अस्पताल नाम दर्ज करें' : 'Enter hospital name'
                    );
                  }}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                    formData.isHospitalNotDecided
                      ? 'border-teal-600 bg-teal-50/80 text-teal-950 font-bold shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <span className="text-sm sm:text-base font-bold block">
                      {isHi ? 'अभी तय नहीं है (पोर्टल पर निकटतम अस्पताल चुनेंगे)' : 'Not decided yet (Will select nearest hospital on portal)'}
                    </span>
                    <span className="text-xs text-slate-500 mt-0.5 block">
                      {isHi
                        ? 'आधिकारिक स्वावलंबन पोर्टल आपके जिले के सभी अधिकृत अस्पताल दिखाएगा।'
                        : 'The official UDID portal provides a dropdown of all authorized CMO offices and hospitals.'}
                    </span>
                  </div>
                  {formData.isHospitalNotDecided && (
                    <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                  )}
                </button>
              </div>
            )}

            {/* Navigation buttons: Back / Next */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200/70 no-print">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-3 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-colors shadow-xs"
              >
                {isHi ? 'पीछे' : 'Back'}
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all focus:outline-none focus:ring-4 focus:ring-blue-400"
              >
                <span>
                  {currentStepIndex === totalQuestions - 1
                    ? isHi ? 'समीक्षा व उत्तर शीट देखें' : 'View Answer Sheet'
                    : isHi ? 'अगला प्रश्न' : 'Next Question'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* Step 13: Review and Answer Sheet (The Output Cheat Sheet) */}
        {/* ------------------------------------------------------------- */}
        {isAnswerSheet && (
          <div className="space-y-6">
            {/* Reminder Banner: Saksham does NOT submit */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 no-print">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm leading-relaxed">
                  <p className="font-extrabold text-amber-950 text-base">
                    {isHi
                      ? 'प्रत्येक उत्तर को आधिकारिक पोर्टल पर कॉपी करें। सक्षम आपका आवेदन जमा नहीं करता है।'
                      : 'Copy each answer into the portal. Saksham does not submit your application.'}
                  </p>
                  <p className="text-amber-900 mt-1">
                    {isHi
                      ? 'आधिकारिक स्वावलंबन पोर्टल पर फॉर्म भरते समय इन उत्तरों को आसानी से पेस्ट करें। आपके समय और भ्रम की बचत होगी।'
                      : 'Use this cheat sheet to quickly fill out the official government portal without repetitive typing or guessing.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Answer Sheet Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-100/90 border border-slate-200 no-print">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyAll}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                    allCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                  aria-label="Copy all answers to clipboard"
                >
                  {allCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{allCopied ? (isHi ? 'सभी कॉपी हो गए!' : 'All Copied!') : (isHi ? 'सभी उत्तर कॉपी करें' : 'Copy All')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors shadow-xs print-allow"
                  aria-label="Print answer sheet"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isHi ? 'प्रिंट करें' : 'Print'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://www.swavlambancard.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <span>{isHi ? 'आधिकारिक पोर्टल खोलें' : 'Open Official Portal'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {/* Clear my data button with confirmation */}
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors"
                  aria-label="Clear all form prep answers"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>{isHi ? 'डेटा साफ़ करें' : 'Clear my data'}</span>
                </button>
              </div>
            </div>

            {/* Clear Data Confirmation Dialog */}
            {showClearConfirm && (
              <div
                role="dialog"
                aria-labelledby="clear-dialog-title"
                className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-3 no-print"
              >
                <h3 id="clear-dialog-title" className="text-sm font-bold">
                  {isHi ? 'क्या आप निश्चित रूप से अपना तैयार डेटा हटाना चाहते हैं?' : 'Are you sure you want to clear your prepared answers?'}
                </h3>
                <p className="text-xs text-rose-800">
                  {isHi
                    ? 'यह आपके ब्राउज़र मेमोरी से सभी उत्तर साफ़ कर देगा। इसे वापस नहीं लाया जा सकता।'
                    : 'This will permanently remove your prepared answers from your browser session.'}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleClearData}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors"
                  >
                    {isHi ? 'हाँ, सब साफ़ करें' : 'Yes, clear my data'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(false)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                  >
                    {isHi ? 'रद्द करें' : 'Cancel'}
                  </button>
                </div>
              </div>
            )}

            {/* Cheat Sheet Field List */}
            <div className="space-y-3 print:space-y-2">
              {generateAnswerList(formData, language).map((item) => {
                const isCopied = copiedFieldId === item.fieldId;

                return (
                  <div
                    key={item.fieldId}
                    className="p-4 rounded-2xl border border-slate-200/80 bg-white/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 page-break-inside-avoid print:border-slate-400"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block">
                        {isHi ? item.fieldNameHi : item.fieldNameEn}
                      </span>
                      <span className="text-base font-extrabold text-slate-900 block mt-0.5 break-words">
                        {item.displayValue}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleCopyField(item.fieldId, item.value, isHi ? item.fieldNameHi : item.fieldNameEn)
                      }
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 no-print border ${
                        isCopied
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                      aria-label={`Copy ${item.fieldNameEn}`}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? (isHi ? 'कॉपी हुआ' : 'Copied') : (isHi ? 'कॉपी' : 'Copy')}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/70 no-print">
              <button
                type="button"
                onClick={() => setCurrentStepIndex(0)}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-colors shadow-xs"
              >
                {isHi ? 'उत्तर संपादित करें' : 'Edit Answers'}
              </button>

              <button
                type="button"
                onClick={() => setActiveScreen('book-help')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all"
              >
                <span>{isHi ? 'अगला: सहायता अनुरोध देखें' : 'Next: Help Request'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </motion.main>

      <VoiceAssistant />
    </div>
  );
};

export default FormPrepView;
