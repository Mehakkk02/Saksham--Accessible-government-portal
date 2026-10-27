# Project Saksham: Comprehensive Manual QA & Demo Checklist

**Target Portal:** Saksham — Accessible Government ID Companion (UDID Pass)  
**Conformance Standard:** WCAG 2.1 AA / Section 508 Compliant  
**Test Environment:** Node.js 22, Express, React 19, Tailwind CSS v4, Vite 8  

---

## 1. Global Accessibility & Device Matrix

### A. Keyboard-Only Navigation (No Mouse)
| Step # | Action | Expected Behavior | Status |
| :--- | :--- | :--- | :--- |
| **K-01** | Press <kbd>Tab</kbd> repeatedly from page load | Focus outline (`outline: 3px solid #2563eb`) moves logically through header controls, primary CTA, feature cards, and floating helpers. | [PASS] |
| **K-02** | Focus on any card or button and press <kbd>Enter</kbd> or <kbd>Space</kbd> | Triggers the button/card action without requiring mouse interaction. | [PASS] |
| **K-03** | Open any modal (Quick Check, Self-Test, Chat, Clear Data) and press <kbd>Escape</kbd> or focus on Close | Modal closes cleanly and focus returns to the triggering button. | [PASS] |
| **K-04** | Use <kbd>Tab</kbd> inside modal dialogs | Focus remains trapped inside the modal container and does not escape behind the backdrop. | [PASS] |

---

### B. Mobile Viewport (360px Width Testing)
*Test using Chrome DevTools Device Mode set to iPhone SE / 360px × 640px viewport.*

| Step # | Action | Expected Behavior | Status |
| :--- | :--- | :--- | :--- |
| **M-01** | Set screen width to `360px` on Home page | Header wraps into logo and compact controls (`EN/HI`, Contrast). No horizontal scrollbar appears. | [PASS] |
| **M-02** | Inspect feature cards on Home page | All cards stack into a clean single column. Touch targets are at least `44px × 44px`. | [PASS] |
| **M-03** | Navigate to Step 2 Document Checklist | 5 slots stack vertically with full text visible. Action buttons wrap comfortably without text truncation. | [PASS] |
| **M-04** | Inspect Floating Controls | Voice Assistant orb and Ask Saksham button sit in opposite bottom corners without overlapping. | [PASS] |

---

### C. High-Contrast Mode
| Step # | Action | Expected Behavior | Status |
| :--- | :--- | :--- | :--- |
| **HC-01** | Click the **High-Contrast toggle button** in header | Background switches to deep black (`#020617`), text switches to high-contrast white/yellow, and borders render crisp 2px yellow/amber outlines. | [PASS] |
| **HC-02** | Check contrast ratios on interactive buttons | Contrast ratio exceeds 7:1 (WCAG AAA level) on all primary buttons and text labels. | [PASS] |
| **HC-03** | Toggle High-Contrast off | Smoothly transitions back to calm, barrier-free light palette (`#f8fafc`). | [PASS] |

---

### D. Text Size Scaler (A, A+, A++)
| Step # | Action | Expected Behavior | Status |
| :--- | :--- | :--- | :--- |
| **TS-01** | Click **A** (Default font size) | Standard base text size (`14px - 16px`), tight leading. | [PASS] |
| **TS-02** | Click **A+** (Large font size) | Headings and body scale up by 120%; layouts reflow naturally without overlapping text. | [PASS] |
| **TS-03** | Click **A++** (Extra-Large font size) | Headings scale up to `24px - 36px`, body scales up to `18px - 20px` with generous line-height for visual/cognitive ease. | [PASS] |

---

## 2. Screen-by-Screen Happy & Failure Path Testing

### Screen 1: Home Page (`/`)
- **Happy Path:**
  1. Header displays logo with **UDID Pass** badge and tagline.
  2. Language switch toggles between **English (EN)** and **हिन्दी (HI)** seamlessly.
  3. Prominent **Fraud Warning Banner** is visible: *"Applying is 100% Free • Never Pay Anyone for a UDID Card"*.
  4. Clicking **"Start my application"** advances directly to Step 1 (Barriers).
  5. Clicking **"What do I need? (Quick Check)"** opens the 5-question interactive modal.
  6. All 5 feature cards can be clicked to jump directly to any step.
- **Voice Narration:**
  - Clicking **"Read Screen"** triggers Web Speech API narration in English or Hindi.

---

### Screen 2: Step 1 — Accessibility Onboarding & Barriers (`/onboarding`)
- **Happy Path:**
  1. Displays 4 clear barrier choice cards:
     - *I cannot read easily* (Large text + Voice first)
     - *I cannot hear* (Visual cues + Captions)
     - *I cannot travel* (Home visit & Doorstep verification)
     - *I need a caregiver* (Caregiver assisted mode)
  2. Clicking any card toggles selection with animated checkmark and real-time counter (*"1 of 4 accommodations active"*).
  3. Toggling **I cannot read easily** immediately switches font size to **A+** and triggers audio cues.
  4. Toggling **I cannot travel** activates doorstep help coordination in subsequent steps.
  5. Toggling **I need a caregiver** activates caregiver co-signing and adds relation fields.
- **Edge Case / Reset:**
  - Clicking **Reset** clears all active barriers and restores default font size.

---

### Screen 3: Step 2 — Document Readiness Checklist (`/document`)
- **Happy Path:**
  1. 5 distinct slots are presented:
     1. Passport-size photo (Required)
     2. ID proof (Required)
     3. Address proof (Required)
     4. Disability / medical certificate (Optional / Hospital assessment available)
     5. Signature or thumb impression (Optional)
  2. For Slot 4, clicking **"I don't have one yet"** marks the slot with **"Will be assessed at the hospital"** and satisfies the readiness requirement.
  3. For Slot 5, clicking **"Skip"** marks the slot skipped.
  4. Once mandatory slots (1, 2, 3, and 4) are satisfied, overall readiness shows **"All mandatory documents look clear!"** and **"Continue to Step 3"** becomes enabled.
  5. Clicking **"Make file smaller"** runs in-memory Canvas downscaling and compresses file size under 200 KB (`MAX_UPLOAD_KB`), showing a **"Download Compressed"** button.
- **Failure Paths (Real Canvas Diagnostics):**
  - **Blurry Photo:** Upload an out-of-focus or flat image (Laplacian variance < 150) -> Slot shows **"Retake needed"** with specific advice: *"Too blurry. Hold the phone steady and tap to focus."*
  - **Too-Dark Photo:** Upload an underexposed photo (luminance < 50) -> Slot shows specific advice: *"Image is too dark. Please face a light source or turn on room lights."*
  - **Low Resolution:** Upload image under 250×250 -> Slot advises holding camera closer.
- **Safety Rule:**
  - The UI strictly displays **"Photo looks clear"** and never claims official verification.
- **Printable Checklist:**
  - Clicking **"Print Checklist"** generates a clean physical paper checklist via `@media print` for caregivers to carry to the civil hospital.
- **Demo Tools (Bypass & Stats):**
  - Accordion provides **"Simulate All 5 Pass"**, **"Trigger Photo Blur Fail"**, **"Pass ID Proof"**, **"Set Certificate Hospital Assessed"**, and **"Run Browser Self-Test"**.

---

### Screen 4: Step 3 — Form Prep Buddy (`/formprep`)
- **Happy Path:**
  1. Question 1 asks: *"Who is filling this application?"* (Myself vs Someone else).
  2. If *Someone else* is selected, caregiver fields appear: Caregiver name, Relationship dropdown, and a switch toggle: *"The applicant agrees to this help"*.
  3. Step-by-step wizard guides through Name, DOB, Gender, 10-digit mobile, Address, Disability category, and Hospital choice.
  4. Disability category includes plain-language choices plus **"Not sure, ask the doctor"** with a mandatory disclaimer: *"Your certificate or hospital decides this. Saksham does not make a diagnosis."*
  5. Final screen presents the **Cheat Sheet**:
     - Individual **Copy** button next to each field with visual checkmark feedback.
     - **"Copy All"** button copies the entire formatted answer sheet.
     - **"Print"** button prints the cheat sheet.
     - **"Open Official Portal"** opens `swavlambancard.gov.in` in a new tab.
- **Failure Paths:**
  - Mobile number with less than 10 digits -> Inline red error: *"Mobile number must be exactly 10 digits"*.
  - Invalid PIN code -> Inline red error: *"PIN code must be exactly 6 digits"*.
  - Caregiver mode without consent switch -> Inline red error: *"Please confirm that the applicant agrees to this help"*.
- **Privacy Rule:**
  - Never requests or stores Aadhaar number, bank account details, OTP, or passwords.
  - All form answers remain in volatile memory only and can be cleared with **"Clear my data"**.

---

### Screen 5: Step 4 — Hospital Visit & Help Prep (`/book-help`)
- **Happy Path:**
  1. Displays **"What to Carry to the Hospital or CMO Office"** checklist with interactive pack switches.
  2. If Travel barrier was selected in Step 1:
     - Shows **"Ask the Hospital About a Home Visit or Assistance"** card.
     - Generates a polite, copyable letter addressed to the Chief Medical Officer (CMO).
     - Clicking **"Copy Request Message"** copies the letter to clipboard with confirmation.
  3. Displays **"Where Can I Get Help Applying?"** listing Common Service Centres (CSC), Sewa Kendras, and District Welfare Offices with a **"Share with Caregiver"** copy button.
  4. Displays **Permanent vs Temporary UDID Card** explainer with audible listen button.
  5. Displays **Government Terms Glossary** (UDID, CMO, Notified Hospital, Assessment, Reference Number) with bilingual audio buttons.
- **Demo Booking:**
  - Selecting an address and time slot and clicking **"Submit Help Request (Demo)"** saves a demo record to server storage without requiring real phone numbers or street addresses.

---

### Screen 6: Step 5 — Official Portal Application Tracking (`/track`)
- **Happy Path:**
  1. Displays the 7 sequential stages mirroring the Swavlamban portal:
     1. Started in Saksham (Completed)
     2. Documents ready (Completed)
     3. Submitted on the official portal (In progress until user confirms)
     4. Visit hospital / CMO office (with printed receipt)
     5. Verification and assessment
     6. Approved
     7. e-UDID ready to download on the portal
  2. Input reference number (e.g. `UDID-2024-88912-DL`) and click **"I submitted on the portal"** -> Stage 3 completes and Stage 4 activates.
  3. Click **"Confirm hospital visit done"** -> Stage 4 completes and Stage 5 activates.
  4. Under Demo Tools, click **"Simulate next status"** -> advances Stage 5 (Verification) to Stage 6 (Approved), and then Stage 7 (e-UDID ready to download).
- **Failure / Corrections Path:**
  - Click **"Simulate Corrections Requested"** -> Stage 5 turns into an amber **"Corrections Requested"** alert.
  - Card displays: *"What to do now: Medical board requested a clearer photo of official seal"* with step-by-step resolution steps and links to re-check in Saksham.

---

### Screen 7: Summary & Digital UDID Pass (`/summary`)
- **Happy Path:**
  1. Displays a digital smart-card preview with cardholder name, disability category, severity percentage, issuing hospital, and certificate number.
  2. Displays QR code summary, assigned rights badges, and government entitlements (Railways 75% concession, ADIP assistive subsidy, Section 80U tax exemption).
  3. Displays doorstep service status and PVC card delivery status.
  4. Clicking **"Download Official Pass"** or **"Print"** triggers clean print formatting.

---

### Modal 1: What do I need? (Quick Check)
- **Happy Path:**
  1. Click **"What do I need? (Quick Check)"** on Home or header.
  2. 5 plain-language multiple-choice questions:
     - Daily difficulty (walking, seeing, hearing, learning, multiple)
     - Duration (from birth, many years, recent)
     - Prior doctor examination (yes, no, not sure)
     - Existing certificate (valid, expired/temporary, none)
     - Prior portal application (first time, applied before)
  3. Dynamic routing results:
     - Has valid certificate -> Routes to **Document Checklist** (*"You may already have what you need"*).
     - No certificate / never examined -> Routes to **Hospital Visit & Help** (*"You may need an assessment at a hospital"*).
     - Expired / uncertain -> Routes to **Help Centres** (*"Not sure, ask at a help centre"*).
  4. Mandatory disclaimer banner is clearly visible:
     *"Guidance only. This is not a medical, legal, or eligibility decision. The government medical board makes all final decisions."*
  5. Clicking **"Read aloud"** reads the question or result aloud.

---

### Modal 2: Ask Saksham AI Assistant (Floating Chat)
- **Happy Path:**
  1. Click the floating **"Ask Saksham"** button at bottom-left.
  2. Chat dialog opens with welcome message and privacy notice: *"Strict privacy: Your name, mobile number, and documents are never sent to AI."*
  3. Click any sample prompt chip (*"Is the UDID application free?"*, *"What documents are required?"*, *"What happens at the hospital?"*) or type a question.
  4. Response is generated from server-side Gemini API in Grade 5 reading level without bureaucratese.
  5. Mandatory footer disclaimer: *"AI answers can make mistakes. Always confirm details on swavlambancard.gov.in. Applying is 100% free."*
- **Safety / PII Redaction:**
  - Any 10-digit phone number or 12-digit Aadhaar number typed in the chat box is automatically sanitized on the client and server before reaching the model.

---

### In-Browser Self-Test Diagnostic Suite (Demo Tools)
- **Execution:**
  1. Navigate to Step 2 Document Checklist.
  2. Open the **Demo Tools (Evaluation Bypass Panel)** accordion.
  3. Click **"Run Browser Self-Test"** (purple button).
  4. Modal opens with 6 automated checks:
     1. Document Classifier (Sharp, Blurry, Dark test canvases)
     2. Live Announcement Regions (assertive and polite `aria-live` DOM scan)
     3. Zero-Network Leak Audit (Fetch spy confirms 0 network calls during image inspection)
     4. Barrier State Adaptations (verifies largeText, voiceFirst, doorstepAssistance, caregiverCoSign)
     5. Bilingual i18n Translation Parity (verifies 100% key parity between English and Hindi)
     6. Centralized Speech Helper Audit (verifies single sanctioned speech helper)
  5. Click **"Run All Tests"** -> Watch all 6 tests run and turn to green **[PASSED]** checkmarks.
  6. Click **"Copy Report"** -> Full diagnostic report copied to clipboard.
