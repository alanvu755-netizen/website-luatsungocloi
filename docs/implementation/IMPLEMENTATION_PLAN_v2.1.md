# IMPLEMENTATION PLAN v2.1
## WEBSITE GIỚI THIỆU LUẬT SƯ – THẠC SĨ LÊ THỊ NGỌC LỢI
## + AI CONTENT ENGINE PAID ADD-ON

**Version:** 2.1.0  
**Status:** Implementation Baseline / Frozen  
**Supersedes:** Implementation Plan v2.0  
**Primary stack:** Next.js App Router + TypeScript Strict + Tailwind CSS + PostgreSQL + Prisma + shadcn/ui

## 1. Executive Summary

Giữ nguyên nền tảng website v2.0 và bổ sung chính thức `AI_CONTENT_ENGINE` như optional paid add-on. AI có entitlement riêng, RBAC, quota, usage tracking, security controls và Gemini server-side integration.

Không biến AI thành feature hard-coded chỉ cho website này.

## 2. Source of Truth

```text
1. PRD
2. Technical Specification
3. Design Specification
4. Customer Reference Screenshot
5. AI Content Engine Specification
6. AI Add-on & Security Technical Specification
7. Master Implementation Prompt
8. Implementation Plan v2.1
```

Conflict không giải quyết được → STOP → OPEN ISSUE.

## 3. Core Requirements

Giữ nguyên v2.0: CMS-driven, visual fidelity, no invented legal content, CRUD, Draft/Preview/Publish, Contact Channels, Zalo/Telegram/Facebook ON/OFF, Floating Contact, Media, SEO, Auth, server-side authorization, responsive QA và production readiness.

## 4. New Product Module

`AI_CONTENT_ENGINE` với status `ACTIVE`, `SUSPENDED`, `EXPIRED`, `DISABLED`.

Allow khi:

```text
User Permission
+ Site Add-on ACTIVE
+ Global AI ON
+ Quota Available
+ Policy Allowed
= AI Allowed
```

## 5. Architecture

```text
SYSADMIN
  ↓
System Admin Console
  ↓
Add-on / AI Platform / Usage
  ↓
AI_CONTENT_ENGINE
  ↓
SITE
  ↓
SITE_ADMIN / EDITOR
  ↓
AI Content Studio
  ↓
AI Service
  ↓
Gemini Provider
  ↓
AI Draft
  ↓
Human Review → Preview → Publish
```

## 6. Phase A — Foundation

Giữ Next.js App Router, TypeScript strict, Tailwind, shadcn/ui, Prisma, PostgreSQL, Auth và validation foundation. Bổ sung Permission, Add-on, AI Provider và secure configuration abstraction.

## 7. Phase B — Database & Services

Giữ existing models: AdminUser, SiteSettings, Hero, Introduction, Education, Experience, ExperienceHighlight, PracticeArea, Commitment, ContactChannel, Media, AuditLog.

Bổ sung:

```text
AddOn
SiteAddOn
Role
Permission
RolePermission
AIProvider
AISiteConfig
AIPromptTemplate
AIKnowledgeBase
AIKnowledgeItem
AIGeneration
AIUsage
AIAuditLog
```

Nếu schema hiện tại đã có Role/AdminUser thì migration phải mở rộng, không tạo duplicate concepts.

## 8. Phase C — Auth / RBAC / System Admin

Roles: `SYSADMIN`, `SITE_ADMIN`, `EDITOR`. Nếu codebase hiện có `SUPER_ADMIN`/`ADMIN`, map rõ semantics trong migration.

SYSADMIN quản lý users, roles, permissions, add-ons, providers, models, policies, usage, quota, audit và kill switch.

SITE_ADMIN chỉ quản lý site của mình và AI nếu entitlement active.

EDITOR permission-based.

## 9. Phase D — Public Website

Giữ nguyên visual v2.0 và screenshot `docs/design/customer-reference.png`. AI không thay đổi public design. AI-generated content khi Publish phải render như CMS content bình thường.

## 10. Phase E — CMS / Contact / Media / SEO

Giữ nguyên Hero, Introduction, Education, Experience, Practice Areas, Commitment, Contact, Contact Channels, Media, SEO, Settings và Draft/Preview/Publish. Zalo/Telegram/Facebook ON/OFF và Floating Contact ON/OFF.

## 11. Phase F — Core Integration

Verify CMS→DB, DB→Public, publish→revalidation, contact, floating contact, media, SEO, authentication và audit.

## 12. Phase H — AI Content Engine

### H1 Add-on Management

SYSADMIN có Add-ons → AI Content Engine: Activate, Suspend, Disable, Expire, Assign plan, Configure quota, View usage.

### H2 AI Content Studio

Route đề xuất: `/admin/ai-content`. Chỉ accessible khi có `AI_CONTENT_USE` + add-on ACTIVE.

### H3 AI Knowledge

Route đề xuất: `/admin/ai-knowledge`. Quản lý Verified Facts, lawyer profile facts, practice areas, brand information và content preferences.

### H4 Brand Voice

Route đề xuất: `/admin/ai-brand`. Quản lý tone, audience, style, terminology, CTA style; không override global safety.

### H5 AI Generation

Service `AIContentService`:

```text
authorize
→ entitlement
→ quota
→ rate limit
→ validate
→ build context
→ provider.generate()
→ validate output
→ save AIGeneration
→ create DRAFT
→ audit
```

## 13. Gemini Integration

Abstraction: `AIProvider → GeminiProvider`. Không gọi Gemini SDK từ React component. Chỉ server-side.

```text
Browser → Next.js Server → AIProvider → Gemini
```

Credential qua Secret Manager; DB chỉ lưu `credentialRef`; không lưu plaintext key.

## 14. AI Security

Bắt buộc: server-side authorization, tenant isolation, least privilege, deny-by-default, rate limiting, quota, output validation, audit, kill switch, secret protection, no auto-publish.

## 15. Prompt Hierarchy

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

## 16. AI Safety

Không tự tạo credentials, degrees, work history, awards, client information, case results, guaranteed outcomes hoặc fabricated legal facts. Thiếu dữ liệu → `[CẦN XÁC NHẬN]`. Chỉ marketing/professional content.

## 17. Quota / Usage / Cost

Track requests, inputTokens, outputTokens, model, estimatedCost, siteId, userId, timestamp. Quota gồm monthlyGenerationLimit, monthlyTokenLimit, maxTokensPerRequest, requestsPerMinute. Threshold 80/90/100%.

## 18. AI Kill Switch

SYSADMIN → AI Platform → Global Status ON/OFF. OFF → mọi generation DENY.

## 19. Audit

Audit add-on, permissions, provider, model, policy, prompt, quota, generation, regeneration, publish và kill switch. Không log secrets.

## 20. Data Isolation

Mọi AI record có site scope. Không Site A → Site B. AI context chỉ lấy global policy + current site data + current user request.

## 21. Testing

Core tests giữ nguyên v2.0. AI tests tối thiểu:

```text
AI-01 Add-on OFF → DENY
AI-02 Add-on ACTIVE + permission → ALLOW
AI-03 Site Admin → provider secret → DENY
AI-04 Site Admin → global policy → DENY
AI-05 Site A → Site B data → DENY
AI-06 Quota exceeded → DENY
AI-07 Rate limit exceeded → DENY
AI-08 Global AI OFF → DENY
AI-09 Generation → DRAFT only
AI-10 No auto-publish
AI-11 API key absent from browser
AI-12 API key absent from logs
AI-13 Verified Facts included in context
AI-14 Unknown fact → confirmation/risk flag
```

## 22. Visual QA

Public website vẫn test 375, 390, 412, 768, 1024, 1280, 1440, 1920 và đối chiếu trực tiếp `docs/design/customer-reference.png`. AI Admin UI dùng chung design system CMS.

## 23. Implementation Order

```text
PHASE A Foundation
↓
PHASE B Database / Services
↓
PHASE C Auth / RBAC / System Admin
↓
PHASE D Public Website
↓
PHASE E CMS / Contact / Media / SEO
↓
PHASE F Core Integration
↓
PHASE H AI Content Engine
↓
PHASE I AI Security / Usage / Audit
↓
PHASE G Testing / Production Readiness
```

## 24. Required Deliverables

1. Source code.
2. Prisma migrations.
3. Seed data.
4. AI seed configuration nếu cần.
5. Environment variable documentation.
6. API/service documentation.
7. RBAC matrix.
8. Add-on entitlement matrix.
9. AI security test report.
10. AI usage/quota test report.
11. Visual QA evidence.
12. Final implementation report.

## 25. Definition of Done

### Core Website

Public website, CMS CRUD, Draft/Preview/Publish, Contact Channels, Zalo/Telegram/Facebook ON/OFF, Floating Contact, Media, SEO, Responsive và Security đều PASS.

### AI Add-on

AI Content Studio, entitlement, RBAC, Gemini server-side, secret management, Verified Facts, Brand Voice, structured output, Draft workflow, no auto-publish, quota, rate limit, usage, estimated cost, audit, kill switch, tenant isolation và security tests đều PASS.

## 26. Open Issues

Chỉ còn dữ liệu 2025–2026 trong experience:

`Luật sư chuyên nghiệp tại [CẦN XÁC NHẬN]`

Không tự điền dữ liệu thay khách hàng.

## 27. Final Architecture Gate

```text
CMS-driven architecture          [ PASS ]
Visual fidelity                   [ PASS ]
RBAC / server-side authorization  [ PASS ]
Add-on entitlement                [ PASS ]
Tenant isolation                 [ PASS ]
Gemini secret security            [ PASS ]
AI quota / rate limit             [ PASS ]
AI safety policy                  [ PASS ]
Human review / no auto-publish    [ PASS ]
AI usage / audit                  [ PASS ]
Kill switch                       [ PASS ]
Responsive QA                     [ PASS ]
Production build                  [ PASS ]
```

Không đánh dấu PASS nếu chưa có evidence.
