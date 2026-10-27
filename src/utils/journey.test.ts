import test from 'node:test';
import assert from 'node:assert/strict';
import {
  JOURNEY_STEPS,
  isBookHelpNeeded,
  isVisitHelpNeeded,
  checkStepReachability,
  isStepCompleted,
  normalizeJourneyStep,
} from './journey';

test('JOURNEY_STEPS defines the 5 canonical steps: Barriers -> Document -> Book help -> Track -> Summary', () => {
  assert.equal(JOURNEY_STEPS.length, 5);
  const ids = JOURNEY_STEPS.map((s) => s.id);
  assert.deepEqual(ids, ['barriers', 'document', 'book-help', 'track', 'summary']);

  const labels = JOURNEY_STEPS.map((s) => s.label);
  assert.deepEqual(labels, ['Barriers', 'Document', 'Book help', 'Track', 'Summary']);
});

test('Book help step description specifies Help request demo label', () => {
  const bookHelp = JOURNEY_STEPS.find((s) => s.id === 'book-help');
  assert.ok(bookHelp);
  assert.match(bookHelp.description, /Help request \(demo\): the hospital still decides the date/);
});

test('isBookHelpNeeded is true only when travel or caregiver is selected', () => {
  // Reading & hearing only -> Book help is skipped (not needed)
  assert.equal(isBookHelpNeeded(['reading', 'hearing']), false);
  assert.equal(isBookHelpNeeded([]), false);

  // Travel selected -> Book help is needed
  assert.equal(isBookHelpNeeded(['travel']), true);
  assert.equal(isBookHelpNeeded(['reading', 'travel']), true);

  // Caregiver selected -> Book help is needed
  assert.equal(isBookHelpNeeded(['caregiver']), true);
  assert.equal(isBookHelpNeeded(['caregiver', 'hearing']), true);

  // Alias compatibility
  assert.equal(isVisitHelpNeeded(['travel']), true);
});

test('checkStepReachability disables Step 4 and 5 with a reason when document scan not passed', () => {
  const contextNotPassed = {
    barriers: ['reading'] as any,
    scanPassed: false,
    bookingStatus: 'idle',
  };

  const trackReachability = checkStepReachability('track', contextNotPassed);
  assert.equal(trackReachability.allowed, false);
  assert.ok(trackReachability.reason?.includes('Complete document readiness check'));

  const summaryReachability = checkStepReachability('summary', contextNotPassed);
  assert.equal(summaryReachability.allowed, false);
  assert.ok(summaryReachability.reason?.includes('Complete document readiness check'));

  // When scan passed, track and summary are reachable
  const contextPassed = {
    barriers: ['reading'] as any,
    scanPassed: true,
    bookingStatus: 'idle',
  };
  assert.equal(checkStepReachability('track', contextPassed).allowed, true);
  assert.equal(checkStepReachability('summary', contextPassed).allowed, true);
});

test('normalizeJourneyStep maps screen aliases to canonical 5 steps', () => {
  assert.equal(normalizeJourneyStep('onboarding'), 'barriers');
  assert.equal(normalizeJourneyStep('barriers'), 'barriers');
  assert.equal(normalizeJourneyStep('document'), 'document');
  assert.equal(normalizeJourneyStep('documents'), 'document');
  assert.equal(normalizeJourneyStep('book-help'), 'book-help');
  assert.equal(normalizeJourneyStep('visit-help'), 'book-help');
  assert.equal(normalizeJourneyStep('track'), 'track');
  assert.equal(normalizeJourneyStep('summary'), 'summary');
  assert.equal(normalizeJourneyStep('dashboard'), 'summary');
});

test('isStepCompleted marks completed steps with an icon correctly', () => {
  const context = {
    barriers: ['travel'] as any,
    scanPassed: true,
    bookingStatus: 'confirmed',
  };

  // If currently on summary: barriers, document, book-help, track are completed
  assert.equal(isStepCompleted('barriers', 'summary', context), true);
  assert.equal(isStepCompleted('document', 'summary', context), true);
  assert.equal(isStepCompleted('book-help', 'summary', context), true);
  assert.equal(isStepCompleted('track', 'summary', context), true);
  assert.equal(isStepCompleted('summary', 'summary', context), false);
});
