# PHASE 2 — ADMIN UI RECONNAISSANCE REPORT

**AUTHORITY**: PO DIRECTIVE — ADMIN UI RECONNAISSANCE & AUDIT  
**AUDIT MODE**: 100% READ-ONLY (NO CODE EDITS, NO FILE DELETIONS, NO TEST MUTATIONS)  
**DATE**: 2026-08-26  

---

## 1. Admin UI Architecture Overview

The Admin UI of the Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi & AI Content Engine project is built using **Next.js 14 App Router** with Tailwind CSS styling and Lucide icons.

### Primary Design System Tokens
- **Primary Navy Theme**: `bg-navy` (`#0F172A` / `slate-900`), `bg-navy-dark` (`#020617`), `text-navy`
- **Gold Accent Token**: `bg-gold` (`#D97706` / `amber-600`), `text-gold` (`#F59E0B`), `border-gold`
- **Background Layer**: `bg-slate-100` / `bg-slate-50`
- **Typography**: Serif titles (`font-serif font-bold text-navy`), sans-serif body text (`text-slate-700 text-xs/text-sm`)

---

## 2. Layout & Shell Architecture

### Root Protected Layout (`app/admin/(protected)/layout.tsx`)
- **Rendering Mode**: React Server Component (RSC).
- **Authentication Guard**: Direct call to `getAuthenticatedUser()`. Unauthenticated users are redirected to `/admin/login`.
- **Sidebar Component**: Fixed 64-unit width (`w-64 flex-shrink-0`), navy background, grouped navigation links, user profile badge, and logout trigger (`/api/admin/logout`).
- **Header Component**: Top bar (`h-16 bg-white border-b border-slate-200`) rendering site title, role badge (`SYSADMIN` / `SITE_ADMIN`), and external link to public homepage (`/`).

---

## 3. Rendering Strategy: Server Components vs Client Components

| Admin Screen | File Path | Component Type | Data Fetching Pattern |
| :--- | :--- | :--- | :--- |
| **Login** | [`app/admin/login/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/login/page.tsx) | Client Component (`"use client"`) | Client `fetch('/api/admin/login')` |
| **Dashboard** | [`app/admin/(protected)/dashboard/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/dashboard/page.tsx) | Server Component (RSC) | Direct Prisma DB query |
| **Consultations** | [`app/admin/(protected)/consultations/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/consultations/page.tsx) | Server Component (RSC) | Direct Prisma DB query |
| **Articles List** | [`app/admin/(protected)/articles/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/articles/page.tsx) | Server Component (RSC) | `getArticles()` Service query |
| **Article Create** | [`app/admin/(protected)/articles/create/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/articles/create/page.tsx) | Client Component (`"use client"`) | API fetches & Client Form State |
| **Article Edit** | [`app/admin/(protected)/articles/[id]/edit/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/articles/%5Bid%5D/edit/page.tsx) | Client Component (`"use client"`) | API fetches & Client Form State |
| **Menus** | [`app/admin/(protected)/menus/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/menus/page.tsx) | Server Component (RSC) | `getMenus()` Service query |
| **Statistics** | [`app/admin/(protected)/statistics/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/statistics/page.tsx) | Server Component (RSC) | `getStatistics()` Service query |
| **Hero Image** | [`app/admin/(protected)/hero/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/hero/page.tsx) | Server Component (RSC) | `getHero()` Service query |
| **Introduction** | [`app/admin/(protected)/introduction/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/introduction/page.tsx) | Server Component (RSC) | `getIntroduction()` Service query |
| **Education** | [`app/admin/(protected)/education/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/education/page.tsx) | Server Component (RSC) | `getEducations()` Service query |
| **Experience** | [`app/admin/(protected)/experience/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/experience/page.tsx) | Server Component (RSC) | `getExperiences()` Service query |
| **Practice Areas** | [`app/admin/(protected)/practice-areas/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/practice-areas/page.tsx) | Server Component (RSC) | `getPracticeAreas()` Service query |
| **Commitment** | [`app/admin/(protected)/commitment/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/commitment/page.tsx) | Server Component (RSC) | `getCommitments()` Service query |
| **Contact Channels** | [`app/admin/(protected)/contact/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/contact/page.tsx) | Server Component (RSC) | `getContactChannels()` Service query |
| **Media Library** | [`app/admin/(protected)/media/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/media/page.tsx) | Server Component (RSC) | Direct Prisma DB query |
| **SEO Settings** | [`app/admin/(protected)/seo/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/seo/page.tsx) | Server Component (RSC) | `getSiteBySlug()` Service query |
| **Site Settings** | [`app/admin/(protected)/settings/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/settings/page.tsx) | Server Component (RSC) | `getSiteBySlug()` Service query |
| **AI Provider** | [`app/admin/(protected)/ai-provider/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/ai-provider/page.tsx) | Server Component (RSC) | Direct Prisma DB query |
| **AI Content Studio**| [`app/admin/(protected)/ai-content/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/ai-content/page.tsx) | Client Component (`"use client"`) | Client `fetch('/api/admin/ai/generate')` |

---

## 4. Key Reconnaissance Findings

1. **Clean Separation of Concerns**: Most listing pages (`articles`, `menus`, `consultations`, `settings`) leverage Next.js **Server Components (RSC)** for fast initial loads, with Server Actions for form submissions.
2. **Rich Interactive Editors**: Interactive creation/editing pages (`articles/create`, `articles/[id]/edit`, `ai-content`) use **Client Components** to support stateful AI generation, dynamic tags, and rich preview modes.
3. **Design Token Consistency**: 100% of active admin screens use uniform Tailwind palette classes (`navy`, `gold`, `slate-50` to `slate-900`), Lucide icon sets, and structured layout wrappers (`max-w-5xl`, `max-w-6xl`).
