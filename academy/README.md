# CulturaGenAI Academy v3 — CADG × m-DOAI + Adaptive Learning

**A browser-based responsible Generative AI microcredential demo** designed for simple GitHub Pages deployment and potential ITEX/QS education-innovation research. This is a complete STATIC DEMONSTRATION, not a production multi-user platform or TRL 9 system.

## Two independent deliverables

This repository is **CulturaGenAI Academy**, with six microcredential courses, quizzes, D/O/A/I submissions, human approvals, demo badges, ethical prompt practice, CADG checklist, stakeholder dashboard and an **adaptive learning lab**. The separate **m-DOAI AdaptEngine** repository provides a standalone adaptive learner simulator and reusable library. The Academy contains the same tested engine source at `src/adaptive-engine.js` and calls it from the Academy MVC model. The repositories are independently deployable.

### What is genuinely adaptive?

- **Rule-based adaptation:** looks at last three practice answers and recommends Foundation / Developing / Advanced.
- **Bayesian Knowledge Tracing (BKT):** updates an illustrative skill-mastery probability using a two-state model (prior=.20, learn=.15, guess=.20, slip=.10); recommended question difficulty changes as the probability changes.
- **Practice bank:** 6 microcredentials × 6 questions (three difficulty levels) = 36 adaptive items with content in English, BM, Chinese and Tamil.
- **Human oversight:** practice estimates do not issue badges. A learner needs to pass formative quiz, submit D/O/A/I evidence, disclose AI use, provide a verification method and receive an explicit *simulated* educator approval. Real credential issuance must happen server-side with institutional policy and identity assurance.

These parameters have not been learned from student data. BKT is a probabilistic modelling method here, **not a trained ML model**. The 'AI coach' performs a checklist, not LLM inference.

## Deploy to GitHub Pages (no npm or API keys)

1. Create a GitHub repo named `culturagenai-academy` (or another name).
2. Upload the **contents** of this folder to its repository root, preserving folder structure and `.github/workflows/pages.yml`. Upload using Git to preserve hidden directories if GitHub drag/drop skips them.
3. In **Settings → Pages → Build and deployment → Source**, choose **GitHub Actions**.
4. Push to branch `main`, then wait until the Actions workflow finishes. Open the deployment link in Pages/Actions. Conventional address: `https://YOUR-USERNAME.github.io/culturagenai-academy/`.
5. For local testing, `python -m http.server 8000` from the project directory and browse to `http://localhost:8000/`; opening `file://.../index.html` will not reliably load JavaScript modules.
6. Optional developer tests (Node 18+): `node --test` (no dependencies to install).

## Judge demonstration (approximately 10 minutes)

1. Open **Overview** and switch among four interface languages.
2. Open **Adaptive Lab**; choose `Alya`, `Wei Ling`, `Kavitha`, or `Daniel` (all fictional), and select a microcredential, then answer a question.
3. Switch adaptation **Rule** ↔ **BKT**; observe recommendations and BKT probability changing with the same history. Six questions are available for each module.
4. Open **Courses**, choose a microcredential, review lesson notes and complete the three-question *formative quiz*.
5. Enter evidence for **D Design, O Opportunities, A Activity, I human-regulated Intelligence**. Supply source checks, privacy and AI disclosure, then submit.
6. Switch the **role selector to Educator** (demo role, not authentication), enter Stakeholder dashboard and approve or request revision.
7. Open **Portfolio** to see clearly labelled simulated badge. Explore **AI Practice Lab**, **CADG audit**, and **Research / TRL** panel.
8. For a full instructor deck, see `docs/CulturaGenAI_Microcredentials_Teaching_Notes.pptx` (67 slides with teaching notes).

## MVC code map

- `src/model.js` → quiz/evidence state and review rules; invokes adaptive engine.
- `src/view.js` → translated responsive UI, adaptive tutor practice and views.
- `src/controller.js` → form/navigation and user actions.
- `src/adaptive-engine.js` → pure testable BKT and rule-based JavaScript algorithms.
- `src/adaptive-data.js` → three difficulty levels, translated practice items and D/O/A/I mappings.
- `src/data.js` → six microcredential lessons, CADG educational checklists, synthetic users.
- `src/styles.css` → responsive style; root `index.html` and `src/main.js` bootstrap.
- `.github/workflows/pages.yml` → GitHub Pages automation; `manifest.webmanifest` and `sw.js` → PWA resources.

## Integrity, privacy and limitations

Everything is client-side (localStorage); anyone can change roles and marks in the browser; data are not shared across devices. No secure authentication, database, server roles, live LLM, verified certificate credentials, official accreditation, real-time analytics or authorized production operation exists in this static demonstration. **Do not input real student or personal records.** Synthetic dashboards and fabricated practice histories are not empirical pilot findings. Educational adaptation of the ten CADG guidelines and the proposed four m-DOAI constructs must be evaluated with real participants and appropriate consent. Refer to `docs/TRL_AND_AWARD_EVIDENCE.md`. NovaEd ONE is independent: no NovaEd software, artwork or branding has been reused.
