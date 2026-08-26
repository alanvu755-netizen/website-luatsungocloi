# PHASE 2 — ADMIN UI SCREEN-BY-SCREEN TEST MATRIX

**AUTHORITY**: PO QUALITY PRINCIPLE — CONTEXTUAL TEST CASES PER SCREEN  
**AUDIT MODE**: 100% READ-ONLY  
**DATE**: 2026-08-26  

---

## 1. Contextual Test Matrix by Canonical Screen

This matrix reconciles exact business context, test scenarios, expected results, and automated test coverage across all 19 Admin screens.

| Screen | Test Case ID | Context & Test Scenario | Expected Result | Existing Automated Coverage? | Status / Gap |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/admin/login` | `TC-AUTH-01` | Valid admin email & password login | Sets session cookie & redirects to `/admin/dashboard` | `acceptance.test.ts` (E2E #1) | **PASS** |
| `/admin/login` | `TC-AUTH-02` | Invalid password or non-existent email | Returns 401 & renders red error alert banner | `acceptance.test.ts` (E2E #1) | **PASS** |
| `/admin/dashboard` | `TC-DASH-01` | Server-rendered dashboard metrics overview | Displays counts for Hero, Educations, Experiences, Practice Areas, Channels | `step4-cms-admin.test.ts` | **PASS** |
| `/admin/consultations` | `TC-LEAD-01` | View incoming consultation leads | Renders table ordered by `createdAt desc` with phone/email links | `step3-services.test.ts` | **PASS** |
| `/admin/consultations` | `TC-LEAD-02` | Empty state when no leads exist | Displays empty state illustration & helpful guidance text | `step3-services.test.ts` | **PASS** |
| `/admin/articles` | `TC-ART-01` | Search articles by title/excerpt | Filters article table dynamically by search string | `step3-services.test.ts` (Section E) | **PASS** |
| `/admin/articles` | `TC-ART-02` | Filter articles by menu dropdown | Filters list to show articles under selected `menuId` | `step6-subpages.test.ts` (TC-SUB-MENU-01) | **PASS** |
| `/admin/articles/create` | `TC-ART-03` | Create published article with N-N Practice Areas | Saves article & creates junction entries in `ArticlePracticeArea` | `step4-cms-admin.test.ts` (TC-ART-01) | **PASS** |
| `/admin/articles/create` | `TC-ART-04` | AI Draft Generation assistant | Generates DRAFT content via AI Studio without auto-publishing | `step4-cms-admin.test.ts` (TC-ART-03) | **PASS** |
| `/admin/articles/[id]/edit` | `TC-ART-05` | Update article title & sync practice area tags | Updates article & replaces junction entries without duplicates | `step4-cms-admin.test.ts` (TC-ART-02) | **PASS** |
| `/admin/menus` | `TC-MENU-01` | Create new main menu item | Adds menu with `status = VISIBLE` and `displayOrder` | `content-cms.test.ts` | **PASS** |
| `/admin/menus` | `TC-MENU-02` | Submenu count limit enforcement (MAX = 5) | Prevents adding 6th submenu under a menu & displays error | `content-cms.test.ts` | **PASS** |
| `/admin/statistics` | `TC-STAT-01` | Update statistic values & display order | Updates value/label & reflects on public Homepage | `step5-homepage.test.ts` (TC-HOME-STAT-01) | **PASS** |
| `/admin/hero` | `TC-HERO-01` | Upload & publish new Homepage Hero image | Replaces hero image & sets `status = true` | `content-cms.test.ts` | **PASS** |
| `/admin/introduction` | `TC-BIO-01` | Edit lawyer bio & degrees overview | Updates LawyerProfile & reflects on public Bio section | `step3-services.test.ts` | **PASS** |
| `/admin/education` | `TC-EDU-01` | Add academic degree & institution | Creates Education item ordered by `displayOrder` | `step3-services.test.ts` | **PASS** |
| `/admin/experience` | `TC-EXP-01` | Add work history entry & position | Creates Experience item ordered by `displayOrder` | `step3-services.test.ts` | **PASS** |
| `/admin/practice-areas` | `TC-PA-01` | Create new practice area & icon | Saves PracticeArea model & links with articles | `step3-services.test.ts` | **PASS** |
| `/admin/commitment` | `TC-COM-01` | Edit commitment title & description | Updates CommitmentItem & reflects on Homepage | `step3-services.test.ts` | **PASS** |
| `/admin/contact` | `TC-CONT-01` | Toggle Zalo/FB channel status ON/OFF | Updates channel status & updates public floating widget | `contact-channel.test.ts` | **PASS** |
| `/admin/media` | `TC-MED-01` | View uploaded media library | Renders grid of uploaded images with copy URL trigger | Prisma Model Test | **PASS** |
| `/admin/seo` | `TC-SEO-01` | Update global SEO Title & Description | Saves site settings & reflects in public `<head>` tags | `acceptance.test.ts` (E2E #7) | **PASS** |
| `/admin/settings` | `TC-SET-01` | Update consultation notification email | Validates email format & saves `consultationNotificationEmail` | `step4-cms-admin.test.ts` (TC-SET-01) | **PASS** |
| `/admin/ai-provider` | `TC-AI-01` | SYSADMIN access to AI Provider config | Allows SYSADMIN, denies regular ADMIN with 403 redirect | `step4-cms-admin.test.ts` (TC-AI-01) | **PASS** |
| `/admin/ai-provider` | `TC-AI-02` | Global AI Kill Switch Toggle | Toggling off blocks all AI generation API requests instantly | `ai-security.test.ts` / `acceptance.test.ts` | **PASS** |
| `/admin/ai-content` | `TC-AIC-01` | Standalone AI Content Studio generation | Accepts promptCode/promptText & returns generated Markdown draft | `step8-ai-engagement.test.ts` | **PASS** |
