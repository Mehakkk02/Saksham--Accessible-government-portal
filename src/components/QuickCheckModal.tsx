/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  HelpCircle,
  X,
  Volume2,
  VolumeX,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  ShieldAlert,
  FileCheck2,
  Stethoscope,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { useSakshamStore } from '../store/useSakshamStore';
import {
  QUICK_CHECK_QUESTIONS,
  evaluateQuickCheck,
  type QuickCheckAnswer,
  type QuickCheckResult,
} from '../utils/quickCheck';
import { speakText, stopSpeaking } from '../utils/speech';
import { t } from '../utils/i18n';

interface QuickCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTo: (screen: 'documents' | 'visit-help') => void;
}

const INITIAL_ANSWERS: QuickCheckAnswer = {
  difficulty: '',
  sinceWhen: '',
  doctorAssessed: '',
  certificateStatus: '',
  appliedBefore: '',
};

export default function QuickCheckModal({
  isOpen,
  onClose,
  onNavigateTo,
}: QuickCheckModalProps) {
  const { language, highContrast } = useSakshamStore();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<QuickCheckAnswer>({ ...INITIAL_ANSWERS });
  const [result, setResult] = useState<QuickCheckResult | null>(null);
  const [isSpeakingLocal, setIsSpeakingLocal] = useState<boolean>(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>('');

  if (!isOpen) return null;

  const isHi = language === 'hi';
  const totalQuestions = QUICK_CHECK_QUESTIONS.length;
  const currentQ = QUICK_CHECK_QUESTIONS[currentStep];

  const handleSelectOption = (value: string) => {
    const fieldId = currentQ.id;
    const updated = { ...answers, [fieldId]: value };
    setAnswers(updated);

    const selectedOpt = currentQ.options.find((o) => o.value === value);
    const label = isHi ? selectedOpt?.labelHi : selectedOpt?.labelEn;
    setLiveAnnouncement(`Selected: ${label}`);

    if (currentStep < totalQuestions - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Completed last question, compute result
      const calculated = evaluateQuickCheck(updated);
      setResult(calculated);
      const spokenResult = isHi
        ? `${calculated.titleHi}. ${calculated.summaryHi}. ${calculated.disclaimerHi}`
        : `${calculated.titleEn}. ${calculated.summaryEn}. ${calculated.disclaimerEn}`;
      setLiveAnnouncement(spokenResult);
    }
  };

  const handleBack = () => {
    if (result) {
      setResult(null);
      setCurrentStep(totalQuestions - 1);
    } else if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    stopSpeaking();
    setIsSpeakingLocal(false);
    setAnswers({ ...INITIAL_ANSWERS });
    setCurrentStep(0);
    setResult(null);
    setLiveAnnouncement(isHi ? 'त्वरित जाँच पुनः आरंभ की गई' : 'Quick check restarted');
  };

  const handleReadAloud = (textToRead: string) => {
    if (isSpeakingLocal) {
      stopSpeaking();
      setIsSpeakingLocal(false);
      return;
    }
    setIsSpeakingLocal(true);
    speakText(textToRead, {
      lang: language,
      onEnd: () => setIsSpeakingLocal(false),
      onError: () => setIsSpeakingLocal(false),
    });
  };

  const handleActionClick = () => {
    if (!result) return;
    stopSpeaking();
    onClose();
    onNavigateTo(result.targetScreen);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-check-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className={`w-full max-w-2xl rounded-2xl shadow-2xl border flex flex-col max-h-[92vh] overflow-hidden transition-colors ${
          highContrast
            ? 'bg-slate-900 border-yellow-400 text-white'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Screen Reader Live Announcements */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {liveAnnouncement}
        </div>

        {/* Modal Header */}
        <div
          className={`p-4 sm:p-5 border-b flex items-center justify-between ${
            highContrast ? 'border-yellow-400/30 bg-slate-950' : 'border-slate-100 bg-slate-50/70'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
                {t('qc.badge', language)}
              </span>
              <h2 id="quick-check-title" className="text-lg sm:text-xl font-bold tracking-tight">
                {t('qc.title', language)}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            aria-label={t('qc.close', language)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {result ? (
            /* Result Card View */
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div
                className={`p-5 rounded-2xl border-2 ${
                  result.route === 'documents'
                    ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/20'
                    : result.route === 'assessment'
                    ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/20'
                    : 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/20'
                }`}
              >
                <div className="flex items-start gap-3.5 mb-3">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-xs shrink-0">
                    {result.route === 'documents' ? (
                      <FileCheck2 className="w-6 h-6 text-emerald-600" />
                    ) : result.route === 'assessment' ? (
                      <Stethoscope className="w-6 h-6 text-blue-600" />
                    ) : (
                      <Building2 className="w-6 h-6 text-amber-600" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {isHi ? 'सुझाया गया मार्ग' : 'Recommended Route'}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
                      {isHi ? result.titleHi : result.titleEn}
                    </h3>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                  {isHi ? result.summaryHi : result.summaryEn}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleActionClick}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all active:scale-98"
                  >
                    <span>{isHi ? result.nextStepTextHi : result.nextStepTextEn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleReadAloud(
                        `${isHi ? result.titleHi : result.titleEn}. ${
                          isHi ? result.summaryHi : result.summaryEn
                        }`
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {isSpeakingLocal ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
                    <span>{isSpeakingLocal ? t('qc.stopVoice', language) : t('qc.readAloud', language)}</span>
                  </button>
                </div>
              </div>

              {/* Mandatory Non-Diagnostic Disclaimer */}
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-normal font-medium">
                  {isHi ? result.disclaimerHi : result.disclaimerEn}
                </p>
              </div>
            </div>
          ) : (
            /* Questions Flow */
            <div className="space-y-5">
              {/* Progress and Question Header */}
              <div className="flex items-center justify-between gap-2 border-b pb-3 border-slate-100 dark:border-slate-800">
                <span className="text-xs sm:text-sm font-bold text-blue-600">
                  {t('qc.progress', language, {
                    current: currentStep + 1,
                    total: totalQuestions,
                  })}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleReadAloud(
                      `${isHi ? currentQ.titleHi : currentQ.titleEn}. ${
                        isHi ? currentQ.helperHi : currentQ.helperEn
                      }`
                    )
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition-colors"
                >
                  {isSpeakingLocal ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isSpeakingLocal ? t('qc.stopVoice', language) : t('qc.readAloud', language)}</span>
                </button>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {isHi ? currentQ.titleHi : currentQ.titleEn}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {isHi ? currentQ.helperHi : currentQ.helperEn}
                </p>
              </div>

              {/* Large Accessible Buttons for Options */}
              <div className="grid grid-cols-1 gap-2.5 pt-1">
                {currentQ.options.map((option) => {
                  const isSelected = answers[currentQ.id] === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelectOption(option.value)}
                      className={`w-full p-4 rounded-xl border-2 text-left flex items-center justify-between gap-3 transition-all active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 font-bold shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      <div className="flex-1">
                        <span className="text-sm sm:text-base font-bold block leading-snug">
                          {isHi ? option.labelHi : option.labelEn}
                        </span>
                        {(option.descEn || option.descHi) && (
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-normal block mt-0.5">
                            {isHi ? option.descHi : option.descEn}
                          </span>
                        )}
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div
          className={`p-4 border-t flex items-center justify-between ${
            highContrast ? 'border-yellow-400/30 bg-slate-950' : 'border-slate-100 bg-slate-50/70'
          }`}
        >
          <div className="flex items-center gap-2">
            {currentStep > 0 || result ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('qc.back', language)}</span>
              </button>
            ) : null}

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('qc.retake', language)}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold transition-colors"
          >
            {t('qc.close', language)}
          </button>
        </div>
      </div>
    </div>
  );
}
