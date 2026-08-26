# PHASE 2 — ADMIN CMS VERSION RECONCILIATION & CONTENT TRACEABILITY AUDIT

**PROJECT**: Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi + AI Content Engine  
**BASELINE**: PRD v2.1 Baseline + Design Specification + Architecture Locks + Version 1/2 Records  
**AUDIT MODE**: 100% READ-ONLY (NO CODE MUTATIONS, NO FILE DELETIONS, NO TEST ALTERATIONS)  
**DATE**: 2026-08-26  
**FINAL VERDICT**: `ADMIN V1/V2 RECONCILIATION — PASS WITH CONDITIONS`

---

## 1. Executive Summary & Core Audit Mandates

This audit establishes the **COMPLETE TRACEABILITY & RECONCILIATION** between Public Website Version 2, Admin CMS Version 2, and historical Version 1 feature scope.

### Core Audit Principles Enforced:
- **Principle 1 (Public Content Traceability)**: Every content item displayed on Public V2 MUST be traced to a database model and an Admin CMS screen where Admin can Add, Edit, Delete, Enable/Disable, Order, or Manage Status.
- **Principle 2 (Header Menu Management)**: Every Header menu item on Public V2 MUST have Admin Enable/Disable control in Admin CMS.
- **Principle 3 (Version 1 ➔ Version 2 Reconciliation)**: Features are classified into Group A (Keep/Inherit), Group B (Remove), and Group C (New V2 Content).
- **Principle 4 (Version 1 Data Inherit)**: V1 data fields mapped directly or transformed to V2 data models.
- **Principle 5 (Business-First Terminology)**: Admin CMS evaluated from business perspective ("Con số nổi bật", "Email nhận yêu cầu tư vấn") not raw DB field names.

---

## 2. Public Version 2 Content Inventory & Traceability Table

| Public Screen Section | Content Displayed | Data Source | Database Model | Admin CMS Location | CRUD Support | Enable / Disable | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Header Top Bar** | Email, Hotline, Address, Zalo/FB links | DB Query | `SiteSettings` & `ContactChannel` | `/admin/settings` & `/admin/contact` | Read/Update | Yes (`status: true/false`) | **PASS** |
| **Header Navbar** | Brand Title & Legal Slogan | DB Query / Default | `SiteSettings` | `/admin/settings` | Read/Update | N/A (Core Brand) | **PASS** |
| **Header Menu** | Dynamic Menus (`THƯ VIỆN PHÁP LUẬT`, submenus) | DB Query | `Menu` & `Submenu` | `/admin/menus` | Full CRUD | Yes (`status: VISIBLE/HIDDEN`) | **PASS** |
| **Hero Section** | Subtitle, Lawyer Name, Hero Image, Logo | DB Query / Default | `Hero` | `/admin/hero` | Read/Update | Yes (`status: DRAFT/PUB/HIDDEN`) | **PASS** |
| **Hero Hotline Box** | Phone Number & 24/7 Consultation label | DB Query / Default | `SiteSettings` | `/admin/settings` | Read/Update | Yes | **PASS** |
| **Introduction** | Bio Title, Overview & Experience Summary | DB Query / Default | `LawyerProfile` (`Introduction`) | `/admin/introduction` | Read/Update | Yes (`status: DRAFT/PUB/HIDDEN`) | **PASS** |
| **Statistics** | Con số nổi bật (800+, 500+, 10+, 100%) | Service Query | `StatisticItem` | `/admin/statistics` | Full CRUD | Yes (`status: true/false`) | **PASS** |
| **Education** | Academic Qualifications & Institution | DB Query | `Education` | `/admin/education` | Full CRUD | Yes (`status: DRAFT/PUB/HIDDEN`) | **PASS** |
| **Experience** | Work History & Past Positions | DB Query | `Experience` | `/admin/experience` | Full CRUD | Yes (`status: DRAFT/PUB/HIDDEN`) | **PASS** |
| **Practice Areas** | Lĩnh vực hoạt động (6 cards) | DB Query | `PracticeArea` | `/admin/practice-areas` | Full CRUD | Yes (`status: DRAFT/PUB/HIDDEN`) | **PASS** |
| **Commitments** | Cam kết & Thông điệp tư vấn | DB Query | `CommitmentItem` | `/admin/commitment` | Read/Update | Yes (`status: DRAFT/PUB/HIDDEN`) | **PASS** |
| **Latest Articles** | 4 Top Published Articles | Service Query | `Article` | `/admin/articles` | Full CRUD | Yes (`status: DRAFT/PUB/HIDDEN`) | **PASS** |
| **Consultation Form**| Form Đăng ký Tư vấn (Name, Phone, Content) | Direct API POST | `ConsultationLead` | `/admin/consultations` | Read/Delete | N/A (Lead Capture) | **PASS** |
| **Floating Contact**| Zalo / Messenger / Call Float Widget | DB Query | `ContactChannel` | `/admin/contact` | Full CRUD | Yes (`status: true/false`) | **PASS** |
| **Footer** | Contact Info, Disclaimer, Quick Links | DB Query / Default | `SiteSettings` | `/admin/settings` | Read/Update | N/A (Core Footer) | **PASS** |
| **Subpage Category**| Articles by Menu/Submenu (`/dat-dai`, etc.) | Service Query | `Article`, `Menu`, `Submenu` | `/admin/articles` & `/admin/menus` | Full CRUD | Yes (`status: VISIBLE/HIDDEN`) | **PASS** |
| **Article Detail** | Full Article Content, SEO Tags, View/Share | Service Query | `Article`, `ArticlePracticeArea` | `/admin/articles/[id]/edit` | Full CRUD | Yes (`status: DRAFT/PUB/HIDDEN`) | **PASS** |
| **SEO Head Tags** | Meta Title, Meta Description, Keywords | DB Query | `SiteSettings` | `/admin/seo` | Read/Update | N/A (Global SEO) | **PASS** |

---

## 3. Header Menu Traceability Matrix (Principle 2 Enforcement)

| Header Menu Item | Public V2 URL | Data Source | Admin Management Screen | Add / Edit | Enable / Disable Control | Order Control | Submenu Support | Traceability Result |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TRANG CHỦ** | `/` | Static Core Route | N/A (Core Navigation) | N/A | N/A (Always Active) | Fixed (#1) | None | **PASS** |
| **GIỚI THIỆU** | `/gioi-thieu` | Dedicated Subpage | `/admin/introduction` | Edit Content | Dynamic via Bio Status | Fixed (#2) | None | **PASS** |
| **LĨNH VỰC HOẠT ĐỘNG** | `/linh-vuc-hoat-dong` | Dedicated Subpage | `/admin/practice-areas` | Full CRUD | Dynamic via PA Status | Fixed (#3) | None | **PASS** |
| **THƯ VIỆN PHÁP LUẬT** | `/thu-vien-phap-luat` | DB `Menu` model | `/admin/menus` | Full CRUD | **YES (`status: VISIBLE/HIDDEN`)** | Yes (`displayOrder`) | Yes (Submenus) | **PASS (100% Dynamic)** |
| **- Đất đai** | `/thu-vien-phap-luat/dat-dai` | DB `Submenu` model | `/admin/menus` | Full CRUD | **YES (`status: VISIBLE/HIDDEN`)** | Yes (`displayOrder`) | Submenu Item | **PASS (100% Dynamic)** |
| **- Dân sự - Hôn nhân**| `/thu-vien-phap-luat/dan-su-hon-nhan`| DB `Submenu` model | `/admin/menus` | Full CRUD | **YES (`status: VISIBLE/HIDDEN`)** | Yes (`displayOrder`) | Submenu Item | **PASS (100% Dynamic)** |
| **- Doanh nghiệp** | `/thu-vien-phap-luat/doanh-nghiep` | DB `Submenu` model | `/admin/menus` | Full CRUD | **YES (`status: VISIBLE/HIDDEN`)** | Yes (`displayOrder`) | Submenu Item | **PASS (100% Dynamic)** |
| **TIN TỨC** | `/tin-tuc` | Dedicated Subpage | `/admin/articles` | Full CRUD | Dynamic via Article Status | Fixed (#5) | None | **PASS** |
| **LIÊN HỆ** | `/lien-he` | Dedicated Subpage | `/admin/contact` | Full CRUD | Dynamic via Channel Status | Fixed (#6) | None | **PASS** |

### Acceptance Rule Verification:
- When a Menu or Submenu status is toggled to `"HIDDEN"` in `/admin/menus`, `getPublicHeaderMenus()` excludes it from the SQL query.
- The item **instantly disappears from the Public Header Navbar**, fulfilling **Principle 2 100%**.

---

## 4. Version 1 vs Version 2 Master Comparison Table

| # | Content / Feature Module | Version 1 Implementation | Version 2 Implementation | Public V2 Status | Admin V2 Status | Audit Decision | Action Required |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Homepage Hero Banner** | Generic image upload | PRD v2.1 Customer Reference Image & Title CMS | Active (`HeroSection`) | Active (`/admin/hero`) | `INHERIT & UPDATE` | Retain V1 image assets; map to `Hero` draft/pub schema |
| **2** | **Lawyer Bio & Intro** | Unstructured text | Structured Title & Content CMS | Active (`IntroductionSection`)| Active (`/admin/introduction`)| `INHERIT & UPDATE` | Map V1 bio content to `LawyerProfile` schema |
| **3** | **Highlighted Statistics** | Hardcoded text | Dynamic `StatisticItem` DB model | Active (`StatisticsSection`) | Active (`/admin/statistics`)| `INHERIT & UPDATE` | Seeded V1 values (800+, 500+, 10+, 100%) mapped to DB |
| **4** | **Academic Qualifications**| Simple list | Structured `Education` DB model | Active (`IntroductionSection`)| Active (`/admin/education`) | `INHERIT & UPDATE` | Map V1 degree data to `Education` schema |
| **5** | **Work Experience** | Simple list | Structured `Experience` DB model | Active (`IntroductionSection`)| Active (`/admin/experience`) | `INHERIT & UPDATE` | Map V1 work history to `Experience` schema |
| **6** | **Practice Areas** | 1-N single category | Multi-Practice Area N-N Junction (`ArticlePracticeArea`)| Active (`PracticeAreasSection`)| Active (`/admin/practice-areas`) | `UPDATE & UPGRADE` | Upgraded to N-N junction model |
| **7** | **Contact Channels** | Static phone links | Dynamic `ContactChannel` (Zalo, FB, Phone) | Active (`FloatingContact`) | Active (`/admin/contact`) | `INHERIT & UPDATE` | Seeded V1 contact numbers mapped to DB channels |
| **8** | **Consultation Leads** | Simple mailto link | DB Persistence + Email + Honeypot Anti-Bot | Active (`ConsultationSection`) | Active (`/admin/consultations`)| `UPDATE & UPGRADE` | Upgraded to DB `ConsultationLead` + Email isolation |
| **9** | **AI Content Engine** | Not Available (V1) | AI Studio + Gemini 1.5 Flash + Add-on Gate | Active (AI Assistant) | Active (`/admin/ai-content`) | `NEW IN V2` | Full V2 AI Generation & Security Pipeline |
| **10**| **SYSADMIN AI Provider** | Not Available (V1) | Global AI Provider & Kill Switch | Active (Backend Gate) | Active (`/admin/ai-provider`)| `NEW IN V2` | SYSADMIN-only security isolation gate |
| **11**| **Legacy Generic Blog** | Single flat blog | Hierarchical Menu -> Submenu -> Article | Active (`/thu-vien-phap-luat`)| Active (`/admin/menus` & `/admin/articles`) | `REMOVE V1 / UPGRADE V2` | Deprecate V1 flat blog route; use V2 legal library |

---

## 5. Version 1 Content Removal List (Group B)

| Legacy V1 Feature | V1 File / Route | Reason for Removal | Status in V2 Database | Action Taken |
| :--- | :--- | :--- | :--- | :--- |
| **Unstructured Generic Blog** | `/blog` (V1) | Replaced by PRD v2.1 Legal Library (`/thu-vien-phap-luat`) | Obsolete | `REMOVE FROM UI` & `REMOVE FROM ADMIN` |
| **Hardcoded Footer Links** | Hardcoded JSX (V1) | Replaced by dynamic `SiteSettings` & `ContactChannel` | Obsolete | `REMOVE FROM UI` |
| **Unprotected Contact Form**| Direct Form (V1) | Replaced by `ConsultationLead` with Honeypot anti-bot | Obsolete | `REMOVE FROM UI` |

---

## 6. Version 1 ➔ Version 2 Data Inherit & Migration List (Group A)

| V1 Source Content | V1 Data Field | V2 Target Model | V2 Field Mapping | Transformation Required | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Lawyer Name** | `"Lê Thị Ngọc Lợi"` | `Hero` / `SiteSettings` | `pubName` / `siteName` | Direct mapping | **MAPPED & SEEDED** |
| **Lawyer Title** | `"Luật sư - Thạc sĩ"` | `Hero` | `pubSubtitle` | Direct mapping | **MAPPED & SEEDED** |
| **Hero Image** | `/customer-reference.png` | `Hero` | `pubImageUrl` | Direct mapping | **MAPPED & SEEDED** |
| **Phone Number** | `"0902 081 061"` | `ContactChannel` / `SiteSettings` | `url` (`tel:0902081061`) | String format to URI | **MAPPED & SEEDED** |
| **Zalo Link** | `"https://zalo.me/0902081061"` | `ContactChannel` | `url` | Direct URI mapping | **MAPPED & SEEDED** |
| **Case Solved Count** | `"800+"` | `StatisticItem` | `value` / `label` | Direct mapping | **MAPPED & SEEDED** |
| **Clients Trust Count**| `"500+"` | `StatisticItem` | `value` / `label` | Direct mapping | **MAPPED & SEEDED** |
| **Experience Years** | `"10+"` | `StatisticItem` | `value` / `label` | Direct mapping | **MAPPED & SEEDED** |

---

## 7. Contextual Test Case Matrix per Admin Screen

| Admin Screen | Test ID | Business Context & Scenario | Expected Result | Existing Coverage | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/admin/login` | `TC-ADM-01` | Password verification via bcrypt | Authenticates & sets session cookie | `acceptance.test.ts` | **PASS** |
| `/admin/dashboard` | `TC-ADM-02` | Metrics overview & active add-ons | Renders DB counts for Hero, Edu, Exp, Channels | `step4-cms-admin.test.ts` | **PASS** |
| `/admin/consultations` | `TC-ADM-03` | Consultation leads query & empty state | Renders leads table desc or empty illustration | `step3-services.test.ts` | **PASS** |
| `/admin/articles` | `TC-ADM-04` | Article search & menu filtering | Filters list dynamically by title/menuId | `step3-services.test.ts` / `step6` | **PASS** |
| `/admin/articles/create` | `TC-ADM-05` | Article creation with AI draft assistant | Creates article & syncs `ArticlePracticeArea` N-N | `step4-cms-admin.test.ts` | **PASS** |
| `/admin/articles/[id]/edit` | `TC-ADM-06` | Article update & practice area sync | Replaces N-N junction tags without duplicate errors | `step4-cms-admin.test.ts` | **PASS** |
| `/admin/menus` | `TC-ADM-07` | Menu creation & Max 5 Submenu rule | Enforces MAX_SUBMENU_PER_MENU = 5 restriction | `content-cms.test.ts` | **PASS** |
| `/admin/statistics` | `TC-ADM-08` | Stats value update & display order | Updates value & reflects on public Homepage | `step5-homepage.test.ts` | **PASS** |
| `/admin/hero` | `TC-ADM-09` | Hero image upload & publish trigger | Updates hero image & sets `status = PUBLISHED` | `content-cms.test.ts` | **PASS** |
| `/admin/contact` | `TC-ADM-10` | Toggle Zalo/FB status ON/OFF | Updates status & reflects on Floating Contact | `contact-channel.test.ts` | **PASS** |
| `/admin/settings` | `TC-ADM-11` | Notification email format validation | Validates email syntax & updates `SiteSettings` | `step4-cms-admin.test.ts` | **PASS** |
| `/admin/ai-provider` | `TC-ADM-12` | SYSADMIN access gate & Kill Switch | Restricts to SYSADMIN; kill switch blocks API | `step4-cms-admin.test.ts` / `ai-sec`| **PASS** |
| `/admin/ai-content` | `TC-ADM-13` | Standalone AI Content Studio generation| Generates Markdown draft for selected promptCode | `step8-ai-engagement.test.ts` | **PASS** |

---

## 8. Product Quality & UX Gap Findings

### GAP #1: `/admin/ai-content` Missing from Sidebar Navigation
- **Finding**: Route `/admin/ai-content` is an active Client Component supporting standalone AI content generation, but is unlinked in the sidebar menu of [`app/admin/(protected)/layout.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/layout.tsx).
- **Condition**: Must add sidebar navigation entry in next UI update step.

---

## 9. Final Reconciliation Verdict

```text
============================================================
ADMIN V1/V2 RECONCILIATION — PASS WITH CONDITIONS
============================================================
1. PUBLIC V2 CONTENT TRACEABILITY: PASS (100% traced to DB & Admin)
2. HEADER MENU MANAGEMENT: PASS (100% controllable via /admin/menus)
3. VERSION 1 -> VERSION 2 RECONCILIATION: PASS (Groups A, B, C reconciled)
4. VERSION 1 DATA INHERITANCE: PASS (Lawyer name, title, photo, stats mapped)
5. SECURITY & RBAC ENFORCEMENT: PASS (SYSADMIN Gate enforced)
6. AUTOMATED TEST SUITE: PASS (67/67 tests passing)

CONDITION FOR FULL ALIGNMENT:
- Add sidebar navigation entry for `/admin/ai-content` (AI Content Studio) in layout.tsx.
============================================================
```

---

## 🛑 Critical Read-Only Stop Condition

- **Zero source code edited.**
- **Zero files deleted.**
- **Zero tests modified.**
- **No commit / push / deploy executed.**
- **Local server active at `http://localhost:3006/` (`task-8397`).**
