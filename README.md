# Saksham (सक्षम) — Accessible Government ID Portal

> **An empathetic, barrier-free accessibility companion for citizens and caregivers applying for a Government Disability ID (UDID).**

[![WCAG 2.1 AA Compliant](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-success?style=flat-square)](docs/manual-qa.md)
[![Zero-PII Architecture](https://img.shields.io/badge/Privacy-Zero--PII%20Guaranteed-blue?style=flat-square)](#privacy--safety-first-architecture)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20%20LTS%20%7C%2022%20LTS-green?style=flat-square)](https://nodejs.org)
[![React 19](https://img.shields.io/badge/React-19-61dafb?style=flat-square)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square)](https://www.typescriptlang.org)

---

## 🌟 The Problem & The Solution

### The Challenge
In India, the **Unique Disability ID (UDID / Swavlamban)** is essential for persons with disabilities to access welfare pensions, 75% rail concessions, assistive equipment under ADIP, and income tax exemptions. However, the official portal application process poses steep barriers:
- **High Document Rejection Rates:** Citizens travel long distances to internet cafes, only to have uploads rejected due to blur, poor lighting, or file sizes exceeding the 200 KB government portal limit.
- **Cognitive & Language Friction:** Long, complex forms with bureaucratic terminology.
- **Predatory Middlemen:** Scammers charging fees for a government process that is **100% free**.
- **Mobility Barriers:** Severe disabilities preventing physical hospital visits without knowing they can request doorstep assessment.

### The Solution: Saksham
Saksham is a **dignified pre-application companion** built from the ground up for full accessibility:
1. **Client-Side Document Readiness:** Tests document clarity (blur, lighting, resolution) and downsizes images to under 200 KB *directly on your device*—images never leave the phone or computer.
2. **Form Prep Buddy & Cheat Sheet:** A simple, one-question-at-a-time wizard in Grade 5 language (English & Hindi) that outputs a copyable and printable cheat sheet.
3. **Doorstep & Hospital Visit Preparation:** Generates copyable, respectful request letters to Chief Medical Officers (CMO) for home assessment, interactive packing checklists, and local help center directories.
4. **7-Stage Timeline Tracker:** Accurately mirrors official portal stages from submission to e-UDID download, including resolution guidance for medical board correction requests.
5. **Ask Saksham AI Assistant:** A safety-grounded Gemini 3.8 Flash helper that explains rules, documents, and hospital steps without jargon.

---

## 🚀 Key Features

| Feature | Description |
| :--- | :--- |
| **Multi-Barrier Onboarding** | Instant UI adaptation for *Reading* (Large font, High-Contrast, Voice-first), *Hearing* (Captions, visual cues), *Travel* (Doorstep help), and *Caregiver* (Co-applicant mode). |
| **Bilingual Support** | Instant toggle between **English (EN)** and **हिन्दी (HI)** with complete 100% dictionary key parity. |
| **Voice-First Narration** | Web Speech API speech assistant reads any screen, glossary item, or question aloud with pause/resume controls. |
| **High-Contrast & Font Scaler** | WCAG AAA 7:1 contrast mode (black background with crisp yellow borders) and 3-stage font scaling (`A`, `A+`, `A++`). |
| **5-Slot Document Readiness** | Checks Passport Photo, ID Proof, Address Proof, Certificate, and Signature with in-memory Canvas Laplacian blur variance and luminance checking. |
| **Under 200 KB Compressor** | In-browser Canvas compressor scales down oversized camera photos to under 200 KB with instant download. |
| **"What do I need?" Quick Check** | 5-question triage modal routing citizens to document prep, hospital assessment, or local help centers. |
| **Official Timeline Tracker** | 7 portal stages from *Started in Saksham* through *e-UDID Ready* with an interactive *Corrections Requested* simulation. |
| **Demo Stats & KPI Engine** | File-backed server storage (`data/demo_db.json`) calculating live Average Onboarding Duration and Document Pass Rates. |
| **In-Browser Self-Test Diagnostics** | 6-point automated browser diagnostics suite verifying canvas CV, aria-live regions, zero-network leaks, adaptations, i18n parity, and speech dispatch. |

---

## 🔒 Privacy & Safety-First Architecture

Project Saksham strictly enforces zero-PII storage:

1. **Images Never Leave the Device:**
   - All document blur, lighting, and compression checks execute inside an HTML5 `<canvas>` in the browser. No image, blob, or base64 data is ever transmitted to the server or any external API.
2. **Volatile Form Prep Memory:**
   - Form-prep answers (name, date of birth, contact details) exist only in browser memory and are wiped when the tab closes or when clicking **"Clear my data"**.
   - Saksham **never asks for or stores** Aadhaar numbers, bank account details, OTPs, or passwords.
3. **Client-Side Document Diagnostics:**
   - Document diagnostics strictly use plain language (*"Photo looks clear"*). Saksham **never claims to verify authenticity** or guarantee government approval.
4. **Automated Anti-Fraud Warnings:**
   - Prominently displays safety banners across all views: *"Applying for a UDID is 100% FREE. Never pay anyone to get a UDID card."*

---

## 🛠️ Tech Stack

- **Frontend:**
  - React 19 & TypeScript
  - Tailwind CSS v4 (with `@tailwindcss/vite`)
  - Framer Motion (reduced-motion compliant animations)
  - Lucide React (accessible icon set)
  - Zustand (state management with persistent UI settings)
  - HTML5 Canvas API (Laplacian blur variance and luminance diagnostics)
- **Backend:**
  - Node.js (v20+ LTS recommended)
  - Express 4
  - Vite 6 dev middleware (single-port unified dev server)
  - `@google/genai` TypeScript SDK (Gemini 3.8 Flash model)
- **Quality Assurance & Testing:**
  - Node.js built-in test runner (`tsx --test src/**/*.test.ts`) — 45 automated unit tests
  - Custom automated guardrail scanner (`scripts/check-rules.mjs`)
  - Playwright browser testing suite (`playwright-cli`)

---

## 💻 Getting Started (Local Setup)

### Prerequisites
- **Node.js:** Version 20 LTS or 22 LTS (minimum v18.18.0)
- Verify Node.js is installed:
  ```bash
  node -v
  npm -v
  ```

### 1. Installation
Clone the repository or extract the ZIP file, open a terminal in the folder, and run:
```bash
npm install
```

### 2. Environment Configuration (Optional)
Copy the example environment file:
```bash
cp .env.example .env
```
Open `.env` and add your Google Gemini API key if you wish to enable the AI chat helper:
```env
PORT=3000
GEMINI_API_KEY="AIzaSyYourActualKeyHere"
```
*(Note: If you omit the API key, the app still functions completely with built-in rule-based safety responses!)*

### 3. Seed Demo Data
Populate the demo database (`data/demo_db.json`) with baseline KPI metrics:
```bash
npm run seed
```

### 4. Start the Application
Run the unified full-stack development server:
```bash
npm run dev
```
Open your browser and navigate to:
```text
http://localhost:3000
```

---

## 🧪 Testing & Verification

### Run the Unit Test Suite
Executes all 45 automated unit tests covering blur detection, i18n parity, storage rules, and validation:
```bash
npm test
```

### Run Automated Security & Privacy Guardrails
Verifies that no PII, unapproved speech callers, raw storage calls, or image leaks exist:
```bash
node scripts/check-rules.mjs
```

### Run Type Checking
```bash
npm run lint
```

### Run In-Browser Self-Test Diagnostics
1. Navigate to `http://localhost:3000`.
2. Click **"Check my documents"** ➔ expand **"Demo Tools (Evaluation Bypass Panel)"**.
3. Click **"Run Browser Self-Test"** ➔ click **"Run All Tests"**.
4. Click **"Copy Report"** to copy the full markdown diagnostic log.

---

## 📦 Production Build & Deployment

To compile and package the application for production:

1. **Build the static bundle:**
   ```bash
   npm run build
   ```
2. **Start in production mode:**
   - **Mac / Linux:**
     ```bash
     NODE_ENV=production npx tsx server.ts
     ```
   - **Windows (PowerShell):**
     ```powershell
     $env:NODE_ENV="production"; npx tsx server.ts
     ```

---

## 📁 Project Structure

```text
├── app/                        # Route pages and layouts
│   ├── document/               # Document Readiness Checklist page
│   ├── onboarding/             # Step 1: Barriers & Accommodation page
│   └── layout.tsx              # Root HTML layout and meta tags
├── data/                       # File-backed demo database
│   └── demo_db.json            # Stores demo KPI metrics, doc checks, help requests (zero PII)
├── docs/                       # Documentation
│   └── manual-qa.md            # Comprehensive step-by-step manual QA & demo checklist
├── lib/                        # Core algorithmic libraries
│   ├── canvas/                 # Laplacian blur and luminance computer vision algorithms
│   └── config.ts               # Global constants (MAX_UPLOAD_KB = 200, BLUR_MIN = 150)
├── scripts/                    # Automation scripts
│   ├── check-rules.mjs         # Automated security, PII, and accessibility guardrails checker
│   └── seed-demo-data.ts       # Seeds demo database with realistic metrics
├── src/
│   ├── components/             # Accessible React UI components
│   │   ├── AskSakshamChat.tsx  # Gemini 3.8 Flash AI chat assistant
│   │   ├── BookHelpView.tsx    # Step 4: Hospital Visit & CMO doorstep request generator
│   │   ├── DashboardView.tsx   # Step 5: Digital UDID Pass preview & printable receipt
│   │   ├── DemoStatsPanel.tsx  # Admin KPI panel (Avg Onboarding Time, Pass Rate)
│   │   ├── DocumentChecklist.tsx # 5-slot document checklist and image compressor
│   │   ├── FormPrepView.tsx    # Step 3: Question wizard & copyable cheat sheet
│   │   ├── HomeScreen.tsx      # Landing page, fraud warnings, quick access
│   │   ├── JourneyStepper.tsx  # 5-step journey progress bar
│   │   ├── QuickCheckModal.tsx # 5-question pre-check guidance modal
│   │   ├── SelfTestModal.tsx   # In-browser 6-point self-test diagnostics suite
│   │   ├── TrackApplicationView.tsx # 7-stage Swavlamban timeline tracker
│   │   └── VoiceAssistant.tsx  # Floating Web Speech API audio narration orb
│   ├── server/                 # Backend database & validation engine
│   │   ├── demoDb.ts           # Demo database CRUD and strict input validation
│   │   └── demoDb.test.ts      # Unit tests for demo storage and stats engine
│   ├── store/                  # Zustand store
│   │   └── useSakshamStore.ts  # Centralized app state, barrier presets, adaptations
│   ├── utils/                  # Accessible utilities
│   │   ├── i18n.ts             # English & Hindi bilingual dictionaries (100% key parity)
│   │   ├── speech.ts           # Centralized Web Speech API helper
│   │   └── storage.ts          # Safe appStorage (strictly blocks persisting PII)
│   ├── App.tsx                 # Main application controller
│   └── main.tsx                # Client entry point
├── package.json                # Project dependencies and scripts
├── server.ts                   # Express full-stack server & Gemini proxy
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite 6 configuration with Tailwind CSS v4
```

---

## 📋 Manual QA Checklist

For an exhaustive, step-by-step test matrix covering keyboard-only use, 360px mobile viewports, high-contrast, text scaling, and every screen's happy and failure path, refer to:
👉 **[`docs/manual-qa.md`](docs/manual-qa.md)**

---

## ⚖️ Official Government Portal Disclaimer

> **Important Notice:** Project Saksham is an independent, non-commercial citizen accessibility initiative. Saksham does not issue, approve, or renew government identity cards, nor does it represent the Ministry of Social Justice and Empowerment or the Department of Empowerment of Persons with Disabilities (DEPwD).
>
> Official UDID applications must be submitted directly on the official Government of India portal: **[swavlambancard.gov.in](https://www.swavlambancard.gov.in/)**.  
> **Applying on the official government portal is 100% FREE.** Never pay any money, fee, or bribe to anyone claiming to provide a UDID card.

---

## 📄 License

This project is licensed under the Apache License 2.0 — see the [LICENSE](LICENSE) file for details.
