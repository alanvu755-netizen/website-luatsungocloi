# MASTER IMPLEMENTATION CONTROL — PRD v2.1
## Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi

**Project Identity:** NGOCLOI  
**Version:** 2.1  
**Status:** MASTER CONTROL — Review Draft

---

# 1. PURPOSE

This document controls how Antigravity executes the project.

It is designed to prevent:

- requirement drift
- repeated misunderstandings
- UI-first/logic-later inconsistency
- self-invented business rules
- uncontrolled scope expansion
- premature coding
- unsupported PASS claims

---

# 2. SOURCE-OF-TRUTH HIERARCHY

```text
1. Customer-confirmed decisions
2. PRD v2.1
3. Design Specification
4. Technical Specification
5. Implementation Plan
6. Acceptance Test Matrix
7. Antigravity implementation detail
```

If two documents conflict:

> STOP. Report the conflict. Do not choose silently.

---

# 3. PROJECT IDENTITY LOCK

Every report must identify:

```text
PROJECT: Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi
PRODUCT: luatsungocloi.vn
PROJECT ID: NGOCLOI
```

No ProfitCal content may be referenced or imported.

---

# 4. DECISION STATES

Every requirement/decision is one of:

```text
CONFIRMED
FROZEN
PROPOSED
UNDECIDED
IMPLEMENTED
VERIFIED
ACCEPTED
```

`UNDECIDED` means:

> Do not invent an answer.

---

# 5. ABSOLUTE NO-CODE RULE

During audit/planning gates:

- no source edits
- no schema migration
- no deployment
- no configuration mutation

Code begins only after explicit Phase 2 authorization.

---

# 6. UI/UX GATE

Before implementing public UI, Antigravity MUST:

1. open screenshot
2. identify layout hierarchy
3. map components
4. define responsive behavior
5. define states
6. define interactions
7. reconcile CMS data requirements
8. report ambiguities

Do not start by coding backend logic and “fit UI later”.

---

# 7. FORM LOGIC GATE

For every form, document:

```text
Fields
Required/optional
Validation
Submit state
Loading state
Success state
Error state
Persistence
Notification
Failure behavior
Anti-spam
Permission
```

No form logic may be invented during coding.

---

# 8. ADMIN UX GATE

For every editable CMS entity, specify:

- list view
- create
- edit
- delete
- enable/disable where applicable
- order where applicable
- validation
- save state
- error state
- confirmation behavior

Admin should be able to manage normal website content without source-code changes.

---

# 9. BACKEND / DATA GATE

Backend behavior must be traceable to a documented requirement.

Before schema migration:

- inspect current schema
- map old → new
- backup
- define rollback
- test relation counts
- verify URL behavior

---

# 10. AI CONTROL GATE

AI is locked to:

```text
Articles → Create Article → AI Assist
```

AI:

- generates Draft
- never auto-publishes
- never exposes provider secret
- cannot invent verified professional facts
- cannot expand into excluded AI modules

SYSADMIN controls Provider configuration.

---

# 11. PERFORMANCE FORENSIC GATE

When a slow issue appears:

```text
USER REPORT
 ↓
REPRODUCE
 ↓
WATERFALL / TRACE
 ↓
MEASURE EACH LAYER
 ↓
LOCALIZE
 ↓
PROVE ROOT CAUSE
 ↓
PROPOSE CHANGE
 ↓
PO AUTHORIZATION
 ↓
CHANGE
 ↓
REGRESSION
```

A server-side fast TTFB does not prove the browser is fast.

A browser stall does not prove the database is slow.

No architectural change is authorized from assumption alone.

---

# 12. IMPLEMENTATION ORDER

Preferred sequence:

```text
UI/UX Foundation
↓
Data Model
↓
Core Services
↓
Admin CMS
↓
Public Homepage
↓
Practice Area / Article
↓
Consultation
↓
AI
↓
SEO / Security / Performance
↓
Acceptance
```

This does not permit skipping dependencies; Antigravity must explain any necessary deviation.

---

# 13. FEATURE DoD

A feature is DONE only if:

- requirement implemented
- UI matches design
- UX states implemented
- data flow works
- permissions work
- validation works
- error handling works
- responsive behavior works
- tests pass
- evidence exists
- no unauthorized scope added

---

# 14. REPORTING FORMAT

At every gate Antigravity must report:

### A. Scope completed
What was actually changed.

### B. Traceability
Which requirement/document section it satisfies.

### C. Files affected
Exact file paths.

### D. Tests
Commands/scenarios executed.

### E. Evidence
Screenshots/logs/results.

### F. Remaining
What is not complete.

### G. Risks
Known risks.

### H. Decisions
Anything requiring PO approval.

---

# 15. STOP CONDITIONS

STOP if:

- requirement ambiguity affects behavior
- documents conflict
- migration may lose data
- security boundary is unclear
- UI behavior is not defined
- AI scope is unclear
- performance root cause is unproven
- implementation requires changing frozen scope
- test evidence is unavailable

---

# 16. NO FALSE COMPLETION

Never say:

- “complete” without evidence
- “production ready” without acceptance
- “root cause identified” without proof
- “performance fixed” without before/after measurement
- “secure” without security tests

---

# 17. PO / CHATGPT / ANTIGRAVITY OPERATING MODEL

```text
PROJECT OWNER
  ↓
Product decisions / acceptance
  ↓
CHATGPT
  ↓
Product interpretation / QA / control
  ↓
ANTIGRAVITY
  ↓
Design / technical implementation
  ↓
Evidence
  ↓
CHATGPT + PO
  ↓
Acceptance
```

The Product Owner monitors and controls rather than micromanaging code.

---

# 18. PHASE GATES

```text
PHASE 0 — AUDIT
    ↓
PHASE 1 — SPECIFICATION
    ↓
PO REVIEW
    ↓
DOCUMENT FREEZE
    ↓
PHASE 2 — IMPLEMENTATION AUTHORIZATION
    ↓
BUILD
    ↓
QA / EVIDENCE
    ↓
PO ACCEPTANCE
```

No implicit phase transition.
