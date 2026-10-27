/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Mic, MicOff, Sparkles, ChevronUp, ChevronDown, Check, RefreshCw } from 'lucide-react';
import { useSakshamStore } from '../store/useSakshamStore';

interface VoiceAssistantProps {
  customNarrativeText?: string;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ customNarrativeText }) => {
  const {
    isSpeaking,
    currentSpeechText,
    speechSpeed,
    setSpeechSpeed,
    startSpeaking,
    stopSpeaking,
    barriers,
    activeScreen,
    scanState,
  } = useSakshamStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
      setHasSpeechSupport(false);
    }
  }, []);

  // Construct context-aware empathetic narration for the active screen
  const getScreenNarration = (): string => {
    if (customNarrativeText) return customNarrativeText;

    if (activeScreen === 'onboarding') {
      const selectedNames = barriers.length > 0
        ? `You currently have ${barriers.length} accommodation${barriers.length > 1 ? 's' : ''} enabled.`
        : 'No accommodations are selected yet.';
      return `Welcome to Saksham. Please choose any barriers you face when reading, hearing, traveling, or applying. ${selectedNames} You can click any card to toggle it on or off, and then proceed to document scanning.`;
    }

    if (activeScreen === 'document') {
      if (scanState === 'idle') {
        return `Step 2: AI Document Scanner. Please upload your government medical board certificate or hospital disability report. You can drag and drop your image, select sample files, or snap a photo. We will check it for official seals and required doctor signatures.`;
      }
      if (scanState === 'scanning') {
        return `Your document is currently being scanned by our accessibility AI. Please wait a moment while we verify hospital seals and registration credentials.`;
      }
      if (scanState === 'success') {
        return `Photo check complete! Your document photo looks clear, sharp, and readable for hospital review.`;
      }
      if (scanState === 'failure') {
        return `Document needs a clearer photo. The official hospital seal or doctor registration could not be verified due to glare or low lighting. Please retake the photo on a flat surface in bright light.`;
      }
    }

    return `Saksham Accessibility Portal. We are here to ensure your government benefits and ID are fully barrier-free.`;
  };

  const handleToggleVoice = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const textToSpeak = getScreenNarration();
      startSpeaking(textToSpeak);
    }
  };

  const handleSpeedToggle = (newSpeed: number) => {
    setSpeechSpeed(newSpeed);
    if (isSpeaking) {
      stopSpeaking();
      setTimeout(() => {
        startSpeaking(getScreenNarration());
      }, 100);
    }
  };

  return (
    <aside aria-label="Saksham Voice Assistant" className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      {/* Expanded Speech Controls & Live Captions Bubble */}
      <AnimatePresence>
        {(isExpanded || isSpeaking) && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="mb-3 max-w-sm w-80 md:w-96 rounded-2xl p-4 shadow-2xl border border-white/60 backdrop-blur-xl bg-white/90 text-slate-800"
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSpeaking ? 'bg-blue-400' : 'bg-slate-300'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isSpeaking ? 'bg-blue-600' : 'bg-slate-400'}`}></span>
                </span>
                <span className="text-xs font-bold tracking-wider uppercase text-blue-900 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Saksham Voice Guide
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => handleSpeedToggle(speechSpeed === 0.85 ? 1.0 : 0.85)}
                  className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                  aria-label="Toggle voice speed"
                >
                  {speechSpeed === 0.85 ? 'Slow (0.8x)' : 'Normal (1x)'}
                </button>
              </div>
            </div>

            {/* Spoken text / transcript display */}
            <div className="text-sm font-medium text-slate-700 leading-relaxed min-h-[50px] flex items-center">
              {isSpeaking ? (
                <div className="flex flex-col gap-1.5 w-full">
                  <div className="flex items-center gap-1.5 text-blue-600 text-xs font-semibold">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    Now reading screen...
                  </div>
                  <p className="line-clamp-3 text-slate-900 bg-blue-50/60 p-2 rounded-lg border border-blue-100 text-xs md:text-sm">
                    "{currentSpeechText || getScreenNarration()}"
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Tap the voice orb anytime to hear the screen read aloud in warm, natural speech.
                </p>
              )}
            </div>

            {/* Quick action buttons */}
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={handleToggleVoice}
                className="flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    Pause Reading
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    Read Entire Screen
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-slate-400 hover:text-slate-600 font-medium"
                aria-label="Dismiss speech settings"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Orb Button */}
      <div className="relative group">
        {/* Pulsing Aura Rings when active */}
        {isSpeaking && (
          <>
            <motion.div
              animate={{ scale: [1, 1.45, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              className="absolute -inset-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 blur-lg -z-10"
            />
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.8, 0.2, 0.8] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut', delay: 0.2 }}
              className="absolute -inset-1.5 rounded-full bg-blue-400/40 -z-10"
            />
          </>
        )}

        {/* Ambient glow when idle */}
        {!isSpeaking && (
          <div className="absolute -inset-1 rounded-full bg-blue-500/25 blur-md group-hover:bg-blue-600/40 transition-all duration-300 -z-10" />
        )}

        <button
          type="button"
          onClick={handleToggleVoice}
          onContextMenu={(e) => {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }}
          aria-label={
            isSpeaking
              ? "Voice Assistant active. Press to pause speech narration."
              : "Voice Assistant idle. Press to hear this screen read aloud."
          }
          aria-pressed={isSpeaking}
          className={`relative flex items-center justify-center w-16 h-16 md:w-18 md:h-18 rounded-full shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-offset-2 ${
            isSpeaking
              ? 'bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 text-white scale-105 shadow-blue-500/50'
              : 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white hover:scale-105 hover:shadow-blue-600/40'
          }`}
        >
          {isSpeaking ? (
            <div className="flex items-center justify-center gap-1 h-6">
              {[0, 1, 2, 3].map((bar) => (
                <motion.span
                  key={bar}
                  animate={{
                    height: ['6px', '22px', '8px', '18px', '6px'],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.1,
                    delay: bar * 0.18,
                    ease: 'easeInOut',
                  }}
                  className="w-1.5 rounded-full bg-white shadow-sm"
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <Mic className="w-7 h-7 transition-transform group-hover:scale-110" />
              <span className="text-[10px] font-bold tracking-tight text-blue-100 uppercase mt-0.5">
                Voice
              </span>
            </div>
          )}
        </button>

        {/* Quick toggle settings button attached to orb - Sibling to avoid nested buttons */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          aria-label="Expand voice assistant options"
          className="absolute -top-1 -right-1 z-10 w-6 h-6 rounded-full bg-white shadow-md border border-blue-200 text-blue-700 flex items-center justify-center hover:bg-blue-50 text-xs"
        >
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Screen reader live announcement region */}
      <div className="sr-only" aria-live="polite">
        {isSpeaking ? `Now reading: ${currentSpeechText}` : 'Voice assistant paused'}
      </div>
    </aside>
  );
};

export default VoiceAssistant;
