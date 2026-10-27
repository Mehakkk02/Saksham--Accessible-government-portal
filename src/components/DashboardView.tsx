/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  QrCode,
  Award,
  Calendar,
  CheckCircle2,
  FileText,
  UserCheck,
  Home,
  Phone,
  Download,
  Share2,
  ArrowLeft,
  Sparkles,
  Users,
  Eye,
  Ear,
  Printer,
  Volume2
} from 'lucide-react';
import { useSakshamStore } from '../store/useSakshamStore';
import { VoiceAssistant } from '../components/VoiceAssistant';

export const DashboardView: React.FC = () => {
  const {
    barriers,
    verificationResult,
    bookingStatus,
    setActiveScreen,
    startSpeaking,
    highContrast,
    fontSize,
    caregiverMode,
  } = useSakshamStore();

  const [downloaded, setDownloaded] = useState(false);

  const applicant = verificationResult?.extractedData || {
    applicantName: 'Aarav Sharma',
    disabilityType: 'Locomotor Disability (Bilateral)',
    disabilityPercentage: '65% (Permanent)',
    issuingHospital: 'All India Institute of Medical Sciences (AIIMS)',
    certificateNumber: 'UDID-CERT-2024-88912',
    verifiedDate: '26 Oct 2026',
    doctorRegistration: 'MCI-REG-94821',
  };

  const hasTravel = barriers.includes('travel');
  const hasReading = barriers.includes('reading');
  const hasHearing = barriers.includes('hearing');
  const hasCaregiver = barriers.includes('caregiver');

  const handleReadSummary = () => {
    startSpeaking(
      `Step 5 of 5: Summary and Digital UDID Pass. Cardholder: ${applicant.applicantName}. Disability: ${applicant.disabilityType}, ${applicant.disabilityPercentage}. Application summary and digital pass preview are ready.`
    );
  };

  const handlePrint = () => {
    setDownloaded(true);
    if (typeof window !== 'undefined') {
      window.print();
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
      <div className="w-full max-w-4xl space-y-6">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl backdrop-blur-md bg-white/75 border border-white/60 shadow-xl">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveScreen('track')}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Back to application tracking (Step 4)"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-xs font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Step 5 of 5 • Summary & UDID Pass
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">
                Digital Disability ID (UDID) Card
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
              aria-label="Print receipt"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={handleReadSummary}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200"
              aria-label="Read summary aloud"
            >
              <Volume2 className="w-4 h-4 text-blue-600" />
              <span>Listen</span>
            </button>
          </div>
        </header>

        {/* Digital UDID Smart Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white border border-blue-500/30"
        >
          {/* Subtle background circuit pattern */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          {/* Card Top Branding */}
          <div className="flex items-start justify-between pb-6 border-b border-white/15">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-blue-300">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wider uppercase text-blue-300">
                  DEPwD • Ministry of Social Justice and Empowerment
                </p>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Unique Disability ID (UDID)
                </h2>
              </div>
            </div>

            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold tracking-wide">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              PREVIEW READY
            </span>
          </div>

          {/* Card Body */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-blue-300/80 block">
                  Cardholder Name
                </span>
                <span className="text-xl font-bold text-white">{applicant.applicantName}</span>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider text-blue-300/80 block">
                  Disability Category
                </span>
                <span className="text-sm font-semibold text-white/90">
                  {applicant.disabilityType}
                </span>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider text-blue-300/80 block">
                  Severity Rating
                </span>
                <span className="text-lg font-bold text-emerald-300">
                  {applicant.disabilityPercentage}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-blue-300/80 block">
                  Issuing Authority
                </span>
                <span className="text-sm font-semibold text-white/90">
                  {applicant.issuingHospital}
                </span>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider text-blue-300/80 block">
                  UDID Number
                </span>
                <span className="text-sm font-mono font-bold text-blue-200">
                  {applicant.certificateNumber}
                </span>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider text-blue-300/80 block">
                  Doctor Council Reg
                </span>
                <span className="text-sm font-mono text-white/80">
                  {applicant.doctorRegistration}
                </span>
              </div>
            </div>

            {/* QR Verification & Biometric Badge */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <div className="p-2.5 rounded-xl bg-white text-slate-900 shadow-md mb-2">
                <QrCode className="w-20 h-20 text-slate-900" />
              </div>
              <span className="text-[11px] font-mono text-blue-200 tracking-wider">
                SCAN FOR APPLICATION SUMMARY
              </span>
            </div>
          </div>

          {/* Active Accommodations Embedded in Digital Pass */}
          <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-blue-300 uppercase tracking-wider">
              Assigned Rights:
            </span>
            {hasReading && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-200 border border-blue-400/30">
                <Eye className="w-3.5 h-3.5" /> Audio & Large Print Notice
              </span>
            )}
            {hasHearing && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
                <Ear className="w-3.5 h-3.5" /> Visual/SMS Notice
              </span>
            )}
            {hasTravel && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-200 border border-sky-400/30">
                <Home className="w-3.5 h-3.5" /> Home Assessment Help Request
              </span>
            )}
            {hasCaregiver && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-200 border border-teal-400/30">
                <Users className="w-3.5 h-3.5" /> Caregiver Co-Signer Linked
              </span>
            )}
          </div>
        </motion.div>

        {/* Benefits & Doorstep Service Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-3xl backdrop-blur-md bg-white/75 border border-white/60 shadow-lg">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Eligible Government Entitlements
            </h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                75% Concession on Indian Railways & Metro Travel
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Priority ADIP Assistive Device Subsidy (Wheelchair/Caliper)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Income Tax Exemption under Section 80U
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl backdrop-blur-md bg-white/75 border border-white/60 shadow-lg">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Home className="w-5 h-5 text-blue-600" />
              Help Request & Service Coordination
            </h3>
            <p className="text-xs text-slate-500 mb-2 font-medium">
              Help request (demo): the hospital still decides the date.
            </p>
            {hasTravel || bookingStatus === 'confirmed' ? (
              <div>
                <p className="text-sm text-slate-600 mb-3">
                  Home assessment support requested for your registered address. Civil hospital medical board will review and confirm.
                </p>
                <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs font-semibold text-teal-900 flex items-center justify-between">
                  <span>Requested Slot: Tuesday, 10:30 AM</span>
                  <span className="px-2 py-0.5 rounded bg-teal-700 text-white text-[10px]">Submitted (Demo)</span>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-slate-600 mb-3">
                  Physical travel accommodation was not selected. Your digital UDID pass is valid for immediate use.
                </p>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>PVC Card Delivery: By Speed Post</span>
                  <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px]">Processing</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={() => setActiveScreen('track')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all"
          >
            Back to Track Application (Step 4)
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveScreen('home')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-sm border border-blue-200 transition-all"
            >
              Return to Home
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm shadow-xl shadow-emerald-600/25 transition-all focus:outline-none focus:ring-4 focus:ring-emerald-400"
            >
              <Download className="w-4 h-4" />
              <span>Download Official Pass</span>
            </button>
          </div>
        </div>
      </div>

      <VoiceAssistant />
    </div>
  );
};

export default DashboardView;
