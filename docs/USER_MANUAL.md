# CulturaGenAI v3.2 — User Manual and Judge Demo Guide

**Release date:** 8 November 2026  
**Products:** CulturaGenAI Academy, reusable m-DOAI AdaptEngine, optional NADI companion, and the protected institutional pilot.  
**Status:** Functional research demos and secure-pilot source; not institutionally accredited and not proven TRL 9.

## Read this first

The programme uses one **official six-module curriculum (M01–M06)** across the poster, the 76-slide instructor deck, Academy lessons, protected final exam and completion record. The public GitHub Pages versions use only **synthetic data**. Do not enter real student information there. The protected pilot needs a separately configured Supabase project with invited users.

### Three portals at a glance

| Portal | Purpose | Needs login? | Data |
|---|---|---|---|
| `/academy/` | Explore six microcredentials, CADG/m-DOAI activities, NADI offline guidance and demo badges | No | Synthetic, browser local |
| `/adaptengine/` | Experiment with transparent adaptive rules and provisional Bayesian Knowledge Tracing (BKT) | No | Synthetic, browser local |
| `/pilot/` | Protected practice, D/O/A/I evidence, human review, server-scored exam and pilot completion records | Yes, after configuration | Institution-scoped records |

### A simple judge demonstration (about 5–8 minutes)

1. Open the **Academy** and show the canonical M01–M06 titles and four interface language options.
2. Open **Adaptive Practice**. Answer two or three sample questions; demonstrate how the difficulty suggestion changes under the rule-based or BKT mode.
3. Ask **NADI** to recommend practice. Explain that the public character uses deterministic offline guidance; the optional live LLM pathway exists only in the separately configured protected pilot.
4. Show a sample D/O/A/I learner reflection and educator review. Explain why **an AI does not award credentials**.
5. Open **AdaptEngine** independently to demonstrate that the adaptive component can be reused.
6. Show the certificate **sample**, clearly marked **SAMPLE ONLY — NOT ACCREDITED**, and explain the secure exam + educator approval policy.

**Do not demonstrate real learner identities, claim actual learning gains, or claim TRL 9.** Source-level tests (39 checks passed) are evidence of implemented code, not educational validation.

---


## Official programme — six consistent microcredentials

All course screens, teaching slides, examination coverage and protected completion records use these identifiers and titles.

- **M01 — GenAI Foundations & Human Agency** (F01–F03)
- **M02 — Privacy, Consent & Safe AI Use** (F04–F06)
- **M03 — Academic Integrity, Disclosure & Verification** (F07–F09)
- **M04 — CADG, Bias, Culture & Inclusive AI** (F10–F12)
- **M05 — Responsible Prompting & Human–AI Iteration** (F13–F15)
- **M06 — AI Governance, Assurance & Ethical Leadership** (F16–F18)

The verified programme structure consists of six modules, recommended 2 learning hours each (12 hours total). The secure pilot has **30 practice items (five per module)** and **18 final-exam items (three per module)**; its minimum final score is **80%**, with **six educator-approved D/O/A/I submissions** also required. These counts reflect the prototype; content validity and accreditation remain pending.

## A. Public demonstration (no accounts, dummy data only)

1. Open the GitHub Pages link and choose **Academy Demo**.
2. Select **English / Bahasa Melayu / Mandarin / Tamil** in the Academy interface.
3. Explore the six responsible GenAI microcredentials: Foundations; Privacy; Integrity; CADG / Culture; Prompting; Governance.
4. Choose **Adaptive Practice** and compare **Rule-Based** or **BKT** modes. Answer questions and inspect the next proposed difficulty.
5. Use the **NADI** avatar to request a planned practice activity in the offline demonstration. This is a bounded simulation, not a live LLM.
6. Switch to the **Educator** role in demo mode to see a simulated evidence approval and demo badge. **This is not authentication.**
7. Open **Standalone AdaptEngine** to inspect a separate reusable adaptive learning product.

**Do not enter real pupil names, identification numbers, health records, passwords, unpublished research or confidential documents into either public demonstration.** The original demos keep sample changes in local browser storage.

## B. Secure institutional pilot (Supabase must be configured by administrator)

### Sign in and choose institution

1. Open **Secure Pilot** from the landing page.
2. Enter your institutional account email and password.
3. If the screen says you are **not enrolled**, ask your administrator to create a membership. Signing in alone never gives a learner or educator role.
4. If your identity belongs to more than one institution, select the relevant institution in Dashboard.

### Learner: adaptive learning

1. Select **Adaptive practice**.
2. Select one of six modules and choose **BKT** or **Rule-Based** mode.
3. Select **Get my next question**. The question appears without answer keys.
4. Answer and submit. The server checks the answer and records the result.
5. Review explanation, mastery estimate and suggested difficulty. Mastery is an **uncalibrated mathematical estimate**, not a diagnosis.
6. Continue until the module's prototype question bank is complete. Each module currently has five practice questions in the secure pilot.

### Learner: m-DOAI evidence

1. Select **m-DOAI evidence** and choose your module.
2. Write at least 30 characters for each reflection:
   - **D** — learner context, inclusion, accessibility and cultural safeguards.
   - **O** — ideas explored and learning opportunities compared.
   - **A** — prompt, examine, verify, revise, apply and reflect.
   - **I** — how the human regulated GenAI, checked accuracy and assumed responsibility.
3. Record original sources checked (minimum 20 characters) and confirm both declarations.
4. Submit. The evidence is marked **pending** until reviewed by an authorised educator.
5. If an educator requests revision, improve the evidence and resubmit. An approved submission becomes locked.

### Learner: final examination and completion record

1. Select **Final examination → Start**.
2. The secure pilot uses **18 server-scored questions**, three per module, with a **35-minute session** and an **80% passing threshold**.
3. Submit all questions. At most two graded submissions are permitted in the pilot.
4. A passing score **does not automatically award a certificate**. All six D/O/A/I evidence submissions must also be educator-approved.
5. Select **Check completion record eligibility**. If all requirements are satisfied, your account can display/print a protected completion record. The pilot record is **not accreditation**.
6. A partially completed exam can be resumed via **Start** while its original session remains valid.

### Learner: NADI companion

1. Select **NADI agent** and choose a microcredential topic.
2. Read the privacy explanation and actively accept sending a question to the configured AI provider if one is connected.
3. Ask a short question about your learning; never include real personal data.
4. NADI reads only approved lesson summaries and your own progress indicators. It may suggest an activity, but **you decide whether to begin**.
5. NADI cannot approve work, change grades, send reports, or create certificates.

### Educator: reviewing evidence

1. Sign in using an **educator/admin membership** issued by the institution, not a simulated role selector.
2. Open **Dashboard → Educator review queue**.
3. Read the learner's D/O/A/I evidence and source verification notes.
4. Enter at least 10 characters of feedback and either **Approve as educator** or **Request revision**.
5. You cannot approve your own submission. Existing approved evidence is locked and requires an administrative correction workflow if mistaken.
6. Approval records include reviewer ID, time and an audit event.

## C. Accessibility and honest research use

- Use keyboard navigation, descriptive labels and a text alternative to NADI's avatar. Animation respects reduced-motion settings.
- Use private institutional accounts; public dummy statistics are **not** valid study results.
- The browser text/voice capabilities are optional. Voice is not required for any assessment.
- Actual evaluation needs consent, ethics approval where required, language review and accessibility testing.


## v3.2 competition materials

- A1 poster: `competition-materials/CulturaGenAI_v3_2_Competition_Poster_A1_Landscape.pdf`.
- 76-slide PPT with speaker notes: `competition-materials/CulturaGenAI_v3_2_Instructor_Deck_Poster_Theme_76slides.pptx`.
- Sample certificate: `competition-materials/CulturaGenAI_v3_2_Sample_Completion_Certificate.pdf`.
- Current evidence and restrictions: `manuals/COMPETITION_EVIDENCE.md`.
