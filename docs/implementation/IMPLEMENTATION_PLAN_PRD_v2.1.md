# IMPLEMENTATION PLAN — PRD v2.1
## Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi

**Project Identity:** NGOCLOI  
**Version:** 2.1  
**Status:** Planning Only — Phase 2 requires explicit PO authorization

---

# 1. IMPLEMENTATION PRINCIPLES

Antigravity MUST:

- implement from approved documents
- not infer missing product requirements
- not expand scope as “best practice”
- preserve approved URLs/data where required
- prove each phase with evidence
- stop on contradictions
- never deploy without authorization

The implementation order prioritizes:

```text
Understand
→ Lock UI/UX
→ Lock Data
→ Implement Core Services
→ Implement CMS
→ Implement Public UI
→ Integrate AI
→ QA
→ Acceptance
```

---

# 2. PHASE 0 — REPOSITORY AUDIT

Status: COMPLETED.

Evidence expected from existing audit:

- current routes
- current schema
- current Admin/RBAC
- current Article model
- current Practice Area model
- current AI implementation
- current media/branding
- current email capability
- current performance observations

No code changes.

---

# 3. PHASE 1 — SPECIFICATION / CONTROL

Status: COMPLETED WITH CONDITIONS.

Controls:

1. UI/UX Specification & Wireframe Logic Gate
2. Feature-level Definition of Done
3. AI Behavior Contract
4. Data Migration & Backward Compatibility Plan

No code/migration/deploy during planning.

---

# 4. PHASE 2 — IMPLEMENTATION AUTHORIZATION GATE

Before coding, PO must explicitly authorize:

```text
PHASE 2 AUTHORIZED
```

Antigravity must not interpret review comments as authorization.

---

# 5. STEP 1 — UI FOUNDATION

Goal:

- implement/lock design tokens
- shared header/footer
- responsive container
- buttons
- cards
- typography
- form primitives
- loading/error/empty primitives

Acceptance:

- no page-specific duplication where shared components are appropriate
- visual system consistent with screenshot
- no business data hard-coded

---

# 6. STEP 2 — DATA MODEL / MIGRATION

Implement only after schema review.

Required changes include, as applicable:

- Statistics CMS entity
- ConsultationLead
- ArticlePracticeArea N:N
- required settings/configuration fields
- AI entities only to the approved scope

Migration sequence:

```text
Backup
→ Migration
→ Data mapping
→ Relation verification
→ URL verification
→ Test
```

No destructive migration without explicit authorization.

---

# 7. STEP 3 — CORE SERVICES

Implement:

- Practice Area querying
- Article querying
- search
- pagination
- related articles
- consultation persistence
- email notification
- media/branding persistence
- password change
- authorization

All services must have explicit validation/error behavior.

---

# 8. STEP 4 — ADMIN CMS

Admin must support:

### Homepage

- profile content
- education
- experience
- practice areas
- statistics
- news
- branding
- contact configuration

### Navigation

- enable/disable
- order
- supported page target

### Articles

- create
- edit
- preview
- publish
- SEO
- featured image
- multi-PracticeArea selection

### Consultation

- view submissions
- view details
- no status workflow

### Account

- change password

### SYSADMIN

- AI Provider/system configuration

---

# 9. STEP 5 — HOMEPAGE

Implement the screenshot faithfully.

Mandatory areas:

- Header
- Hero
- Profile
- Education
- Experience
- Practice Areas
- Statistics
- Commitment
- News
- Consultation
- Footer

Perform screenshot comparison before calling UI complete.

---

# 10. STEP 6 — PRACTICE AREA + ARTICLE PUBLIC SYSTEM

Implement:

```text
Practice Area
  ↓
Article list
  ├── Search title/content
  ├── Pagination
  ├── Empty
  └── Error
       ↓
Article detail
  ├── CTA
  ├── Facebook
  ├── Zalo
  └── Related Articles
```

Preserve Practice Area context across search/pagination.

---

# 11. STEP 7 — CONSULTATION FLOW

Implement:

```text
Validate
→ Anti-spam
→ Save Lead
→ Return success
→ Notify Admin
```

Email failure cannot delete lead.

Test:

- valid submission
- missing required fields
- optional email absent
- invalid phone/input
- spam
- email provider failure
- duplicate submission behavior as applicable

---

# 12. STEP 8 — AI ARTICLE CREATION

Only after core article creation works manually.

Implement:

- bullet input
- AI generate
- structured output
- Draft mapping
- editable result
- error preservation
- provider abstraction
- SYSADMIN provider configuration

Do not build excluded AI modules.

---

# 13. STEP 9 — SEO / ACCESSIBILITY / PERFORMANCE

Verify:

- metadata
- canonical
- sitemap
- robots
- semantic headings
- alt text
- keyboard navigation
- responsive layouts
- image optimization
- no unnecessary client JS

For performance incidents:

```text
Reproduce
→ Measure
→ Localize
→ Prove
→ Authorize
→ Change
→ Regression test
```

---

# 14. STEP 10 — INTEGRATION / ACCEPTANCE

Run full acceptance suite.

Evidence must include:

- screenshots
- test results
- route checks
- DB migration verification
- authorization tests
- AI security tests
- responsive tests
- SEO checks
- production smoke test where authorized

---

# 15. PHASE EXIT CRITERIA

A phase cannot be declared complete based only on “code is finished”.

Required:

- scope complete
- tests pass
- visual QA pass
- data integrity pass
- security pass
- evidence recorded
- no unresolved critical blocker
- PO gate satisfied
