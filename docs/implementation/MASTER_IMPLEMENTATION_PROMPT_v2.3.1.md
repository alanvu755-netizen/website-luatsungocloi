# MASTER IMPLEMENTATION PROMPT v2.3.1
## ANTIGRAVITY — ARCHITECTURE-LOCKED IMPLEMENTATION

You are implementing:

> WEBSITE GIỚI THIỆU LUẬT SƯ – THẠC SĨ LÊ THỊ NGỌC LỢI + AI CONTENT ENGINE

Your task is to IMPLEMENT the approved architecture, not redesign it.

---

# 1. READ THE APPROVED DOCUMENTS FIRST

Read these before modifying code:

```text
docs/product/PRD_Website_Luat_Su_Le_Thi_Ngoc_Loi.md
docs/technical/TECHNICAL_SPECIFICATION_Website_Luat_Su_Le_Thi_Ngoc_Loi.md
docs/technical/AI_ADDON_SECURITY_SPECIFICATION.md
docs/product/AI_CONTENT_ENGINE_SPECIFICATION.md
docs/design/DESIGN_SPECIFICATION_Website_Luat_Su_Le_Thi_Ngoc_Loi.md
docs/implementation/IMPLEMENTATION_PLAN_v2.3.1_ARCHITECTURE_LOCK_CORRECTIONS.md
docs/design/customer-reference.png
```

Also read the existing `IMPLEMENTATION_PLAN_v2.3` if present.

If filenames differ slightly, locate the corresponding approved document. Do not replace them with unrelated project material.

---

# 2. SOURCE-OF-TRUTH PRIORITY

```text
1. Customer-confirmed requirements + reference screenshot
2. Architecture Lock v2.3.1
3. PRD
4. Technical Specification
5. AI Add-on & Security Specification
6. AI Content Engine Specification
7. Design Specification
8. Implementation Plan v2.3.1
9. This prompt
```

This prompt is an implementation package and does not override the source documents.

If a conflict cannot be resolved:

```text
STOP
→ record OPEN ISSUE
→ identify the exact conflict
→ do not invent a solution
→ do not silently change architecture
```

---

# 3. ABSOLUTE IMPLEMENTATION RULES

MUST NOT:

- redesign the approved architecture;
- replace the approved stack without approval;
- change tenant architecture;
- invent customer facts;
- expose secrets;
- bypass server-side authorization;
- auto-publish AI content;
- fabricate professional/legal credentials;
- allow cross-site data access;
- introduce unnecessary architecture.

MUST:

- implement the locked schema semantics;
- keep security-sensitive logic server-side;
- write tests for security boundaries;
- provide evidence for completion.

---

# 4. APPROVED STACK

Use the approved stack:

```text
Next.js App Router
TypeScript strict
Tailwind CSS
shadcn/ui
PostgreSQL
Prisma
Zod
```

Do not change the stack without approval.

---

# 5. TENANT ARCHITECTURE

`Site` is the root tenant scope.

All site data must be scoped:

```text
CMS
Media
Settings
SEO
Contact Channels
AI Config
AI Knowledge
AI Generation
AI Usage
Audit Logs
```

Rules:

```text
SYSADMIN.siteId = null
SITE_ADMIN.siteId = required
EDITOR.siteId = required
```

Never trust a browser-supplied `siteId`. Derive and validate scope from the authenticated session.

---

# 6. RBAC AND PERMISSION PRECEDENCE

Roles:

```text
SYSADMIN
SITE_ADMIN
EDITOR
```

Models:

```text
Role
RolePermission
Permission
UserPermission
```

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
UserPermission.granted = true
→ ALLOW

UserPermission.granted = false
→ DENY

No UserPermission:
    matching RolePermission
    → ALLOW

No matching permission
→ DENY
```

Default is DENY.

Frontend checks are UX only. Server-side authorization is mandatory for every sensitive operation.

Every mutation:

```text
Authentication
→ Site scope
→ Effective permission
→ Business rule
```

Do not implement an insecure role-only bypass.

---

# 7. CMS PUBLISHING

Singletons:

```text
Hero
Introduction
Commitment
```

Use `draft*` and `pub*`.

Public uses only `pub*`.

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
→ DRAFT
→ Preview
→ Publish
→ PUBLISHED
```

`HIDDEN` is never public.

Public queries MUST filter:

```text
status = PUBLISHED
```

AI-generated CMS content always begins as `DRAFT`.

AI cannot publish.

---

# 8. AI ADD-ON ENTITLEMENT

Add-on:

```text
AI_CONTENT_ENGINE
```

Statuses:

```text
ACTIVE
SUSPENDED
EXPIRED
DISABLED
```

Every AI generation requires:

```text
Authenticated
+
Active user
+
Correct site scope
+
Permission
+
Add-on ACTIVE
+
Global AI enabled
+
Quota available
+
Rate limit available
+
Valid input
+
Policy allowed
```

Any failed gate:

```text
DENY / BLOCKED
```

No provider call after a blocked gate.

---

# 9. GLOBAL AI KILL SWITCH

Use:

```text
GlobalAIConfig
```

with:

```text
id = "global"
enabled
updatedAt
updatedById
```

When disabled:

```text
ALL AI GENERATION = BLOCKED
```

Audit the change.

---

# 10. GEMINI PROVIDER

Use a provider abstraction:

```text
AIProvider
└── GeminiProvider
```

Execution flow:

```text
Browser
→ Server Action/API
→ Authorization
→ AI Service
→ AIProvider
→ Gemini
```

Gemini credentials are server-side only.

Never expose credentials in:

```text
browser
client bundle
HTML
localStorage
public environment variables
Git
plaintext DB
logs
analytics
```

Use secret-management references.

---

# 11. MODEL CONFIGURATION

Do not hard-code a concrete Gemini model in Prisma `@default`.

Use:

```text
defaultModel
allowedModels
```

Validate:

```text
requestedModel ∈ allowedModels
```

before provider execution.

---

# 12. AI CONTENT ENGINE

Admin functions:

```text
Generate
Rewrite
Expand
Shorten
Improve
SEO
CTA
```

Supported CMS content:

```text
Introduction
Professional profile
Education
Career experience
Practice areas
Commitment
Articles
FAQ
SEO
CTA
```

AI Content Studio is available only when:

```text
AI_CONTENT_ENGINE = ACTIVE
```

and the current user has the required permission.

---

# 13. VERIFIED INFORMATION / SAFETY

AI context must distinguish verified information.

AI MUST NOT invent:

```text
degrees
positions
organizations
years of experience
awards
clients
case results
credentials
legal outcomes
```

Do not generate guaranteed outcomes.

If required facts are missing, use:

```text
[CẦN XÁC NHẬN]
```

or a risk flag.

This Phase 1 module is for professional/marketing content and must not be presented as an automated legal-advice system.

---

# 14. AI PROMPT HIERARCHY

Use:

```text
SYSTEM POLICY
↓
GLOBAL AI POLICY
↓
SITE BRAND VOICE
↓
SITE VERIFIED FACTS
↓
SITE KNOWLEDGE
↓
CURRENT TASK
```

Lower levels cannot override higher levels.

---

# 15. AI PROMPT TEMPLATE

Implement:

```text
AIPromptTemplate
```

Minimum fields:

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

Suggested:

```text
ARTICLE_GENERATE
ARTICLE_REWRITE
ARTICLE_EXPAND
ARTICLE_SHORTEN
SEO_GENERATE
CTA_GENERATE
```

Templates must be versioned.

---

# 16. AI GENERATION LIFECYCLE

Use exactly:

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

Technical/provider failure:

```text
→ FAILED
```

Security/business rejection:

```text
→ BLOCKED
```

Add:

```text
completedAt
failedAt
errorCode
```

Suggested error codes:

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

Do not store raw provider error payloads when they may expose sensitive information.

---

# 17. AI QUOTA AND USAGE

`AISiteConfig.monthlyQuota` means:

> Maximum AI generation requests allowed for a site during one calendar month.

Unit:

```text
requests
```

It is not tokens.

If token limiting is implemented:

```text
monthlyTokenLimit
```

Unit:

```text
tokens
```

Usage source of truth:

```text
AIUsage
```

Fields:

```text
siteId
yearMonth
requestCount
totalTokens
totalCost
```

Unique:

```text
siteId + yearMonth
```

Do not add:

```text
usedQuota
```

---

# 18. IDEMPOTENCY

Each generation has a unique:

```text
requestId
```

Same requestId must never double-count.

Rules:

```text
Blocked before provider call
→ no provider usage count

Provider already called
→ count once even if provider fails

Retry same requestId
→ no second count
```

Use transactions/idempotency around:

```text
AIGeneration
+
AIUsage
```

---

# 19. AI KNOWLEDGE

Phase 1 uses:

```text
AIKnowledgeItem
```

scoped by:

```text
siteId
```

Do not introduce an unnecessary `AIKnowledgeBase`.

Site A must never access Site B knowledge.

---

# 20. AUDIT LOGGING

Use:

```text
AuditLog
```

for:

```text
AI_GENERATION
AI_PROVIDER
AI_ADDON
AI_PROMPT_TEMPLATE
AI_QUOTA
AI_KILL_SWITCH
AI_POLICY
```

Never log:

```text
API keys
passwords
secrets
credential values
```

---

# 21. ADMIN INFORMATION ARCHITECTURE

SYSADMIN:

```text
System Admin
├── Websites / Clients
├── Users & Roles
├── Add-ons
│   └── AI Content Engine
├── AI Platform
│   ├── Providers
│   ├── Models
│   ├── Prompt Templates
│   ├── Global Policy
│   └── Usage
└── Audit Logs
```

SITE_ADMIN:

```text
Dashboard
Content
Media
SEO
Contact
AI Content Studio
AI Knowledge
AI Verified Information
Brand Voice
```

SITE_ADMIN must not see provider secrets, global policy editing, platform-wide add-on management, or other sites.

---

# 22. CONTACT CHANNELS

Keep admin-configurable:

```text
ZALO
TELEGRAM
FACEBOOK
```

Each has ON/OFF control.

Public website displays enabled channels only.

Do not hard-code these channels into the public UI.

---

# 23. PRACTICE AREAS VISUAL LOCK

One `PracticeArea` record equals one checklist item.

Use:

```text
solid navy circular check icon
+
text
```

Do NOT use:

```text
cards
grid boxes
tiles
```

Reference:

```text
docs/design/customer-reference.png
```

---

# 24. PUBLIC WEBSITE

The public website is CMS-driven.

Do not hard-code customer content inside components.

Public reads only published data.

Never expose:

```text
DRAFT
HIDDEN
unpublished AI content
```

AI infrastructure must not alter the public design unless approved content has been published.

---

# 25. DATABASE / MIGRATION

Before migration:

1. Compare current Prisma schema with the locked schema.
2. Preserve compatible existing data.
3. Create safe migrations.
4. Do not drop production data without explicit approval.
5. Run Prisma validation.
6. Run migrations in development/test first.
7. Run seed.
8. Verify relations and tenant constraints.

Required corrections:

```text
+ AIPromptTemplate
+ AIGeneration.completedAt
+ AIGeneration.failedAt
+ AIGeneration.errorCode
+ AISiteConfig.monthlyTokenLimit (if token quota is implemented)
+ GlobalAIConfig.updatedBy relation
```

Do not add without architecture approval:

```text
AIKnowledgeBase
AIAuditLog
usedQuota
```

---

# 26. REQUIRED TEST MATRIX

## RBAC

```text
No permission → DENY
Role permission → ALLOW
User grant override → ALLOW
User revoke override → DENY
Wrong site → DENY
```

## CMS

```text
Create → DRAFT
Edit → DRAFT
Preview → authorized only
Publish → PUBLISHED
Hide → HIDDEN
Public → PUBLISHED only
```

## AI

```text
Add-on inactive → BLOCKED
Global AI off → BLOCKED
No permission → BLOCKED
Quota exceeded → BLOCKED
Rate limit exceeded → BLOCKED
Valid → REQUESTED → GENERATING → COMPLETED
Provider failure → FAILED
Policy rejection → BLOCKED
```

## Usage

```text
One request → +1
Retry same requestId → no double count
Provider failure after call → counted once
Blocked before provider → no provider usage count
```

## Secret security

```text
API key absent from browser
API key absent from logs
API key not plaintext in DB
SITE_ADMIN cannot access provider secret
```

---

# 27. VISUAL QA

Compare against:

```text
docs/design/customer-reference.png
```

Required widths:

```text
375
390
412
768
1024
1280
1440
1920
```

Verify:

```text
typography
spacing
imagery
colors
section hierarchy
checklist visual
contact behavior
responsive behavior
```

Do not redesign away from the reference.

---

# 28. IMPLEMENTATION ORDER

```text
PHASE A — Foundation
↓
PHASE B — Database
↓
PHASE C — Auth / RBAC
↓
PHASE D — Admin CMS
↓
PHASE E — Public Website
↓
PHASE F — Core Integration
↓
PHASE H — AI Content Engine
↓
PHASE I — AI Security / Usage / Audit
↓
PHASE G — Final QA / Production Readiness
```

Do not build AI before its dependencies are complete.

---

# 29. REQUIRED COMPLETION REPORT

Do not report only “Done”.

Return:

```text
1. Architecture status
2. Implementation status
3. Test status
4. Files changed
5. Database migration
6. RBAC verification
7. Tenant isolation verification
8. AI add-on verification
9. Gemini verification
10. Secret security verification
11. Quota/idempotency verification
12. AI lifecycle verification
13. CMS verification
14. Visual QA
15. Build/lint/test results
16. Remaining issues
```

Use exactly:

```text
ARCHITECTURE STATUS:
LOCKED

IMPLEMENTATION STATUS:
NOT STARTED / IN PROGRESS / COMPLETE

TEST STATUS:
NOT RUN / PASS / FAIL
```

Never claim PASS without evidence.

---

# 30. FINAL GATE

Implementation is NOT complete until:

```text
[ ] Tenant architecture correct
[ ] RBAC correct
[ ] Permission precedence correct
[ ] CMS Draft/Published correct
[ ] Public reads Published only
[ ] AI add-on entitlement correct
[ ] Global kill switch works
[ ] Gemini server-side only
[ ] Secrets protected
[ ] AI prompt hierarchy correct
[ ] Verified Facts protected
[ ] AI lifecycle correct
[ ] AI quota correct
[ ] Usage idempotent
[ ] Tenant isolation tested
[ ] Audit logging works
[ ] No AI auto-publish
[ ] Zalo/Telegram/Facebook toggles work
[ ] Practice Area visual matches reference
[ ] Responsive QA passed
[ ] Production build passed
[ ] Tests passed
```

---

# 31. FINAL INSTRUCTION

Implement the approved architecture.

Do not redesign it.

Do not invent unknown customer information.

Do not weaken security for convenience.

Do not expose secrets.

Do not allow AI to publish automatically.

Do not silently change schema semantics.

If blocked by ambiguity:

```text
STOP
→ OPEN ISSUE
→ report the exact conflict
→ wait for clarification
```

Otherwise proceed phase-by-phase and provide evidence at every major gate.
