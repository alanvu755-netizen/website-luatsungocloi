# AI ADD-ON & SECURITY TECHNICAL SPECIFICATION
## WEBSITE GIỚI THIỆU LUẬT SƯ – THẠC SĨ LÊ THỊ NGỌC LỢI

**Version:** 1.0  
**Status:** Approved for implementation  
**Security Level:** Production requirement

## 1. Architectural Principle

AI là optional paid add-on. Không dùng role để quyết định trực tiếp quyền AI. Điều kiện Allow:

```text
Authenticated User
+ Correct Site/Tenant
+ Permission
+ AI Add-on ACTIVE
+ Global AI Platform ON
+ Quota Available
+ Rate Limit OK
+ Policy Allowed
= ALLOW
```

Bất kỳ điều kiện nào fail → DENY. Authorization phải enforce ở server-side.

## 2. Roles

### SYSADMIN
Quản lý sites, users, roles, permissions, add-ons, AI providers, models, global AI policies, prompts, usage, quota, rate limits, audit và emergency kill switch.

### SITE_ADMIN
Chỉ quản lý site của mình: CMS, Media, SEO, Contact, AI Content Studio nếu entitlement active, Brand Voice, Verified Facts, Knowledge Base và AI generation theo permission.

Không được xem API key, provider secret, global policy, global prompt hoặc quản lý add-on/provider.

### EDITOR
Chỉ có permissions được cấp; không mặc định có system/add-on/provider/secret management.

## 3. Permissions

Tối thiểu:

```text
CONTENT_READ
CONTENT_WRITE
CONTENT_PUBLISH
AI_CONTENT_USE
AI_CONTENT_GENERATE
AI_CONTENT_REGENERATE
AI_SETTINGS_READ
AI_SETTINGS_WRITE
AI_USAGE_READ
AI_USAGE_EXPORT
ADDON_READ
ADDON_MANAGE
AI_PROVIDER_READ
AI_PROVIDER_MANAGE
AI_POLICY_READ
AI_POLICY_MANAGE
AUDIT_LOG_READ
AI_KILL_SWITCH
```

Backend phải kiểm tra permission.

## 4. Add-on Entitlement

Add-on: `AI_CONTENT_ENGINE`.

Status: `ACTIVE`, `SUSPENDED`, `EXPIRED`, `DISABLED`.

Khuyến nghị model:

```text
AddOn
SiteAddOn
- siteId
- addOnId
- planId
- status
- activatedAt
- expiresAt
```

## 5. Admin Information Architecture

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
│   ├── Global Policies
│   └── Usage
├── Billing / Plans
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

Nếu add-on chưa ACTIVE, AI Content Studio không cho generate và không hiển thị secrets/system configuration.

## 6. Gemini Provider

Phase 1: `AIProvider → GeminiProvider`. Không gọi Gemini SDK trực tiếp từ React component. Provider abstraction phải cho phép mở rộng provider khác sau này.

## 7. Credential Security

Gemini API key là secret. Không đưa key vào browser, client bundle, HTML, response, Git, logs, analytics hoặc error tracking.

```text
Browser → Application Server → Secret Manager → Gemini API
```

Database chỉ lưu `credentialRef`, không lưu plaintext API key.

## 8. Provider Configuration

SYSADMIN có thể cấu hình Provider, Model, Status, Credential Reference, Default Model và Allowed Models. Không hiển thị secret value sau khi lưu. Có Validate Connection, Rotate Credential và Disable Provider.

## 9. Customer API Key Mode

Architecture sẵn sàng cho `PLATFORM_MANAGED` và `CUSTOMER_MANAGED`. Phase 1 có thể triển khai Platform Managed trước.

## 10. AI Policy

Global policy tối thiểu:

```text
Human approval required = ON
Auto publish = OFF
No invented credentials = ON
No invented legal facts = ON
No guaranteed outcomes = ON
No confidential client data = ON
No sensitive personal data = ON
```

Site Admin không được disable policy bắt buộc.

## 11. Prompt Hierarchy

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

Lower-level prompt không override higher-level policy.

## 12. Server-side Authorization Flow

```text
Request
↓ Authentication
↓ Session Validation
↓ Site/Tenant Validation
↓ Role Permission Check
↓ Add-on Entitlement Check
↓ Global AI Status
↓ AI Policy
↓ Quota Check
↓ Rate Limit
↓ Input Validation
↓ Build Context
↓ Gemini Call
↓ Output Validation
↓ Save Draft
↓ Audit Log
```

Frontend check chỉ là UX; backend check là security boundary.

## 13. Tenant Isolation

Mọi AI entity phải có site scope: `AIGeneration.siteId`, `AIUsage.siteId`, `AIKnowledgeBase.siteId`, `AIKnowledgeItem.siteId`, `AISettings.siteId`.

Không cho Site A đọc Site B. AI context chỉ lấy global policy + current site data + current user request.

## 14. Quota

Configurable: `monthlyGenerationLimit`, `monthlyTokenLimit`, `maxTokensPerRequest`, `requestsPerMinute`, `allowedModels`.

Threshold: 80% warning, 90% warning, 100% hard limit.

## 15. Cost Guard

Track request, inputTokens, outputTokens, model, estimatedCost, timestamp, siteId, userId. SYSADMIN xem toàn hệ thống; SITE_ADMIN chỉ xem site của mình.

## 16. Rate Limit

Giới hạn login, AI generation, AI regeneration và AI endpoints. Enforce server-side.

## 17. AI Kill Switch

SYSADMIN có `AI Platform Status: ON/OFF`. Khi OFF, mọi generation bị DENY.

## 18. AI Generation Storage

Tối thiểu:

```text
AIGeneration
- id
- siteId
- userId
- type
- model
- status
- inputTokens
- outputTokens
- estimatedCost
- resultDraftId
- riskFlags
- createdAt
```

Prompt content phải được đánh giá privacy; dữ liệu nhạy cảm phải redact/hash hoặc không lưu full content.

## 19. Audit Log

Audit: add-on activation/suspension/expiry, permission changes, provider/model/policy/prompt changes, quota changes, generation, regeneration, kill switch và publish. Không log secrets, passwords hoặc credentials.

## 20. Database Additions

Khuyến nghị:

```text
AddOn
SiteAddOn
Role
Permission
RolePermission
UserRole / UserPermission
AIProvider
AISiteConfig
AIPromptTemplate
AIKnowledgeBase
AIKnowledgeItem
AIGeneration
AIUsage
AIAuditLog
```

Tên model có thể điều chỉnh theo schema hiện tại nhưng phải giữ semantics.

## 21. Security Tests

Bắt buộc test: unauthenticated admin deny; Site Admin không đọc secret/global policy/add-on management; Editor không publish nếu thiếu permission; Site A không đọc Site B; add-on OFF deny; global AI OFF deny; quota/rate limit deny; AI generation chỉ tạo Draft; API key không xuất hiện browser/client bundle/logs; Draft không public.

## 22. Definition of Done

RBAC, entitlement, tenant isolation, server-side Gemini integration, secret protection, quota, rate limit, usage, cost guard, kill switch, audit, AI safety và security tests đều PASS.
