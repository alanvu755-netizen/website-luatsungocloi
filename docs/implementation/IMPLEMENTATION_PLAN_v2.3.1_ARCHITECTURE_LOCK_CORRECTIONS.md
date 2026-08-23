# IMPLEMENTATION PLAN v2.3.1 — ARCHITECTURE LOCK CORRECTIONS

## WEBSITE GIỚI THIỆU LUẬT SƯ – THẠC SĨ LÊ THỊ NGỌC LỢI + AI CONTENT ENGINE

**Version:** 2.3.1  
**Status:** ARCHITECTURE LOCKED BASELINE — CORRECTION PATCH  
**Parent Baseline:** `IMPLEMENTATION_PLAN_v2.3`

---

## 1. PURPOSE

v2.3.1 is a correction patch to v2.3. It does not redesign the system.

Mandatory corrections:

1. Permission precedence.
2. Collection content publishing semantics.
3. AI schema completeness.
4. AI generation failure lifecycle.
5. AI quota semantics.

All v2.3 decisions not explicitly corrected here remain valid.

---

## 2. SOURCE OF TRUTH

Priority:

1. Customer-confirmed requirements + reference screenshot
2. Architecture Lock v2.3.1
3. PRD
4. Technical Specification
5. AI Add-on & Security Specification
6. AI Content Engine Specification
7. Design Specification
8. Implementation Plan v2.3.1
9. Master Prompt v2.3.1

If an unresolved conflict exists:

`STOP → record OPEN ISSUE → do not guess → do not silently change architecture`

---

## 3. ARCHITECTURE LOCK #9 — PERMISSION PRECEDENCE

Effective permission:

```text
UserPermission override
        >
RolePermission
        >
DENY
```

Rules:

```text
IF UserPermission exists:
    granted = true  → ALLOW
    granted = false → DENY
ELSE IF RolePermission exists:
    → ALLOW
ELSE:
    → DENY
```

Default is DENY.

Frontend permission checks are UX only. Security enforcement must be server-side.

Every mutation must check:

```text
Authentication
→ Site scope
→ Effective permission
→ Business rule
```

`SYSADMIN.siteId = null`, but platform access must still be represented by permissions and must not rely only on `role === SYSADMIN`.

---

## 4. ARCHITECTURE LOCK #10 — COLLECTION CONTENT PUBLISHING

Singleton:

```text
Hero
Introduction
Commitment
```

continue to use `draft*` and `pub*`.

Collections:

```text
Education
Experience
ExperienceHighlight
PracticeArea
ContactChannel
```

use a single record plus `status` in Phase 1.

Workflow:

```text
Create/Edit
    ↓
DRAFT
    ↓
Preview
    ↓
Publish
    ↓
PUBLISHED
```

`HIDDEN` is never public.

Public queries MUST filter:

```text
status = PUBLISHED
```

AI-generated CMS content always starts as `DRAFT`.

AI cannot publish.

---

## 5. ARCHITECTURE LOCK #11 — AI SCHEMA COMPLETENESS

Keep:

```text
AIProvider
AISiteConfig
AIKnowledgeItem
AIGeneration
AIUsage
GlobalAIConfig
AddOn
SiteAddOn
```

Do not add unnecessary Phase 1 `AIKnowledgeBase` or `AIAuditLog`.

Site-scoped knowledge uses:

```text
Site → AIKnowledgeItem[]
```

AI audit uses the shared `AuditLog`.

### AIPromptTemplate

Add:

```text
id
code
name
description
template
version
status
createdAt
updatedAt
```

`code` is unique.

Suggested codes:

```text
ARTICLE_GENERATE
ARTICLE_REWRITE
ARTICLE_EXPAND
ARTICLE_SHORTEN
SEO_GENERATE
CTA_GENERATE
```

Purpose: centrally manage prompt templates, versions, and policy rather than hard-coding prompts throughout business logic.

### Audit

Use `AuditLog` for:

```text
AI_GENERATION
AI_PROVIDER
AI_POLICY
AI_ADDON
AI_PROMPT_TEMPLATE
AI_QUOTA
AI_KILL_SWITCH
```

Never log secrets.

---

## 6. ARCHITECTURE LOCK #12 — AI GENERATION FAILURE LIFECYCLE

Lifecycle:

```text
REQUESTED
GENERATING
COMPLETED
FAILED
BLOCKED
```

Normal:

```text
REQUESTED → GENERATING → COMPLETED
```

Failures:

```text
REQUESTED → FAILED
REQUESTED → BLOCKED
GENERATING → FAILED
GENERATING → BLOCKED
```

Add:

```text
completedAt DateTime?
failedAt DateTime?
errorCode String?
```

Suggested structured error codes:

```text
PROVIDER_TIMEOUT
PROVIDER_RATE_LIMIT
PROVIDER_UNAVAILABLE
INVALID_PROVIDER_RESPONSE
INTERNAL_ERROR
GLOBAL_AI_DISABLED
ADDON_INACTIVE
PERMISSION_DENIED
QUOTA_EXCEEDED
RATE_LIMITED
POLICY_BLOCKED
INVALID_INPUT
```

`providerRequestId` may be stored for tracing but must not contain secrets.

Do not retain raw provider error payloads when they may contain sensitive context.

---

## 7. ARCHITECTURE LOCK #13 — AI QUOTA SEMANTICS

`AISiteConfig.monthlyQuota` means:

> Maximum number of AI generation requests allowed for a site during one calendar month.

Unit:

```text
requests
```

It is not a token quota.

If token limiting is implemented, use:

```text
monthlyTokenLimit
```

Unit:

```text
tokens
```

Recommended:

```text
monthlyQuota
monthlyTokenLimit
rateLimitRpm
```

### Usage source of truth

`AIUsage` is the single aggregation source:

```text
siteId
yearMonth
requestCount
totalTokens
totalCost
```

Unique:

```text
@@unique([siteId, yearMonth])
```

Do not add `usedQuota`.

### Idempotency

Every generation has a unique `requestId`.

Retrying the same `requestId` must not double-count.

Rules:

- Blocked before provider call → no provider usage count.
- Provider already called → count once, including provider failure.
- Retry same requestId → no second count.

---

## 8. AI AUTHORIZATION GATE

Every AI generation:

```text
Authentication
→ Active user
→ Site scope
→ Permission
→ Add-on ACTIVE
→ Global AI ENABLED
→ Quota
→ Rate Limit
→ Input Validation
→ Policy Validation
→ Provider Call
```

A failed gate results in DENY/BLOCKED and no provider call.

---

## 9. TENANT ISOLATION

Every site-scoped AI entity must have `siteId`.

AI context may contain only:

```text
Global Policy
+
Current Site Data
+
Current User Request
```

Site A must never access Site B data.

---

## 10. AI PROVIDER CONFIG

Do not hard-code a concrete model in Prisma `@default`.

Use:

```text
defaultModel
allowedModels
```

Validate:

```text
requestedModel ∈ allowedModels
```

---

## 11. GLOBAL AI KILL SWITCH

`GlobalAIConfig`:

```text
id = global
enabled
updatedAt
updatedById
```

When `enabled = false`, all generation is BLOCKED.

Changes must be audited.

Recommended relation:

```text
updatedById → AdminUser
```

---

## 12. PRACTICE AREA VISUAL LOCK

Keep:

```text
1 PracticeArea DB record
=
1 checklist item
```

UI:

```text
solid navy circular check icon
+
text
+
approved spacing
```

Do NOT use cards, grids, boxes, or tiles.

Reference:

```text
docs/design/customer-reference.png
```

---

## 13. REQUIRED SCHEMA CORRECTIONS

Minimum:

```text
+ AIPromptTemplate
+ AIGeneration.completedAt
+ AIGeneration.failedAt
+ AIGeneration.errorCode
+ AISiteConfig.monthlyTokenLimit (if token quota is implemented)
+ GlobalAIConfig.updatedBy relation
```

Do not add without an approved architecture change:

```text
AIKnowledgeBase
AIAuditLog
usedQuota
```

---

## 14. REQUIRED TEST MATRIX

### RBAC

```text
R-01 No permission → DENY
R-02 Role permission → ALLOW
R-03 User grant override → ALLOW
R-04 User revoke override → DENY
R-05 Wrong/missing site scope → DENY
```

### Collection publishing

```text
C-01 Create → DRAFT
C-02 Edit → DRAFT
C-03 Preview → authorized admin only
C-04 Publish → PUBLISHED
C-05 Public query → PUBLISHED only
C-06 HIDDEN → not public
```

### AI add-on

```text
A-01 Add-on inactive → BLOCKED
A-02 Add-on active + permission → ALLOW
A-03 Global AI OFF → BLOCKED
A-04 Quota exceeded → BLOCKED
A-05 RPM exceeded → BLOCKED
```

### AI lifecycle

```text
G-01 REQUESTED
G-02 GENERATING
G-03 COMPLETED
G-04 FAILED
G-05 BLOCKED
```

### Usage

```text
U-01 One request → +1
U-02 Retry same requestId → no double count
U-03 Provider failure after call → counted once
U-04 Blocked before provider → no provider usage count
```

### Secrets

```text
S-01 API key never reaches browser
S-02 API key never appears in logs
S-03 API key never stored plaintext in DB
S-04 SITE_ADMIN cannot access provider secret
```

---

## 15. FINAL ARCHITECTURE LOCK

After v2.3.1:

```text
ARCHITECTURE STATUS = LOCKED
```

No implementation change may alter:

- tenant model;
- RBAC semantics;
- permission precedence;
- Draft/Published semantics;
- AI entitlement model;
- AI usage source of truth;
- AI lifecycle;
- AI security boundary;
- provider secret architecture;
- PracticeArea visual architecture.

Any architecture change requires a new architecture version.

---

## 16. DEFINITION OF DONE

v2.3.1 correction is complete when:

- all five architecture locks are implemented;
- Prisma schema matches locked semantics;
- authorization tests pass;
- collection publishing tests pass;
- AI lifecycle tests pass;
- AI quota/idempotency tests pass;
- secret security tests pass;
- tenant isolation tests pass;
- no conflicting duplicate architecture remains.
