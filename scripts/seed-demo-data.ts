/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Seed Script for Project Saksham Demo Database
 * Usage: tsx scripts/seed-demo-data.ts
 */

import { resetDemoDatabase, calculateDemoStats } from '../src/server/demoDb.js';

console.log('Seeding Project Saksham Demo Database (data/demo_db.json)...');
const freshDb = resetDemoDatabase();
const stats = calculateDemoStats();

console.log('✓ Demo Database successfully seeded!');
console.log('--- Summary Metrics ---');
console.log(`• Help Requests (Demo Bookings): ${freshDb.help_requests.length}`);
console.log(`• Document Checks: ${freshDb.doc_checks.length} (Pass Rate: ${stats.docPassRatePercent}%)`);
console.log(`• Tracker Events: ${freshDb.tracker_events.length}`);
console.log(`• KPI Events: ${freshDb.kpi_events.length} (Avg Onboarding Time: ${stats.formattedAvgOnboardingTime})`);
console.log('• Privacy Guarantee: Zero PII, no images, no Aadhaar, no contact numbers.');
