/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Contrast,
  Users,
  Home as HomeIcon,
  ArrowRight,
  Globe,
  Trash2,
  HelpCircle,
  AlertCircle,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useSakshamStore } from './store/useSakshamStore';
import type { JourneyStepId } from './utils/journey';
import HomeScreen from './components/HomeScreen';
import OnboardingPage from './app/onboarding/page';
import DocumentScannerPage from './app/document/page';
import FormPrepView from './components/FormPrepView';
import VisitHelpView from './components/VisitHelpView';
import BookHelpView from './components/BookHelpView';
import TrackApplicationView from './components/TrackApplicationView';
import DashboardView from './components/DashboardView';
import JourneyStepper from './components/JourneyStepper';
import QuickCheckModal from './components/QuickCheckModal';
import AskSakshamChat from './components/AskSakshamChat';
import { t } from './utils/i18n';

export default function App() {
  const {
    activeScreen,
    setActiveScreen,
    highContrast,
    toggleHighContrast,
    fontSize,
    setFontSize,
    language,
    setLanguage,
    caregiverMode,
    toggleCaregiverMode,
    clearUserData,
    missingHindiVoiceNotice,
    dismissMissingHindiVoiceNotice,
  } = useSakshamStore();

  const [isQuickCheckOpen, setIsQuickCheckOpen] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>('');

  const isHome = activeScreen === 'home';
  const isHi = language === 'hi';

  const handleClearData = () => {
    clearUserData();
    setShowClearConfirm(false);
    const msg = t('nav.clearDataSuccess', language);
    setLiveAnnouncement(msg);
  };

  const handleLanguageToggle = () => {
    const nextLang = language === 'en' ? 'hi' : 'en';
    setLanguage(nextLang);
    setLiveAnnouncement(nextLang === 'hi' ? 'भाषा बदलकर हिन्दी कर दी गई है' : 'Language switched to English');
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
        highContrast ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
      }`}
    >
      {/* Screen Reader Live Announcements */}
      <div className="sr-only" aria-live="assertive" aria-atomic="true">
        {liveAnnouncement}
      </div>

      {/* Missing Hindi Voice Notice Banner */}
      {missingHindiVoiceNotice && (
        <div
          role="status"
          aria-live="polite"
          className="bg-amber-100 text-amber-900 border-b border-amber-300 px-4 py-2 text-xs flex items-center justify-between gap-2 z-50"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              {isHi
                ? 'आपके ब्राउज़र में हिन्दी आवाज़ (hi-IN) उपलब्ध नहीं है। डिफ़ॉल्ट सिस्टम आवाज़ का उपयोग किया जाएगा।'
                : 'Hindi system voice (hi-IN) is not installed on this browser. Voice will use the system default voice.'}
            </span>
          </div>
          <button
            type="button"
            onClick={dismissMissingHindiVoiceNotice}
            className="p-1 rounded hover:bg-amber-200 text-amber-800"
            aria-label="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Accessibility & Step Navigation Bar */}
      <header
        role="banner"
        aria-label="Application Navigation and Accessibility Controls"
        className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
          highContrast
            ? 'bg-slate-900/95 border-yellow-400/40 text-white'
            : 'bg-white/85 border-slate-200/70 text-slate-800 shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-h-16 py-2 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          {/* Logo & Platform Info */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveScreen('home')}
              className="flex items-center gap-2.5 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl p-1"
              aria-label="Go to Saksham Home"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <span className="font-black text-base tracking-tight text-slate-900 flex items-center gap-1.5">
                  {t('app.title', language)}
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-blue-100 text-blue-800">
                    {t('app.badge', language)}
                  </span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium block">
                  {t('app.tagline', language)}
                </span>
              </div>
            </button>

            {/* Mobile quick controls */}
            <div className="flex md:hidden items-center gap-1.5">
              {/* Language Switch */}
              <button
                type="button"
                onClick={handleLanguageToggle}
                className="px-2 py-1 rounded-lg border text-xs font-bold bg-white text-slate-700 border-slate-200 flex items-center gap-1"
                aria-label={isHi ? 'Switch to English' : 'हिन्दी में बदलें'}
              >
                <Globe className="w-3 h-3 text-blue-600" />
                <span>{language.toUpperCase()}</span>
              </button>

              {/* High Contrast */}
              <button
                type="button"
                onClick={toggleHighContrast}
                aria-pressed={highContrast}
                className={`p-1.5 rounded-xl border text-xs transition-all ${
                  highContrast
                    ? 'bg-yellow-400 text-slate-950 border-yellow-300 font-bold'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
                aria-label={t('nav.toggleContrast', language)}
              >
                <Contrast className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Central 5-Step Journey Stepper (Barriers -> Document -> Book help -> Track -> Summary) */}
          <div className="flex-1 max-w-3xl px-0 md:px-4 flex items-center justify-center">
            {isHome ? (
              <div className="hidden md:flex items-center gap-3 text-xs font-semibold text-slate-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{t('nav.readyToApply', language)}</span>
                <button
                  type="button"
                  onClick={() => setActiveScreen('onboarding')}
                  className="font-bold text-blue-700 hover:text-blue-900 underline underline-offset-2 flex items-center gap-1"
                >
                  {t('nav.startJourney', language)} <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => setIsQuickCheckOpen(true)}
                  className="font-bold text-emerald-700 hover:text-emerald-900 underline underline-offset-2 flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  {t('nav.quickCheck', language)}
                </button>
              </div>
            ) : (
              <JourneyStepper
                activeScreen={activeScreen}
                onNavigate={(step) => setActiveScreen(step)}
              />
            )}
          </div>

          {/* Accessibility Quick Toolbar (Desktop) */}
          <div className="hidden md:flex items-center gap-2">
            {/* Language Toggle Button */}
            <button
              type="button"
              onClick={handleLanguageToggle}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all shadow-2xs"
              aria-label={isHi ? 'Switch to English' : 'हिन्दी में बदलें'}
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>{isHi ? 'हिन्दी (HI)' : 'English (EN)'}</span>
            </button>

            {/* Font Size Chooser */}
            <div
              role="group"
              aria-label="Adjust font size"
              className="flex items-center bg-slate-100/90 rounded-xl p-1 border border-slate-200/60"
            >
              <button
                type="button"
                onClick={() => setFontSize('normal')}
                aria-pressed={fontSize === 'normal'}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                  fontSize === 'normal'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Default text size"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize('large')}
                aria-pressed={fontSize === 'large'}
                className={`px-2 py-1 rounded-lg text-xs font-extrabold transition-all ${
                  fontSize === 'large'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Large text size"
              >
                A+
              </button>
              <button
                type="button"
                onClick={() => setFontSize('xlarge')}
                aria-pressed={fontSize === 'xlarge'}
                className={`px-2 py-1 rounded-lg text-xs font-black transition-all ${
                  fontSize === 'xlarge'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Extra large text size"
              >
                A++
              </button>
            </div>

            {/* High Contrast Toggle */}
            <button
              type="button"
              onClick={toggleHighContrast}
              aria-pressed={highContrast}
              className={`p-2 rounded-xl border transition-all ${
                highContrast
                  ? 'bg-yellow-400 text-slate-950 border-yellow-300 font-bold'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="Toggle High-Contrast mode"
              aria-label="Toggle High-Contrast mode"
            >
              <Contrast className="w-4 h-4" />
            </button>

            {/* Caregiver Assisted Mode Toggle */}
            <button
              type="button"
              onClick={toggleCaregiverMode}
              aria-pressed={caregiverMode}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                caregiverMode
                  ? 'bg-teal-600 text-white border-teal-500 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="Caregiver Assisted Mode"
              aria-label="Toggle Caregiver Assisted Mode"
            >
              <Users className="w-3.5 h-3.5" />
              <span>{caregiverMode ? t('nav.caregiverActive', language) : t('nav.caregiver', language)}</span>
            </button>

            {/* Clear My Data (Session & Memory Privacy) */}
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="p-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 transition-all text-xs font-medium"
              title={t('nav.clearData', language)}
              aria-label={t('nav.clearData', language)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Transition across all views */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {activeScreen === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              <HomeScreen onOpenQuickCheck={() => setIsQuickCheckOpen(true)} />
            </motion.div>
          )}

          {(activeScreen === 'onboarding' || activeScreen === 'barriers') && (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.35 }}
            >
              <OnboardingPage />
            </motion.div>
          )}

          {(activeScreen === 'document' || activeScreen === 'documents') && (
            <motion.div
              key="document"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.35 }}
            >
              <DocumentScannerPage />
            </motion.div>
          )}

          {(activeScreen === 'form-prep' || activeScreen === 'formprep') && (
            <motion.div
              key="form-prep"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              <FormPrepView />
            </motion.div>
          )}

          {(activeScreen === 'book-help' || activeScreen === 'visit-help') && (
            <motion.div
              key="book-help"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35 }}
            >
              <BookHelpView />
            </motion.div>
          )}

          {activeScreen === 'track' && (
            <motion.div
              key="track"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              <TrackApplicationView />
            </motion.div>
          )}

          {(activeScreen === 'summary' || activeScreen === 'dashboard') && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              <DashboardView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Phase 4: Quick Check Modal */}
      <QuickCheckModal
        isOpen={isQuickCheckOpen}
        onClose={() => setIsQuickCheckOpen(false)}
        onNavigateTo={(target) => {
          setIsQuickCheckOpen(false);
          setActiveScreen(target);
        }}
      />

      {/* Phase 5: Floating Ask Saksham AI Help Assistant */}
      <AskSakshamChat />

      {/* Phase 6: Accessible "Clear my data" Confirmation Dialog */}
      {showClearConfirm && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="clear-dialog-title"
          aria-describedby="clear-dialog-desc"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 id="clear-dialog-title" className="text-lg font-bold text-slate-900 dark:text-white">
                {t('nav.clearData', language)}
              </h3>
              <p id="clear-dialog-desc" className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                {t('nav.clearDataConfirm', language)}
              </p>
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {isHi ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleClearData}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
              >
                {isHi ? 'हाँ, डेटा साफ़ करें' : 'Yes, clear my data'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
