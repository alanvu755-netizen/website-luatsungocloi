# PHASE 2 — ADMIN LEGACY UI & DUPLICATE UI AUDIT

**AUTHORITY**: PO DIRECTIVE — ADMIN UI AUDIT  
**AUDIT MODE**: 100% READ-ONLY  
**DATE**: 2026-08-26  

---

## 1. Legacy & Duplicate UI Investigation Results

A comprehensive audit was performed across the entire repository to search for:
- Duplicate admin route trees (`/admin/legacy`, `/cms/v1`, `/admin/old`)
- Duplicate form components
- Unconnected legacy pages
- Conflicting design patterns

### Audit Findings Summary
1. **Zero Duplicate Route Trees**: No legacy route structures (such as `/admin/v1` or `/admin/old`) exist. All 19 screens reside within the unified `app/admin/(protected)` route group.
2. **Zero Duplicate Components**: The Admin UI uses shared components (e.g., [`components/admin/ChannelSubmitButton.tsx`](file:///Users/thiemvv/Documents/website-luat/components/admin/ChannelSubmitButton.tsx) and [`components/ui/SubmitButtonWithSpinner.tsx`](file:///Users/thiemvv/Documents/website-luat/components/ui/SubmitButtonWithSpinner.tsx)) without duplicating form primitive logic.
3. **1 Navigation Discrepancy Found**: The route `/admin/ai-content` (AI Content Studio) is active and functional but missing from the sidebar in [`app/admin/(protected)/layout.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/layout.tsx).

---

## 2. Old vs New UI Decision Matrix

| Business Capability | Current Active UI Path | Legacy / Old UI Path | Navigation Link Status | Proposed Decision | Rationale & Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Admin Login** | `/admin/login` | None | Direct URL | `KEEP` | PRD v2.1 Canonical Auth |
| **CMS Dashboard** | `/admin/dashboard` | None | Sidebar: `TỔNG QUAN` | `KEEP` | PRD v2.1 Canonical Dashboard |
| **Consultation Leads** | `/admin/consultations` | None | Sidebar: `TỔNG QUAN` | `KEEP` | PRD v2.1 Lead Management |
| **Articles Listing** | `/admin/articles` | None | Sidebar: `NỘI DUNG CONTENT CMS` | `KEEP` | PRD v2.1 Article Table |
| **Article Create** | `/admin/articles/create` | None | Subroute of `/admin/articles` | `KEEP` | PRD v2.1 Article Form + AI |
| **Article Edit** | `/admin/articles/[id]/edit` | None | Subroute of `/admin/articles` | `KEEP` | PRD v2.1 Article Form + N-N Sync |
| **Menus & Submenus** | `/admin/menus` | None | Sidebar: `NỘI DUNG CONTENT CMS` | `KEEP` | PRD v2.1 Menu Builder (Max 5) |
| **Statistics** | `/admin/statistics` | None | Sidebar: `NỘI DUNG CONTENT CMS` | `KEEP` | PRD v2.1 Highlighted Stats |
| **Hero Image Banner** | `/admin/hero` | None | Sidebar: `PROFILE & TRANG CHỦ` | `KEEP` | PRD v2.1 Hero Banner CMS |
| **Lawyer Introduction**| `/admin/introduction` | None | Sidebar: `PROFILE & TRANG CHỦ` | `KEEP` | PRD v2.1 Lawyer Profile |
| **Education History** | `/admin/education` | None | Sidebar: `PROFILE & TRANG CHỦ` | `KEEP` | PRD v2.1 Qualification CMS |
| **Work Experience** | `/admin/experience` | None | Sidebar: `PROFILE & TRANG CHỦ` | `KEEP` | PRD v2.1 Career History |
| **Practice Areas** | `/admin/practice-areas` | None | Sidebar: `PROFILE & TRANG CHỦ` | `KEEP` | PRD v2.1 Practice Areas |
| **Commitment Items** | `/admin/commitment` | None | Sidebar: `PROFILE & TRANG CHỦ` | `KEEP` | PRD v2.1 Core Values |
| **Contact Channels** | `/admin/contact` | None | Sidebar: `PROFILE & TRANG CHỦ` | `KEEP` | PRD v2.1 Contact Channels |
| **Media Library** | `/admin/media` | None | Sidebar: `MEDIA & SEO` | `KEEP` | PRD v2.1 Media Asset Library |
| **SEO Settings** | `/admin/seo` | None | Sidebar: `MEDIA & SEO` | `KEEP` | PRD v2.1 SEO Config |
| **Site Settings** | `/admin/settings` | None | Sidebar: `HỆ THỐNG` | `KEEP` | PRD v2.1 Notification Email |
| **AI Provider** | `/admin/ai-provider` | None | Sidebar: `HỆ THỐNG` (SYSADMIN) | `KEEP` | PRD v2.1 SYSADMIN Gate |
| **AI Content Studio** | `/admin/ai-content` | None | Unlinked in Sidebar | `KEEP & LINK` | Standalone AI Generation |

---

## 3. UI Discrepancy & Navigation Alignment Plan

- **Discrepancy**: Route `/admin/ai-content` is not in the sidebar array in `app/admin/(protected)/layout.tsx`.
- **Recommended Action**: Add `{ label: "AI Content Studio", href: "/admin/ai-content", icon: Sparkles }` to the `NỘI DUNG CONTENT CMS` sidebar group in a future approved UI update step.
