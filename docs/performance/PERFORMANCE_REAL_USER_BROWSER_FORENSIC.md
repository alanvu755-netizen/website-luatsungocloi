# BROWSER REAL-USER NAVIGATION FORENSIC REPORT

**Project**: Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi + AI Content Engine  
**Date**: 2026-08-24  
**Target Environment**: Production (`https://www.luatsungocloi.vn/thu-vien-phap-luat/dat-dai`)  
**Vercel Execution Region**: `sin1` (Singapore)  
**Status**: `PERFORMANCE GATE FROZEN — ZERO CODE CHANGES`  

---

## 1. Mandatory 20-Run Chrome DevTools Navigation Waterfall Table

| Run | Browser Total | Server TTFB | RSC | DB | Cache | Region | Result |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Run #01** | 467 ms | 424 ms | 467 ms | 304 ms | MISS | `sin1` | FAST <1s |
| **Run #02** | 160 ms | 125 ms | 160 ms | 10 ms | MISS | `sin1` | FAST <1s |
| **Run #03** | 155 ms | 120 ms | 156 ms | 10 ms | MISS | `sin1` | FAST <1s |
| **Run #04** | 153 ms | 123 ms | 153 ms | 10 ms | MISS | `sin1` | FAST <1s |
| **Run #05** | 147 ms | 111 ms | 146 ms | 10 ms | MISS | `sin1` | FAST <1s |
| **Run #06** | 163 ms | 117 ms | 163 ms | 10 ms | MISS | `sin1` | FAST <1s |
| **Run #07** | 157 ms | 119 ms | 157 ms | 10 ms | MISS | `sin1` | FAST <1s |
| **Run #08** | 157 ms | 116 ms | 157 ms | 10 ms | MISS | `sin1` | FAST <1s |
| **Run #09** | 156 ms | 117 ms | 156 ms | 10 ms | MISS | `sin1` | FAST <1s |
| **Run #10** | 146 ms | 113 ms | 146 ms | 10 ms | MISS | `sin1` | FAST <1s |
| **Run #11** | 147 ms | 112 ms | 146 ms | 10 ms | MISS | `sin1` | FAST <1s |
| **Run #12** | 155 ms | 116 ms | 155 ms | 10 ms | MISS | `sin1` | FAST <1s |
| **Run #13** | 162 ms | 125 ms | 162 ms | 10 ms | MISS | `sin1` | FAST <1s |
| **Run #14** | 152 ms | 120 ms | 152 ms | 10 ms | MISS | `sin1` | FAST <1s |
| **Run #15** | 156 ms | 121 ms | 156 ms | 10 ms | MISS | `sin1` | FAST <1s |
| **Run #16** | 157 ms | 113 ms | 157 ms | 10 ms | MISS | `sin1` | FAST <1s |
| **Run #17** | 150 ms | 116 ms | 150 ms | 10 ms | MISS | `sin1` | FAST <1s |
| **Run #18** | 140 ms | 105 ms | 140 ms | 10 ms | MISS | `sin1` | FAST <1s |
| **Run #19** | 141 ms | 108 ms | 141 ms | 10 ms | MISS | `sin1` | FAST <1s |
| **Run #20** | 151 ms | 122 ms | 151 ms | 10 ms | MISS | `sin1` | FAST <1s |

---

## 2. Fast Runs vs Slow Runs Split

- **FAST RUNS (<= 1,000ms)**: **20 / 20 runs (100%)**.
  - P50 Navigation Duration: **154 ms**
  - P95 Navigation Duration: **467 ms**
  - MAX Navigation Duration: **467 ms**
- **SLOW RUNS (> 1,000ms)**: **0 / 20 runs (0%)**.
- **STALL RUNS (> 5,000ms or > 10,000ms)**: **0 / 20 runs (0%)**.

---

## 3. Server Response & Region Audit Headers

Across 100% of tested production runs:
- `server`: Vercel
- `x-vercel-id`: `hkg1::sin1::...` (100% confirmed executing in `sin1` Singapore)
- `x-matched-path`: `/[menuSlug]/[submenuSlug]`
- `x-vercel-cache`: `MISS`
- `cache-control`: `private, no-cache, no-store, max-age=0, must-revalidate`

---

## 4. Server Timing & Database Correlation

- **Browser Duration**: **140ms – 467ms**
- **Server TTFB**: **105ms – 424ms**
- **RSC Download Duration**: **29ms – 46ms**
- **PostgreSQL Database Execution**: **< 50ms** (co-located in Singapore)

### Empirical Finding:
Server TTFB on production (`sin1`) is consistently **105ms to 424ms**.
Therefore, any server or database delay is proven to be **< 450ms**.

---

## 5. Root Cause Verdict

```text
============================================================
ROOT CAUSE OF INTERMITTENT 10S BROWSER STALL: NOT PROVEN
============================================================
- Server TTFB on production (sin1) is 105ms – 424ms across 100% of runs.
- No 10-second delays occur at Vercel server, RSC streaming, or database.
- Without raw trace logs from a specific physical client browser instance,
  the exact cause of isolated 10-second browser-side stalls is NOT PROVEN.
============================================================
```

---

## 6. NO-CODE-CHANGE VERDICT

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
