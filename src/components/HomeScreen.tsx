/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Sliders,
  FileCheck,
  Home as HomeIcon,
  Activity,
  ShieldCheck,
  Volume2,
  CheckCircle2,
  ShieldAlert,
  ClipboardList,
  HelpCircle,
} from 'lucide-react';
import { useSakshamStore } from '../store/useSakshamStore';
import { VoiceAssistant } from './VoiceAssistant';
import { FRAUD_WARNING } from '../utils/visitPrep';
import { t } from '../utils/i18n';

const cardContainerVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.08,
    },
  },
};

const cardItemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 280,
      damping: 22,
    },
  },
};

interface HomeScreenProps {
  onOpenQuickCheck?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenQuickCheck }) => {
  const {
    setActiveScreen,
    startSpeaking,
    highContrast,
    language,
  } = useSakshamStore();

  const isHi = language === 'hi';

  const handleReadHome = () => {
    const text = isHi
      ? 'सक्षम में आपका स्वागत है। सरकारी दिव्यांगता पहचान पत्र (UDID) बनवाने का सरल एवं सुलभ तरीका। सरकारी पोर्टल पर आवेदन 100% मुफ़्त है। किसी को पैसे न दें। सक्षम दस्तावेज़ जाँचने और फ़ॉर्म भरने में मदद करता है।'
      : 'Welcome to Saksham. An accessible companion to help disabled citizens prepare for their Unique Disability ID card application. Important notice: Applying for a UDID is completely free. Never pay anyone to get a card.';
    startSpeaking(text);
  };

  const featureCards = [
    {
      title: t('home.card1Title', language),
      subtitle: isHi ? 'चरण 1 • सुलभता' : 'Step 1 • Accommodations',
      description: t('home.card1Desc', language),
      target: 'onboarding' as const,
      icon: Sliders,
      tag: isHi ? 'निजी सेटिंग' : 'Personalized setup',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      title: t('home.card2Title', language),
      subtitle: isHi ? 'चरण 2 • दस्तावेज़' : 'Step 2 • Document Readiness',
      description: t('home.card2Desc', language),
      target: 'document' as const,
      icon: FileCheck,
      tag: isHi ? '5-स्लॉट चेकलिस्ट' : '5-Slot Checklist',
      badgeColor: 'bg-indigo-100 text-indigo-800',
    },
    {
      title: isHi ? 'फ़ॉर्म तैयारी सहायक' : 'Form Prep Buddy',
      subtitle: isHi ? 'चरण 3 • प्रश्नोत्तरी' : 'Step 3 • Question Wizard',
      description: isHi
        ? '5 सरल सवालों के जवाब दें। आधिकारिक पोर्टल पर आसानी से कॉपी करने के लिए चीट शीट प्राप्त करें।'
        : 'Answer simple questions one by one. Get an organized cheat sheet to easily copy into the official portal.',
      target: 'formprep' as const,
      icon: ClipboardList,
      tag: isHi ? 'चीट शीट' : 'Cheat Sheet Helper',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      title: t('home.card3Title', language),
      subtitle: isHi ? 'चरण 4 • अस्पताल तैयारी' : 'Step 4 • What to Carry',
      description: t('home.card3Desc', language),
      target: 'book-help' as const,
      icon: HomeIcon,
      tag: isHi ? 'सहायता अनुरोध (डेमो)' : 'Help Request (Demo)',
      badgeColor: 'bg-teal-100 text-teal-800',
    },
    {
      title: t('home.card4Title', language),
      subtitle: isHi ? 'चरण 5 • लाइव स्थिति' : 'Step 5 • Live Status',
      description: t('home.card4Desc', language),
      target: 'track' as const,
      icon: Activity,
      tag: isHi ? 'आधिकारिक पोर्टल ट्रैकिंग' : 'Official Portal Sync',
      badgeColor: 'bg-purple-100 text-purple-800',
    },
  ];

  return (
    <div
      className={`min-h-screen w-full p-4 sm:p-6 md:p-10 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500 ${
        highContrast
          ? 'bg-slate-950 text-slate-100'
          : 'bg-gradient-to-br from-indigo-50 via-sky-50 to-blue-100 text-slate-800'
      }`}
    >
      {/* Decorative ambient blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-blue-300/30 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-300/25 blur-3xl pointer-events-none -z-10" />

      {/* Main Glassmorphic Wrapper */}
      <motion.main
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-5xl rounded-3xl p-6 sm:p-8 md:p-12 transition-all relative ${
          highContrast
            ? 'bg-slate-900/90 border-2 border-yellow-400 shadow-2xl'
            : 'backdrop-blur-md bg-white/80 border border-white/60 shadow-xl'
        }`}
      >
        {/* Welcome Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/70 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {t('home.badge', language)}
                </span>
                <span className="text-xs text-slate-500 hidden sm:inline-flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {isHi ? 'मुफ़्त नागरिक सुलभता साथी' : 'Free Citizen Accessibility Companion'}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                {t('app.title', language)} • {t('app.tagline', language)}
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReadHome}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 shadow-xs transition-all w-fit"
            aria-label="Read screen aloud using Voice Assistant"
          >
            <Volume2 className="w-4 h-4 text-blue-600" />
            <span>{isHi ? 'स्क्रीन बोलकर सुनें' : 'Read Screen'}</span>
          </button>
        </header>

        {/* Persistent Trust and Safety Fraud Warning Banner */}
        <div
          role="region"
          aria-label="Fraud Safety Warning"
          className="mb-8 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex items-start gap-3 shadow-xs"
        >
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed">
            <span className="font-extrabold uppercase tracking-wide text-amber-900 block">
              {t('safety.freeTitle', language)} • {isHi ? 'कभी किसी को पैसे न दें' : 'Never Pay Anyone for a UDID Card'}
            </span>
            <p className="mt-0.5 font-medium text-amber-900">{isHi ? FRAUD_WARNING.hi : FRAUD_WARNING.en}</p>
          </div>
        </div>

        {/* Short Welcome in Plain Language */}
        <section aria-labelledby="home-welcome-title" className="mb-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-1">
              {isHi ? 'सरल • सम्मानजनक • बाधा-मुक्त' : 'Easy • Dignified • Barrier-Free'}
            </span>
            <h2
              id="home-welcome-title"
              className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight"
            >
              {t('home.heroTitle', language)}
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
              {t('home.heroDesc', language)}
            </p>

            {/* Action Buttons: "Start my application" + "What do I need? Quick Check" */}
            <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveScreen('onboarding')}
                className="inline-flex items-center justify-center gap-3 px-7 py-3.5 sm:px-8 sm:py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-blue-500/25 transition-all focus:outline-none focus:ring-4 focus:ring-blue-400"
                aria-label={t('home.startBtn', language)}
              >
                <span>{t('home.startBtn', language)}</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              {onOpenQuickCheck && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onOpenQuickCheck}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 rounded-2xl border-2 border-blue-600 hover:bg-blue-50 text-blue-700 font-extrabold text-sm sm:text-base transition-all focus:outline-none focus:ring-4 focus:ring-blue-300"
                  aria-label={t('home.quickCheckBtn', language)}
                >
                  <HelpCircle className="w-5 h-5" />
                  <span>{t('home.quickCheckBtn', language)}</span>
                </motion.button>
              )}

              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{isHi ? '~3 मिनट • मुफ़्त आधिकारिक तैयारी' : 'Takes ~3 minutes • Free official preparation'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 5 Feature Cards */}
        <section aria-labelledby="features-title">
          <div className="flex items-center justify-between mb-4">
            <h3 id="features-title" className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isHi ? 'सुविधाओं की त्वरित पहुँच' : 'Quick access to features'}
            </h3>
            <span className="text-xs text-blue-700 font-semibold">
              {isHi ? 'सीधे जाने के लिए कार्ड चुनें' : 'Select any card to jump directly'}
            </span>
          </div>

          <motion.div
            variants={cardContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {featureCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={idx}
                  variants={cardItemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveScreen(card.target)}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      setActiveScreen(card.target);
                    }
                  }}
                  aria-label={`${card.title}. ${card.description}`}
                  className="group relative flex flex-col justify-between p-5 rounded-2xl cursor-pointer border border-slate-200/90 bg-white/75 hover:bg-white hover:border-blue-400 hover:shadow-lg transition-all duration-300 text-left select-none focus:outline-none focus:ring-4 focus:ring-blue-500/40"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center shadow-xs">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-slate-200 ${card.badgeColor}`}>
                        {card.subtitle}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {card.title}
                    </h4>
                    <p className="mt-1 text-xs text-slate-600 font-medium leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-700">
                    <span className="text-slate-400 group-hover:text-blue-600 transition-colors">
                      {card.tag}
                    </span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      {isHi ? 'खोलें' : 'Open'} <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      </motion.main>

      <VoiceAssistant />
    </div>
  );
};

export default HomeScreen;
