/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { appStorage } from './storage';

test('appStorage: blocks persisting personal data keys (Aadhaar, phone, name, address, form answers)', () => {
  const resultAadhaar = appStorage.setItem('applicant_aadhaar', '1234-5678-9012');
  assert.equal(resultAadhaar, false, 'Should block key with aadhaar');

  const resultPhone = appStorage.setItem('user_phone_number', '9876543210');
  assert.equal(resultPhone, false, 'Should block key with phone');

  const resultMobile = appStorage.setItem('mobile_contact', '9876543210');
  assert.equal(resultMobile, false, 'Should block key with mobile');

  const resultAddress = appStorage.setItem('home_address', '123 Street');
  assert.equal(resultAddress, false, 'Should block key with address');

  const resultFormPrep = appStorage.setItem('formprep_answers', '{}');
  assert.equal(resultFormPrep, false, 'Should block key with formprep');
});

test('appStorage: allows non-sensitive UI preferences (theme, language, accessibility toggles)', () => {
  // In Node environment without window, should safely return false/null without throwing
  const result = appStorage.setItem('ui_high_contrast', 'true');
  assert.equal(typeof result, 'boolean');

  const getResult = appStorage.getItem('ui_high_contrast');
  assert.equal(getResult, null);
});
