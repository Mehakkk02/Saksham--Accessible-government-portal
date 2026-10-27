import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeAccommodations,
  evaluateDocument,
  BARRIERS_DATA,
} from './accessibility';

test('BARRIERS_DATA has 4 required accessible cards', () => {
  assert.equal(BARRIERS_DATA.length, 4);
  const ids = BARRIERS_DATA.map((b) => b.id);
  assert.deepEqual(ids, ['reading', 'hearing', 'travel', 'caregiver']);
});

test('computeAccommodations turns on corresponding adaptations', () => {
  const result1 = computeAccommodations(['reading', 'travel']);
  assert.equal(result1.largeText, true);
  assert.equal(result1.doorstepAssistance, true);
  assert.equal(result1.visualAlertsOnly, false);
  assert.equal(result1.caregiverCoSign, false);
  assert.equal(result1.activeBarrierCount, 2);

  const resultAll = computeAccommodations(['reading', 'hearing', 'travel', 'caregiver']);
  assert.equal(resultAll.largeText, true);
  assert.equal(resultAll.visualAlertsOnly, true);
  assert.equal(resultAll.doorstepAssistance, true);
  assert.equal(resultAll.caregiverCoSign, true);
  assert.equal(resultAll.activeBarrierCount, 4);
});

test('evaluateDocument produces valid verification for clear document', () => {
  const validDoc = evaluateDocument({
    hasHospitalSeal: true,
    isClearResolution: true,
    hasMedicalRegNumber: true,
    hasDisabilityPercent: true,
  });

  assert.equal(validDoc.isValid, true);
  assert.equal(validDoc.badge, 'AUTHENTIC');
  assert.ok(validDoc.confidenceScore > 90);
  assert.ok(validDoc.extractedData?.applicantName);
});

test('evaluateDocument produces helpful plain-language feedback on missing seal or blur', () => {
  const blurryDoc = evaluateDocument({
    hasHospitalSeal: false,
    isClearResolution: false,
    hasMedicalRegNumber: true,
    hasDisabilityPercent: true,
  });

  assert.equal(blurryDoc.isValid, false);
  assert.equal(blurryDoc.badge, 'NEEDS_RESUBMISSION');
  assert.ok(blurryDoc.feedbackMessage.includes('hospital or medical board seal'));
  assert.ok(blurryDoc.missingItems && blurryDoc.missingItems.length >= 2);
});
