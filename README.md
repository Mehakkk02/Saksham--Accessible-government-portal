# Saksham

**An AI-assisted accessibility layer for India's UDID (Unique Disability ID) application.**
Built by Team NEXORA01 for the Seva Innovation Challenge 2026.

> **Demo prototype.** Saksham is not an official government product and is not connected to the UDID portal (swavlambancard.gov.in). It does not submit applications, verify documents, or issue IDs. All bookings, statuses and sample data in the app are mock data.

---

## What it does

The UDID application assumes you can read a dense online form, upload clear documents and travel to a hospital. Many applicants can't. Saksham sits in front of the official portal and:

1. **Adapts to the person.** The user picks what is difficult for them (cannot read, cannot hear, cannot travel, needs a caregiver) and the whole interface changes: voice read-aloud, larger text, high contrast, visual alerts, caregiver mode.
2. **Checks documents before submission.** Each photo (passport photo, ID proof, address proof, disability certificate) is checked for blur, lighting and resolution **on the user's own device**. The result is a clear pass or retake, with a plain-language reason, shown on screen and spoken aloud.
3. **Prepares the form.** One question per screen, read aloud, ending in a copy-ready answer sheet to paste into the official portal.
4. **Prepares the hospital visit.** Help requests (home assessment or caregiver support), a "what to carry" checklist and a status tracker that mirrors the real application stages.
5. **Answers questions in plain language** through a help chat (Gemini, server-side, no personal data sent).

## Why it exists

- India has **2.68 crore persons with disabilities**, about 69% in rural areas (Census 2011).
- Of **1.62 crore UDID applications**, **22.3 lakh have been rejected** and about **15 lakh are awaiting assessment** (Lok Sabha reply, 12 Aug 2025, reported by PTI).
- Document problems usually surface only after submission. Saksham surfaces them first.

## Screenshots

<!-- Add 3 screenshots after the latest build: onboarding, document checklist result, help request confirmation -->
| Onboarding | Document check | Help request |
|---|---|---|
| _add image_ | _add image_ | _add image_ |

---

## Tech stack

| Area | Technology |
|---|---|
| UI | React 19, TypeScript, Vite |
| Styling | Tailwind CSS 4 |
| State | Zustand |
| Animation | Framer Motion |
| Icons | lucide-react |
| Voice | Web Speech API (browser text-to-speech) |
| Image checks | Canvas API (blur, brightness, resolution), runs in the browser |
| Server | Express (Gemini help chat, mock endpoints) |
| AI | Google Gemini via `@google/genai` (help chat only) |

---

## Getting started

### Prerequisites
- **Node.js** (current LTS recommended) and npm. Check with `node -v`.
- **Chrome or Edge** recommended (best text-to-speech and camera support).

### 1. Install
```bash
npm install
```

### 2. Set environment variables
Create a file named `.env.local` in the project root:
```bash
GEMINI_API_KEY="your_key_here"
```
- Only the **help chat** needs the key. The rest of the app works without it.
- The key is used on the server only. **Never commit `.env.local`** or paste the key into client code.
- `APP_URL` in `.env.example` is for hosting and is not needed locally.

### 3. Run
```bash
npm run dev
```
Open **http://localhost:3000**.

### 4. Build for production
```bash
npm run build
npm run preview
```

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server on port 3000 |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Type-check with `tsc --noEmit` |
| `npm run clean` | Remove `dist/` and `server.js` |

---

## Project structure

```
app/          Screens (onboarding, document checklist, and so on)
components/   Shared UI components (uploader, voice assistant, ...)
store/        Zustand stores (accessibility preferences, journey state)
lib/          Helpers, including lib/canvas/ (blur and brightness checks)
src/          App entry and re-exports of the folders above
```
Most real code lives in the root-level folders. Files under `src/` mainly re-export from them, so check both before moving or deleting anything.

---

## Using the demo

The demo includes tools so you can show both outcomes without hunting for test images.

- **Demo mode** (switch in the footer) reveals a **Demo tools** panel with sample documents and a "Simulate next status" button for the tracker.
- In demo mode, a file name containing `pass` or `fail` forces that result, for example `medical_cert_pass.jpg`. Results from this path are labelled **Demo Bypass**.
- Any other file runs the real on-device blur and lighting check.

A good 2-minute walkthrough: pick a barrier, upload a sharp photo (pass), upload a blurry one (retake with a spoken reason), prepare the answer sheet, create a help request, then show the tracker.

---

## Accessibility

- Full keyboard operation with visible focus indicators.
- Results announced through `aria-live` regions **and** spoken aloud when read-aloud is on.
- State is never shown by color alone (icon plus text).
- Large touch targets, adjustable text size and a high-contrast mode.
- Designed to work at 360px width on a phone.

## Privacy and security

- **Certificate and ID images never leave the device.** Image analysis runs in the browser, and only numeric results (such as a sharpness score) are used.
- Saksham **never asks for or stores** Aadhaar numbers, OTPs or bank details.
- Form-prep answers stay in memory or session storage and can be wiped with **Clear my data**.
- The Gemini key stays on the server. No personal data or images are sent to the model.

---

## Current limitations

- Mock data and mock APIs only. No connection to the UDID portal.
- The document check measures photo quality (sharpness, light, resolution). It does **not** read the certificate, verify authenticity or judge disability.
- Text-to-speech depends on the voices installed in the user's browser. Hindi voices are not available on every device.
- Features marked as planned below are not built.

## Roadmap

- Field pilot with community helpers (ASHA, CSC operators) in one district, with department consent
- More regional languages, starting with Marathi
- Accessibility audit (WCAG 2.1 AA) with disabled users
- Consent-based status tracking through the portal's official data-sharing process, if approved

---

## Team

**Team NEXORA01**

| Name | Role |
|---|---|
| _Name 1_ | _Product and research_ |
| _Name 2_ | _Frontend and accessibility_ |
| _Name 3_ | _Image checks and backend_ |
| _Name 4_ | _Testing and field research_ |

## Acknowledgements and sources

- Census of India 2011 (disability tables) and the MoSJE statistical profile of persons with disabilities.
- Lok Sabha reply on UDID applications, 12 Aug 2025 (PTI report).
- DEPwD UDID documentation, swavlambancard.gov.in (official portal; Saksham is independent of it).

## License

_Add a license before making the repository public (for example MIT)._
