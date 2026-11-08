# Security Design & Threat Model — CulturaGenAI v3

**Status:** implemented architectural safeguards and tests; **NOT independently audited or authorised for real student data**.

## Current controls by layer

| Layer / threat | Implemented control | Outstanding risk or action |
|---|---|---|
| Fake role selection / privilege escalation | Pilot roles come from Supabase membership table, not user-editable profile metadata or HTML. DB membership creation is admin-only. | Invite/MFA policy and role change review in deployment. |
| Account takeover | Supabase Auth JWT, refresh and session expiry, provider-managed credential checking; no self-service admin accounts. | MFA/SSO and real institutional identity verification needed. |
| Cross-institution data exposure | Institution ID + user ID checked at every Edge action; RLS policies on all app data tables, indexes on tenant filters. | Full adversarial cross-tenant integration tests still needed. |
| Exposed exam keys / grade manipulation | Server-only answer bank in **private backend repo**; grading and exam session state executed on server, no public DB write grants. | Question editorial validation, large bank, supervised proctoring/anti-collusion for high-stakes uses. |
| Illicit microcredential | 80% final server-graded exam + all six human-approved D/O/A/I submissions. Credentials server-issued and scoped to institution. | External identity proof and accreditation/verification process NOT present. |
| Educator self-approval | Server rejects reviewing learner's own evidence. Approval has reviewer, timestamp and audit metadata. | Administrative reversal/two-person review for disputes not yet built. |
| Prompt injection / excessive agency | NADI can only call two exact read-only tools; no arbitrary URLs, code execution, grading or certificate tools; strict parameters, max 2 calls, bounded output. | Red-team with diverse languages/prompt injections before pilot. |
| LLM cost abuse | Authenticated only; atomic DB daily rate limit 10 per user; bounded model response; no cloud model without server secret. | Add upstream IP throttling and a provider-side budget cap. |
| Sensitive data leakage | NADI context excludes names and full answers; screens discourage input; minimal logs; keywords reject common secret/email patterns. | Input screening is NOT a privacy guarantee. Complete DPIA/privacy review and retention/deletion policy needed. |
| Browser script injection | Pilot escapes dynamic content, has CSP and no external UI JS dependencies, renders model output as escaped text. | Thorough security scan, real HTTP headers and browser testing needed. |
| Stolen browser session | `sessionStorage` (ends with browser tab session) and expiry/refresh logic; no app passwords saved. | HttpOnly secure cookie BFF preferred over browser-held tokens for high-assurance deployments. |
| Loss of data | Relational schema and institutional FK constraints. | Backup/restore monitoring and operations required. |
| Offline public demo privacy | Demo labels synthetic records; no live API or credential claims. | NEVER put real student data into demo/localStorage. |

## Trust boundaries

1. **Public Pages** is always readable by anyone with the URL. Source uploaded to a **public GitHub repo** is readable even if not served by Pages. Only frontend ZIP is safe to publish, not backend answer keys.
2. **Pilot frontend** is not a trusted policy enforcement point. An attacker can modify HTML/JS, select options, tamper with request payloads and inspect all sent data.
3. **Supabase Auth** authenticates user; **membership check + Postgres RLS** authorise institution and role. No role is accepted from client input.
4. **Edge server** grades exams and performs consequential writes after authorisation. Admin service privileges should be tightly limited by code and deployment permissions.
5. **NADI/LLM** has a narrow scope. AI responses are untrusted narrative suggestions, not authorisation, official assessment or system commands.

## Attacks to verify before real deployment

- Call the API with a valid account but different institution ID; expect 403.
- Call `evidence_review` as learner, or use the educator's own evidence ID; expect 403.
- Send forged `role='admin'`, `user_id`, `correct=true`, `passed=true`, or `verification_code`; values must not control server output.
- Query REST directly for `certificates` belonging to another account; RLS must deny.
- Query REST for `exam_sessions`; role should have no SELECT grant.
- Retry the same practice question or resubmit a graded exam; server must reject.
- Prompt NADI to run arbitrary JavaScript, disclose other learner records or issue a credential; no tools should permit this.
- Exceed the ten-request daily AI limit; expect 429 and no extra upstream model call.
- Check source of the public GitHub repo and Pages bundle for hidden question bank/keys.
- Inject HTML/script fragments into evidence and review fields; rendered output must remain inert text.
- Perform concurrency testing on exam sessions and certificate issuance.

## Important disclaimer

Security is a process, not a feature checkbox. This prototype includes meaningful safeguards, but **a passing Node test suite does not prove the deployment secure**. Independent testing, policy configuration, backups, audit monitoring, and compliance evaluation remain prerequisites for production claims and TRL 9.

## Reference materials (developer documentation)

- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase Secure Edge Functions](https://supabase.com/docs/guides/functions/auth)
- [OWASP AI Agent Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html)
- [OWASP LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)
- [GitHub Pages publishing](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
