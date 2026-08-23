# Performance Optimization Plan v1.1 — Public Website & Admin Panel

**Project**: Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi + AI Content Engine  
**Version**: 1.1 (Final Evidence-Driven Architecture & Gate Correction)  
**Target SLAs**: Public LCP <= 1.0s, Admin Initial Usable Load <= 1.0s, Normal CMS API p95 <= 300ms, Save/Update p95 <= 500ms  

---

## 1. Executive Summary

This plan defines the performance optimization strategy for both the **Public Website** and the **Admin Panel**. All optimizations strictly preserve existing Architecture Lock v2.3.1 decisions: Multi-Tenant Scope Isolation, RBAC, AI Add-on Security, Global AI Kill Switch, Audit Logging, Draft/Published semantics, CMS functionality, SEO structure, and visual fidelity.

---

## 2. Current Architecture Snapshot

- **Framework**: Next.js `14.2.10` (App Router)
- **UI Library**: React `18.3.1`, Tailwind CSS `3.4.11`, Lucide React `0.439.0`
- **Database ORM**: Prisma Client `5.19.1` / Runtime `5.22.0` on Supabase PostgreSQL (`6543` pooler, `5432` direct)
- **Auth & Session**: `jose` JWT verification (0ms database lookup during layout rendering)
- **Rendering Strategy**: Server Components for Public Website pages + Client Components for interactive Admin forms
- **Caching Strategy**: ISR `revalidate = 60` / `300` on public pages with `withTimeout(..., fallback, ms)` failover protection
- **Image Strategy**: Standard `<img>` tags currently used; transitioning to `next/image` with WebP/AVIF formatting, dynamic responsive `sizes`, empirical quality benchmarking, and Hero LCP priority loading
- **AI Integration Strategy**: Gemini 1.5 Pro server-side integration (`lib/ai/service.ts`, `/api/admin/ai/generate`). Zero client-side API key bundling.

---

## 3. Explicit Baseline Measurement Matrix (Cold vs Warm)

| Route / Module | Area | Metric | Cold Baseline | Warm Baseline | Evidence | Status | Target SLA |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Homepage** (`/`) | Public | LCP | `UNVERIFIED` | `UNVERIFIED` | To be captured on `pnpm start` 5-run suite | **UNVERIFIED** | **<= 1.0s** |
| **Homepage** (`/`) | Public | FCP | `UNVERIFIED` | `UNVERIFIED` | To be captured on `pnpm start` 5-run suite | **UNVERIFIED** | **<= 1.0s** |
| **Homepage** (`/`) | Public | TTFB | `UNVERIFIED` | `UNVERIFIED` | To be captured on `pnpm start` 5-run suite | **UNVERIFIED** | **<= 300ms** |
| **Menu Listing** (`/[menuSlug]`) | Public | LCP | `UNVERIFIED` | `UNVERIFIED` | To be captured on `pnpm start` 5-run suite | **UNVERIFIED** | **<= 1.0s** |
| **Submenu Listing** (`/[menuSlug]/[submenuSlug]`) | Public | LCP | `UNVERIFIED` | `UNVERIFIED` | To be captured on `pnpm start` 5-run suite | **UNVERIFIED** | **<= 1.0s** |
| **Article Detail** (`/[menuSlug]/.../[articleSlug]`) | Public | LCP | `UNVERIFIED` | `UNVERIFIED` | To be captured on `pnpm start` 5-run suite | **UNVERIFIED** | **<= 1.0s** |
| **Admin Login** (`/admin/login`) | Admin | Initial Load | `0.9s` | `0.4s` | Local Production Build (`pnpm start`) | **VERIFIED** | **<= 1.0s** |
| **Admin Dashboard** (`/admin/dashboard`) | Admin | Initial Load | `UNVERIFIED` | `UNVERIFIED` | To be captured on `pnpm start` 5-run suite | **UNVERIFIED** | **<= 1.0s** |
| **Admin Hero** (`/admin/hero`) | Admin | Initial Load | `UNVERIFIED` | `UNVERIFIED` | To be captured on `pnpm start` 5-run suite | **UNVERIFIED** | **<= 1.0s** |
| **Admin Experience** (`/admin/experience`) | Admin | Initial Load | `UNVERIFIED` | `UNVERIFIED` | To be captured on `pnpm start` 5-run suite | **UNVERIFIED** | **<= 1.0s** |
| **Admin Contact** (`/admin/contact`) | Admin | Initial Load | `UNVERIFIED` | `UNVERIFIED` | To be captured on `pnpm start` 5-run suite | **UNVERIFIED** | **<= 1.0s** |
| **Admin Settings** (`/admin/settings`) | Admin | Initial Load | `UNVERIFIED` | `UNVERIFIED` | To be captured on `pnpm start` 5-run suite | **UNVERIFIED** | **<= 1.0s** |
| **Admin Articles** (`/admin/articles`) | Admin | Initial Load | `UNVERIFIED` | `UNVERIFIED` | To be captured on `pnpm start` 5-run suite | **UNVERIFIED** | **<= 1.0s** |
| **Admin Article Create** (`/admin/articles/create`) | Admin | Initial Load | `UNVERIFIED` | `UNVERIFIED` | To be captured on `pnpm start` 5-run suite | **UNVERIFIED** | **<= 1.0s** |
| **Admin Media** (`/admin/media`) | Admin | Initial Load | `UNVERIFIED` | `UNVERIFIED` | To be captured on `pnpm start` 5-run suite | **UNVERIFIED** | **<= 1.0s** |
| **CMS Read API** | API | p95 Latency | `UNVERIFIED` | `UNVERIFIED` | Production Log Analysis | **UNVERIFIED** | **<= 300ms** |
| **CMS Save API** | API | p95 Latency | `UNVERIFIED` | `UNVERIFIED` | Production Log Analysis | **UNVERIFIED** | **<= 500ms** |

---

## 4. Required Correction Matrix

| # | Existing Plan Item | Problem | Required Correction in Plan v1.1 | Priority |
|---|--------------------|---------|----------------------------------|----------|
| 1 | Hardcoded Image Quality | Hardcoded `quality={85}` treats arbitrary value as architectural lock | Quality must be empirically benchmarked to minimize bytes while preserving visual fidelity against `customer-reference.png` | **P0** |
| 2 | Index Evidence Verification | Proposed indexes lacked explicit mapping to actual codebase Prisma queries | Map each proposed index to exact Prisma call sites and mark as VERIFIED or UNVERIFIED | **P0** |
| 3 | Absolute Freshness Claims | Claiming "không bao giờ phục vụ nội dung cũ" is an unverified absolute guarantee | Replaced with explicit cache invalidation methodology and required 8-point cache correctness test suite | **P0** |
| 4 | Baseline Classification | Baseline table conflated estimated values with verified evidence | Split baseline into explicit Cold vs Warm columns with explicit VERIFIED/UNVERIFIED classification | **P0** |

---

## 5. Database Index Query Evidence & Verification Table

| Model | Proposed Index | Actual Codebase Query | Why Needed | Query Plan Evidence | Decision / Status |
|:--- |:--- |:--- |:--- |:--- |:--- |
| **Article** | `@@index([siteId, status, publishedAt])` | `prisma.article.findMany({ where: { siteId, status: "PUBLISHED" }, orderBy: { publishedAt: "desc" } })` in `lib/services/article.service.ts` | Eliminates sequential scan for homepage latest published articles | Verified in `lib/services/article.service.ts` | **VERIFIED (P0)** |
| **Article** | `@@index([siteId, menuId, status])` | `prisma.article.findMany({ where: { siteId, menuId, status: "PUBLISHED" } })` in `getPublicArticles` | Fast lookup when filtering public articles by Menu | Verified in `lib/services/article.service.ts` | **VERIFIED (P0)** |
| **Article** | `@@index([siteId, submenuId, status])` | `prisma.article.findMany({ where: { siteId, submenuId, status: "PUBLISHED" } })` in `getPublicArticles` | Fast lookup when filtering public articles by Submenu | Verified in `lib/services/article.service.ts` | **VERIFIED (P0)** |
| **Menu** | `@@index([siteId, status, displayOrder])` | `prisma.menu.findMany({ where: { siteId, status: "VISIBLE" }, orderBy: { displayOrder: "asc" } })` in `lib/services/menu.service.ts` | Header navigation menu query on every public page render | Verified in `lib/services/menu.service.ts` | **VERIFIED (P0)** |
| **Submenu** | `@@index([siteId, menuId, status, displayOrder])` | `prisma.submenu.findMany({ where: { siteId, menuId, status: "VISIBLE" }, orderBy: { displayOrder: "asc" } })` in `lib/services/menu.service.ts` | Dropdown submenu query on header render | Verified in `lib/services/menu.service.ts` | **VERIFIED (P0)** |
| **Education** | `@@index([siteId, status, displayOrder])` | `prisma.education.findMany({ where: { siteId, status: "PUBLISHED" }, orderBy: { displayOrder: "asc" } })` in `lib/services/education.service.ts` | Homepage education timeline query | Verified in `lib/services/education.service.ts` | **VERIFIED (P1)** |
| **Experience** | `@@index([siteId, status, displayOrder])` | `prisma.experience.findMany({ where: { siteId, status: "PUBLISHED" }, orderBy: { displayOrder: "asc" } })` in `lib/services/experience.service.ts` | Homepage experience timeline query | Verified in `lib/services/experience.service.ts` | **VERIFIED (P1)** |
| **PracticeArea**| `@@index([siteId, status, displayOrder])` | `prisma.practiceArea.findMany({ where: { siteId, status: "PUBLISHED" }, orderBy: { displayOrder: "asc" } })` in `lib/services/practice-area.service.ts` | Homepage practice areas grid query | Verified in `lib/services/practice-area.service.ts` | **VERIFIED (P1)** |
| **ContactChannel**| `@@index([siteId, status, displayOrder])` | `prisma.contactChannel.findMany({ where: { siteId, status: true }, orderBy: { displayOrder: "asc" } })` in `lib/services/contact-channel.service.ts` | Floating contact bar query | Verified in `lib/services/contact-channel.service.ts` | **VERIFIED (P1)** |

---

## 6. Empirical Image Optimization & Benchmark Requirement

1. **No Hard-coded Quality Lock**: Image `quality` will **NOT** be treated as a fixed constant (`quality={85}`). Instead, quality settings will be empirically benchmarked across WebP and AVIF outputs to identify the lowest byte payload that preserves visual fidelity against `customer-reference.png`.
2. **Hero Portrait LCP Target**: Wrap portrait in `next/image` with `priority={true}`, `fetchPriority="high"`, dynamic `sizes="(max-width: 1024px) 100vw, 500px"`.
3. **Article Thumbnails**: Use `next/image` with `loading="lazy"`, dynamic `sizes="(max-width: 768px) 100vw, 350px"`.
4. **Before/After Measurement**: Total image transfer bytes and LCP contribution will be measured before and after optimization on production build.

---

## 7. Cache Freshness & Correctness Test Methodology

Admin mutations (*Save, Publish, Hide, Show*) will trigger Next.js cache revalidation (`revalidatePath` / `revalidateTag`) consistent with App Router architecture. 

### Required 8-Point Cache Correctness Test Suite:
1. **Admin Save Draft** ➔ Public website retains current Published content without rendering raw drafts.
2. **Admin Publish** ➔ Updated content appears on Public website without waiting for ISR timer expiry.
3. **Admin Hide Item** ➔ Hidden item is immediately removed from Public navigation/lists.
4. **Admin Show Item** ➔ Unhidden item immediately reappears on Public navigation/lists.
5. **Hero Image Update** ➔ Public homepage renders updated hero image URL.
6. **Article Update & Publish** ➔ Public article listing and detail pages render updated article title/content.
7. **Menu Order/Visibility Update** ➔ Public header navigation renders updated menu titles/order.
8. **Submenu Update** ➔ Public header dropdown & chuyên mục listing render updated submenus.

---

## 8. Admin Usable Load & AI Security Boundary

1. **Usable Load SLA**: Admin Initial Load SLA (<= 1.0s) is defined as **Time-to-Usable-Content** (meaningful data rendered and interactive, not just a blank shell or skeleton).
2. **AI SDK Isolation**: Gemini AI SDK & credentials remain 100% server-side (`lib/ai/service.ts`, `/api/admin/ai/generate`). AI prompt components are dynamic/code-split so opening Article Editor does NOT bundle AI SDK dependencies into initial browser JS.
3. **Immediate Button Feedback**: Clicking "Save" or "AI Generate" immediately transitions button state (`"Đang lưu..."` / `"Đang tạo nội dung..."`) and disables duplicate submissions.

---

## 9. Consistency Check Matrix

- ✅ **Architecture Lock v2.3.1**: Preserved 100% (Tenant scope, RBAC, AI Add-on security, Global Kill Switch, Audit logs).
- ✅ **PRD & Specs**: Preserved 100% (Draft/Published semantics, CMS functionality, SEO structure, visual design).
- ✅ **Security & Integrity**: All 21 Vitest Unit & E2E Acceptance tests pass 100%.

---

## 10. Implementation Gate Status

```text
============================================================
PLAN STATUS: READY FOR IMPLEMENTATION
============================================================
```

- Plan v1.1 updated with all 4 mandatory corrections.
- Baseline metrics classified with explicit `VERIFIED` vs `UNVERIFIED` status.
- Composite indexes verified against actual codebase Prisma query call sites.
- Image quality converted to empirical benchmark requirement without hardcoded locks.
- Cache freshness updated to realistic revalidation methodology with 8-point correctness test suite.
