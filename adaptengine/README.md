# m-DOAI AdaptEngine · Standalone Adaptive Learning Laboratory

**Independent, reusable software + working browser demo for GitHub Pages.** This package has a separate visual interface, independent model/controller, six responsible GenAI microcredentials, 36 bilingual/multilingual practice questions (EN, BM, 中文, தமிழ்), four synthetic learners, configurable algorithm mode and illustrative BKT parameters, practice feedback, learning traces and safe JSON exports.

## Deploy in GitHub Pages — no npm required

1. Create a new GitHub repository, for example **`mdoai-adaptengine`**. It can be public for GitHub Pages on Free accounts.
2. Upload **all files INSIDE this folder to the repository root**: `index.html`, `src/`, `assets/`, `tests/`, `.github/`, `.nojekyll`, `manifest.webmanifest`, `sw.js`. GitHub’s website may not upload hidden `.github/` reliably through drag-and-drop; use **Add file → Create new file** for `.github/workflows/pages.yml` if it is missing, or push the folder using Git.
3. In repository **Settings → Pages → Source → GitHub Actions**, select GitHub Actions.
4. Every push to branch `main` launches the included deployment. The demo URL will be similar to `https://YOUR-USERNAME.github.io/mdoai-adaptengine/`.
5. For offline local preview, run `python -m http.server 8000` in this folder and open `http://localhost:8000`. Do not open the HTML directly from `file://` (JavaScript modules may be blocked).

## Features & how to demonstrate

- Select an illustrative learner profile, module, adaptation mode (Rule or BKT), and four-language UI.
- Answer one challenge, view instant feedback, then select **Next challenge**.
- The engine chooses the next *unseen* question near the recommended difficulty (foundation/developing/advanced), never repeats an item until the bank is exhausted.
- **Learning insights** shows mastery traces per module and comparison between the two recommendations.
- **How it works** describes BKT transparency and sliders for simulated probability sensitivity. The sliders do **not** calibrate a trained model.
- Export *synthetic anonymous* analytics as JSON. Inputs are stored in the local browser (`localStorage`), and no external API is called.

## API for external integration

```js
import {
  updateBKT, replayMastery, masteryTrace,
  ruleRecommendation, bktRecommendation, chooseNextItem
} from './src/adaptive-engine.js';

const questionBank = [
  {id:'q1',difficulty:'foundation'},
  {id:'q2',difficulty:'developing'},
  {id:'q3',difficulty:'advanced'}
];
const attempts = [{questionId:'q1',correct:true}];
const next = chooseNextItem(questionBank,attempts,'bkt');
console.log(next.item?.id, replayMastery(attempts));
```

The engine is decoupled from all question wording and can be used for other courses. The identical source file is bundled in the separate CulturaGenAI Academy repository under `src/adaptive-engine.js`.

## Algorithms (actual, not claimed ML training)

**Rule-based:** among the latest three answers, when at least two exist: ≥80% correct → advanced; ≥50% → developing; else foundation. Initial/default stage is foundation.

**Bayesian Knowledge Tracing (classic two-state/no-forgetting):** default initial mastery 0.20, chance of learning 0.15, guess probability 0.20, slip probability 0.10. For a correct answer, likelihood of correctness given knowledge is `1-slip`; given not knowing is `guess`. For an incorrect answer, likelihood is `slip` or `1-guess`. Apply Bayes' theorem, then the chance of learning. For illustration, <50% mastery → foundation; 50–79.99% → developing; ≥80% → advanced. Parameters are uncalibrated.

These are **algorithmic adaptive systems, not a generative AI model or a validated predictive ML deployment**. Model predictions are not used to approve credentials, classify student health, or make consequential education decisions. A human approves formal outcomes.

## Testing

`node --test` or `npm test` (Node 18+). No `npm install` required. The tests cover BKT arithmetic, decision rules, question-bank completeness, rendering, and interaction model flow.

## MVC layout

- **Model:** `src/model.js` manages learner state, seeded examples, local storage and exports.
- **View:** `src/view.js` generates responsive pages and translated instructions.
- **Controller:** `src/controller.js` manages quiz interactions and navigation.
- **Independent algorithm library:** `src/adaptive-engine.js`.
- **Question content:** `src/data.js` and `src/adaptive-data.js`.

## Research integrity and limitations

All demo learners, attempt histories, mastery lines and outcomes are **synthetic**, not evidence of real educational impact. Rule/BKT recommendations are educational hypotheses requiring consented learner data, teacher oversight, calibration, diverse evaluation and usability work. Current repository has no account authentication, server, synchronized database, cryptographically signed badges, live AI model, adaptive content generation, or TRL 9 proof. GitHub Pages only serves static files. Do not input real student data or secrets. See `docs/INTEGRATION_AND_EVIDENCE.md`.
