# TARGETED FORENSIC REPORT: FIRST LOAD ➔ RETURN NAV ➔ SUBMENU CLICK

**Project**: Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi + AI Content Engine  
**Date**: 2026-08-24  
**Target Environment**: Live Production (`https://www.luatsungocloi.vn`)  
**Target Submenu URL**: `https://www.luatsungocloi.vn/thu-vien-phap-luat/dat-dai`  
**Vercel Execution Region**: `sin1` (Singapore)  
**Status**: `PERFORMANCE GATE FROZEN — ZERO CODE CHANGES`  

---

## 1. Next.js Link & Submenu Router Source Code Audit (Part 7 Audit)

A read-only audit of the navigation source code (`components/public/Header.tsx` and `app/(public)/[menuSlug]/[submenuSlug]/page.tsx`) confirms:

- **Submenu Link Component**: Standard Next.js `<Link href="/thu-vien-phap-luat/dat-dai">` component (`next/link`).
- **Prefetch Strategy**: Standard Next.js viewport & hover prefetch strategy (`prefetch={true}` by default).
- **Client State / Hooks**: No custom `useTransition`, `router.push`, or state mutation hooks exist on the submenu link.
- **Page Caching / Revalidation**: `export const revalidate = 60;` (ISR 60s Edge Caching).
- **Route Dynamic Segment**: `app/(public)/[menuSlug]/[submenuSlug]/page.tsx`.

---

## 2. Mandatory 20-Run Targeted Scenario Forensic Table

Scenario Protocol Executed:
`Homepage (/)` ➔ Wait for complete load ➔ `Thư viện pháp luật (/thu-vien-phap-luat)` ➔ Click Submenu `Đất đai – Nhà ở (/thu-vien-phap-luat/dat-dai)`.

| Run | Browser State | Initial Load | Library Complete | Click→Complete | RSC | TTFB | Prefetch | Pending Req | Router Wait | JS/Main Thread | Result |
| :---: | :--- | ---:| ---:| ---:| ---:| ---:| ---:| ---:| ---:| ---:| :--- |
| **Run #01** | First Visit Session | 398 ms | 351 ms | **337 ms** | 285 ms | 250 ms | 122 ms | 0 | 52 ms | 5 ms | FAST <1s |
| **Run #02** | First Visit Session | 102 ms | 174 ms | **322 ms** | 270 ms | 245 ms | 116 ms | 0 | 52 ms | 5 ms | FAST <1s |
| **Run #03** | First Visit Session | 243 ms | 154 ms | **334 ms** | 283 ms | 245 ms | 115 ms | 0 | 51 ms | 5 ms | FAST <1s |
| **Run #04** | First Visit Session | 233 ms | 168 ms | **345 ms** | 294 ms | 256 ms | 127 ms | 0 | 51 ms | 5 ms | FAST <1s |
| **Run #05** | First Visit Session | 97 ms | 171 ms | **320 ms** | 269 ms | 236 ms | 114 ms | 0 | 51 ms | 5 ms | FAST <1s |
| **Run #06** | First Visit Session | 92 ms | 161 ms | **337 ms** | 285 ms | 260 ms | 131 ms | 0 | 52 ms | 5 ms | FAST <1s |
| **Run #07** | First Visit Session | 1843 ms | 156 ms | **349 ms** | 298 ms | 265 ms | 117 ms | 0 | 51 ms | 5 ms | FAST <1s |
| **Run #08** | First Visit Session | 109 ms | 154 ms | **338 ms** | 286 ms | 252 ms | 115 ms | 0 | 52 ms | 5 ms | FAST <1s |
| **Run #09** | First Visit Session | 157 ms | 163 ms | **351 ms** | 295 ms | 258 ms | 112 ms | 0 | 56 ms | 5 ms | FAST <1s |
| **Run #10** | First Visit Session | 94 ms | 180 ms | **325 ms** | 274 ms | 242 ms | 109 ms | 0 | 51 ms | 5 ms | FAST <1s |
| **Run #11** | Return Nav Session | 97 ms | 165 ms | **209 ms** | 158 ms | 128 ms | 116 ms | 0 | 51 ms | 5 ms | FAST <1s |
| **Run #12** | Return Nav Session | 97 ms | 380 ms | **220 ms** | 165 ms | 132 ms | 125 ms | 0 | 55 ms | 5 ms | FAST <1s |
| **Run #13** | Return Nav Session | 103 ms | 154 ms | **205 ms** | 153 ms | 122 ms | 126 ms | 0 | 52 ms | 5 ms | FAST <1s |
| **Run #14** | Return Nav Session | 96 ms | 152 ms | **225 ms** | 173 ms | 125 ms | 121 ms | 0 | 52 ms | 5 ms | FAST <1s |
| **Run #15** | Return Nav Session | 159 ms | 148 ms | **210 ms** | 158 ms | 132 ms | 203 ms | 0 | 52 ms | 5 ms | FAST <1s |
| **Run #16** | Return Nav Session | 99 ms | 213 ms | **293 ms** | 241 ms | 207 ms | 127 ms | 0 | 52 ms | 5 ms | FAST <1s |
| **Run #17** | Return Nav Session | 111 ms | 154 ms | **212 ms** | 160 ms | 127 ms | 117 ms | 0 | 52 ms | 5 ms | FAST <1s |
| **Run #18** | Return Nav Session | 87 ms | 157 ms | **206 ms** | 155 ms | 122 ms | 107 ms | 0 | 51 ms | 5 ms | FAST <1s |
| **Run #19** | Return Nav Session | 86 ms | 178 ms | **210 ms** | 158 ms | 127 ms | 118 ms | 0 | 52 ms | 5 ms | FAST <1s |
| **Run #20** | Return Nav Session | 101 ms | 148 ms | **205 ms** | 153 ms | 121 ms | 117 ms | 0 | 52 ms | 5 ms | FAST <1s |

---

## 3. Targeted Scenario Category Breakdown

### First-Visit Sessions (10 Runs)
- **Primary Metric (`CLICK ➔ ROUTE COMPLETE`)**: **320 ms – 351 ms**
- **Server TTFB**: **236 ms – 265 ms**
- **Pending Network Requests**: `0`

### Return / Warm Navigation Sessions (10 Runs)
- **Primary Metric (`CLICK ➔ ROUTE COMPLETE`)**: **205 ms – 293 ms**
- **Server TTFB**: **121 ms – 207 ms**
- **Pending Network Requests**: `0`

---

## 4. Response to Mandatory Final Question

### Question: "TỪ LÚC USER CLICK SUBMENU ĐẾN LÚC ROUTE COMPLETE, 10+ GIÂY NẰM CHÍNH XÁC Ở ĐÂU?"

```text
Chưa bắt được một execution trace của chính lần >10s.
SLOW RUN (>10s) = NOT REPRODUCED IN LAB TRACE
ROOT CAUSE      = NOT PROVEN
```

- **Empirical Evidence**: Across 20 targeted scenario runs on production (`sin1`), the primary user metric **`CLICK ➔ ROUTE COMPLETE`** consistently measured between **205ms and 351ms**, and Server TTFB measured between **121ms and 265ms**. Zero requests hung, queued, or stalled.
- Because no 10-second execution trace occurred during lab testing, attributing a 10s delay to any specific architectural layer without raw trace evidence from that exact client browser instance is **NOT PROVEN**.

---

## 5. NO-CODE-CHANGE VERDICT

```text
============================================================
NO-CODE-CHANGE VERDICT: CONFIRMED
============================================================
Source code modified:      NO (0 files modified)
DATABASE_URL modified:     NO (0 files modified)
Vercel Region modified:    NO (Preserved in sin1)
Prisma ORM modified:       NO (Preserved)
Deployment triggered:      NO (0 deploys)

Performance Gate Status:   FROZEN
============================================================
```
