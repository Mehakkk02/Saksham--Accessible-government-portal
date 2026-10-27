/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  EyeOff,
  BookOpen,
  EarOff,
  VolumeX,
  Accessibility,
  MapPin,
  Users,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  RotateCcw,
  Volume2
} from 'lucide-react';
import { useSakshamStore, type BarrierId, BARRIERS_DATA } from '../../store/useSakshamStore';
import { VoiceAssistant } from '../../components/VoiceAssistant';

// Stagger motion containers
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.12,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 260,
      damping: 20,
    },
  },
};

export default function OnboardingPage() {
  const {
    barriers,
    toggleBarrier,
    hasBarrier,
    clearBarriers,
    setActiveScreen,
    startSpeaking,
    highContrast,
    fontSize,
  } = useSakshamStore();

  const startTimeRef = React.useRef<number>(Date.now());
  const sessionIdRef = React.useRef<string>(`sess-${Date.now()}`);

  React.useEffect(() => {
    fetch('/api/demo/kpi-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: sessionIdRef.current,
        eventType: 'onboarding_started',
      }),
    }).catch(() => {});
  }, []);

  const handleContinueToDocument = () => {
    const elapsedSeconds = Math.max(5, Math.round((Date.now() - startTimeRef.current) / 1000));
    fetch('/api/demo/kpi-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: sessionIdRef.current,
        eventType: 'onboarding_completed',
        durationSeconds: elapsedSeconds,
      }),
    }).catch(() => {});
    setActiveScreen('document');
  };

  const handleReadScreen = () => {
    const activeText = `Welcome to Saksham. Tell us how we can make your Government ID application effortless. Select any barriers you experience. 1: I cannot read easily. 2: I cannot hear. 3: I cannot travel. 4: I need a caregiver. You currently have ${barriers.length} accommodation${barriers.length !== 1 ? 's' : ''} enabled.`;
    startSpeaking(activeText);
  };

  const getCardIcon = (id: BarrierId, isSelected: boolean) => {
    const iconClass = isSelected ? 'text-blue-600' : 'text-slate-600';
    switch (id) {
      case 'reading':
        return (
          <div className="relative flex items-center justify-center">
            <EyeOff className={`w-8 h-8 ${iconClass}`} />
            <BookOpen className="w-4 h-4 text-blue-500 absolute -bottom-1 -right-1" />
          </div>
        );
      case 'hearing':
        return (
          <div className="relative flex items-center justify-center">
            <EarOff className={`w-8 h-8 ${iconClass}`} />
            <VolumeX className="w-4 h-4 text-blue-500 absolute -bottom-1 -right-1" />
          </div>
        );
      case 'travel':
        return (
          <div className="relative flex items-center justify-center">
            <Accessibility className={`w-8 h-8 ${iconClass}`} />
            <MapPin className="w-4 h-4 text-blue-500 absolute -bottom-1 -right-1" />
          </div>
        );
      case 'caregiver':
        return (
          <div className="relative flex items-center justify-center">
            <Users className={`w-8 h-8 ${iconClass}`} />
            <HeartHandshake className="w-4 h-4 text-blue-500 absolute -bottom-1 -right-1" />
          </div>
        );
    }
  };

  const fontSizeClass =
    fontSize === 'xlarge'
      ? 'text-lg leading-relaxed'
      : fontSize === 'large'
      ? 'text-base leading-relaxed'
      : 'text-sm leading-normal';

  const headingSizeClass =
    fontSize === 'xlarge'
      ? 'text-4xl md:text-5xl font-extrabold'
      : fontSize === 'large'
      ? 'text-3xl md:text-4xl font-extrabold'
      : 'text-2xl md:text-3xl font-bold';

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-500 p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center relative overflow-hidden ${
        highContrast
          ? 'bg-slate-950 text-slate-50'
          : 'bg-gradient-to-br from-indigo-50 via-sky-50 to-blue-100 text-slate-800'
      }`}
    >
      {/* Subtle organic decorative background blurs (Headspace / Apple Health aesthetic) */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-blue-300/30 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-300/25 blur-3xl pointer-events-none -z-10" />

      {/* Main Glassmorphic Container */}
      <motion.main
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full max-w-5xl rounded-3xl p-5 sm:p-7 md:p-9 transition-all relative ${
          highContrast
            ? 'bg-slate-900/90 border-2 border-yellow-400 shadow-2xl text-slate-100'
            : 'backdrop-blur-md bg-white/70 border border-white/50 shadow-xl'
        }`}
      >
        {/* Top Header Badge & Accessibility Controls */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200/60 mb-6">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-blue-100/80 text-blue-800">
                  Step 1 of 2 • Accessibility Onboarding
                </span>
                <span className="text-xs text-slate-500 hidden sm:inline-flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Government UDID Compliant
                </span>
              </div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 mt-0.5">
                Saksham • Accessible ID Portal
              </h1>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              type="button"
              onClick={handleReadScreen}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/80 hover:bg-white text-blue-700 border border-blue-200 shadow-sm transition-all hover:shadow"
              aria-label="Read screen aloud using Voice Assistant"
            >
              <Volume2 className="w-4 h-4 text-blue-600" />
              <span>Read Aloud</span>
            </button>

            {barriers.length > 0 && (
              <button
                type="button"
                onClick={clearBarriers}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 transition-all"
                aria-label="Clear all barrier selections"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </header>

        {/* Empathetic Greeting & Plain Language Introduction */}
        <section aria-labelledby="onboarding-title" className="mb-5">
          <div className="max-w-2xl">
            <h2 id="onboarding-title" className={`${headingSizeClass} text-slate-900 tracking-tight leading-tight`}>
              How can we make your ID application effortless?
            </h2>
            <p className={`mt-2 ${fontSizeClass} text-slate-600 font-normal`}>
              Every individual is unique. Select any barriers that apply to you so Saksham can
              instantly tailor the interface, font sizes, audio cues, and doorstep support for your
              government disability ID (UDID).
            </p>
          </div>
        </section>

        {/* 4 Barrier Cards with Framer Motion Stagger */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          aria-label="Disability accommodation choices"
          className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5 mb-6"
        >
          {BARRIERS_DATA.map((card) => {
            const isSelected = hasBarrier(card.id);
            return (
              <motion.div
                key={card.id}
                variants={cardVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 350, damping: 24 }}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`${card.title}. ${card.description}. ${isSelected ? 'Selected' : 'Not selected'}`}
                onClick={() => toggleBarrier(card.id)}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    toggleBarrier(card.id);
                  }
                }}
                className={`group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl cursor-pointer transition-all duration-300 text-left select-none focus:outline-none focus:ring-4 focus:ring-blue-500/40 ${
                  isSelected
                    ? 'border-3 border-blue-600 bg-blue-50/70 shadow-lg shadow-blue-500/10'
                    : 'border border-slate-200/90 bg-white/70 hover:bg-white hover:border-blue-300 hover:shadow-md'
                }`}
              >
                {/* Active selection background glow */}
                {isSelected && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-indigo-500/10 pointer-events-none" />
                )}

                <div>
                  {/* Card Header: Icon + State Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-blue-100 text-blue-700 shadow-inner'
                          : 'bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600'
                      }`}
                    >
                      {getCardIcon(card.id, isSelected)}
                    </div>

                    {/* Animated Checkmark Indicator */}
                    <div className="flex items-center">
                      <AnimatePresence mode="wait">
                        {isSelected ? (
                          <motion.div
                            key="checked"
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 45 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white shadow-sm"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-xs font-semibold tracking-wide">Selected</span>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="unchecked"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-7 h-7 rounded-full border-2 border-slate-300 group-hover:border-blue-400 flex items-center justify-center transition-colors"
                          >
                            <span className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-blue-200 transition-colors" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Card Title & Plain Language Subtitle */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-blue-700 tracking-wide uppercase">
                        {card.subtitle}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                      {card.title}
                    </h3>
                  </div>

                  {/* Accessible Description */}
                  <p className={`mt-2.5 ${fontSizeClass} text-slate-600 font-medium leading-relaxed`}>
                    {card.description}
                  </p>
                </div>

                {/* Accommodations Tag Badge */}
                <div className="mt-5 pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      isSelected
                        ? 'bg-blue-100 text-blue-800 font-semibold'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    {card.tag}
                  </span>
                  <span className="text-slate-400 group-hover:text-blue-600 font-medium">
                    {isSelected ? 'Active for you' : 'Tap to enable'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.section>

        {/* Bottom Actions Bar */}
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200/60">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
            </span>
            <span className="font-semibold text-slate-800">
              {barriers.length} of 4 accommodations active
            </span>
            <span className="text-slate-400 hidden sm:inline">• Changes save automatically</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContinueToDocument}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-base shadow-xl shadow-blue-500/25 transition-all focus:outline-none focus:ring-4 focus:ring-blue-400"
              aria-label="Continue to Document Verification Step"
            >
              <span>Continue to AI Document Scanner</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </footer>
      </motion.main>

      {/* Floating pulsing Web Speech API Voice Orb */}
      <VoiceAssistant />
    </div>
  );
}
