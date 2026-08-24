# FIRST-VISIT / COLD-ENTRY FORENSIC REPORT

**Project**: Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi + AI Content Engine  
**Date**: 2026-08-24  
**Target Environment**: Production (`https://www.luatsungocloi.vn/thu-vien-phap-luat/dat-dai`)  
**Vercel Execution Region**: `sin1` (Singapore)  
**Service Worker Status**: `NOT PRESENT`  
**Status**: `PERFORMANCE GATE FROZEN — ZERO CODE CHANGES`  

---

## 1. Mandatory 30-Run First-Visit Forensic Table

| Run | Browser State | First Visit? | Target Navigation | Total | Server TTFB | RSC | JS | Main Thread | Result |
| :---: | :--- | :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Run #01** | New Session / Cold | YES | `/thu-vien-phap-luat/dat-dai` | 1,300 ms | 249 ms | 280 ms | 18 ms | 15 ms | SLOW >1s |
| **Run #02** | New Session / Cold | YES | `/thu-vien-phap-luat/dat-dai` | 497 ms | 247 ms | 280 ms | 12 ms | 5 ms | FAST <1s |
| **Run #03** | New Session / Cold | YES | `/thu-vien-phap-luat/dat-dai` | 648 ms | 258 ms | 287 ms | 14 ms | 6 ms | FAST <1s |
| **Run #04** | New Session / Cold | YES | `/thu-vien-phap-luat/dat-dai` | 511 ms | 236 ms | 275 ms | 12 ms | 5 ms | FAST <1s |
| **Run #05** | New Session / Cold | YES | `/thu-vien-phap-luat/dat-dai` | 496 ms | 249 ms | 271 ms | 11 ms | 5 ms | FAST <1s |
| **Run #06** | New Session / Cold | YES | `/thu-vien-phap-luat/dat-dai` | 504 ms | 269 ms | 280 ms | 12 ms | 5 ms | FAST <1s |
| **Run #07** | New Session / Cold | YES | `/thu-vien-phap-luat/dat-dai` | 566 ms | 240 ms | 267 ms | 15 ms | 5 ms | FAST <1s |
| **Run #08** | New Session / Cold | YES | `/thu-vien-phap-luat/dat-dai` | 499 ms | 259 ms | 279 ms | 11 ms | 5 ms | FAST <1s |
| **Run #09** | New Session / Cold | YES | `/thu-vien-phap-luat/dat-dai` | 507 ms | 247 ms | 276 ms | 12 ms | 5 ms | FAST <1s |
| **Run #10** | New Session / Cold | YES | `/thu-vien-phap-luat/dat-dai` | 624 ms | 367 ms | 400 ms | 14 ms | 6 ms | FAST <1s |
| **Run #11** | Cold Direct URL | YES | `/thu-vien-phap-luat/dat-dai` | 166 ms | 163 ms | 166 ms | 0 ms | 5 ms | FAST <1s |
| **Run #12** | Cold Direct URL | YES | `/thu-vien-phap-luat/dat-dai` | 163 ms | 159 ms | 163 ms | 0 ms | 5 ms | FAST <1s |
| **Run #13** | Cold Direct URL | YES | `/thu-vien-phap-luat/dat-dai` | 295 ms | 291 ms | 295 ms | 0 ms | 5 ms | FAST <1s |
| **Run #14** | Cold Direct URL | YES | `/thu-vien-phap-luat/dat-dai` | 290 ms | 286 ms | 290 ms | 0 ms | 5 ms | FAST <1s |
| **Run #15** | Cold Direct URL | YES | `/thu-vien-phap-luat/dat-dai` | 285 ms | 278 ms | 285 ms | 0 ms | 5 ms | FAST <1s |
| **Run #16** | Cold Direct URL | YES | `/thu-vien-phap-luat/dat-dai` | 277 ms | 273 ms | 276 ms | 0 ms | 5 ms | FAST <1s |
| **Run #17** | Cold Direct URL | YES | `/thu-vien-phap-luat/dat-dai` | 291 ms | 284 ms | 291 ms | 0 ms | 5 ms | FAST <1s |
| **Run #18** | Cold Direct URL | YES | `/thu-vien-phap-luat/dat-dai` | 294 ms | 288 ms | 293 ms | 0 ms | 5 ms | FAST <1s |
| **Run #19** | Cold Direct URL | YES | `/thu-vien-phap-luat/dat-dai` | 284 ms | 283 ms | 284 ms | 0 ms | 5 ms | FAST <1s |
| **Run #20** | Cold Direct URL | YES | `/thu-vien-phap-luat/dat-dai` | 330 ms | 324 ms | 330 ms | 0 ms | 5 ms | FAST <1s |
| **Run #21** | Warm Client Nav | NO | `/thu-vien-phap-luat/dat-dai` | 349 ms | 314 ms | 349 ms | 0 ms | 2 ms | FAST <1s |
| **Run #22** | Warm Client Nav | NO | `/thu-vien-phap-luat/dat-dai` | 155 ms | 125 ms | 155 ms | 0 ms | 2 ms | FAST <1s |
| **Run #23** | Warm Client Nav | NO | `/thu-vien-phap-luat/dat-dai` | 147 ms | 123 ms | 146 ms | 0 ms | 2 ms | FAST <1s |
| **Run #24** | Warm Client Nav | NO | `/thu-vien-phap-luat/dat-dai` | 146 ms | 120 ms | 146 ms | 0 ms | 2 ms | FAST <1s |
| **Run #25** | Warm Client Nav | NO | `/thu-vien-phap-luat/dat-dai` | 208 ms | 176 ms | 207 ms | 0 ms | 2 ms | FAST <1s |
| **Run #26** | Warm Client Nav | NO | `/thu-vien-phap-luat/dat-dai` | 164 ms | 146 ms | 164 ms | 0 ms | 2 ms | FAST <1s |
| **Run #27** | Warm Client Nav | NO | `/thu-vien-phap-luat/dat-dai` | 158 ms | 130 ms | 158 ms | 0 ms | 2 ms | FAST <1s |
| **Run #28** | Warm Client Nav | NO | `/thu-vien-phap-luat/dat-dai` | 266 ms | 265 ms | 266 ms | 0 ms | 2 ms | FAST <1s |
| **Run #29** | Warm Client Nav | NO | `/thu-vien-phap-luat/dat-dai` | 182 ms | 136 ms | 182 ms | 0 ms | 2 ms | FAST <1s |
| **Run #30** | Warm Client Nav | NO | `/thu-vien-phap-luat/dat-dai` | 149 ms | 119 ms | 148 ms | 0 ms | 2 ms | FAST <1s |

---

## 2. Group Summary Analysis

### Group A: Brand New Browser Sessions (First Visit Chain)
- **Sample Size**: 10 runs
- **Mean Navigation Chain Total**: **585 ms**
- **Server TTFB**: **236 ms – 367 ms**
- **Result**: 9/10 runs `< 650ms`. Run #1 took 1.30s for the entire multi-page navigation chain.

### Group B: Cold Direct Entry Requests
- **Sample Size**: 10 runs
- **Mean Document Duration**: **267 ms**
- **Server TTFB**: **159 ms – 324 ms**
- **Result**: 10/10 runs `< 330ms`.

### Group C: Warm Client-Side Navigations
- **Sample Size**: 10 runs
- **Mean Navigation Duration**: **192 ms**
- **Server TTFB**: **119 ms – 314 ms**
- **Result**: 10/10 runs `< 350ms`.

---

## 3. Service Worker & Resource Initialization Forensic Audit

- **Service Worker (`/sw.js`)**: **`NOT PRESENT`** (HTTP 404). Service Workers are not active and are not intercepting navigation requests.
- **Resource Initialization (First Visit vs Second Visit)**:
  - First Visit static JS chunks (`/_next/static/chunks/main-app.js`) download in **11ms – 18ms**.
  - All Serverless execution headers returned `x-vercel-id: hkg1::sin1::...` (100% executing in Singapore `sin1`).

---

## 4. Single Mandatory Question Answer

### Question: "10+ GIÂY ĐANG NẰM Ở ĐÂU?"
- **Answer**:
  ```text
  SLOW RUN (>5s / >10s) = NOT REPRODUCED
  ROOT CAUSE = NOT PROVEN
  ```
- **Empirical Evidence**: Across 30 total forensic runs (10 First Visit, 10 Cold Direct Entry, 10 Warm Navigation), Server TTFB on production (`sin1`) consistently measured **119ms to 367ms**, and total navigation time measured **146ms to 1,300ms**. No 10-second stall occurred at any layer during lab profiling.

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
