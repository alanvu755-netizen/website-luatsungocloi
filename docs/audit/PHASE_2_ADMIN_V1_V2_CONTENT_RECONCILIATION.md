# PHASE 2 — ADMIN V1 / V2 CONTENT RECONCILIATION REPORT

**PROJECT**: Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi + AI Content Engine  
**BASELINE**: PRD v2.1 Baseline + Architecture Locks  
**AUDIT MODE**: 100% READ-ONLY AUDIT  
**DATE**: 2026-08-26  

---

## 1. GROUP A — INHERITED CONTENT (V1 ➔ V2)

Content elements present in Version 1 that are retained and mapped to Version 2 database models & Admin screens:

| V1 Source Content | V1 Field / Format | V2 Target DB Model | V2 Target Field | V2 Admin CMS Screen | Inherited Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Lawyer Name** | `"Lê Thị Ngọc Lợi"` | `Hero` / `SiteSettings` | `pubName` / `siteName` | `/admin/hero` & `/admin/settings` | **MAPPED & SEEDED** |
| **Lawyer Title** | `"Luật sư - Thạc sĩ"` | `Hero` | `pubSubtitle` | `/admin/hero` | **MAPPED & SEEDED** |
| **Hero Image** | `/customer-reference.png` | `Hero` | `pubImageUrl` | `/admin/hero` | **MAPPED & SEEDED** |
| **Hotline Phone** | `"0902 081 061"` | `ContactChannel` / `SiteSettings`| `url` (`tel:0902081061`) | `/admin/contact` & `/admin/settings`| **MAPPED & SEEDED** |
| **Zalo Chat Link** | `"https://zalo.me/0902081061"` | `ContactChannel` | `url` | `/admin/contact` | **MAPPED & SEEDED** |
| **Case Solved Count**| `"800+"` | `StatisticItem` | `value` / `label` | `/admin/statistics` | **MAPPED & SEEDED** |
| **Client Trust Count**| `"500+"` | `StatisticItem` | `value` / `label` | `/admin/statistics` | **MAPPED & SEEDED** |
| **Experience Years** | `"10+"` | `StatisticItem` | `value` / `label` | `/admin/statistics` | **MAPPED & SEEDED** |

---

## 2. GROUP B — TRANSFORMED / UPGRADED CONTENT (V1 ➔ V2)

Content elements present in Version 1 that were transformed or upgraded to V2 architectures:

| V1 Content / Feature | V1 Architecture | V2 Transformed Architecture | V2 DB Model | V2 Admin CMS Screen | Reason for Transformation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Contact Form** | Static Mailto Link | Lead Capture Table + Anti-Bot Honeypot + Email Notification | `ConsultationLead` | `/admin/consultations` | Ensures no missed leads & prevents spam |
| **Practice Areas** | Single Category List | Multi-Practice Area N-N Junction (`ArticlePracticeArea`)| `PracticeArea` | `/admin/practice-areas` | Allows articles to belong to multiple practice areas |
| **Header Navigation**| Hardcoded Static Links | Dynamic Hierarchical Menu/Submenu Engine | `Menu`, `Submenu` | `/admin/menus` | Allows Admin to toggle legal categories dynamically |

---

## 3. GROUP C — REMOVED CONTENT (V1 OBSOLETE)

Content elements present in Version 1 that are obsolete in Version 2:

| V1 Obsolete Feature | V1 Route / File | Reason for Removal in V2 | Status in V2 Database | Action Taken |
| :--- | :--- | :--- | :--- | :--- |
| **Unstructured Generic Blog** | `/blog` (V1) | Replaced by PRD v2.1 Legal Library (`/thu-vien-phap-luat`)| Obsolete | `REMOVE FROM UI` & `REMOVE FROM ADMIN` |
| **Hardcoded Footer Links** | Hardcoded JSX (V1) | Replaced by dynamic `SiteSettings` & `ContactChannel` | Obsolete | `REMOVE FROM UI` |
| **Unprotected Contact Form** | Direct Form (V1) | Replaced by `ConsultationLead` with Honeypot anti-bot | Obsolete | `REMOVE FROM UI` |

---

## 4. GROUP D — NEW V2 CONTENT & FEATURES

Features introduced exclusively in Version 2:

| V2 New Feature | Business Purpose | V2 DB Model | V2 Admin CMS Screen | Status |
| :--- | :--- | :--- | :--- | :--- |
| **AI Content Studio** | Standalone AI Draft Assistant with pre-configured legal prompts | `AIGeneration` | `/admin/ai-content` | **ACTIVE (Needs Sidebar Link)** |
| **SYSADMIN AI Provider** | API Key Management & Global AI Kill Switch | `AIProvider` | `/admin/ai-provider` | **ACTIVE (SYSADMIN Only)** |
| **On-Demand Cache Purging**| Instant Next.js static page cache revalidation upon Admin edit | Next.js Cache | All Server Actions | **ACTIVE (0s Stale Data)** |

---

## 5. GROUP E — IDENTIFIED CONTENT MANAGEMENT GAPS

Public V2 content elements lacking an Admin input field:

| # | Public Content Element | Public Component | Data Source | Missing Admin Control | Severity | Proposed Backlog Action |
| :---: | :--- | :--- | :--- | :--- | :---: | :--- |
| **1** | Hero Headline Text (`ĐỒNG HÀNH PHÁP LÝ`) | `Hero.tsx` | Hardcoded JSX | No input field in `/admin/hero` | `P2` | Add `headline` field to `Hero` DB model & `/admin/hero` |
| **2** | Hero Description Paragraph | `Hero.tsx` | Hardcoded JSX | No input field in `/admin/hero` | `P2` | Add `description` field to `Hero` DB model & `/admin/hero` |
| **3** | 4 Hero Feature Badges (Tận tâm, etc.) | `Hero.tsx` | Hardcoded JSX | No input fields in `/admin/hero` | `P2` | Add `heroBadges` table/fields to `/admin/hero` |
| **4** | Footer Disclaimer Copyright Text | `Footer.tsx` | Hardcoded JSX | No input field in `/admin/settings` | `P3` | Add `footerDisclaimer` field to `SiteSettings` & `/admin/settings`|
