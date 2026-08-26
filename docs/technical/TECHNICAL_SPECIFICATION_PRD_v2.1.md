# TECHNICAL SPECIFICATION — PRD v2.1
## Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi + AI Content Engine

**Project Identity:** NGOCLOI  
**Product:** `luatsungocloi.vn`  
**Version:** 2.1  
**Status:** Review Draft — NOT AUTHORIZED FOR CODE  
**Technical Source of Truth:** This document after approval  
**Depends on:** `PRD_v2.1_Product_Requirements_Baseline_Luat_Su_Le_Thi_Ngoc_Loi_FINAL.md`

---

# 1. DOCUMENT CONTROL

## 1.1 Authority

1. Customer-confirmed product decisions / frozen PRD.
2. Design Specification.
3. This Technical Specification.
4. Implementation Plan.
5. Developer implementation detail.

Technical implementation MUST NOT silently change product requirements.

## 1.2 Project identity lock

This document belongs ONLY to the Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi project.

Do not import architecture, terminology, schema, business rules, or implementation decisions from ProfitCal or any unrelated project.

---

# 2. TECHNICAL GOALS

- Preserve existing public URLs where the PRD requires backward compatibility.
- Keep public content server-rendered/SEO-friendly.
- Keep CMS content dynamic; do not hard-code editable content.
- Enforce authorization server-side.
- Store consultation submissions independently from email delivery.
- Support Article ↔ PracticeArea N:N.
- Keep AI provider credentials server-side.
- Make AI generation Draft-only.
- Provide measurable evidence for every implementation phase.

---

# 3. CURRENT ARCHITECTURAL BASELINE

The existing application is treated as the implementation baseline. Before changing schema or routes, Antigravity MUST inspect the actual repository and report the exact current models/routes/services.

Target layers:

```text
Public UI
   ↓
Server / Route / Server Action
   ↓
Domain / Service Layer
   ↓
Prisma ORM
   ↓
PostgreSQL
```

External services:

```text
Application Server → Resend
Application Server → Gemini
```

Secrets MUST never be exposed to the browser.

---

# 4. DATA MODEL REQUIREMENTS

## 4.1 Site / settings

Existing site settings should remain the source for configurable website identity.

Required configurable values include, as applicable:

- Site name
- Logo
- Favicon
- Lawyer portrait
- Phone
- Email
- Address
- Facebook URL
- Zalo URL
- Consultation notification email
- SEO defaults

Do not create duplicate sources of truth for the same setting.

## 4.2 Navigation

Navigation records must support:

- label
- slug/link target
- enabled/disabled
- display order
- hierarchy where supported
- public visibility

Public rendering MUST only use enabled records.

## 4.3 Statistics

A CMS entity must support four editable statistics without source-code changes.

Minimum semantics:

```text
Statistic
- id
- value
- label
- displayOrder
- isActive
```

Seed values:

```text
800+
500+
10+
100%
```

The values are editable, not hard-coded.

## 4.4 Practice Area

Minimum semantics:

```text
PracticeArea
- id
- name/title
- slug
- description
- image/icon (if required by design)
- displayOrder
- isActive
- SEO fields as required
```

## 4.5 Article

Article must support:

- title
- slug
- summary/excerpt
- content
- featured image
- publish status
- publishedAt
- SEO title
- SEO description
- keywords where supported
- OG title
- OG description
- OG image
- canonical URL where supported
- timestamps

Public pages show Published content only.

## 4.6 Article ↔ PracticeArea: N:N

This is a mandatory v2.1 change.

```text
Article
   ↕
ArticlePracticeArea
   ↕
PracticeArea
```

A single article can belong to multiple practice areas.

Do NOT duplicate article records.

The existing 1-N relationship must be migrated carefully if it exists.

## 4.7 ConsultationLead

Required fields:

```text
ConsultationLead
- id
- fullName        REQUIRED
- phone           REQUIRED
- email           OPTIONAL
- message         REQUIRED
- createdAt
```

The product does NOT require a lead-status workflow. If an internal default status such as `NEW` is retained for technical compatibility, it MUST NOT create an Admin status-management feature unless separately approved.

## 4.8 AI generation

Minimum semantics:

```text
AIGeneration
- id
- userId
- siteId
- type
- status
- model
- inputTokens (if available)
- outputTokens (if available)
- estimatedCost (if available)
- result/draft reference
- risk flags where applicable
- createdAt
```

AI output must resolve to a Draft article/content state.

---

# 5. ROUTING

Existing route structure must be audited before modification.

Target public patterns include:

```text
/
/[menuSlug]
/[menuSlug]/[submenuSlug]
/[menuSlug]/[submenuSlug]/[articleSlug]
```

These are baseline examples derived from the current product architecture; Antigravity MUST reconcile them against the repository before implementation.

No route may be deleted or changed merely because PRD v2 leaves some legacy page architecture undecided.

---

# 6. PRACTICE AREA LISTING

For a Practice Area page:

1. Resolve current PracticeArea.
2. Query only Published Articles related to that PracticeArea.
3. Apply search against title OR content.
4. Keep search scoped to the current PracticeArea.
5. Apply pagination.
6. Preserve query state across pagination.
7. Return explicit empty state when no results.
8. Return explicit error state when query fails.

Search MUST be case-insensitive.

No advanced filters are required in this version.

---

# 7. ARTICLE DETAIL

Article detail must provide:

- published content
- relevant practice areas
- CTA to contact/consultation
- Facebook share
- Zalo share
- canonical/public URL
- related articles

Related articles:

- share at least one PracticeArea
- exclude current article
- Published only
- no duplicate cards
- hide the block when no result exists

The exact number/layout is a Design/Technical decision unless the frozen PRD states otherwise.

---

# 8. CONSULTATION FLOW

Required sequence:

```text
User submits
   ↓
Server-side validation
   ↓
Anti-spam validation
   ↓
Create ConsultationLead
   ↓
Return success to user
   ↓
Trigger email notification
```

Critical invariant:

> Email failure MUST NOT delete or rollback an already saved ConsultationLead.

Recommended implementation:

- Persist lead in a DB transaction.
- Send notification independently after persistence.
- Record email failure for operational diagnosis.
- Do not expose Resend API credentials client-side.

The exact async mechanism must be selected by implementation based on the deployed architecture; do not invent a queue if unnecessary.

---

# 9. EMAIL NOTIFICATION

Approved product/technical direction:

**Resend API**

Configuration must be Admin-editable for the notification recipient.

At minimum:

```text
CONSULTATION_NOTIFICATION_EMAIL
RESEND_API_KEY (secret)
```

The secret must be server-side only.

Email content should include:

- full name
- phone
- email if supplied
- consultation message
- submission time
- link/reference to Admin record if available

Email failure is an operational failure, not a lead-storage failure.

---

# 10. ANTI-SPAM

Required:

- server-side validation
- honeypot or equivalent low-friction mechanism
- rate limiting where appropriate
- reject obvious automated payloads
- do not trust client-side-only validation

Do not introduce intrusive CAPTCHA unless separately approved.

---

# 11. AUTH / RBAC

At minimum:

```text
ADMIN
SYSADMIN
```

SYSADMIN inherits all Admin capabilities and additionally controls AI Provider/system configuration.

Rules:

- Admin can manage website content.
- Admin can change own password.
- Admin cannot configure AI Provider.
- SYSADMIN can configure AI Provider.
- Authorization MUST be checked server-side.
- Hiding a UI menu is NOT authorization.

---

# 12. PASSWORD CHANGE

Both roles require self-service password change:

```text
Current password
New password
Confirm new password
```

Requirements:

- current password verification
- server-side validation
- secure password hashing
- no plaintext storage
- appropriate session/security handling

---

# 13. BRANDING / MEDIA

Required editable assets:

- logo
- favicon
- lawyer portrait
- other homepage media

Media must be referenced through CMS/media records, not hard-coded component paths.

If an asset is currently used, deletion must provide protection/warning.

---

# 14. AI TECHNICAL BOUNDARY

AI is available ONLY in:

```text
Admin → Articles → Create Article
```

Flow:

```text
Bullet points
   ↓
AI generation
   ↓
Draft outputs
   ↓
Human review/edit
   ↓
Save / Preview / Publish
```

AI outputs:

- title
- article content
- summary
- SEO title
- SEO description
- keywords
- article structure suggestion
- CTA

No standalone AI Studio, calendar, ideas dashboard, bulk generation, or AI rewrite in Edit Article.

---

# 15. GEMINI INTEGRATION

Use a provider abstraction.

```text
Application
   ↓
AI Provider Service
   ↓
Gemini Provider
   ↓
Gemini API
```

Never call Gemini directly from a client React component.

Provider credentials and model configuration belong to SYSADMIN.

Provider configuration must be server-side.

---

# 16. AI SAFETY / VERIFIED FACTS

AI must not invent:

- degrees
- awards
- cases
- clients
- professional history
- legal outcomes
- guarantees

Approved factual source content must be maintained as verified project knowledge.

When information is missing or uncertain, the system must use a clear review marker such as:

`[CẦN XÁC NHẬN]`

AI-generated legal content remains Draft until human review.

---

# 17. SEO

Public:

- semantic HTML
- title
- meta description
- canonical
- Open Graph
- sitemap
- robots
- SEO-friendly URLs
- appropriate structured data if approved in implementation

Draft/hidden articles must not be exposed as public content or sitemap entries.

Admin must be able to manage article SEO metadata.

---

# 18. PERFORMANCE

Performance is a quality requirement.

Rules inherited from the project lessons:

```text
REPRODUCE
  ↓
MEASURE
  ↓
LOCALIZE
  ↓
PROVE ROOT CAUSE
  ↓
AUTHORIZE CHANGE
  ↓
REGRESSION TEST
```

Do not jump from a user report of slowness directly to changing DB, ORM, region, cache, or architecture.

Any production performance incident must preserve a read-only forensic stage before code changes.

---

# 19. SECURITY

Required:

- server-side authorization
- secure password hashing
- input validation
- rich-text sanitization
- upload validation
- secret protection
- no API keys in client bundles
- no secrets in Git
- safe error handling
- audit logging where required

---

# 20. MIGRATION / BACKWARD COMPATIBILITY

Before migration:

1. Inspect current schema.
2. Produce migration impact report.
3. Backup database.
4. Map existing Article → PracticeArea relationship.
5. Migrate existing relation into ArticlePracticeArea.
6. Verify article counts and relation counts.
7. Verify public URLs.
8. Run acceptance tests.
9. Keep rollback procedure documented.

No destructive migration without explicit authorization.

---

# 21. TECHNICAL DEFINITION OF DONE

A technical feature is DONE only when:

- schema/API/service implementation matches approved spec
- server-side authorization works
- validation works
- error paths work
- data integrity invariants pass
- public behavior matches Design Specification
- responsive behavior passes
- tests pass
- evidence is recorded
- no unauthorized scope was added
- no known critical regression remains

---

# 22. STOP CONDITIONS

Antigravity MUST STOP and request decision if:

- PRD requirement is ambiguous
- two approved documents conflict
- migration risks data loss
- route compatibility is uncertain
- security boundary is unclear
- AI scope appears broader than approved
- implementation requires changing a frozen product decision
- a production issue cannot be localized with evidence
