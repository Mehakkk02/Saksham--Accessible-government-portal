/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_FORM_PREP_DATA,
  validateMobileNumber,
  validatePinCode,
  generateAnswerList,
  formatAllAnswersText,
  DISABILITY_CATEGORIES_PLAIN,
  type FormPrepData,
} from './formPrep';

test('Strict Privacy Audit: FormPrepData never requests or contains Aadhaar number, bank details, OTP, or password', () => {
  const keys = Object.keys(INITIAL_FORM_PREP_DATA);

  // Assert none of the restricted terms exist in the form data keys
  const forbiddenPatterns = ['aadhaar', 'bank', 'account', 'ifsc', 'otp', 'password', 'pin_secret'];
  for (const key of keys) {
    const lowerKey = key.toLowerCase();
    for (const pattern of forbiddenPatterns) {
      assert.ok(
        !lowerKey.includes(pattern),
        `Privacy violation: found forbidden pattern "${pattern}" in key "${key}"`
      );
    }
  }
});

test('validateMobileNumber checks for valid 10-digit Indian numbers', () => {
  assert.equal(validateMobileNumber('').isValid, false);
  assert.equal(validateMobileNumber('12345').isValid, false);
  assert.equal(validateMobileNumber('98765432101').isValid, false); // 11 digits

  const valid = validateMobileNumber('9876543210');
  assert.equal(valid.isValid, true);

  const formattedValid = validateMobileNumber('+91 98765-43210');
  assert.equal(formattedValid.isValid, true);
});

test('validatePinCode checks for valid 6-digit Indian PIN codes', () => {
  assert.equal(validatePinCode('').isValid, false);
  assert.equal(validatePinCode('1100').isValid, false);
  assert.equal(validatePinCode('1100019').isValid, false);

  const valid = validatePinCode('110001');
  assert.equal(valid.isValid, true);
});

test('Disability categories include plain language options and "Not sure, ask the doctor"', () => {
  const notSure = DISABILITY_CATEGORIES_PLAIN.find((c) => c.id === 'not_sure');
  assert.ok(notSure);
  assert.equal(notSure.labelEn, 'Not sure, ask the doctor');
  assert.equal(notSure.labelHi, 'पक्का नहीं पता, डॉक्टर से पूछेंगे');
});

test('generateAnswerList and formatAllAnswersText produce clean copyable cheat sheet', () => {
  const sampleData: FormPrepData = {
    fillingFor: 'someone_else',
    caregiverName: 'Priya Sharma',
    caregiverRelation: 'Daughter',
    applicantConsent: true,
    fullName: 'Ramesh Sharma',
    dob: '1965-05-12',
    gender: 'male',
    mobileNumber: '9876543210',
    email: 'ramesh@example.com',
    state: 'Delhi',
    district: 'South Delhi',
    villageTown: 'Saket',
    pinCode: '110017',
    disabilityCategory: 'Locomotor / Physical movement disability',
    isNotSureDisability: false,
    hospitalChoice: 'AIIMS New Delhi',
    isHospitalNotDecided: false,
  };

  const listEn = generateAnswerList(sampleData, 'en');
  assert.ok(listEn.length >= 10);

  const nameField = listEn.find((f) => f.fieldId === 'fullName');
  assert.equal(nameField?.value, 'Ramesh Sharma');

  const textAll = formatAllAnswersText(sampleData, 'en');
  assert.ok(textAll.includes('Ramesh Sharma'));
  assert.ok(textAll.includes('AIIMS New Delhi'));
  assert.ok(textAll.includes('Priya Sharma'));
  assert.ok(textAll.includes('swavlambancard.gov.in'));
});
