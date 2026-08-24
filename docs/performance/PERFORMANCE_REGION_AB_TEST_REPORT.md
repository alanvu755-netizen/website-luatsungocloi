# CONTROLLED REGION A/B TEST REPORT

**Project**: Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi + AI Content Engine  
**Date**: 2026-08-23  
**Target Environment**: Live Production (`https://www.luatsungocloi.vn/thu-vien-phap-luat/dat-dai`)  
**Experiment**: Single-Variable Region Shift (`iad1` ➔ `sin1`)  

---

## 1. Executive Summary & Verdict

A controlled single-variable experiment was conducted to verify if relocating the Vercel Serverless Function execution region from `iad1` (Washington D.C., USA) to `sin1` (Singapore) eliminates the 5–10 second navigation stall.

- **Only Change Applied**: Created `vercel.json` specifying `"regions": ["sin1"]`.
- **Code Changes**: **0 lines modified** (No code, schema, query, or connection pool changes).
- **Sequential P50 Latency**: Reduced from **5,992 ms ➔ 163 ms** (**⚡ 97.3% faster**).
- **Sequential MAX Latency**: Reduced from **7,699 ms ➔ 909 ms** (**⚡ 88.2% faster**).
- **Concurrent Burst MAX Latency (20 Reqs)**: Reduced from **12,067 ms ➔ 1,262 ms** (**⚡ 89.5% faster**).
- **5–10s Navigation Stalls**: **100% ELIMINATED** (`0` occurrences out of 30 total test runs).

---

## 2. Control Group Baseline (`CONTROL_BEFORE_iad1`)

- **Execution Region (`x-vercel-id`)**: `hkg1::iad1::...` (Washington D.C., USA)
- **Database Region**: `aws-0-ap-southeast-1` (Singapore)
- **Vercel Cache Header**: `x-vercel-cache: MISS`

### 10 Sequential Requests (`iad1`)
```text
Seq #01 | Status: 200 | TTFB: 751ms | Total: 7699ms | Vercel-ID: hkg1::iad1::8kdnv...
Seq #02 | Status: 200 | TTFB: 442ms | Total: 7162ms | Vercel-ID: hkg1::iad1::8kdnv...
Seq #03 | Status: 200 | TTFB: 319ms | Total: 5791ms | Vercel-ID: hkg1::iad1::dkstz...
Seq #04 | Status: 200 | TTFB: 311ms | Total: 6067ms | Vercel-ID: hkg1::iad1::fmv49...
Seq #05 | Status: 200 | TTFB: 305ms | Total: 5949ms | Vercel-ID: hkg1::iad1::4ctdd...
Seq #06 | Status: 200 | TTFB: 313ms | Total: 5976ms | Vercel-ID: hkg1::iad1::fmv49...
Seq #07 | Status: 200 | TTFB: 456ms | Total: 5766ms | Vercel-ID: hkg1::iad1::fmv49...
Seq #08 | Status: 200 | TTFB: 361ms | Total: 5992ms | Vercel-ID: hkg1::iad1::8kdnv...
Seq #09 | Status: 200 | TTFB: 355ms | Total: 5913ms | Vercel-ID: hkg1::iad1::v2ncc...
Seq #10 | Status: 200 | TTFB: 298ms | Total: 7357ms | Vercel-ID: hkg1::iad1::sznj6...
```
- **P50**: `5,992 ms` | **P95**: `7,699 ms` | **MAX**: `7,699 ms`
- **Counts**: `>1s`: 10 | `>3s`: 10 | `>5s`: 10 (100% > 5s)

### 20 Concurrent Burst Requests (`iad1`)
- **P50**: `10,197 ms` | **P95**: `12,067 ms` | **MAX**: `12,067 ms`
- **Counts**: `>1s`: 20 | `>3s`: 20 | `>5s`: 20 (100% > 5s)

---

## 3. Test Group Measurement (`TEST_AFTER_sin1`)

- **Execution Region (`x-vercel-id`)**: `hkg1::sin1::...` (Singapore Datacenter Co-located)
- **Database Region**: `aws-0-ap-southeast-1` (Singapore)
- **Vercel Cache Header**: `x-vercel-cache: MISS`

### 10 Sequential Requests (`sin1`)
```text
Seq #01 | Status: 200 | TTFB: 769ms | Total: 771ms | Vercel-ID: hkg1::sin1::qkh5f...
Seq #02 | Status: 200 | TTFB: 590ms | Total: 592ms | Vercel-ID: hkg1::sin1::9dkbp...
Seq #03 | Status: 200 | TTFB: 134ms | Total: 178ms | Vercel-ID: hkg1::sin1::tmxjs...
Seq #04 | Status: 200 | TTFB: 846ms | Total: 909ms | Vercel-ID: hkg1::sin1::nrdg7...
Seq #05 | Status: 200 | TTFB: 133ms | Total: 161ms | Vercel-ID: hkg1::sin1::nrdg7...
Seq #06 | Status: 200 | TTFB: 129ms | Total: 157ms | Vercel-ID: hkg1::sin1::tmxjs...
Seq #07 | Status: 200 | TTFB: 124ms | Total: 154ms | Vercel-ID: hkg1::sin1::9dkbp...
Seq #08 | Status: 200 | TTFB: 135ms | Total: 156ms | Vercel-ID: hkg1::sin1::7nfr7...
Seq #09 | Status: 200 | TTFB: 127ms | Total: 159ms | Vercel-ID: hkg1::sin1::nrdg7...
Seq #10 | Status: 200 | TTFB: 128ms | Total: 163ms | Vercel-ID: hkg1::sin1::w29rx...
```
- **P50**: `163 ms` | **P95**: `909 ms` | **MAX**: `909 ms`
- **Counts**: `>1s`: 0 | `>3s`: 0 | `>5s`: 0 (**0% > 1s**)

### 20 Concurrent Burst Requests (`sin1`)
- **P50**: `1,052 ms` | **P95**: `1,262 ms` | **MAX**: `1,262 ms`
- **Counts**: `>1s`: 13 | `>3s`: 0 | `>5s`: 0 (**0% > 3s**)

---

## 4. Side-by-Side Comparison Table (BEFORE vs AFTER)

### 10 Sequential Requests
| Metric | BEFORE (`iad1` - USA) | AFTER (`sin1` - Singapore) | Delta Improvement |
| :--- | :---: | :---: | :---: |
| **Execution Region (`x-vercel-id`)** | `hkg1::iad1::...` | `hkg1::sin1::...` | **Co-located with DB** |
| **P50 Latency** | **5,992 ms** | **163 ms** | **⚡ 97.3% faster** |
| **P95 Latency** | **7,699 ms** | **909 ms** | **⚡ 88.2% faster** |
| **MAX Latency** | **7,699 ms** | **909 ms** | **⚡ 88.2% faster** |
| **Reqs > 1s** | **10 / 10** | **0 / 10** | **100% Eliminated** |
| **Reqs > 3s** | **10 / 10** | **0 / 10** | **100% Eliminated** |
| **Reqs > 5s** | **10 / 10** | **0 / 10** | **100% Eliminated** |

### 20 Concurrent Burst Requests
| Metric | BEFORE (`iad1` - USA) | AFTER (`sin1` - Singapore) | Delta Improvement |
| :--- | :---: | :---: | :---: |
| **P50 Latency** | **10,197 ms** | **1,052 ms** | **⚡ 89.7% faster** |
| **P95 Latency** | **12,067 ms** | **1,262 ms** | **⚡ 89.5% faster** |
| **MAX Latency** | **12,067 ms** | **1,262 ms** | **⚡ 89.5% faster** |
| **Reqs > 3s** | **20 / 20** | **0 / 20** | **100% Eliminated** |
| **Reqs > 5s** | **20 / 20** | **0 / 20** | **100% Eliminated** |

---

## 5. Empirical Verification Verdict

```text
============================================================
CONTROLLED REGION A/B TEST VERDICT: PASS & PROVEN
============================================================
1. Vercel Execution Region: Verified running in sin1 (Singapore)
2. Sequential P50 Latency:  163 ms (reduced from 5,992 ms)
3. Sequential MAX Latency:  909 ms (reduced from 7,699 ms)
4. Concurrent Burst MAX:    1,262 ms (reduced from 12,067 ms)
5. 5-10s Intermittent Stall: 100% ELIMINATED
6. Source Code Changes:     0 lines modified
============================================================
```
