/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  QUICK_CHECK_QUESTIONS,
  evaluateQuickCheck,
  QUICK_CHECK_DISCLAIMER_EN,
  QUICK_CHECK_DISCLAIMER_HI,
} from './quickCheck';

describe('Phase 4: What do I need? Quick Check', () => {
  test('defines exactly 5 plain-language questions with bilingual support', () => {
    assert.equal(QUICK_CHECK_QUESTIONS.length, 5);
    const ids = QUICK_CHECK_QUESTIONS.map((q) => q.id);
    assert.deepEqual(ids, [
      'difficulty',
      'sinceWhen',
      'doctorAssessed',
      'certificateStatus',
      'appliedBefore',
    ]);

    for (const q of QUICK_CHECK_QUESTIONS) {
      assert.ok(q.titleEn.length > 5);
      assert.ok(q.titleHi.length > 5);
      assert.ok(q.options.length >= 2);
      for (const opt of q.options) {
        assert.ok(opt.value);
        assert.ok(opt.labelEn);
        assert.ok(opt.labelHi);
      }
    }
  });

  test('routes to "documents" when user has a valid certificate', () => {
    const result = evaluateQuickCheck({
      difficulty: 'walking',
      sinceWhen: 'many_years',
      doctorAssessed: 'assessed_yes',
      certificateStatus: 'has_valid',
      appliedBefore: 'first_time',
    });

    assert.equal(result.route, 'documents');
    assert.equal(result.targetScreen, 'documents');
    assert.ok(result.titleEn.includes('start with documents'));
    assert.ok(result.summaryEn.includes('existing certificate'));
    assert.equal(result.disclaimerEn, QUICK_CHECK_DISCLAIMER_EN);
    assert.equal(result.disclaimerHi, QUICK_CHECK_DISCLAIMER_HI);
  });

  test('routes to "assessment" when user has never had a certificate or doctor check', () => {
    const result = evaluateQuickCheck({
      difficulty: 'seeing',
      sinceWhen: 'from_birth',
      doctorAssessed: 'assessed_no',
      certificateStatus: 'none',
      appliedBefore: 'first_time',
    });

    assert.equal(result.route, 'assessment');
    assert.equal(result.targetScreen, 'visit-help');
    assert.ok(result.titleEn.includes('assessment at a hospital'));
    assert.ok(result.summaryEn.includes('Will be assessed at hospital'));
  });

  test('routes to "help_centre" when status is expired or uncertain', () => {
    const result = evaluateQuickCheck({
      difficulty: 'hearing_speaking',
      sinceWhen: 'many_years',
      doctorAssessed: 'assessed_yes',
      certificateStatus: 'has_expired_old',
      appliedBefore: 'applied_before',
    });

    assert.equal(result.route, 'help_centre');
    assert.equal(result.targetScreen, 'visit-help');
    assert.ok(result.titleEn.includes('ask at a help centre'));
  });

  test('mandatory disclaimer is strictly non-diagnostic and emphasizes hospital decision', () => {
    assert.ok(QUICK_CHECK_DISCLAIMER_EN.includes('not a medical, legal or official eligibility decision'));
    assert.ok(QUICK_CHECK_DISCLAIMER_EN.includes('hospital makes all final decisions'));
    assert.ok(QUICK_CHECK_DISCLAIMER_HI.includes('मार्गदर्शन'));
    assert.ok(QUICK_CHECK_DISCLAIMER_HI.includes('अस्पताल'));
  });
});
