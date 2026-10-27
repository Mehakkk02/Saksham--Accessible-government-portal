/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DOCUMENT_SLOTS,
  calculateReadiness,
  getDiagnosticMessage,
  getSlotSpeechText,
  INITIAL_DOCUMENTS_STATE,
  type DocumentSlotRecord,
  type SlotId,
} from './documentChecklist';
import { MAX_UPLOAD_KB } from '../../lib/config';

test('DOCUMENT_SLOTS defines the 5 required slots with bilingual metadata', () => {
  assert.equal(DOCUMENT_SLOTS.length, 5);

  const slotIds = DOCUMENT_SLOTS.map((s) => s.id);
  assert.deepEqual(slotIds, ['photo', 'id_proof', 'address_proof', 'certificate', 'signature']);

  // Slot 1: Passport-size photo
  assert.equal(DOCUMENT_SLOTS[0].titleEn, 'Passport-size photo');
  assert.equal(DOCUMENT_SLOTS[0].isMandatory, true);

  // Slot 2: ID proof
  assert.equal(DOCUMENT_SLOTS[1].titleEn, 'ID proof');
  assert.equal(DOCUMENT_SLOTS[1].isMandatory, true);

  // Slot 3: Address proof
  assert.equal(DOCUMENT_SLOTS[2].titleEn, 'Address proof');
  assert.equal(DOCUMENT_SLOTS[2].isMandatory, true);

  // Slot 4: Disability certificate with hospital assessment option
  assert.equal(DOCUMENT_SLOTS[3].titleEn, 'Disability / medical certificate');
  assert.equal(DOCUMENT_SLOTS[3].allowHospitalAssessment, true);

  // Slot 5: Signature conditional
  assert.equal(DOCUMENT_SLOTS[4].titleEn, 'Signature or thumb impression');
  assert.ok(DOCUMENT_SLOTS[4].conditionalNoteEn?.includes("Only if the portal asks"));
});

test('MAX_UPLOAD_KB is set to 200 in lib/config', () => {
  assert.equal(MAX_UPLOAD_KB, 200);
});

test('calculateReadiness accurately computes ready count and continuation requirements', () => {
  // Initial empty state: 0 ready, cannot continue
  const initial = calculateReadiness(INITIAL_DOCUMENTS_STATE);
  assert.equal(initial.readyCount, 0);
  assert.equal(initial.canContinue, false);
  assert.equal(initial.statusSummaryEn, '0 of 5 ready');

  // Photo, ID, and Address good, certificate hospital assessed
  const readyDocs: Record<SlotId, DocumentSlotRecord> = {
    photo: { slotId: 'photo', status: 'looks_good' },
    id_proof: { slotId: 'id_proof', status: 'looks_good' },
    address_proof: { slotId: 'address_proof', status: 'looks_good' },
    certificate: { slotId: 'certificate', status: 'skipped', isHospitalAssessment: true },
    signature: { slotId: 'signature', status: 'not_added' },
  };

  const readiness = calculateReadiness(readyDocs);
  assert.equal(readiness.readyCount, 4);
  assert.equal(readiness.isMandatoryReady, true);
  assert.equal(readiness.canContinue, true);
  assert.equal(readiness.statusSummaryEn, '4 of 5 ready');
  assert.equal(readiness.statusSummaryHi, '5 में से 4 तैयार हैं');
});

test('getDiagnosticMessage strictly adheres to "Photo looks clear" and never claims "verified"', () => {
  const successEn = getDiagnosticMessage(true, undefined, 'en');
  assert.equal(successEn.text, 'Photo looks clear');
  assert.ok(!successEn.text.toLowerCase().includes('verified'));
  assert.ok(!successEn.text.toLowerCase().includes('genuine'));

  const blurEn = getDiagnosticMessage(false, 'blur', 'en');
  assert.equal(blurEn.text, 'Too blurry. Hold the phone steady and tap to focus.');

  const blurHi = getDiagnosticMessage(false, 'blur', 'hi');
  assert.ok(blurHi.text.includes('धुंधली'));
});

test('getSlotSpeechText provides accessible spoken strings in EN and HI', () => {
  const photoSlot = DOCUMENT_SLOTS[0];
  const record: DocumentSlotRecord = {
    slotId: 'photo',
    status: 'looks_good',
  };

  const textEn = getSlotSpeechText(photoSlot, record, 'en');
  assert.ok(textEn.includes('Passport-size photo'));
  assert.ok(textEn.includes('Photo looks clear'));

  const textHi = getSlotSpeechText(photoSlot, record, 'hi');
  assert.ok(textHi.includes('पासपोर्ट साइज फोटो'));
  assert.ok(textHi.includes('फोटो स्पष्ट दिख रही है'));
});
