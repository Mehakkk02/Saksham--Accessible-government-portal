/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PORTAL_STAGES,
  getStageStatus,
  getNextSimulatedStage,
  type PortalTimelineContext,
} from './portalTimeline';

test('PORTAL_STAGES mirrors the 7 official portal stages in order', () => {
  assert.equal(PORTAL_STAGES.length, 7);
  const ids = PORTAL_STAGES.map((s) => s.id);
  assert.deepEqual(ids, [
    'started',
    'documents_ready',
    'submitted_portal',
    'hospital_visit',
    'verification',
    'approved',
    'ready_download',
  ]);

  assert.equal(PORTAL_STAGES[0].title, '1. Started in Saksham');
  assert.equal(PORTAL_STAGES[1].title, '2. Documents ready');
  assert.equal(PORTAL_STAGES[2].title, '3. Submitted on the official portal');
  assert.equal(PORTAL_STAGES[3].title, '4. Visit hospital / CMO office (with printed receipt)');
  assert.equal(PORTAL_STAGES[4].title, '5. Verification and assessment');
  assert.equal(PORTAL_STAGES[5].title, '6. Approved');
  assert.equal(PORTAL_STAGES[6].title, '7. e-UDID ready to download on the portal');
});

test('Stages 1-2 derive from app state', () => {
  const initialContext: PortalTimelineContext = {
    scanPassed: false,
    isPortalSubmitted: false,
    portalReferenceNumber: 'UDID-2024-88912-DL',
    hasVisitedHospital: false,
    demoAdvancedStage: 'none',
    correctionsRequested: false,
  };

  // Stage 1 is completed
  assert.equal(getStageStatus('started', initialContext), 'completed');
  // Stage 2 is current because scan not yet passed
  assert.equal(getStageStatus('documents_ready', initialContext), 'current');
  // Stage 3 is locked because documents not ready
  assert.equal(getStageStatus('submitted_portal', initialContext), 'locked');

  // Once scan passes, Stage 2 becomes completed
  const scanDoneContext: PortalTimelineContext = {
    ...initialContext,
    scanPassed: true,
  };
  assert.equal(getStageStatus('documents_ready', scanDoneContext), 'completed');
  assert.equal(getStageStatus('submitted_portal', scanDoneContext), 'current');
});

test('Stages 3-4 are user-confirmed', () => {
  const contextBeforeSubmit: PortalTimelineContext = {
    scanPassed: true,
    isPortalSubmitted: false,
    portalReferenceNumber: 'UDID-2024-88912-DL',
    hasVisitedHospital: false,
    demoAdvancedStage: 'none',
    correctionsRequested: false,
  };

  assert.equal(getStageStatus('submitted_portal', contextBeforeSubmit), 'current');
  assert.equal(getStageStatus('hospital_visit', contextBeforeSubmit), 'locked');

  // User confirms stage 3
  const contextSubmitted: PortalTimelineContext = {
    ...contextBeforeSubmit,
    isPortalSubmitted: true,
  };
  assert.equal(getStageStatus('submitted_portal', contextSubmitted), 'completed');
  assert.equal(getStageStatus('hospital_visit', contextSubmitted), 'current');

  // User confirms stage 4
  const contextVisited: PortalTimelineContext = {
    ...contextSubmitted,
    hasVisitedHospital: true,
  };
  assert.equal(getStageStatus('hospital_visit', contextVisited), 'completed');
  assert.equal(getStageStatus('verification', contextVisited), 'current');
});

test('Stages 5-7 advance only through demo tools simulation', () => {
  const visitedContext: PortalTimelineContext = {
    scanPassed: true,
    isPortalSubmitted: true,
    portalReferenceNumber: 'UDID-2024-88912-DL',
    hasVisitedHospital: true,
    demoAdvancedStage: 'none',
    correctionsRequested: false,
  };

  // Initially at verification (not yet advanced by demo)
  assert.equal(getStageStatus('approved', visitedContext), 'locked');
  assert.equal(getStageStatus('ready_download', visitedContext), 'locked');

  // Advance to verification via demo
  const stage1 = getNextSimulatedStage(visitedContext.demoAdvancedStage, visitedContext.hasVisitedHospital);
  assert.equal(stage1, 'verification');

  // Advance to approved via demo
  const stage2 = getNextSimulatedStage(stage1, true);
  assert.equal(stage2, 'approved');

  const approvedContext: PortalTimelineContext = {
    ...visitedContext,
    demoAdvancedStage: 'approved',
  };
  assert.equal(getStageStatus('verification', approvedContext), 'completed');
  assert.equal(getStageStatus('approved', approvedContext), 'current');
  assert.equal(getStageStatus('ready_download', approvedContext), 'locked');

  // Advance to ready_download via demo
  const stage3 = getNextSimulatedStage(stage2, true);
  assert.equal(stage3, 'ready_download');

  const downloadedContext: PortalTimelineContext = {
    ...visitedContext,
    demoAdvancedStage: 'ready_download',
  };
  assert.equal(getStageStatus('approved', downloadedContext), 'completed');
  assert.equal(getStageStatus('ready_download', downloadedContext), 'completed');
});

test('Corrections requested branch produces corrections_requested status for stage 5', () => {
  const correctionsContext: PortalTimelineContext = {
    scanPassed: true,
    isPortalSubmitted: true,
    portalReferenceNumber: 'UDID-2024-88912-DL',
    hasVisitedHospital: true,
    demoAdvancedStage: 'verification',
    correctionsRequested: true,
    correctionReason: 'Medical board requested re-verification of doctor seal',
  };

  assert.equal(getStageStatus('verification', correctionsContext), 'corrections_requested');
});
