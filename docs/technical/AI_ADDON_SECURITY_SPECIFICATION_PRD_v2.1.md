# AI ADD-ON & SECURITY SPECIFICATION — PRD v2.1
## Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi

**Project Identity:** NGOCLOI  
**Version:** 2.1  
**Status:** Review Draft — NOT AUTHORIZED FOR CODE

---

# 1. PURPOSE

Define the security boundary for the AI Content Engine without expanding the approved product scope.

AI is an optional capability used only to assist creation of a new article.

---

# 2. AI SCOPE LOCK

Allowed:

```text
Admin → Articles → Create Article → AI Assist
```

AI may generate:

- title
- article content
- summary
- SEO title
- SEO description
- keywords
- suggested article structure
- CTA

Input:

- bullet points / key ideas supplied by the Admin

Output:

- Draft only

---

# 3. PROHIBITED AI FEATURES

Do not implement unless separately approved:

- standalone AI Content Studio
- AI Ideas dashboard
- AI Calendar
- bulk generation
- AI Rewrite in Edit Article
- auto-publish
- AI legal decision making
- guaranteed legal outcomes
- unsupported factual claims

---

# 4. AUTHORIZATION MODEL

For this project:

```text
ADMIN
  └── may use approved AI article creation capability

SYSADMIN
  ├── all Admin permissions
  └── AI Provider / system configuration
```

Important:

> Admin must never be able to configure AI Provider.

Authorization MUST be server-side.

Frontend visibility is not a security boundary.

---

# 5. AI PROVIDER SECURITY

Provider configuration belongs to SYSADMIN.

Gemini is the approved initial provider direction.

Architecture:

```text
Browser
   ↓
Application Server
   ↓
AI Provider abstraction
   ↓
Gemini API
```

API keys/secrets:

- server-side only
- never in client bundle
- never in HTML
- never in browser-visible response
- never committed to Git
- never written into normal logs

---

# 6. AI KILL SWITCH

A system-level AI enable/disable control may be retained from the established architecture.

If AI is OFF:

```text
generation request → DENY
```

The denial must happen server-side.

---

# 7. DRAFT-ONLY INVARIANT

Every AI-generated article result MUST begin as Draft.

```text
AI Generated
     ↓
DRAFT
     ↓
Human Review
     ↓
Admin chooses Publish
```

AI must never directly publish.

---

# 8. VERIFIED FACTS / ZERO FABRICATION

AI must not invent:

- degrees
- universities
- awards
- professional positions
- cases
- clients
- legal achievements
- guaranteed outcomes

Approved verified project facts must be provided to the generation context.

Known project source material includes the approved professional profile information; only facts confirmed in the project's source-of-truth documents may be presented as verified.

If a required fact is missing:

`[CẦN XÁC NHẬN]`

---

# 9. PROMPT HIERARCHY

Recommended hierarchy:

```text
SYSTEM SAFETY POLICY
        ↓
PROJECT AI POLICY
        ↓
VERIFIED PROJECT FACTS
        ↓
CURRENT ARTICLE TASK
        ↓
USER BULLET POINTS
```

Lower-level input cannot override higher-level safety/policy rules.

---

# 10. OUTPUT VALIDATION

Before saving AI output:

- validate required fields
- validate expected structure
- detect prohibited claims where feasible
- ensure output is Draft
- ensure no secret is returned
- ensure generation failure does not create a falsely published article

---

# 11. USAGE / RATE LIMIT

The implementation should support server-side:

- generation rate limiting
- token/cost measurement where provider exposes usage
- request logging
- model tracking

Do not add a complex billing system to the product unless separately approved.

---

# 12. DATA PRIVACY

Do not send unnecessary personal/confidential client information to AI.

Admin should be instructed not to place confidential client data into article-generation prompts.

Do not persist sensitive prompt content unnecessarily.

Secrets/passwords must never be included in AI prompts or logs.

---

# 13. AUDIT

Security-relevant events should be auditable where the current architecture supports it:

- AI generation
- AI provider configuration changes
- AI enable/disable
- permission changes
- publish action

Never log API keys or passwords.

---

# 14. SECURITY TESTS

Mandatory tests:

1. Unauthenticated user cannot call AI endpoint.
2. Admin cannot access AI Provider configuration.
3. SYSADMIN can access AI Provider configuration.
4. AI disabled → generation denied.
5. Invalid permission → generation denied.
6. API key never reaches browser.
7. AI result is Draft.
8. Draft is not publicly visible.
9. AI cannot auto-publish.
10. Fabrication controls are present in generation policy.
11. Secrets do not appear in logs/errors.
12. Rate limiting works if enabled.

---

# 15. DEFINITION OF DONE

AI security is DONE only when:

- server-side authorization passes
- provider secret protection passes
- Draft-only invariant passes
- AI boundary is enforced
- prohibited scope is absent
- security tests pass
- evidence is recorded
