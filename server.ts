/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini SDK with server-side API key
const apiKey = process.env.GEMINI_API_KEY || '';
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
}

const SYSTEM_INSTRUCTION = `You are "Saksham Assistant", an empathetic, accessible guide for disabled citizens and caregivers in India applying for a Government Disability ID (UDID).
Reading level: Grade 5. Use simple, short, reassuring sentences. No complicated jargon or bureaucratese.

Allowed Topics:
1. Steps to get a UDID card:
   - Step 1: Register on the official portal (swavlambancard.gov.in).
   - Step 2: Fill application details (personal, address, disability category).
   - Step 3: Upload documents (photo, ID proof, address proof, medical papers).
   - Step 4: Get your application reference number.
   - Step 5: Visit the notified government hospital / CMO office with your printed receipt for medical assessment.
   - Step 6: Medical board verifies details.
   - Step 7: Approved e-UDID card is downloaded directly on the official portal.
2. Required documents: Passport photo with clear face, ID proof (Voter ID, PAN card, Ration card), address proof, and medical papers/certificate if already available. If no certificate exists, the hospital assesses them.
3. How to use Saksham: Preparing form answers beforehand, checking document clarity and reducing file size below 200 KB, getting visit checklists, and tracking portal stages. Note that Saksham does not submit applications or issue cards.
4. Fraud warning: Applying for a UDID on the official government portal is completely 100% FREE. Never pay any fee, money, or bribe to any agent, cyber cafe, or middleman.

Strict Rules & Boundaries:
- NEVER provide medical advice, diagnosis, or clinical opinions.
- NEVER state disability percentages or promise approval.
- NEVER state deadlines, card fees, or specific hospital appointments.
- NEVER ask for, accept, or process Aadhaar numbers, bank account numbers, OTPs, or passwords.
- If unsure or asked about unrelated topics, politely state that you can only guide on UDID steps, and recommend visiting https://www.swavlambancard.gov.in/ or the local District Welfare Office / CMO office.
- Answer in the language requested by the user: English or Hindi. Keep sentences brief and easy to read.`;

// Server-side Gemini API endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, language } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Server-side safety: strip common PII patterns if accidentally passed
    const sanitized = message
      .replace(/\b\d{4}\s?\d{4}\s?\d{4}\b/g, '[REDACTED_AADHAAR]')
      .replace(/\b\d{10}\b/g, '[REDACTED_PHONE]')
      .slice(0, 500); // limit length for safety

    const targetLang = language === 'hi' ? 'Hindi' : 'English';

    if (!aiClient) {
      // Graceful fallback if GEMINI_API_KEY is not configured
      const fallbackReply =
        language === 'hi'
          ? 'नमस्ते! UDID कार्ड के लिए आधिकारिक पोर्टल swavlambancard.gov.in पर 100% मुफ़्त आवेदन किया जा सकता है। आपको पासपोर्ट फ़ोटो, पहचान पत्र और पते के प्रमाण की आवश्यकता होगी। अस्पताल में सरकारी मेडिकल बोर्ड जाँच करके कार्ड जारी करता है।'
          : 'Hello! Applying for a UDID card on swavlambancard.gov.in is 100% free. You only need a clear passport photo, ID proof, address proof, and hospital medical assessment. Always check the official portal for official updates.';
      return res.json({ reply: fallbackReply });
    }

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AI response timed out')), 7000)
    );

    const callPromise = aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Please respond in ${targetLang}. User question: ${sanitized}`,
            },
          ],
        },
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        maxOutputTokens: 300,
        temperature: 0.3,
      },
    });

    const response = (await Promise.race([callPromise, timeoutPromise])) as any;
    const reply = response.text || '';
    return res.json({ reply });
  } catch (err: any) {
    console.error('Gemini API chat error:', err);
    const errorFallback =
      req.body.language === 'hi'
        ? 'क्षमा करें, उत्तर प्राप्त करने में समस्या हुई। कृपया आधिकारिक पोर्टल swavlambancard.gov.in पर देखें। UDID आवेदन पूर्णतः मुफ़्त है।'
        : 'Sorry, could not fetch answer right now. Please check the official portal at swavlambancard.gov.in. Applying is 100% free.';
    return res.json({ reply: errorFallback });
  }
});

// -----------------------------------------------------------------------------
// Demo Storage & KPI Tracking Endpoints (File-backed: data/demo_db.json)
// Zero PII, no Aadhaar, no contact numbers, no image data
// -----------------------------------------------------------------------------

import {
  readDemoDatabase,
  writeDemoDatabase,
  resetDemoDatabase,
  calculateDemoStats,
  validateHelpRequestInput,
  validateDocCheckInput,
  validateTrackerEventInput,
  validateKpiEventInput,
} from './src/server/demoDb.js';

// GET /api/demo/stats - returns live calculated KPI stats
app.get('/api/demo/stats', (_req: Request, res: Response) => {
  try {
    const stats = calculateDemoStats();
    return res.json(stats);
  } catch (err: any) {
    console.error('Error fetching demo stats:', err);
    return res.status(500).json({ error: 'Failed to compute demo stats' });
  }
});

// POST /api/demo/help-requests - records a demo booking (validated, demo alias only)
app.post('/api/demo/help-requests', (req: Request, res: Response) => {
  try {
    const validation = validateHelpRequestInput(req.body);
    if (!validation.isValid || !validation.cleanData) {
      return res.status(400).json({ error: validation.error || 'Invalid help request payload' });
    }

    const db = readDemoDatabase();
    const newRecord = {
      id: `req-${Date.now()}`,
      ...validation.cleanData,
      createdAt: new Date().toISOString(),
    };
    db.help_requests.push(newRecord);
    writeDemoDatabase(db);

    return res.status(201).json({ success: true, item: newRecord });
  } catch (err: any) {
    console.error('Error recording help request:', err);
    return res.status(500).json({ error: 'Failed to record help request' });
  }
});

// POST /api/demo/doc-checks - records numeric quality check metrics (never images)
app.post('/api/demo/doc-checks', (req: Request, res: Response) => {
  try {
    const validation = validateDocCheckInput(req.body);
    if (!validation.isValid || !validation.cleanData) {
      return res.status(400).json({ error: validation.error || 'Invalid doc check payload' });
    }

    const db = readDemoDatabase();
    const newRecord = {
      id: `chk-${Date.now()}`,
      ...validation.cleanData,
      checkedAt: new Date().toISOString(),
    };
    db.doc_checks.push(newRecord);
    writeDemoDatabase(db);

    return res.status(201).json({ success: true, item: newRecord });
  } catch (err: any) {
    console.error('Error recording doc check:', err);
    return res.status(500).json({ error: 'Failed to record doc check' });
  }
});

// POST /api/demo/tracker-events - records stage updates
app.post('/api/demo/tracker-events', (req: Request, res: Response) => {
  try {
    const validation = validateTrackerEventInput(req.body);
    if (!validation.isValid || !validation.cleanData) {
      return res.status(400).json({ error: validation.error || 'Invalid tracker event payload' });
    }

    const db = readDemoDatabase();
    const newRecord = {
      id: `tr-${Date.now()}`,
      ...validation.cleanData,
      timestamp: new Date().toISOString(),
    };
    db.tracker_events.push(newRecord);
    writeDemoDatabase(db);

    return res.status(201).json({ success: true, item: newRecord });
  } catch (err: any) {
    console.error('Error recording tracker event:', err);
    return res.status(500).json({ error: 'Failed to record tracker event' });
  }
});

// POST /api/demo/kpi-events - records onboarding start/completion timestamps
app.post('/api/demo/kpi-events', (req: Request, res: Response) => {
  try {
    const validation = validateKpiEventInput(req.body);
    if (!validation.isValid || !validation.cleanData) {
      return res.status(400).json({ error: validation.error || 'Invalid KPI event payload' });
    }

    const db = readDemoDatabase();
    const newRecord = {
      id: `kpi-${Date.now()}`,
      ...validation.cleanData,
      timestamp: new Date().toISOString(),
    };
    db.kpi_events.push(newRecord);
    writeDemoDatabase(db);

    return res.status(201).json({ success: true, item: newRecord });
  } catch (err: any) {
    console.error('Error recording KPI event:', err);
    return res.status(500).json({ error: 'Failed to record KPI event' });
  }
});

// POST /api/demo/reset - resets database back to default seed data
app.post('/api/demo/reset', (_req: Request, res: Response) => {
  try {
    resetDemoDatabase();
    const stats = calculateDemoStats();
    return res.json({ success: true, stats });
  } catch (err: any) {
    console.error('Error resetting demo database:', err);
    return res.status(500).json({ error: 'Failed to reset demo database' });
  }
});

// Setup Vite or Static File Serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Saksham server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
