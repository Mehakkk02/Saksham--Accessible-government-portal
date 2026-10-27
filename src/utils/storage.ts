/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Single Sanctioned Storage Helper for Saksham.
 *
 * PERMANENT GUARDRAILS:
 * 1. Personal data (form answers, applicant name, address, phone number, Aadhaar)
 *    must NEVER be persisted to localStorage or sessionStorage.
 * 2. Only non-sensitive interface preferences (theme, language preference, high contrast)
 *    may be stored.
 * 3. All browser storage operations must be routed through this helper.
 */

const FORBIDDEN_PERSONAL_KEYS = [
  'aadhaar',
  'phone',
  'mobile',
  'address',
  'name',
  'dob',
  'formprep',
  'form_data',
  'answers',
  'disability_detail',
];

function isPersonalDataKey(key: string): boolean {
  const normalized = key.toLowerCase();
  return FORBIDDEN_PERSONAL_KEYS.some((forbidden) => normalized.includes(forbidden));
}

export const appStorage = {
  getItem(key: string, storageType: 'local' | 'session' = 'local'): string | null {
    if (typeof window === 'undefined') return null;
    try {
      const storage = storageType === 'local' ? window.localStorage : window.sessionStorage;
      return storage.getItem(key);
    } catch {
      return null;
    }
  },

  setItem(key: string, value: string, storageType: 'local' | 'session' = 'local'): boolean {
    if (typeof window === 'undefined') return false;

    // Strict guardrail: Prevent storing personal data
    if (isPersonalDataKey(key)) {
      console.warn(`[Security Guardrail] Blocked persisting personal data key: "${key}"`);
      return false;
    }

    try {
      const storage = storageType === 'local' ? window.localStorage : window.sessionStorage;
      storage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },

  removeItem(key: string, storageType: 'local' | 'session' = 'local'): void {
    if (typeof window === 'undefined') return;
    try {
      const storage = storageType === 'local' ? window.localStorage : window.sessionStorage;
      storage.removeItem(key);
    } catch {
      // ignore
    }
  },

  clear(storageType: 'local' | 'session' = 'local'): void {
    if (typeof window === 'undefined') return;
    try {
      const storage = storageType === 'local' ? window.localStorage : window.sessionStorage;
      storage.clear();
    } catch {
      // ignore
    }
  },
};

export default appStorage;
