# PHASE 2 — ADMIN UI ROUTE INVENTORY REPORT

**AUTHORITY**: PO DIRECTIVE — ADMIN UI RECONNAISSANCE & AUDIT  
**AUDIT MODE**: 100% READ-ONLY  
**DATE**: 2026-08-26  

---

## 1. Complete Admin Route Inventory Table

| Route | Page File Path | Business Function | UI Version | Status | Linked in Sidebar Nav? | Notes & Reachability |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/admin/login` | [`app/admin/login/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/login/page.tsx) | Admin Authentication | `NEW (PRD v2.1)` | `ACTIVE` | N/A (Public) | Direct URL / Auth Redirect |
| `/admin/dashboard` | [`app/admin/(protected)/dashboard/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/dashboard/page.tsx) | CMS Overview & System Health | `NEW (PRD v2.1)` | `ACTIVE` | YES | Group: `TỔNG QUAN` |
| `/admin/consultations` | [`app/admin/(protected)/consultations/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/consultations/page.tsx) | Consultation Leads Table | `NEW (PRD v2.1)` | `ACTIVE` | YES | Group: `TỔNG QUAN` |
| `/admin/menus` | [`app/admin/(protected)/menus/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/menus/page.tsx) | Navigation Menu & Submenus | `NEW (PRD v2.1)` | `ACTIVE` | YES | Group: `NỘI DUNG CONTENT CMS` |
| `/admin/articles` | [`app/admin/(protected)/articles/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/articles/page.tsx) | Article Table & Search | `NEW (PRD v2.1)` | `ACTIVE` | YES | Group: `NỘI DUNG CONTENT CMS` |
| `/admin/articles/create` | [`app/admin/(protected)/articles/create/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/articles/create/page.tsx) | Create Article + AI Assistant | `NEW (PRD v2.1)` | `ACTIVE` | NO | Subroute of `/admin/articles` |
| `/admin/articles/[id]/edit` | [`app/admin/(protected)/articles/[id]/edit/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/articles/%5Bid%5D/edit/page.tsx) | Edit Article + N-N Practice Areas | `NEW (PRD v2.1)` | `ACTIVE` | NO | Subroute of `/admin/articles` |
| `/admin/statistics` | [`app/admin/(protected)/statistics/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/statistics/page.tsx) | Highlighted Stats Management | `NEW (PRD v2.1)` | `ACTIVE` | YES | Group: `NỘI DUNG CONTENT CMS` |
| `/admin/hero` | [`app/admin/(protected)/hero/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/hero/page.tsx) | Homepage Hero Banner CMS | `NEW (PRD v2.1)` | `ACTIVE` | YES | Group: `PROFILE & TRANG CHỦ` |
| `/admin/introduction` | [`app/admin/(protected)/introduction/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/introduction/page.tsx) | Lawyer Bio & Introduction | `NEW (PRD v2.1)` | `ACTIVE` | YES | Group: `PROFILE & TRANG CHỦ` |
| `/admin/education` | [`app/admin/(protected)/education/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/education/page.tsx) | Academic Qualifications | `NEW (PRD v2.1)` | `ACTIVE` | YES | Group: `PROFILE & TRANG CHỦ` |
| `/admin/experience` | [`app/admin/(protected)/experience/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/experience/page.tsx) | Work Experience History | `NEW (PRD v2.1)` | `ACTIVE` | YES | Group: `PROFILE & TRANG CHỦ` |
| `/admin/practice-areas` | [`app/admin/(protected)/practice-areas/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/practice-areas/page.tsx) | Legal Practice Areas CMS | `NEW (PRD v2.1)` | `ACTIVE` | YES | Group: `PROFILE & TRANG CHỦ` |
| `/admin/commitment` | [`app/admin/(protected)/commitment/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/commitment/page.tsx) | Core Commitments CMS | `NEW (PRD v2.1)` | `ACTIVE` | YES | Group: `PROFILE & TRANG CHỦ` |
| `/admin/contact` | [`app/admin/(protected)/contact/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/contact/page.tsx) | Floating Contact Channels | `NEW (PRD v2.1)` | `ACTIVE` | YES | Group: `PROFILE & TRANG CHỦ` |
| `/admin/media` | [`app/admin/(protected)/media/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/media/page.tsx) | Media Assets Library | `NEW (PRD v2.1)` | `ACTIVE` | YES | Group: `MEDIA & SEO` |
| `/admin/seo` | [`app/admin/(protected)/seo/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/seo/page.tsx) | SEO Meta Title & Description | `NEW (PRD v2.1)` | `ACTIVE` | YES | Group: `MEDIA & SEO` |
| `/admin/settings` | [`app/admin/(protected)/settings/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/settings/page.tsx) | Site Settings & Notification Email | `NEW (PRD v2.1)` | `ACTIVE` | YES | Group: `HỆ THỐNG` |
| `/admin/ai-provider` | [`app/admin/(protected)/ai-provider/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/ai-provider/page.tsx) | SYSADMIN AI Provider Config | `NEW (PRD v2.1)` | `ACTIVE` | YES (SYSADMIN) | Group: `HỆ THỐNG` |
| `/admin/ai-content` | [`app/admin/(protected)/ai-content/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/ai-content/page.tsx) | Standalone AI Content Studio | `NEW (PRD v2.1)` | `ACTIVE` | NO | Reached via direct URL |

---

## 2. Actual Repository Admin Route Tree

```text
app/admin/
├── login/
│   └── page.tsx                         (Public Admin Login Form)
└── (protected)/
    ├── layout.tsx                       (Protected Sidebar Layout Shell)
    ├── dashboard/page.tsx               (CMS Dashboard Overview)
    ├── consultations/page.tsx           (Consultation Leads Table)
    ├── menus/page.tsx                   (Menu & Submenu Builder)
    ├── articles/
    │   ├── page.tsx                     (Article List & Search Table)
    │   ├── create/page.tsx              (Create Article + AI Assistant)
    │   └── [id]/edit/page.tsx           (Edit Article + N-N Practice Areas)
    ├── statistics/page.tsx              (Highlighted Stats Management)
    ├── hero/page.tsx                    (Homepage Hero Banner CMS)
    ├── introduction/page.tsx            (Lawyer Profile & Bio)
    ├── education/page.tsx               (Academic Qualifications)
    ├── experience/page.tsx              (Work History Management)
    ├── practice-areas/page.tsx          (Practice Areas CMS)
    ├── commitment/page.tsx              (Commitment & Principles)
    ├── contact/page.tsx                 (Contact Channels - Zalo/FB/Phone)
    ├── media/page.tsx                   (Media Assets Library)
    ├── seo/page.tsx                     (SEO Meta Title/Description Config)
    ├── settings/page.tsx                (Site Settings & Notification Email)
    ├── ai-provider/page.tsx             (SYSADMIN AI Provider Settings)
    └── ai-content/page.tsx              (Standalone AI Content Studio)
```
