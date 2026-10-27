/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  getWhatToCarryChecklist,
  generateHospitalRequestMessage,
  generateHelpCentersShareText,
  FRAUD_WARNING,
  PERMANENT_VS_TEMPORARY_INFO,
  GLOSSARY_ITEMS,
} from './visitPrep';

describe('Visit Preparation & Safety Utilities', () => {
  it('generates basic what to carry checklist without caregiver', () => {
    const list = getWhatToCarryChecklist({ hasCaregiver: false });
    assert.equal(list.length, 4);
    const ids = list.map((i) => i.id);
    assert.ok(ids.includes('portal_receipt'));
    assert.ok(ids.includes('original_id'));
    assert.ok(ids.includes('medical_reports'));
    assert.ok(ids.includes('passport_photos'));
    assert.ok(!ids.includes('caregiver_id'));
  });

  it('includes caregiver ID when hasCaregiver is true', () => {
    const list = getWhatToCarryChecklist({ hasCaregiver: true });
    assert.equal(list.length, 5);
    const ids = list.map((i) => i.id);
    assert.ok(ids.includes('caregiver_id'));
    const caregiverItem = list.find((i) => i.id === 'caregiver_id');
    assert.equal(caregiverItem?.isCaregiverSpecific, true);
    assert.equal(caregiverItem?.required, true);
  });

  it('formats hospital request message politely in English', () => {
    const msg = generateHospitalRequestMessage({
      applicantName: 'Ramesh Kumar',
      preferredSlot: 'Morning (10:00 AM - 12:00 PM)',
      referenceNumber: 'MH-2026-99881',
      language: 'en',
    });
    assert.ok(msg.includes('Ramesh Kumar'));
    assert.ok(msg.includes('MH-2026-99881'));
    assert.ok(msg.includes('Morning (10:00 AM - 12:00 PM)'));
    assert.ok(msg.includes('Chief Medical Officer'));
    assert.ok(msg.includes('doorstep / home medical assessment'));
  });

  it('formats hospital request message politely in Hindi', () => {
    const msg = generateHospitalRequestMessage({
      applicantName: 'सुनील शर्मा',
      preferredSlot: 'दोपहर 2 बजे',
      language: 'hi',
    });
    assert.ok(msg.includes('सुनील शर्मा'));
    assert.ok(msg.includes('गृह-मूल्यांकन'));
    assert.ok(msg.includes('दोपहर 2 बजे'));
  });

  it('generates shareable help centers text for caregiver', () => {
    const textEn = generateHelpCentersShareText('en');
    assert.ok(textEn.includes('Common Service Centres'));
    assert.ok(textEn.includes('Sewa Kendras'));
    assert.ok(textEn.includes('District Social Welfare'));
    assert.ok(textEn.includes('free'));

    const textHi = generateHelpCentersShareText('hi');
    assert.ok(textHi.includes('कॉमन सर्विस सेंटर'));
    assert.ok(textHi.includes('निःशुल्क'));
  });

  it('validates fraud warning text in both languages', () => {
    assert.ok(FRAUD_WARNING.en.includes('Applying is free'));
    assert.ok(FRAUD_WARNING.en.includes('Never pay anyone'));
    assert.ok(FRAUD_WARNING.hi.includes('मुफ्त'));
  });

  it('contains all 5 mandatory glossary terms with plain meanings', () => {
    const requiredTerms = ['udid', 'cmo', 'notified_hospital', 'assessment', 'reference_number'];
    const glossaryIds = GLOSSARY_ITEMS.map((g) => g.id);
    for (const term of requiredTerms) {
      assert.ok(glossaryIds.includes(term), `Missing glossary term: ${term}`);
    }
  });

  it('validates permanent vs temporary explainer information', () => {
    assert.ok(PERMANENT_VS_TEMPORARY_INFO.disclaimer.en.includes('General information'));
    assert.ok(PERMANENT_VS_TEMPORARY_INFO.permanent.title.en.includes('Permanent'));
    assert.ok(PERMANENT_VS_TEMPORARY_INFO.temporary.title.en.includes('Temporary'));
  });
});
