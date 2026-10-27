/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SpeechOptions {
  lang?: 'en' | 'hi';
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

let activeUtterance: SpeechSynthesisUtterance | null = null;

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function hasHindiVoice(): boolean {
  if (!isSpeechSupported()) return false;
  const voices = window.speechSynthesis.getVoices();
  return voices.some(
    (v) => v.lang.toLowerCase().startsWith('hi') || v.name.toLowerCase().includes('hindi')
  );
}

export function speakText(
  text: string,
  options: SpeechOptions = {}
): { started: boolean; missingHindiVoice?: boolean } {
  if (!isSpeechSupported()) {
    console.warn('SpeechSynthesis not available in this browser.');
    return { started: false };
  }

  // Cancel any ongoing speech
  stopSpeaking();

  const utterance = new SpeechSynthesisUtterance(text);
  const targetLang = options.lang || 'en';
  utterance.rate = options.rate ?? 0.95;
  utterance.pitch = options.pitch ?? 1.0;

  const voices = window.speechSynthesis.getVoices();
  let missingHindiVoice = false;

  if (targetLang === 'hi') {
    utterance.lang = 'hi-IN';
    const hiVoice = voices.find(
      (v) => v.lang.toLowerCase().startsWith('hi') || v.name.toLowerCase().includes('hindi')
    );
    if (hiVoice) {
      utterance.voice = hiVoice;
    } else {
      missingHindiVoice = true;
      // Fallback to natural Indian English or standard voice
      const indianEnVoice = voices.find((v) => v.lang.toLowerCase().includes('in'));
      if (indianEnVoice) {
        utterance.voice = indianEnVoice;
      }
    }
  } else {
    utterance.lang = 'en-US';
    const enVoice = voices.find(
      (v) =>
        (v.name.includes('Natural') ||
          v.name.includes('Google') ||
          v.name.includes('Samantha') ||
          v.lang.startsWith('en')) &&
        !v.name.includes('Compact')
    ) || voices[0];
    if (enVoice) {
      utterance.voice = enVoice;
    }
  }

  utterance.onstart = () => {
    options.onStart?.();
  };

  utterance.onend = () => {
    activeUtterance = null;
    options.onEnd?.();
  };

  utterance.onerror = (e) => {
    activeUtterance = null;
    options.onError?.(e);
  };

  activeUtterance = utterance;
  window.speechSynthesis.speak(utterance);

  return { started: true, missingHindiVoice };
}

export function stopSpeaking(): void {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
  activeUtterance = null;
}
