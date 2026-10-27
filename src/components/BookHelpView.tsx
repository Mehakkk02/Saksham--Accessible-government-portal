/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Users,
  Info,
  ArrowRight,
  ArrowLeft,
  Volume2,
  Copy,
  Printer,
  Check,
  Building2,
  FileText,
  ShieldAlert,
  HelpCircle,
  Share2,
  Car,
  Bookmark,
} from 'lucide-react';
import { useSakshamStore } from '../store/useSakshamStore';
import { VoiceAssistant } from './VoiceAssistant';
import {
  getWhatToCarryChecklist,
  generateHospitalRequestMessage,
  generateHelpCentersShareText,
  GLOSSARY_ITEMS,
  PERMANENT_VS_TEMPORARY_INFO,
  HELP_CENTERS,
  HELP_CENTERS_NOTE,
  FRAUD_WARNING,
  type ChecklistItem,
} from '../utils/visitPrep';
import { loadFormPrepData } from '../utils/formPrep';

export const BookHelpView: React.FC = () => {
  const {
    barriers,
    bookingStatus,
    setBookingStatus,
    setActiveScreen,
    startSpeaking,
    highContrast,
    portalReferenceNumber,
    caregiverMode,
  } = useSakshamStore();

  const [address, setAddress] = useState('Flat 402, Shanti Vihar, Civil Lines, Nagpur, MH 440001');
  const [selectedSlot, setSelectedSlot] = useState('Tomorrow, 10:00 AM - 12:00 PM');
  const [confirmed, setConfirmed] = useState(bookingStatus === 'confirmed' || bookingStatus === 'requested');
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [copiedCenters, setCopiedCenters] = useState(false);

  // Form prep applicant details if stored in session
  const prepData = loadFormPrepData();
  const applicantName = prepData?.fullName || 'Applicant';

  const hasTravelBarrier = barriers.includes('travel');
  const hasCaregiver =
    barriers.includes('caregiver') || caregiverMode || prepData?.fillingFor === 'someone_else';
  const helpNeeded = hasTravelBarrier || hasCaregiver;

  // Checklist of "What to carry"
  const checklistItems = getWhatToCarryChecklist({ hasCaregiver });
  const [tickedItems, setTickedItems] = useState<Record<string, boolean>>({
    portal_receipt: false,
    original_id: false,
    medical_reports: false,
    passport_photos: false,
    caregiver_id: false,
  });

  const toggleChecklistItem = (id: string) => {
    setTickedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const slots = [
    'Tomorrow, 10:00 AM - 12:00 PM',
    'Tomorrow, 02:00 PM - 04:00 PM',
    'Day after, 10:00 AM - 12:00 PM',
    'Day after, 02:00 PM - 04:00 PM',
  ];

  const handleReadScreen = () => {
    const text =
      "Hospital Visit Preparation and Help Request. " +
      "Applying for a UDID card is completely free. Never pay anyone to get a card. " +
      "Review your What to Carry checklist before going to the hospital: printed portal receipt, original ID, photos, and medical reports. " +
      "If you cannot travel, you can copy a polite assistance request message to share with the medical board.";
    startSpeaking(text);
  };

  const handleReadGlossary = (item: typeof GLOSSARY_ITEMS[0]) => {
    const text = `${item.term}. ${item.meaning}`;
    startSpeaking(text);
  };

  const handleSubmitHelpRequest = () => {
    setConfirmed(true);
    setBookingStatus('requested');

    // Record demo help request to server JSON database (strictly zero PII, demo alias only)
    fetch('/api/demo/help-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicantAlias: `Applicant ${applicantName && applicantName !== 'Applicant' ? applicantName.charAt(0).toUpperCase() : 'Demo'}-${Math.floor(Math.random() * 800) + 100}`,
        requestedSlot: selectedSlot,
        supportType: hasTravelBarrier ? 'doorstep_assessment' : 'caregiver_coordination',
        district: 'Nagpur',
      }),
    }).catch(() => {});

    startSpeaking(
      'Help request submitted in demo mode. Please remember: the hospital still decides the official date and schedule.'
    );
  };

  const handleCopyHospitalMessage = async () => {
    const message = generateHospitalRequestMessage({
      applicantName,
      preferredSlot: selectedSlot,
      referenceNumber: portalReferenceNumber,
      language: 'en',
    });
    try {
      await navigator.clipboard.writeText(message);
      setCopiedMessage(true);
      startSpeaking('Assistance request message copied to clipboard. You can paste and send this to the hospital or CMO office.');
      setTimeout(() => setCopiedMessage(false), 3000);
    } catch {
      // Fallback
    }
  };

  const handleShareCenters = async () => {
    const shareText = generateHelpCentersShareText('en');
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedCenters(true);
      startSpeaking('Help centre details copied to clipboard. You can share this with your caregiver or family.');
      setTimeout(() => setCopiedCenters(false), 3000);
    } catch {
      // Fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const allTicked = checklistItems.every((item) => tickedItems[item.id] || !item.required);
  const tickedCount = checklistItems.filter((item) => tickedItems[item.id]).length;

  return (
    <div
      className={`min-h-screen w-full p-4 sm:p-6 md:p-8 flex flex-col items-center transition-colors duration-300 ${
        highContrast ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
      }`}
    >
      <motion.main
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl space-y-6"
      >
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveScreen('formprep')}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 transition-colors text-slate-700"
              aria-label="Back to Form Prep"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  Step 4 of 5 • Visit & Help
                </span>
                {!helpNeeded && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    Skipped (not needed)
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-black text-slate-900 mt-1">
                Hospital Visit Prep & Assisted Help
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-xs transition-colors"
              aria-label="Print hospital visit checklist"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print Checklist</span>
            </button>
            <button
              type="button"
              onClick={handleReadScreen}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 shadow-xs transition-colors"
              aria-label="Read screen aloud"
            >
              <Volume2 className="w-4 h-4 text-blue-600" />
              <span>Listen</span>
            </button>
          </div>
        </header>

        {/* Persistent Fraud Safety Notice */}
        <div
          role="region"
          aria-label="Fraud Prevention Alert"
          className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex items-start gap-3 shadow-xs"
        >
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed">
            <span className="font-extrabold uppercase tracking-wide text-amber-900 block">
              Applying is 100% Free • Beware of Touts & Fraud
            </span>
            <p className="mt-0.5 font-medium text-amber-900">{FRAUD_WARNING.en}</p>
            <p className="mt-0.5 text-xs text-amber-800">{FRAUD_WARNING.hi}</p>
          </div>
        </div>

        {/* Non-travel / non-caregiver optional banner */}
        {!helpNeeded && (
          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300 text-slate-800 flex items-start gap-3">
            <Info className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm leading-relaxed">
              <span className="font-bold text-slate-900 block">
                Skipped (not needed for your accommodations)
              </span>
              <p className="mt-0.5 text-slate-700">
                You did not select severe travel barrier or caregiver in Step 1. You can review the visit
                checklist below or proceed directly to Track your application.
              </p>
            </div>
          </div>
        )}

        {/* 1. What to Carry Checklist */}
        <section
          aria-labelledby="checklist-heading"
          className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 id="checklist-heading" className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>What to Carry to the Hospital or CMO Office</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Check off each item as you pack it into your file folder.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  allTicked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                }`}
                aria-live="polite"
              >
                {tickedCount} of {checklistItems.length} packed
              </span>
            </div>
          </div>

          <div className="space-y-3" role="group" aria-label="Hospital Checklist Items">
            {checklistItems.map((item) => {
              const isTicked = !!tickedItems[item.id];
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                    isTicked
                      ? 'border-emerald-300 bg-emerald-50/60 text-emerald-950'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-white text-slate-800'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{item.title}</span>
                      {item.required ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                          Mandatory
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                          If available
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                    <p className="text-xs text-slate-500 leading-relaxed italic">{item.descriptionHi}</p>
                  </div>

                  {/* Switch-style toggle button */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isTicked}
                    aria-label={`${item.title}, ${isTicked ? 'Packed' : 'Not packed'}`}
                    onClick={() => toggleChecklistItem(item.id)}
                    className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                      isTicked
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {isTicked ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Packed</span>
                      </>
                    ) : (
                      <>
                        <span className="w-4 h-4 rounded-full border border-slate-400" />
                        <span>Pack</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2. Travel Barrier: Home Visit / Doorstep Assistance Request */}
        {hasTravelBarrier && (
          <section
            aria-labelledby="travel-request-heading"
            className="p-6 rounded-3xl bg-white border border-teal-200 shadow-sm space-y-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                <Car className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                    Travel Barrier Support
                  </span>
                </div>
                <h2 id="travel-request-heading" className="text-lg font-bold text-slate-900 mt-1">
                  Ask the Hospital About a Home Visit or Assistance
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  Because you indicated travel difficulty, you can request a doorstep assessment or special
                  mobility support from your district CMO. Saksham does not send messages directly; copy this polite
                  letter and share it with the hospital or welfare office.
                </p>
              </div>
            </div>

            {/* Address & Slot preference */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-2xl bg-teal-50/50 border border-teal-100">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-teal-900 block mb-1">
                  Applicant Name
                </label>
                <p className="text-sm font-semibold text-slate-800">{applicantName}</p>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-teal-900 block mb-1">
                  Preferred Time Window
                </label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full text-xs font-semibold p-2 rounded-xl border border-teal-200 bg-white text-slate-800"
                  aria-label="Select preferred doorstep time slot"
                >
                  {slots.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Generated Message Preview */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-mono whitespace-pre-wrap leading-relaxed">
              {generateHospitalRequestMessage({
                applicantName,
                preferredSlot: selectedSlot,
                referenceNumber: portalReferenceNumber,
                language: 'en',
              })}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <span className="text-xs text-slate-500 font-medium">
                Note: This is a message to copy. Saksham does not submit or contact the hospital.
              </span>
              <button
                type="button"
                onClick={handleCopyHospitalMessage}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors"
                aria-label="Copy polite assistance request message to clipboard"
              >
                {copiedMessage ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedMessage ? 'Copied to Clipboard!' : 'Copy Request Message'}</span>
              </button>
            </div>
          </section>
        )}

        {/* 3. Demo Help Request Wizard Card */}
        <section
          aria-labelledby="help-request-heading"
          className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                Help request (demo): the hospital still decides the date
              </span>
              <h2 id="help-request-heading" className="text-lg font-bold text-slate-900 mt-1">
                Record Help Request for Medical Team
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Saksham captures your preferred address and time slot for your records. The designated civil
            hospital medical board decides the actual assessment schedule.
          </p>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Home Address for Assessment
              </span>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium bg-white text-slate-900"
                aria-label="Home address for assessment"
              />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                Preferred Slot
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {slots.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSelectedSlot(s);
                      setConfirmed(false);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between ${
                      selectedSlot === s
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>{s}</span>
                    {selectedSlot === s && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {confirmed ? (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs sm:text-sm">
                <span className="font-bold">Help request saved (demo):</span> The hospital still decides the
                date. Preferred slot: <span className="font-bold">{selectedSlot}</span>.
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSubmitHelpRequest}
              className="w-full py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
            >
              Submit Help Request (Demo)
            </button>
          )}
        </section>

        {/* 4. "Where can I get help applying?" Card */}
        <section
          aria-labelledby="help-centres-heading"
          className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 id="help-centres-heading" className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <span>Where Can I Get Help Applying?</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {HELP_CENTERS_NOTE.en} • {HELP_CENTERS_NOTE.hi}
              </p>
            </div>
            <button
              type="button"
              onClick={handleShareCenters}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors shrink-0"
              aria-label="Share help centres with caregiver"
            >
              {copiedCenters ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-indigo-600" />}
              <span>{copiedCenters ? 'Copied Details!' : 'Share with Caregiver'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {HELP_CENTERS.map((center) => (
              <div
                key={center.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-1.5 hover:bg-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-600" />
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900">{center.title}</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{center.description}</p>
                <p className="text-xs text-slate-500 leading-relaxed italic">{center.descriptionHi}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Permanent vs Temporary UDID Explainer */}
        <section
          aria-labelledby="perm-temp-heading"
          className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4"
        >
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-blue-600" />
                <h2 id="perm-temp-heading" className="text-lg font-bold text-slate-900">
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
                  "Permanent vs Temporary UDID. " +
                  "Permanent UDID: Issued when the medical condition is irreversible or permanent. It does not need renewal. " +
                  "Temporary UDID: Issued when a condition may change or improve over time, or for children. It has a validity period like 5 years. " +
                  "General information. Confirm details on the official portal.";
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
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900 block">
                {PERMANENT_VS_TEMPORARY_INFO.permanent.title.en}
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {PERMANENT_VS_TEMPORARY_INFO.permanent.description.en}
              </p>
              <p className="text-xs text-slate-600 italic leading-relaxed">
                {PERMANENT_VS_TEMPORARY_INFO.permanent.description.hi}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block">
                {PERMANENT_VS_TEMPORARY_INFO.temporary.title.en}
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {PERMANENT_VS_TEMPORARY_INFO.temporary.description.en}
              </p>
              <p className="text-xs text-slate-600 italic leading-relaxed">
                {PERMANENT_VS_TEMPORARY_INFO.temporary.description.hi}
              </p>
            </div>
          </div>
        </section>

        {/* 6. Plain-Language Glossary */}
        <section
          aria-labelledby="glossary-heading"
          className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4"
        >
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 id="glossary-heading" className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-teal-600" />
                <span>Plain-Language Government Terms Glossary</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Simple explanations of terms used in the official application process.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {GLOSSARY_ITEMS.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white transition-colors"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-slate-900">{item.term}</span>
                    <span className="text-xs text-slate-500 font-medium">({item.termHi})</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.meaning}</p>
                  <p className="text-xs text-slate-500 leading-relaxed italic">{item.meaningHi}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleReadGlossary(item)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 shrink-0 self-start sm:self-center transition-colors"
                  aria-label={`Read ${item.term} definition aloud`}
                >
                  <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Read aloud</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Action Buttons */}
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setActiveScreen('formprep')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-all"
          >
            Back to Form Prep (Step 3)
          </button>
          <button
            type="button"
            onClick={() => setActiveScreen('track')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-blue-500/25 transition-all focus:outline-none focus:ring-4 focus:ring-blue-400"
          >
            <span>Continue to Track Application (Step 5)</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </footer>
      </motion.main>
      <VoiceAssistant />
    </div>
  );
};

export default BookHelpView;
