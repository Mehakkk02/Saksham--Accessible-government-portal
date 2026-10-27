/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  readDemoDatabase,
  resetDemoDatabase,
  writeDemoDatabase,
  calculateDemoStats,
  validateHelpRequestInput,
  validateDocCheckInput,
  validateTrackerEventInput,
  validateKpiEventInput,
} from './demoDb';

test('demoDb: seeds and reads the 4 required collections with demo data only', () => {
  const db = resetDemoDatabase();
  assert.ok(Array.isArray(db.help_requests));
  assert.ok(Array.isArray(db.doc_checks));
  assert.ok(Array.isArray(db.tracker_events));
  assert.ok(Array.isArray(db.kpi_events));
  assert.ok(db.help_requests.length > 0);
  assert.ok(db.doc_checks.length > 0);
  assert.ok(db.kpi_events.length > 0);
});

test('demoDb: calculateDemoStats calculates avg onboarding time and doc pass rate', () => {
  resetDemoDatabase();
  const stats = calculateDemoStats();
  assert.ok(typeof stats.avgOnboardingSeconds === 'number');
  assert.ok(stats.avgOnboardingSeconds > 0);
  assert.ok(stats.formattedAvgOnboardingTime.includes('m') || stats.formattedAvgOnboardingTime.includes('s'));
  assert.ok(typeof stats.docPassRatePercent === 'number');
  assert.ok(stats.docPassRatePercent >= 0 && stats.docPassRatePercent <= 100);
  assert.equal(stats.totalDocChecks, 10);
  // 8 passed out of 10 checks = 80.0%
  assert.equal(stats.docPassRatePercent, 80.0);
});

test('validateDocCheckInput: accepts valid numeric scores and rejects image payloads', () => {
  // Valid numerical check
  const valid = validateDocCheckInput({
    slot: 'photo',
    blurScore: 210.5,
    brightnessScore: 140.0,
    passed: true,
  });
  assert.equal(valid.isValid, true);
  assert.equal(valid.cleanData?.slot, 'photo');
  assert.equal(valid.cleanData?.blurScore, 210.5);

  // Rejects invalid slot
  const invalidSlot = validateDocCheckInput({
    slot: 'passport_scan_unknown',
    blurScore: 150,
    brightnessScore: 120,
    passed: true,
  });
  assert.equal(invalidSlot.isValid, false);

  // STRICT REJECTION: Rejects payload containing image / base64 / blob
  const imagePayload = validateDocCheckInput({
    slot: 'photo',
    blurScore: 200,
    brightnessScore: 120,
    passed: true,
    image: 'data:image/jpeg;base64,...',
  });
  assert.equal(imagePayload.isValid, false);
  assert.ok(imagePayload.error?.includes('Images must never leave the device'));
});

test('validateHelpRequestInput: rejects real phone numbers and Aadhaar numbers', () => {
  // Valid demo request with alias
  const valid = validateHelpRequestInput({
    applicantAlias: 'Applicant A-102',
    requestedSlot: 'Tomorrow 10:00 AM',
    supportType: 'doorstep_assessment',
    district: 'Nagpur',
  });
  assert.equal(valid.isValid, true);

  // Rejects 10-digit phone number in alias or slot
  const phonePayload = validateHelpRequestInput({
    applicantAlias: 'Applicant 9876543210',
    requestedSlot: 'Tomorrow 10:00 AM',
    supportType: 'doorstep_assessment',
    district: 'Nagpur',
  });
  assert.equal(phonePayload.isValid, false);
  assert.ok(phonePayload.error?.includes('forbidden contact numbers'));

  // Rejects 12-digit Aadhaar pattern
  const aadhaarPayload = validateHelpRequestInput({
    applicantAlias: 'Applicant 1234 5678 9012',
    requestedSlot: 'Tomorrow 10:00 AM',
    supportType: 'doorstep_assessment',
    district: 'Nagpur',
  });
  assert.equal(aadhaarPayload.isValid, false);
});

test('validateKpiEventInput: validates eventType and durationSeconds', () => {
  const valid = validateKpiEventInput({
    sessionId: 'sess-123',
    eventType: 'onboarding_completed',
    durationSeconds: 105,
  });
  assert.equal(valid.isValid, true);
  assert.equal(valid.cleanData?.durationSeconds, 105);

  const invalidType = validateKpiEventInput({
    sessionId: 'sess-123',
    eventType: 'unknown_event_type',
  });
  assert.equal(invalidType.isValid, false);
});
