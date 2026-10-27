/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SupportedLanguage = 'en' | 'hi';

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // App Header & Brand
    'app.title': 'Saksham',
    'app.tagline': 'Accessible Government ID Portal',
    'app.badge': 'UDID Pass',
    'nav.home': 'Home',
    'nav.startJourney': 'Start journey',
    'nav.readyToApply': 'Ready to apply for your Government Disability ID?',
    'nav.toggleContrast': 'Toggle High-Contrast mode',
    'nav.caregiver': 'Caregiver',
    'nav.caregiverActive': 'Caregiver Active',
    'nav.langEn': 'English',
    'nav.langHi': 'हिन्दी',
    'nav.quickCheck': 'Quick Check',
    'nav.clearData': 'Clear my data',
    'nav.clearDataConfirm': 'Are you sure you want to clear your session data, documents, and prepared form?',
    'nav.clearDataSuccess': 'All temporary form answers and document previews have been cleared from memory.',

    // Home Screen
    'home.badge': 'Official UDID Citizen Assistant',
    'home.heroTitle': 'Your barrier-free guide to applying for a Government Disability ID.',
    'home.heroDesc': 'Saksham helps you check your papers, prepare form answers, and understand hospital visits in simple words. We do not issue or approve cards—we help you prepare before visiting the official portal.',
    'home.startBtn': 'Start my application',
    'home.quickCheckBtn': 'What do I need? (Quick Check)',
    'home.card1Title': 'Set up accessibility',
    'home.card1Desc': 'Tell us if you need large text, voice narration, or easy navigation.',
    'home.card2Title': 'Check my documents',
    'home.card2Desc': 'Check photo clarity and reduce file size under 200 KB right on your device.',
    'home.card3Title': 'Book help at home',
    'home.card3Desc': 'Request doorstep assistance or prepare your hospital visit documents.',
    'home.card4Title': 'Track my application',
    'home.card4Desc': 'Follow your official Swavlamban portal stages from submission to e-UDID.',
    'home.fraudNotice': 'Applying is 100% free on the government portal. Never pay any fee or agent to get a UDID.',

    // Stepper
    'step.barriers': 'Barriers',
    'step.document': 'Document',
    'step.bookHelp': 'Visit & help',
    'step.track': 'Track',
    'step.summary': 'Summary',

    // Quick Check
    'qc.badge': 'Guidance Tool',
    'qc.title': 'What do I need? Quick Check',
    'qc.subtitle': 'Answer 5 simple questions to find the best route for your application.',
    'qc.progress': 'Question {current} of {total}',
    'qc.back': 'Back',
    'qc.next': 'Next',
    'qc.close': 'Close',
    'qc.retake': 'Retake Check',
    'qc.readAloud': 'Read aloud',
    'qc.stopVoice': 'Stop voice',
    'qc.guidanceOnly': 'Guidance only. This is not a medical, legal, or eligibility decision. No disability percentages or diagnoses are given. The government hospital medical board makes all final decisions.',

    // Ask Saksham Chat (Gemini)
    'chat.floatingBtn': 'Ask Saksham',
    'chat.title': 'Ask Saksham (Help Assistant)',
    'chat.subtitle': 'Questions about UDID steps, documents, or fraud warnings',
    'chat.placeholder': 'Ask a question in English or Hindi...',
    'chat.send': 'Send',
    'chat.thinking': 'Saksham is answering...',
    'chat.disclaimer': 'AI answers can make mistakes. Always confirm details on the official portal swavlambancard.gov.in. Applying is 100% free.',
    'chat.readAloud': 'Read aloud',
    'chat.privacyNote': 'Strict privacy: Your name, mobile number, and documents are never sent to AI.',
    'chat.initialGreeting': 'Namaste! I can answer questions in simple words about how to apply for your UDID card, which documents you need, hospital visits, or how to use Saksham. What would you like to know?',

    // Trust & Safety
    'safety.freeTitle': 'Applying is 100% Free',
    'safety.freeDesc': 'The official Swavlamban UDID portal never charges any fee for UDID application or card issuance. Never give money to any agent.',
    'safety.officialPortalBtn': 'Open Official Swavlamban Portal',
  },
  hi: {
    // App Header & Brand
    'app.title': 'सक्षम',
    'app.tagline': 'सुलभ सरकारी पहचान पत्र पोर्टल',
    'app.badge': 'UDID पास',
    'nav.home': 'होम',
    'nav.startJourney': 'शुरू करें',
    'nav.readyToApply': 'क्या आप अपने सरकारी दिव्यांगता पहचान पत्र के लिए तैयार हैं?',
    'nav.toggleContrast': 'हाई-कंट्रास्ट मोड बदलें',
    'nav.caregiver': 'सहायक (केयरगिवर)',
    'nav.caregiverActive': 'सहायक मोड सक्रिय',
    'nav.langEn': 'English',
    'nav.langHi': 'हिन्दी',
    'nav.quickCheck': 'त्वरित जाँच',
    'nav.clearData': 'मेरा डेटा साफ़ करें',
    'nav.clearDataConfirm': 'क्या आप अपना तैयार फ़ॉर्म डेटा, दस्तावेज़ और सत्र साफ़ करना चाहते हैं?',
    'nav.clearDataSuccess': 'सभी अस्थायी फ़ॉर्म उत्तर और दस्तावेज़ मेमोरी से सुरक्षित रूप से हटा दिए गए हैं।',

    // Home Screen
    'home.badge': 'आधिकारिक UDID नागरिक सहायक',
    'home.heroTitle': 'सरकारी दिव्यांगता पहचान पत्र (UDID) बनवाने का सरल एवं सुलभ तरीका।',
    'home.heroDesc': 'सक्षम आपके दस्तावेज़ों की जाँच करने, फ़ॉर्म के उत्तर तैयार करने और अस्पताल की जाँच समझने में सरल भाषा में मदद करता है। हम कार्ड जारी नहीं करते—हम आपको आधिकारिक पोर्टल पर जाने से पहले तैयार करते हैं।',
    'home.startBtn': 'आवेदन प्रक्रिया शुरू करें',
    'home.quickCheckBtn': 'मुझे क्या चाहिए? (त्वरित जाँच)',
    'home.card1Title': 'सुलभता सेटिंग',
    'home.card1Desc': 'यदि आपको बड़े अक्षर, बोलकर सुनाने की सुविधा या आसान नेविगेशन चाहिए तो यहाँ चुनें।',
    'home.card2Title': 'दस्तावेज़ जाँचें',
    'home.card2Desc': 'फ़ोटो की स्पष्टता देखें और अपने फ़ोन पर ही फ़ाइल का साइज़ 200 KB से कम करें।',
    'home.card3Title': 'घर पर मदद व अस्पताल तैयारी',
    'home.card3Desc': 'घर पर सहायता का अनुरोध करें या अस्पताल जाने के लिए ज़रूरी कागज़ात की सूची देखें।',
    'home.card4Title': 'आवेदन ट्रैक करें',
    'home.card4Desc': 'आधिकारिक स्वावलंबन पोर्टल पर अपने आवेदन की स्थिति आवेदन से लेकर ई-यूडीआईडी तक देखें।',
    'home.fraudNotice': 'सरकारी पोर्टल पर आवेदन बिल्कुल मुफ़्त है। UDID बनवाने के लिए किसी को भी कभी पैसे न दें।',

    // Stepper
    'step.barriers': 'सुलभता',
    'step.document': 'दस्तावेज़',
    'step.bookHelp': 'अस्पताल व मदद',
    'step.track': 'ट्रैक करें',
    'step.summary': 'सारांश',

    // Quick Check
    'qc.badge': 'मार्गदर्शन टूल',
    'qc.title': 'मुझे क्या चाहिए? त्वरित जाँच',
    'qc.subtitle': 'अपने आवेदन के लिए सबसे सही रास्ता जानने के लिए 5 आसान सवालों के जवाब दें।',
    'qc.progress': 'प्रश्न {current} / {total}',
    'qc.back': 'पीछे',
    'qc.next': 'आगे',
    'qc.close': 'बंद करें',
    'qc.retake': 'पुनः जाँच करें',
    'qc.readAloud': 'बोलकर सुनें',
    'qc.stopVoice': 'आवाज़ बंद करें',
    'qc.guidanceOnly': 'केवल मार्गदर्शन के लिए। यह कोई चिकित्सकीय, कानूनी या आधिकारिक पात्रता निर्णय नहीं है। कोई दिव्यांगता प्रतिशत या बीमारी तय नहीं की जाती। अस्पताल का सरकारी मेडिकल बोर्ड ही अंतिम निर्णय लेता है।',

    // Ask Saksham Chat (Gemini)
    'chat.floatingBtn': 'सक्षम से पूछें',
    'chat.title': 'सक्षम से पूछें (सहायक)',
    'chat.subtitle': 'UDID के चरणों, दस्तावेज़ों या धोखाधड़ी चेतावनी से जुड़े सवाल पूछें',
    'chat.placeholder': 'हिन्दी या अंग्रेज़ी में अपना प्रश्न लिखें...',
    'chat.send': 'भेजें',
    'chat.thinking': 'सक्षम उत्तर तैयार कर रहा है...',
    'chat.disclaimer': 'AI के उत्तरों में त्रुटि हो सकती है। हमेशा आधिकारिक पोर्टल swavlambancard.gov.in पर पुष्टि करें। आवेदन 100% मुफ़्त है।',
    'chat.readAloud': 'बोलकर सुनें',
    'chat.privacyNote': 'सख्त गोपनीयता: आपका नाम, मोबाइल नंबर और दस्तावेज़ कभी भी AI को नहीं भेजे जाते हैं।',
    'chat.initialGreeting': 'नमस्ते! मैं आपको सरल भाषा में बता सकता हूँ कि UDID कार्ड के लिए आवेदन कैसे करें, कौन से दस्तावेज़ चाहिए, अस्पताल में क्या होता है, या सक्षम का उपयोग कैसे करें। आप क्या जानना चाहते हैं?',

    // Trust & Safety
    'safety.freeTitle': 'आवेदन 100% मुफ़्त है',
    'safety.freeDesc': 'भारत सरकार UDID आवेदन या कार्ड जारी करने के लिए कोई शुल्क नहीं लेती। किसी भी बिचौलिए या एजेंट को पैसे न दें।',
    'safety.officialPortalBtn': 'आधिकारिक स्वावलंबन पोर्टल खोलें',
  },
};

export function t(key: string, lang: SupportedLanguage = 'en', params?: Record<string, string | number>): string {
  const dictionary = TRANSLATIONS[lang] || TRANSLATIONS.en;
  let text = dictionary[key] || TRANSLATIONS.en[key] || key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    });
  }
  return text;
}
