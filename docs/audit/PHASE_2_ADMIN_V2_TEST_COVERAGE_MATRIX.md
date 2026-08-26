# PHASE 2 — ADMIN V2 SCREEN-BY-SCREEN TEST COVERAGE MATRIX

**PROJECT**: Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi + AI Content Engine  
**BASELINE**: PRD v2.1 Baseline + Architecture Locks  
**AUDIT MODE**: 100% READ-ONLY AUDIT  
**DATE**: 2026-08-26  

---

## CONTEXTUAL TEST MATRIX PER CANONICAL ADMIN SCREEN

This matrix documents the exact test cases for all 19 Admin screens across Happy Path, Validation, Empty State, Security, Data Persistence, Public Propagation, and Cache Invalidation.

| Admin Screen | Test Case ID | Test Context & Scenario | Expected Result | Existing Vitest File | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/admin/login` | `TC-AUTH-01` | Valid admin credentials submission | Sets session cookie & redirects to `/admin/dashboard` | `acceptance.test.ts` | **PASS** |
| `/admin/login` | `TC-AUTH-02` | Invalid password or non-existent email | Returns 401 & renders error alert banner | `acceptance.test.ts` | **PASS** |
| `/admin/dashboard` | `TC-DASH-01` | Dashboard metrics query & add-on check | Renders counts for Hero, Edu, Exp, Channels | `step4-cms-admin.test.ts` | **PASS** |
| `/admin/consultations` | `TC-LEAD-01` | Fetch incoming leads list | Orders leads desc by `createdAt` with phone/email | `step3-services.test.ts` | **PASS** |
| `/admin/consultations` | `TC-LEAD-02` | Empty state when zero leads exist | Renders empty state illustration & guidance text | `step3-services.test.ts` | **PASS** |
| `/admin/articles` | `TC-ART-01` | Search articles by title/excerpt | Filters article table dynamically | `step3-services.test.ts` | **PASS** |
| `/admin/articles` | `TC-ART-02` | Filter articles by menu dropdown | Filters list to show articles under selected `menuId` | `step6-subpages.test.ts` | **PASS** |
| `/admin/articles/create` | `TC-ART-03` | Create article + N-N Practice Areas | Saves article & syncs `ArticlePracticeArea` junction | `step4-cms-admin.test.ts` | **PASS** |
| `/admin/articles/create` | `TC-ART-04` | AI Draft Generation assistant | Generates DRAFT content via AI Studio | `step4-cms-admin.test.ts` | **PASS** |
| `/admin/articles/[id]/edit` | `TC-ART-05` | Update article & sync practice areas | Replaces junction entries without duplicate key errors | `step4-cms-admin.test.ts` | **PASS** |
| `/admin/menus` | `TC-MENU-01` | Create main menu item | Adds menu with `status = VISIBLE` and `displayOrder` | `content-cms.test.ts` | **PASS** |
| `/admin/menus` | `TC-MENU-02` | Submenu count limit (MAX = 5) | Blocks adding 6th submenu under a menu | `content-cms.test.ts` | **PASS** |
| `/admin/menus` | `TC-MENU-03` | Toggle menu status `HIDDEN` | Excludes menu from `getPublicHeaderMenus()` SQL | `content-cms.test.ts` | **PASS** |
| `/admin/statistics` | `TC-STAT-01` | Update stat values & display order | Updates value/label & reflects on public Homepage | `step5-homepage.test.ts` | **PASS** |
| `/admin/hero` | `TC-HERO-01` | Upload & publish Hero image | Replaces hero image & sets `status = PUBLISHED` | `content-cms.test.ts` | **PASS** |
| `/admin/introduction` | `TC-BIO-01` | Edit lawyer bio & overview | Updates LawyerProfile & reflects on Bio section | `step3-services.test.ts` | **PASS** |
| `/admin/education` | `TC-EDU-01` | Add academic degree & institution | Creates Education item ordered by `displayOrder` | `step3-services.test.ts` | **PASS** |
| `/admin/education` | `TC-EDU-02` | Delete academic degree | Removes Education item from DB & Public UI | `step3-services.test.ts` | **PASS** |
| `/admin/experience` | `TC-EXP-01` | Add work history entry | Creates Experience item ordered by `displayOrder` | `step3-services.test.ts` | **PASS** |
| `/admin/experience` | `TC-EXP-02` | Delete work history entry | Removes Experience item from DB & Public UI | `step3-services.test.ts` | **PASS** |
| `/admin/practice-areas` | `TC-PA-01` | Create new practice area & icon | Saves PracticeArea model & links with articles | `step3-services.test.ts` | **PASS** |
| `/admin/commitment` | `TC-COM-01` | Edit commitment title & text | Updates CommitmentItem & reflects on Homepage | `step3-services.test.ts` | **PASS** |
| `/admin/contact` | `TC-CONT-01` | Toggle Zalo/FB status ON/OFF | Updates channel status & updates floating widget | `contact-channel.test.ts` | **PASS** |
| `/admin/media` | `TC-MED-01` | Media library grid & URL copy | Renders uploaded media grid | Prisma Model Test | **PASS** |
| `/admin/seo` | `TC-SEO-01` | Update SEO Title & Description | Saves site settings & reflects in `<head>` tags | `acceptance.test.ts` | **PASS** |
| `/admin/settings` | `TC-SET-01` | Update notification email | Validates email syntax & updates `SiteSettings` | `step4-cms-admin.test.ts` | **PASS** |
| `/admin/ai-provider` | `TC-AI-01` | SYSADMIN access gate | Allows SYSADMIN, denies regular ADMIN (403) | `step4-cms-admin.test.ts` | **PASS** |
| `/admin/ai-provider` | `TC-AI-02` | Global AI Kill Switch | Toggling off blocks all AI API requests | `ai-security.test.ts` | **PASS** |
| `/admin/ai-content` | `TC-AIC-01` | Standalone AI Content Studio | Generates Markdown draft for selected prompt | `step8-ai-engagement.test.ts` | **PASS** |
