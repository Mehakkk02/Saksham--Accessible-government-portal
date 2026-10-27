/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Demo Data Storage & KPI Engine for Project Saksham
 * File-backed JSON store: data/demo_db.json
 *
 * GUARANTEES:
 * 1. Demo data ONLY: No real contact details, no Aadhaar, no form-prep answers.
 * 2. doc_checks stores numeric scores and pass/fail status only; NEVER images.
 * 3. Survives dev server restarts.
 * 4. Input validation rejects PII, phone numbers, and image payloads.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'demo_db.json');

export interface HelpRequest {
  id: string;
  applicantAlias: string;
  requestedSlot: string;
  supportType: 'doorstep_assessment' | 'hospital_escort' | 'caregiver_coordination';
  district: string;
  status: 'submitted_demo' | 'under_review_demo' | 'acknowledged_demo';
  createdAt: string;
}

export interface DocCheck {
  id: string;
  slot: 'photo' | 'id_proof' | 'address_proof' | 'certificate' | 'signature';
  blurScore: number;
  brightnessScore: number;
  passed: boolean;
  checkedAt: string;
}

export interface TrackerEvent {
  id: string;
  referenceAlias: string;
  stageId: string;
  stageTitle: string;
  status: 'completed' | 'in_progress' | 'corrections_requested';
  timestamp: string;
}

export interface KpiEvent {
  id: string;
  sessionId: string;
  eventType: 'onboarding_started' | 'onboarding_completed' | 'checklist_completed';
  durationSeconds?: number;
  timestamp: string;
}

export interface DemoDatabaseSchema {
  help_requests: HelpRequest[];
  doc_checks: DocCheck[];
  tracker_events: TrackerEvent[];
  kpi_events: KpiEvent[];
  updatedAt: string;
}

// Initial realistic seed dataset for Hackathon and Demonstration metrics
export const SEED_DATA: Omit<DemoDatabaseSchema, 'updatedAt'> = {
  help_requests: [
    {
      id: 'req-demo-101',
      applicantAlias: 'Applicant A-402',
      requestedSlot: 'Tomorrow, 10:00 AM - 12:00 PM',
      supportType: 'doorstep_assessment',
      district: 'Nagpur',
      status: 'submitted_demo',
      createdAt: '2026-10-27T07:15:00.000Z',
    },
    {
      id: 'req-demo-102',
      applicantAlias: 'Applicant M-108',
      requestedSlot: 'Day after, 02:00 PM - 04:00 PM',
      supportType: 'caregiver_coordination',
      district: 'South Delhi',
      status: 'under_review_demo',
      createdAt: '2026-10-27T08:30:00.000Z',
    },
    {
      id: 'req-demo-103',
      applicantAlias: 'Applicant R-715',
      requestedSlot: 'Tomorrow, 02:00 PM - 04:00 PM',
      supportType: 'hospital_escort',
      district: 'Jaipur',
      status: 'acknowledged_demo',
      createdAt: '2026-10-27T09:00:00.000Z',
    },
  ],
  doc_checks: [
    {
      id: 'chk-demo-01',
      slot: 'photo',
      blurScore: 248.5,
      brightnessScore: 138.0,
      passed: true,
      checkedAt: '2026-10-27T07:10:00.000Z',
    },
    {
      id: 'chk-demo-02',
      slot: 'id_proof',
      blurScore: 195.2,
      brightnessScore: 145.0,
      passed: true,
      checkedAt: '2026-10-27T07:11:30.000Z',
    },
    {
      id: 'chk-demo-03',
      slot: 'address_proof',
      blurScore: 215.8,
      brightnessScore: 120.0,
      passed: true,
      checkedAt: '2026-10-27T07:12:15.000Z',
    },
    {
      id: 'chk-demo-04',
      slot: 'certificate',
      blurScore: 42.1,
      brightnessScore: 110.0,
      passed: false,
      checkedAt: '2026-10-27T07:13:00.000Z',
    },
    {
      id: 'chk-demo-05',
      slot: 'certificate',
      blurScore: 260.4,
      brightnessScore: 142.0,
      passed: true,
      checkedAt: '2026-10-27T07:14:10.000Z',
    },
    {
      id: 'chk-demo-06',
      slot: 'signature',
      blurScore: 180.0,
      brightnessScore: 155.0,
      passed: true,
      checkedAt: '2026-10-27T07:14:40.000Z',
    },
    {
      id: 'chk-demo-07',
      slot: 'photo',
      blurScore: 38.5,
      brightnessScore: 45.0,
      passed: false,
      checkedAt: '2026-10-27T08:05:00.000Z',
    },
    {
      id: 'chk-demo-08',
      slot: 'photo',
      blurScore: 220.0,
      brightnessScore: 130.0,
      passed: true,
      checkedAt: '2026-10-27T08:06:15.000Z',
    },
    {
      id: 'chk-demo-09',
      slot: 'id_proof',
      blurScore: 235.0,
      brightnessScore: 140.0,
      passed: true,
      checkedAt: '2026-10-27T08:07:00.000Z',
    },
    {
      id: 'chk-demo-10',
      slot: 'address_proof',
      blurScore: 210.0,
      brightnessScore: 135.0,
      passed: true,
      checkedAt: '2026-10-27T08:08:00.000Z',
    },
  ],
  tracker_events: [
    {
      id: 'tr-demo-01',
      referenceAlias: 'UDID-2024-88912-DL',
      stageId: 'started',
      stageTitle: '1. Started in Saksham',
      status: 'completed',
      timestamp: '2026-10-27T07:00:00.000Z',
    },
    {
      id: 'tr-demo-02',
      referenceAlias: 'UDID-2024-88912-DL',
      stageId: 'documents_ready',
      stageTitle: '2. Documents ready',
      status: 'completed',
      timestamp: '2026-10-27T07:15:00.000Z',
    },
    {
      id: 'tr-demo-03',
      referenceAlias: 'UDID-2024-88912-DL',
      stageId: 'submitted_portal',
      stageTitle: '3. Submitted on the official portal',
      status: 'completed',
      timestamp: '2026-10-27T07:30:00.000Z',
    },
    {
      id: 'tr-demo-04',
      referenceAlias: 'UDID-2024-88912-DL',
      stageId: 'hospital_visit',
      stageTitle: '4. Visit hospital / CMO office',
      status: 'in_progress',
      timestamp: '2026-10-27T07:35:00.000Z',
    },
  ],
  kpi_events: [
    {
      id: 'kpi-01',
      sessionId: 'sess-demo-01',
      eventType: 'onboarding_started',
      timestamp: '2026-10-27T06:58:00.000Z',
    },
    {
      id: 'kpi-02',
      sessionId: 'sess-demo-01',
      eventType: 'onboarding_completed',
      durationSeconds: 98,
      timestamp: '2026-10-27T06:59:38.000Z',
    },
    {
      id: 'kpi-03',
      sessionId: 'sess-demo-02',
      eventType: 'onboarding_started',
      timestamp: '2026-10-27T07:45:00.000Z',
    },
    {
      id: 'kpi-04',
      sessionId: 'sess-demo-02',
      eventType: 'onboarding_completed',
      durationSeconds: 114,
      timestamp: '2026-10-27T07:46:54.000Z',
    },
    {
      id: 'kpi-05',
      sessionId: 'sess-demo-03',
      eventType: 'onboarding_started',
      timestamp: '2026-10-27T08:12:00.000Z',
    },
    {
      id: 'kpi-06',
      sessionId: 'sess-demo-03',
      eventType: 'onboarding_completed',
      durationSeconds: 84,
      timestamp: '2026-10-27T08:13:24.000Z',
    },
    {
      id: 'kpi-07',
      sessionId: 'sess-demo-04',
      eventType: 'onboarding_started',
      timestamp: '2026-10-27T09:10:00.000Z',
    },
    {
      id: 'kpi-08',
      sessionId: 'sess-demo-04',
      eventType: 'onboarding_completed',
      durationSeconds: 128,
      timestamp: '2026-10-27T09:12:08.000Z',
    },
  ],
};

function ensureDbFileExists(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const initialDb: DemoDatabaseSchema = {
      ...SEED_DATA,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
  }
}

export function readDemoDatabase(): DemoDatabaseSchema {
  ensureDbFileExists();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      help_requests: Array.isArray(parsed.help_requests) ? parsed.help_requests : [],
      doc_checks: Array.isArray(parsed.doc_checks) ? parsed.doc_checks : [],
      tracker_events: Array.isArray(parsed.tracker_events) ? parsed.tracker_events : [],
      kpi_events: Array.isArray(parsed.kpi_events) ? parsed.kpi_events : [],
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };
  } catch (err) {
    console.warn('Error reading demo_db.json, resetting to seed data:', err);
    const fallbackDb: DemoDatabaseSchema = {
      ...SEED_DATA,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(fallbackDb, null, 2), 'utf-8');
    return fallbackDb;
  }
}

export function writeDemoDatabase(db: DemoDatabaseSchema): void {
  ensureDbFileExists();
  db.updatedAt = new Date().toISOString();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

export function resetDemoDatabase(): DemoDatabaseSchema {
  ensureDbFileExists();
  const freshDb: DemoDatabaseSchema = {
    ...SEED_DATA,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(freshDb, null, 2), 'utf-8');
  return freshDb;
}

// -------------------------------------------------------------------------
// Strict Input Validation Rules
// -------------------------------------------------------------------------

const PII_PATTERNS = [
  /\b[6-9]\d{9}\b/, // Indian 10-digit phone
  /\b\d{4}\s?\d{4}\s?\d{4}\b/, // 12-digit Aadhaar pattern
  /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/, // email
];

export function validateHelpRequestInput(data: any): { isValid: boolean; error?: string; cleanData?: Omit<HelpRequest, 'id' | 'createdAt'> } {
  if (!data || typeof data !== 'object') {
    return { isValid: false, error: 'Request body must be an object' };
  }

  const applicantAlias = String(data.applicantAlias || '').trim();
  const requestedSlot = String(data.requestedSlot || '').trim();
  const supportType = String(data.supportType || '').trim();
  const district = String(data.district || '').trim();
  const status = (data.status as any) || 'submitted_demo';

  if (!applicantAlias || applicantAlias.length > 80) {
    return { isValid: false, error: 'Valid applicantAlias (max 80 chars) is required' };
  }
  if (!requestedSlot || requestedSlot.length > 100) {
    return { isValid: false, error: 'Valid requestedSlot is required' };
  }
  if (!['doorstep_assessment', 'hospital_escort', 'caregiver_coordination'].includes(supportType)) {
    return { isValid: false, error: 'Invalid supportType' };
  }
  if (!district || district.length > 60) {
    return { isValid: false, error: 'District name (max 60 chars) is required' };
  }
  if (!['submitted_demo', 'under_review_demo', 'acknowledged_demo'].includes(status)) {
    return { isValid: false, error: 'Invalid demo status' };
  }

  // Strict anti-PII check: reject if phone or aadhaar pattern is found in text
  const combined = `${applicantAlias} ${requestedSlot} ${district}`;
  for (const pattern of PII_PATTERNS) {
    if (pattern.test(combined)) {
      return { isValid: false, error: 'Input contains forbidden contact numbers or Aadhaar patterns. Demo aliases only.' };
    }
  }

  return {
    isValid: true,
    cleanData: {
      applicantAlias,
      requestedSlot,
      supportType: supportType as any,
      district,
      status: status as any,
    },
  };
}

export function validateDocCheckInput(data: any): { isValid: boolean; error?: string; cleanData?: Omit<DocCheck, 'id' | 'checkedAt'> } {
  if (!data || typeof data !== 'object') {
    return { isValid: false, error: 'Request body must be an object' };
  }

  // Reject any payload containing image data or binary fields
  if (data.image || data.photo || data.file || data.blob || data.previewUrl || data.base64) {
    return { isValid: false, error: 'Document checks accept numerical scores and status only. Images must never leave the device.' };
  }

  const validSlots = ['photo', 'id_proof', 'address_proof', 'certificate', 'signature'];
  if (!validSlots.includes(data.slot)) {
    return { isValid: false, error: `Invalid slot: must be one of ${validSlots.join(', ')}` };
  }

  const blurScore = Number(data.blurScore);
  const brightnessScore = Number(data.brightnessScore);
  const passed = Boolean(data.passed);

  if (!Number.isFinite(blurScore) || blurScore < 0 || blurScore > 10000) {
    return { isValid: false, error: 'blurScore must be a finite non-negative number' };
  }
  if (!Number.isFinite(brightnessScore) || brightnessScore < 0 || brightnessScore > 255) {
    return { isValid: false, error: 'brightnessScore must be between 0 and 255' };
  }

  return {
    isValid: true,
    cleanData: {
      slot: data.slot,
      blurScore: Number(blurScore.toFixed(1)),
      brightnessScore: Number(brightnessScore.toFixed(1)),
      passed,
    },
  };
}

export function validateTrackerEventInput(data: any): { isValid: boolean; error?: string; cleanData?: Omit<TrackerEvent, 'id' | 'timestamp'> } {
  if (!data || typeof data !== 'object') {
    return { isValid: false, error: 'Request body must be an object' };
  }

  const referenceAlias = String(data.referenceAlias || '').trim();
  const stageId = String(data.stageId || '').trim();
  const stageTitle = String(data.stageTitle || '').trim();
  const status = String(data.status || '').trim();

  if (!referenceAlias || referenceAlias.length > 50) {
    return { isValid: false, error: 'referenceAlias is required (e.g. UDID-DEMO-01)' };
  }
  if (!stageId || stageId.length > 50) {
    return { isValid: false, error: 'stageId is required' };
  }
  if (!stageTitle || stageTitle.length > 100) {
    return { isValid: false, error: 'stageTitle is required' };
  }
  if (!['completed', 'in_progress', 'corrections_requested'].includes(status)) {
    return { isValid: false, error: 'status must be completed, in_progress, or corrections_requested' };
  }

  return {
    isValid: true,
    cleanData: {
      referenceAlias,
      stageId,
      stageTitle,
      status: status as any,
    },
  };
}

export function validateKpiEventInput(data: any): { isValid: boolean; error?: string; cleanData?: Omit<KpiEvent, 'id' | 'timestamp'> } {
  if (!data || typeof data !== 'object') {
    return { isValid: false, error: 'Request body must be an object' };
  }

  const sessionId = String(data.sessionId || '').trim();
  const eventType = String(data.eventType || '').trim();
  const durationSeconds = data.durationSeconds !== undefined ? Number(data.durationSeconds) : undefined;

  if (!sessionId || sessionId.length > 80) {
    return { isValid: false, error: 'sessionId is required' };
  }
  if (!['onboarding_started', 'onboarding_completed', 'checklist_completed'].includes(eventType)) {
    return { isValid: false, error: 'Invalid eventType' };
  }
  if (durationSeconds !== undefined && (!Number.isFinite(durationSeconds) || durationSeconds < 0 || durationSeconds > 7200)) {
    return { isValid: false, error: 'durationSeconds must be a valid number between 0 and 7200' };
  }

  return {
    isValid: true,
    cleanData: {
      sessionId,
      eventType: eventType as any,
      durationSeconds: durationSeconds !== undefined ? Math.round(durationSeconds) : undefined,
    },
  };
}

// -------------------------------------------------------------------------
// KPI Calculation Engine for Demo Stats Panel
// -------------------------------------------------------------------------

export interface DemoStatsSummary {
  avgOnboardingSeconds: number;
  formattedAvgOnboardingTime: string;
  docPassRatePercent: number;
  totalDocChecks: number;
  totalHelpRequests: number;
  totalKpiEvents: number;
  totalTrackerEvents: number;
  recentDocChecks: DocCheck[];
  recentHelpRequests: HelpRequest[];
  updatedAt: string;
}

export function calculateDemoStats(): DemoStatsSummary {
  const db = readDemoDatabase();

  // 1. Average Onboarding Time from kpi_events
  const completedOnboardings = db.kpi_events.filter(
    (e) => e.eventType === 'onboarding_completed' && typeof e.durationSeconds === 'number' && e.durationSeconds > 0
  );
  const totalSeconds = completedOnboardings.reduce((sum, e) => sum + (e.durationSeconds || 0), 0);
  const avgOnboardingSeconds = completedOnboardings.length > 0
    ? Math.round(totalSeconds / completedOnboardings.length)
    : 0;

  const minutes = Math.floor(avgOnboardingSeconds / 60);
  const seconds = avgOnboardingSeconds % 60;
  const formattedAvgOnboardingTime = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  // 2. Document Pass Rate from doc_checks
  const totalDocChecks = db.doc_checks.length;
  const passedDocChecks = db.doc_checks.filter((d) => d.passed === true).length;
  const docPassRatePercent = totalDocChecks > 0
    ? Number(((passedDocChecks / totalDocChecks) * 100).toFixed(1))
    : 0;

  return {
    avgOnboardingSeconds,
    formattedAvgOnboardingTime,
    docPassRatePercent,
    totalDocChecks,
    totalHelpRequests: db.help_requests.length,
    totalKpiEvents: db.kpi_events.length,
    totalTrackerEvents: db.tracker_events.length,
    recentDocChecks: db.doc_checks.slice(-6).reverse(),
    recentHelpRequests: db.help_requests.slice(-6).reverse(),
    updatedAt: db.updatedAt,
  };
}
