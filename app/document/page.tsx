/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useSakshamStore } from '../../store/useSakshamStore';
import { DocumentChecklist } from '../../src/components/DocumentChecklist';
import { VoiceAssistant } from '../../components/VoiceAssistant';

export default function DocumentScannerPage() {
  const {
    setActiveScreen,
    highContrast,
    language,
  } = useSakshamStore();

  const isHi = language === 'hi';

  return (
    <div
      className={`min-h-screen w-full p-4 sm:p-6 md:p-10 flex flex-col items-center justify-start relative overflow-hidden transition-colors duration-500 ${
        highContrast
          ? 'bg-slate-950 text-slate-100'
          : 'bg-gradient-to-br from-indigo-50 via-sky-50 to-blue-100 text-slate-800'
      }`}
    >
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-blue-200/40 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[45vw] h-[45vw] rounded-full bg-indigo-200/30 blur-3xl pointer-events-none -z-10" />

      {/* Main Glassmorphic Wrapper */}
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className={`w-full max-w-5xl rounded-3xl p-4 sm:p-6 md:p-8 backdrop-blur-md transition-all relative ${
          highContrast
            ? 'bg-slate-900/90 border-2 border-yellow-400 shadow-2xl'
            : 'bg-white/75 border border-white/60 shadow-xl'
        }`}
      >
        {/* Navigation Bar back button */}
        <div className="flex items-center gap-3 pb-4 mb-2 no-print">
          <button
            type="button"
            onClick={() => setActiveScreen('onboarding')}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={isHi ? 'वापस बाधाएं स्क्रीन पर जाएं' : 'Back to Barriers & Accommodations'}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-slate-600">
            {isHi ? 'वापस: बाधाएं और सहायता' : 'Back to Step 1: Barriers'}
          </span>
        </div>

        {/* Phase 3A: Document Readiness Checklist Component */}
        <DocumentChecklist />
      </motion.main>

      <VoiceAssistant />
    </div>
  );
}
