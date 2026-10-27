/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Admin-Only "Demo Stats" Panel inside Demo Tools
 * Displays:
 * 1. Average onboarding time (calculated from kpi_events)
 * 2. Document pass rate (calculated from doc_checks)
 * 3. Recent doc quality checks (numbers only, never images)
 * 4. Recent demo help requests (demo aliases only, no real address or phone)
 * 5. Controls to refresh stats and reset/re-seed demo database
 */

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Clock,
  CheckCircle2,
  FileCheck,
  RotateCcw,
  RefreshCw,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Activity,
  Sun,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export interface DemoStatsData {
  avgOnboardingSeconds: number;
  formattedAvgOnboardingTime: string;
  docPassRatePercent: number;
  totalDocChecks: number;
  totalHelpRequests: number;
  totalKpiEvents: number;
  totalTrackerEvents: number;
  recentDocChecks: Array<{
    id: string;
    slot: string;
    blurScore: number;
    brightnessScore: number;
    passed: boolean;
    checkedAt: string;
  }>;
  recentHelpRequests: Array<{
    id: string;
    applicantAlias: string;
    requestedSlot: string;
    supportType: string;
    district: string;
    status: string;
    createdAt: string;
  }>;
  updatedAt: string;
}

export const DemoStatsPanel: React.FC = () => {
  const [stats, setStats] = useState<DemoStatsData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/demo/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.warn('Failed to fetch demo stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSeed = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/demo/reset', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setStatusMessage('Demo database reset to clean seed data!');
        setTimeout(() => setStatusMessage(''), 3000);
      }
    } catch (err) {
      console.warn('Failed to reset demo database:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="mt-4 pt-4 border-t border-amber-300/80 space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-600 text-white">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
              <span>Admin Demo Stats & KPI Panel</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-200 text-amber-900">
                Demo Metrics
              </span>
            </h4>
            <p className="text-[11px] text-amber-900/80 font-medium">
              Real-time measurement of onboarding efficiency and document clarity
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {statusMessage && (
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md animate-fade-in">
              {statusMessage}
            </span>
          )}
          <button
            type="button"
            onClick={fetchStats}
            disabled={loading}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-amber-300 shadow-2xs transition-colors"
            title="Refresh KPI stats"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-700 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={handleResetSeed}
            disabled={loading}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shadow-2xs transition-colors"
            title="Re-seed demo database with default data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-seed Demo Data</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* KPI 1: Avg Onboarding Time */}
          <div className="p-3 rounded-xl bg-white border border-amber-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Avg Onboarding</span>
              <Clock className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-900">
              {stats.formattedAvgOnboardingTime || '0s'}
            </div>
            <span className="text-[10px] text-slate-500">
              from {stats.totalKpiEvents} KPI events
            </span>
          </div>

          {/* KPI 2: Document Pass Rate */}
          <div className="p-3 rounded-xl bg-white border border-amber-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Doc Pass Rate</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-lg sm:text-xl font-black text-emerald-700">
              {stats.docPassRatePercent}%
            </div>
            <span className="text-[10px] text-slate-500">
              across {stats.totalDocChecks} quality checks
            </span>
          </div>

          {/* KPI 3: Demo Bookings */}
          <div className="p-3 rounded-xl bg-white border border-amber-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Demo Bookings</span>
              <FileCheck className="w-3.5 h-3.5 text-teal-600" />
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-900">
              {stats.totalHelpRequests}
            </div>
            <span className="text-[10px] text-slate-500">
              help requests (demo aliases)
            </span>
          </div>

          {/* KPI 4: Timeline Tracker Events */}
          <div className="p-3 rounded-xl bg-white border border-amber-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Status Events</span>
              <Activity className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-900">
              {stats.totalTrackerEvents}
            </div>
            <span className="text-[10px] text-slate-500">
              timeline transitions
            </span>
          </div>
        </div>
      )}

      {/* Toggle Detailed Inspection Records */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 hover:text-amber-950 underline underline-offset-2"
        >
          {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>{showDetails ? 'Hide inspection logs' : 'Inspect recent doc checks & demo bookings (numbers & aliases only)'}</span>
        </button>

        {showDetails && stats && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs animate-in fade-in duration-200">
            {/* Recent Doc Checks */}
            <div className="p-3 rounded-xl bg-white border border-amber-200 space-y-2">
              <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 block">
                Recent Quality Checks (Numbers Only, Never Images)
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {stats.recentDocChecks.length === 0 ? (
                  <p className="text-slate-400 text-[11px]">No quality checks recorded yet.</p>
                ) : (
                  stats.recentDocChecks.map((chk) => (
                    <div
                      key={chk.id}
                      className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px]"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 capitalize block">
                          Slot: {chk.slot.replace('_', ' ')}
                        </span>
                        <div className="flex items-center gap-2 text-slate-500 font-mono text-[10px]">
                          <span>Blur: {chk.blurScore}</span>
                          <span>•</span>
                          <span>Lum: {chk.brightnessScore}</span>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          chk.passed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {chk.passed ? 'Looks Good' : 'Retake'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Demo Help Requests */}
            <div className="p-3 rounded-xl bg-white border border-amber-200 space-y-2">
              <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 block">
                Recent Demo Help Requests (Demo Aliases Only)
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {stats.recentHelpRequests.length === 0 ? (
                  <p className="text-slate-400 text-[11px]">No demo bookings recorded yet.</p>
                ) : (
                  stats.recentHelpRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-2 rounded-lg bg-slate-50 border border-slate-100 space-y-1 text-[11px]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{req.applicantAlias}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-100 text-teal-800 font-semibold">
                          {req.supportType.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-500 text-[10px]">
                        <span>{req.requestedSlot}</span>
                        <span className="font-medium text-slate-600">{req.district}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Strict Privacy Guarantee Footnote */}
      <div className="flex items-center gap-2 text-[10px] text-amber-900/90 font-medium pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
        <span>
          Strict Privacy Guarantee: Numerical scores and demo aliases only. Never stores form-prep answers, Aadhaar, real phone numbers, or images.
        </span>
      </div>
    </div>
  );
};

export default DemoStatsPanel;
