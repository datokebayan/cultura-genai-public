> v3.2 assets and manuals are reissued around unchanged 39/39-tested v3.1 source. These checks are not live security or learner-outcome tests.

# CulturaGenAI v3 — Build and Verification Report

Date: 2026-11-08

## Verified in this environment

- 39/39 Node automated tests passed (v3.1 consistency release): original Academy workflows, independent AdaptEngine, NADI offline planner, XSS escape, public/private separation, RLS policy presence and server question-bank shape.
- 26/26 public frontend Node tests passed after extraction of the standalone public GitHub ZIP.
- TypeScript syntax checks completed for private Supabase Edge Function and answer bank using Node 22's type-strip parser.
- Static public-folder audit found no private exam question bank, no SQL migrations, no service key and no detected API secrets. Actual customer secrets were not provided.
- ZIP archives passed integrity checks with `ZipFile.testzip()`.
- Local web-server HTTP checks returned 200 for `/`, `/academy/`, `/adaptengine/`, `/pilot/`, shared algorithm source and both application import shims.

## Not verified yet — MUST complete before live pilot

- Browser end-to-end interactions: the browser automation environment refused localhost navigation (`ERR_BLOCKED_BY_ADMINISTRATOR`). Actual authenticated browser flows require manual or CI browser testing.
- No real Supabase project, authentication account, deployed Edge Function, email identity or OpenAI API key was supplied. Therefore no live login, LLM tool-calling, RLS tenant penetration, server grading or certificate workflow was executed end-to-end against the platform.
- The SQL pgTAP RLS test file is included but was **not executed**; requires Supabase CLI + a running local Postgres stack.
- No third-party audit, accessibility study, educational evaluation, BKT calibration or load test was performed.
- Compliance, minors' data handling, licence agreements and issuance/accreditation require institutional authorisation.

## Risk interpretation

A passing test suite is evidence of source-level functionality, not proof of real-world security, scalability, academic learning gains or Technology Readiness Level 9.

## Deployment readiness

- **GitHub Pages synthetic demos:** structurally ready for deployment, pending a live GitHub Actions run.
- **Secure institutional pilot:** source provided with protective design, but requires configuration, staging, manual role administration, Supabase integration and real security acceptance tests.
- **NADI live LLM:** optional code path present; remains offline without a separately configured Edge secret and successful live integration test.

## v3.1 addendum

- Added three cross-component alignment tests for pilot/Academy display, module-wise final exam coverage and completion-record module labels.
- The updated competition poster and teaching deck are packaged with v3.1, not embedded into the authenticated learning runtime.
- No live Supabase, browser end-to-end, security audit, load test or educational effectiveness validation is newly claimed.
