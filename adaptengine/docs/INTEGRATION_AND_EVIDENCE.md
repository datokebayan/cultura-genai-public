# m-DOAI AdaptEngine — Integration and evidence plan

## Component boundary

The engine is independent from the curricula. It accepts a question array and learner answer history; its output is a suggested difficulty and an explanatory basis. It does not generate learning content or approve credentials. The Academy reuses the same library, integrates CADG multilingual design choices and holds the educator review workflow.

```
Question bank + learner practice attempts
                |
      AdaptEngine (Rule / BKT)
                |
   recommended difficulty + trace
                |
       human-approved content
                |
 learner practices → teacher verifies D/O/A/I evidence
                |
       microcredential decision (outside engine)
```

## CADG and m-DOAI status

The ten CADG elements are drawn from preexisting guidelines for culturally appropriate digital content; a later educational implementation needs revalidation. m-DOAI is a **proposed** extension of m-DOA: Design (human-centred GenAI design), Opportunities (generative learning opportunities), Activity (iterative human–AI activity), Intelligence (human-regulated generative intelligence). Neither this application's original questions nor its mastery estimates are a validated CADG or m-DOAI measure.

## Research study towards ITEX / QS

Plan a prospective, ethics-approved comparative pilot, not a retroactive claim. One feasible design uses a comparison of fixed-path versus adaptively sequenced practice in the same responsible GenAI microcredentials, with pre/post learning measures, accuracy at verification tasks, ethical judgement scenarios, qualitative interviews, accessibility/usability feedback, and disaggregated fairness checks. Include safeguards to prevent sharing identifiable student records with public tools. Pre-register any primary outcomes and report sample sizes, missingness, effect sizes and limitations. Reflective qualitative thematic analysis may complement quantitative comparisons.

## What is needed beyond a browser demonstration

Server-validated identity, RBAC, verified course results and assessor signatures, versioned question sets and rubric, secure encrypted storage, privacy/guardian consent where applicable, privacy-by-design review, security audits, accessibility checks, bias evaluation by language/cultural context, learner safeguards, teacher training, support/service monitoring, incident response, real-world pilot evaluation, and documented routine production operation. These are preconditions for a credible TRL 9 case, not features present now.
