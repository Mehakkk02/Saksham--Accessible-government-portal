/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  FileText,
  Home,
  UserCheck,
  Volume2,
  Award,
  AlertTriangle,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Printer,
  Camera,
  Check,
  Building2,
  FileCheck,
  Download,
  Lock,
  RefreshCw,
  ShieldAlert,
  HelpCircle,
  Bookmark,
} from 'lucide-react';
import { useSakshamStore } from '../store/useSakshamStore';
import {
  PORTAL_STAGES,
  getStageStatus,
  type PortalStageId,
  type StageDisplayStatus,
} from '../utils/portalTimeline';
import {
  FRAUD_WARNING,
  PERMANENT_VS_TEMPORARY_INFO,
  GLOSSARY_ITEMS,
} from '../utils/visitPrep';
import { VoiceAssistant } from './VoiceAssistant';

export const TrackApplicationView: React.FC = () => {
  const {
    barriers,
    scanState,
    bookingStatus,
    portalReferenceNumber,
    setPortalReferenceNumber,
    isPortalSubmitted,
    confirmPortalSubmission,
    hasVisitedHospital,
    confirmHospitalVisit,
    demoAdvancedStage,
    simulateNextStatus,
    correctionsRequested,
    correctionReason,
    setCorrectionsRequested,
    resetPortalTimeline,
    setActiveScreen,
    startSpeaking,
    highContrast,
  } = useSakshamStore();

  const [inputRefNumber, setInputRefNumber] = useState(portalReferenceNumber);
  const [isEditingRef, setIsEditingRef] = useState(false);
  const [showDemoTools, setShowDemoTools] = useState(true);

  const scanPassed = scanState === 'success';

  // Compute status for all 7 stages using pure logic
  const stageStatuses: Record<PortalStageId, StageDisplayStatus> = {
    started: getStageStatus('started', {
      scanPassed,
      isPortalSubmitted,
      portalReferenceNumber,
      hasVisitedHospital,
      demoAdvancedStage,
      correctionsRequested,
    }),
    documents_ready: getStageStatus('documents_ready', {
      scanPassed,
      isPortalSubmitted,
      portalReferenceNumber,
      hasVisitedHospital,
      demoAdvancedStage,
      correctionsRequested,
    }),
    submitted_portal: getStageStatus('submitted_portal', {
      scanPassed,
      isPortalSubmitted,
      portalReferenceNumber,
      hasVisitedHospital,
      demoAdvancedStage,
      correctionsRequested,
    }),
    hospital_visit: getStageStatus('hospital_visit', {
      scanPassed,
      isPortalSubmitted,
      portalReferenceNumber,
      hasVisitedHospital,
      demoAdvancedStage,
      correctionsRequested,
    }),
    verification: getStageStatus('verification', {
      scanPassed,
      isPortalSubmitted,
      portalReferenceNumber,
      hasVisitedHospital,
      demoAdvancedStage,
      correctionsRequested,
    }),
    approved: getStageStatus('approved', {
      scanPassed,
      isPortalSubmitted,
      portalReferenceNumber,
      hasVisitedHospital,
      demoAdvancedStage,
      correctionsRequested,
    }),
    ready_download: getStageStatus('ready_download', {
      scanPassed,
      isPortalSubmitted,
      portalReferenceNumber,
      hasVisitedHospital,
      demoAdvancedStage,
      correctionsRequested,
    }),
  };

  const recordTrackerEventToApi = (stageId: string, stageTitle: string, status: 'completed' | 'in_progress' | 'corrections_requested') => {
    fetch('/api/demo/tracker-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referenceAlias: portalReferenceNumber || 'UDID-DEMO-01',
        stageId,
        stageTitle,
        status,
      }),
    }).catch(() => {});
  };

  const handlePortalSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const ref = inputRefNumber.trim() || 'UDID-2024-88912-DL';
    confirmPortalSubmission(ref);
    setIsEditingRef(false);
    recordTrackerEventToApi('submitted_portal', '3. Submitted on the official portal', 'completed');
  };

  const handleHospitalVisitToggle = () => {
    const nextVisited = !hasVisitedHospital;
    confirmHospitalVisit(nextVisited);
    recordTrackerEventToApi(
      'hospital_visit',
      '4. Visit hospital / CMO office (with printed receipt)',
      nextVisited ? 'completed' : 'in_progress'
    );
  };

  const handleOpenOfficialPortal = () => {
    if (typeof window !== 'undefined') {
      window.open('https://www.swavlambancard.gov.in/', '_blank', 'noopener,noreferrer');
    }
  };

  const handleOpenTrackApplication = () => {
    if (typeof window !== 'undefined') {
      window.open('https://www.swavlambancard.gov.in/', '_blank', 'noopener,noreferrer');
    }
  };

  const handleReadAloud = () => {
    let text = `Step 5 of 5: Track Application. 7 stage timeline mirroring official portal. Reference number ${portalReferenceNumber}. `;
    text += "Important safety reminder: Applying is free. Never pay anyone to get a UDID. ";
    if (correctionsRequested) {
      text += `Attention: Corrections requested by Medical Board. ${correctionReason}. Please see what to do now.`;
    } else if (demoAdvancedStage === 'ready_download') {
      text += `Status: Approved by Medical Board and e-UDID ready to download on the official portal.`;
    } else if (demoAdvancedStage === 'approved') {
      text += `Status: Application approved by State Medical Board.`;
    } else if (hasVisitedHospital) {
      text += `Status: Hospital visit completed. Medical board evaluation in progress.`;
    } else if (isPortalSubmitted) {
      text += `Status: Submitted on official portal. Next step is visit hospital or CMO office with printed receipt.`;
    } else {
      text += `Status: Documents prepared in Saksham. Please submit on official portal.`;
    }
    startSpeaking(text);
  };

  const handleReadGlossary = (item: typeof GLOSSARY_ITEMS[0]) => {
    const text = `${item.term}. ${item.meaning}`;
    startSpeaking(text);
  };

  // Helper to render stage icons and text labels (non-color-alone accessible status)
  const renderStageIcon = (status: StageDisplayStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" aria-hidden="true" />;
      case 'current':
        return <Clock className="w-5 h-5 text-blue-600 animate-pulse" aria-hidden="true" />;
      case 'corrections_requested':
        return <AlertTriangle className="w-5 h-5 text-amber-600" aria-hidden="true" />;
      case 'locked':
      default:
        return <Lock className="w-4 h-4 text-slate-400" aria-hidden="true" />;
    }
  };

  const renderStageBadge = (status: StageDisplayStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Check className="w-3 h-3" /> Completed
          </span>
        );
      case 'current':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Clock className="w-3 h-3 animate-spin" /> In Progress
          </span>
        );
      case 'corrections_requested':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertTriangle className="w-3 h-3" /> Corrections Requested
          </span>
        );
      case 'locked':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-300">
            <Lock className="w-3 h-3" /> Locked
          </span>
        );
    }
  };

  return (
    <div
      className={`min-h-screen w-full p-4 sm:p-6 md:p-10 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500 ${
        highContrast
          ? 'bg-slate-950 text-slate-100'
          : 'bg-gradient-to-br from-indigo-50 via-sky-50 to-blue-100 text-slate-800'
      }`}
    >
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-emerald-200/25 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[45vw] h-[45vw] rounded-full bg-blue-200/25 blur-3xl pointer-events-none -z-10" />

      <motion.main
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`w-full max-w-5xl rounded-3xl p-5 sm:p-8 md:p-10 backdrop-blur-md transition-all relative ${
          highContrast
            ? 'bg-slate-900/95 border-2 border-yellow-400 shadow-2xl'
            : 'bg-white/90 border border-white/70 shadow-xl'
        }`}
      >
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 mb-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveScreen('book-help')}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Back to Step 4 Visit & Help"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Step 5 of 5 • Track Application
                </span>
                <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Ref: {portalReferenceNumber}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                Official Portal Application Timeline
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReadAloud}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200"
              aria-label="Listen to tracking status"
            >
              <Volume2 className="w-4 h-4 text-blue-600" />
              <span>Listen</span>
            </button>
          </div>
        </header>

        {/* Persistent Fraud Safety Notice */}
        <div
          role="region"
          aria-label="Fraud Safety Warning"
          className="mb-6 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex items-start gap-3 shadow-xs"
        >
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed">
            <span className="font-extrabold uppercase tracking-wide text-amber-900 block">
              Applying is 100% Free • Never Pay Anyone for a UDID Card
            </span>
            <p className="mt-0.5 font-medium text-amber-900">{FRAUD_WARNING.en}</p>
            <p className="mt-0.5 text-xs text-amber-800">{FRAUD_WARNING.hi}</p>
          </div>
        </div>

        {/* Official Portal Quick-Actions & Required Note */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border border-blue-200/80 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                <Building2 className="w-4 h-4 text-blue-700" />
                <span>Department of Empowerment of Persons with Disabilities (DEPwD)</span>
              </div>
              <p className="text-xs text-slate-700 mt-1 font-medium">
                Check your real status on the official portal. Saksham only keeps your reference number for convenience.
              </p>
            </div>

            <div className="flex items-center flex-wrap gap-2.5">
              <button
                type="button"
                onClick={handleOpenOfficialPortal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-blue-700 border border-blue-300 shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Open official portal in new tab"
              >
                <span>Open official portal</span>
                <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              </button>

              <button
                type="button"
                onClick={handleOpenTrackApplication}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Open Track Your Application on official portal in new tab"
              >
                <span>Open Track Your Application</span>
                <ExternalLink className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Demo Tools Bar */}
        <section
          aria-label="Demo Testing Controls"
          className="mb-6 p-3.5 sm:p-4 rounded-2xl bg-amber-50/90 border border-amber-300/80 text-amber-950"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Demo Tools: Advance Portal Stages (Stages 5–7)
              </span>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              <button
                type="button"
                onClick={simulateNextStatus}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-amber-400"
                aria-label="Simulate next status"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Simulate next status</span>
              </button>

              <button
                type="button"
                onClick={() => setCorrectionsRequested(!correctionsRequested)}
                aria-pressed={correctionsRequested}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  correctionsRequested
                    ? 'bg-red-600 text-white border-red-700'
                    : 'bg-white text-amber-900 border-amber-300 hover:bg-amber-100'
                }`}
                aria-label="Toggle simulate corrections requested"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>
                  {correctionsRequested ? 'Corrections Active' : 'Simulate Corrections Requested'}
                </span>
              </button>

              <button
                type="button"
                onClick={resetPortalTimeline}
                className="p-1.5 rounded-xl text-xs font-semibold text-amber-800 hover:bg-amber-100 border border-amber-200 transition-colors"
                title="Reset portal timeline"
                aria-label="Reset portal timeline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="text-[11px] text-amber-800 mt-2 flex items-center gap-2">
            <span>Stages 1–2 derive from app state. Stages 3–4 are user-confirmed. Stages 5–7 advance via "Simulate next status".</span>
          </div>
        </section>

        {/* CORRECTIONS REQUESTED BRANCH */}
        {correctionsRequested && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mb-6 p-5 sm:p-6 rounded-2xl border-2 transition-all shadow-md ${
              highContrast
                ? 'bg-amber-950/90 border-yellow-400 text-yellow-100'
                : 'bg-amber-50 border-amber-400 text-amber-950'
            }`}
            role="region"
            aria-label="Corrections Requested: What to do now"
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500 text-white mt-0.5 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-base sm:text-lg font-black text-amber-950">
                    What to do now: Medical Board Corrections Requested
                  </h3>
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300">
                    Action Required
                  </span>
                </div>

                <p className="text-sm text-amber-900 mt-1 font-medium">
                  {correctionReason}
                </p>

                <div className="mt-4 p-4 rounded-xl bg-white/80 border border-amber-200 space-y-2.5 text-xs sm:text-sm text-slate-800">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Simple steps to resolve this:</span>
                  </h4>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
                    <li>
                      <strong>Take a clearer photograph:</strong> Make sure the hospital round seal and the doctor's registration number are clearly visible without blur or glare.
                    </li>
                    <li>
                      <strong>Re-check in Saksham:</strong> Use our Document Checklist to test sharpness and lighting before re-uploading.
                    </li>
                    <li>
                      <strong>Re-submit on official portal:</strong> Log in using your reference number (<code>{portalReferenceNumber}</code>) on Swavlamban card portal and upload the replacement document.
                    </li>
                  </ol>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveScreen('document')}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Check document in Saksham</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenOfficialPortal}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-amber-300 shadow-xs transition-all"
                  >
                    <ExternalLink className="w-4 h-4 text-amber-700" />
                    <span>Upload correction on official portal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCorrectionsRequested(false)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>I submitted requested correction</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 7 REVISED TIMELINE STAGES */}
        <section aria-label="Application Progress Stages" className="space-y-4">
          <ol className="relative border-l-2 border-blue-200 ml-4 space-y-6" role="list">
            {PORTAL_STAGES.map((stage) => {
              const status = stageStatuses[stage.id];
              const isDone = status === 'completed';
              const isCurrent = status === 'current';
              const isCorrection = status === 'corrections_requested';

              return (
                <li
                  key={stage.id}
                  className={`ml-6 p-4 rounded-2xl border transition-all ${
                    isCorrection
                      ? 'bg-amber-50/90 border-amber-300 shadow-sm'
                      : isCurrent
                      ? 'bg-blue-50/80 border-blue-300 shadow-xs ring-1 ring-blue-300'
                      : isDone
                      ? 'bg-white/90 border-slate-200'
                      : 'bg-slate-50/70 border-slate-200/60 opacity-75'
                  }`}
                >
                  <span
                    className={`absolute -left-3.5 flex items-center justify-center w-7 h-7 rounded-full ring-4 ring-white shadow-xs ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : isCorrection
                        ? 'bg-amber-500 text-white animate-bounce'
                        : isCurrent
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                    aria-hidden="true"
                  >
                    {renderStageIcon(status)}
                  </span>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                      <span>{stage.title}</span>
                    </h3>
                    <div className="flex items-center gap-2">
                      {renderStageBadge(status)}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mb-2">{stage.description}</p>

                  {/* Stage 3: Submitted on the official portal */}
                  {stage.id === 'submitted_portal' && (
                    <div className="mt-3 p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                      {isPortalSubmitted && !isEditingRef ? (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-semibold text-slate-700">Official Reference Number:</span>
                            <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              {portalReferenceNumber}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setIsEditingRef(true)}
                              className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline"
                            >
                              Edit number
                            </button>
                            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                            </span>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handlePortalSubmit} className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <div className="flex-1">
                              <label
                                htmlFor="reference-input"
                                className="block text-xs font-bold text-slate-700 mb-1"
                              >
                                Enter your official portal application reference number:
                              </label>
                              <input
                                id="reference-input"
                                type="text"
                                value={inputRefNumber}
                                onChange={(e) => setInputRefNumber(e.target.value)}
                                placeholder="e.g. UDID-2024-88912-DL"
                                className="w-full px-3 py-2 text-xs font-mono font-semibold rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                              />
                            </div>
                            <button
                              type="submit"
                              className="self-end sm:self-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                              I submitted on the portal
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Tip: Once you apply on Swavlamban card website, paste your confirmation receipt reference number here.
                          </p>
                        </form>
                      )}
                    </div>
                  )}

                  {/* Stage 4: Visit hospital / CMO office */}
                  {stage.id === 'hospital_visit' && (
                    <div className="mt-3 p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Printer className="w-4 h-4 text-slate-600" />
                            <span className="text-xs font-bold text-slate-800">
                              Bring printed application receipt and original records
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Visit the Chief Medical Officer (CMO) office or designated Civil Hospital board on your scheduled assessment day.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={handleHospitalVisitToggle}
                          disabled={!isPortalSubmitted}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                            !isPortalSubmitted
                              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                              : hasVisitedHospital
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-white text-blue-700 border border-blue-300 hover:bg-blue-50'
                          }`}
                          aria-pressed={hasVisitedHospital}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>
                            {hasVisitedHospital ? 'Hospital visit confirmed' : 'Confirm hospital visit done'}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Stage 7: e-UDID ready to download */}
                  {stage.id === 'ready_download' && status === 'completed' && (
                    <div className="mt-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-emerald-900 block">
                          🎉 Your official Unique Disability ID card is ready!
                        </span>
                        <span className="text-[11px] text-emerald-800">
                          Download digital copy from the Swavlamban portal or proceed to view your Saksham summary sheet.
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleOpenOfficialPortal}
                          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300 inline-flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download e-UDID</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveScreen('summary')}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs"
                        >
                          View Summary
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </section>

        {/* Permanent vs Temporary Explainer Card */}
        <section
          aria-labelledby="track-perm-temp-heading"
          className="mt-8 p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4"
        >
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-blue-600" />
                <h2 id="track-perm-temp-heading" className="text-base sm:text-lg font-bold text-slate-900">
                  Permanent vs Temporary UDID Card
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {PERMANENT_VS_TEMPORARY_INFO.disclaimer.en}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const text =
                  "Permanent vs Temporary UDID Card. " +
                  "Permanent: Issued when the condition is non-progressive. No renewal needed. " +
                  "Temporary: Issued when condition may improve or for children. Has an expiry date like 5 years. " +
                  "General information. Confirm details on official portal.";
                startSpeaking(text);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 shrink-0"
              aria-label="Read Permanent vs Temporary explanation aloud"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900 block">
                {PERMANENT_VS_TEMPORARY_INFO.permanent.title.en}
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {PERMANENT_VS_TEMPORARY_INFO.permanent.description.en}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block">
                {PERMANENT_VS_TEMPORARY_INFO.temporary.title.en}
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {PERMANENT_VS_TEMPORARY_INFO.temporary.description.en}
              </p>
            </div>
          </div>
        </section>

        {/* Plain-Language Government Terms Glossary */}
        <section
          aria-labelledby="track-glossary-heading"
          className="mt-6 p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4"
        >
          <div className="pb-3 border-b border-slate-100">
            <h2 id="track-glossary-heading" className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-teal-600" />
              <span>Government Portal Glossary</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Quickly look up official terms used during your application and assessment.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {GLOSSARY_ITEMS.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-slate-900">{item.term}</span>
                    <span className="text-xs text-slate-500 font-medium">({item.termHi})</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.meaning}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleReadGlossary(item)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 shrink-0 self-start sm:self-center transition-colors"
                  aria-label={`Read ${item.term} definition aloud`}
                >
                  <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Read aloud</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Navigation Controls */}
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-8 border-t border-slate-200/80">
          <button
            type="button"
            onClick={() => setActiveScreen('book-help')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all shadow-xs"
          >
            Back to Visit & Help (Step 4)
          </button>

          <button
            type="button"
            onClick={() => setActiveScreen('summary')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm shadow-xl shadow-emerald-600/25 transition-all focus:outline-none focus:ring-4 focus:ring-emerald-400"
          >
            <span>Continue to Summary & Pass</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </footer>
      </motion.main>

      <VoiceAssistant />
    </div>
  );
};

export default TrackApplicationView;
