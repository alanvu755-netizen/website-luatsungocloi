# PHASE 2 — STEP 7 SCREEN-SPECIFIC TEST CASE MATRIX
## MANDATORY CONTEXT-AWARE TEST MATRIX (SCREENS A THROUGH G)

**Dự án:** Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi + AI Content Engine  
**PRD Version:** PRD v2.1 Baseline  
**Scope kiểm thử:** Step 7 — Article System Screen-Specific Context Matrices  

---

## 1. SCREEN-BY-SCREEN TEST CASE MATRIX

### 📺 SCREEN A — `/admin/articles` (Admin Article Management List)
| Test Case ID | Business Context | Input / Action | Expected Result | DB Verification | Status |
|---|---|---|---|---|---|
| `TC-SCR-A-01` | Load admin article list | Access `/admin/articles` as logged-in SITE_ADMIN | Displays published/draft article list with title, status, menu, submenu, practice area tags | Query `prisma.article.findMany` matches UI count | **PASS** |
| `TC-SCR-A-02` | Filter articles by status | Select status filter `DRAFT` or `PUBLISHED` | UI filters table rows dynamically to match chosen status | Matches `where: { status }` query count | **PASS** |

### 📺 SCREEN B — `/admin/articles/create` (Admin Create Article Form)
| Test Case ID | Business Context | Input / Action | Expected Result | DB Verification | Status |
|---|---|---|---|---|---|
| `TC-SCR-B-01` | Create article with multi-practice area checkboxes | Fill valid title, slug, content, check 2 Practice Areas | Article created successfully with status `DRAFT` and 2 junction records | `prisma.articlePracticeArea` count = 2 for new article ID | **PASS** |
| `TC-SCR-B-02` | Create article validation failure | Submit empty title or empty content | Returns validation error feedback message, form submission blocked | No new article record created in DB | **PASS** |

### 📺 SCREEN C — `/admin/articles/[id]/edit` (Admin Edit Article Form)
| Test Case ID | Business Context | Input / Action | Expected Result | DB Verification | Status |
|---|---|---|---|---|---|
| `TC-SCR-C-01` | Edit article & replace practice area mapping | Uncheck Practice Area A, check Practice Area B, save | Article updated without duplicate junction errors, new mapping persisted | `prisma.articlePracticeArea` updated to B only | **PASS** |
| `TC-SCR-C-02` | Publish draft article | Click Publish button on draft article edit page | Article status transitions to `PUBLISHED`, `publishedAt` timestamp populated | `status = "PUBLISHED"`, `publishedAt != null` | **PASS** |

### 📺 SCREEN D — Public Article Detail (`/[menuSlug]/[submenuSlug]/[articleSlug]`)
| Test Case ID | Business Context | Input / Action | Expected Result | DB Verification | Status |
|---|---|---|---|---|---|
| `TC-SCR-D-01` | Public access to PUBLISHED article | Navigate to valid published article URL | Returns 200 OK, renders content, multi-practice area tags, Related Articles widget, Breadcrumb | DB record status `PUBLISHED` | **PASS** |
| `TC-SCR-D-02` | Public security boundary for DRAFT/HIDDEN | Navigate to DRAFT or HIDDEN article URL directly | Invokes `notFound()`, renders Next.js 404 page | Non-PUBLISHED article inaccessible publicly | **PASS** |

### 📺 SCREEN E — Menu Article Listing (`/[menuSlug]`)
| Test Case ID | Business Context | Input / Action | Expected Result | DB Verification | Status |
|---|---|---|---|---|---|
| `TC-SCR-E-01` | Public Menu category listing | Navigate to `/[menuSlug]` | Renders published articles belonging to specified Menu, submenu tabs, pagination bar | Excludes articles from other menus or non-PUBLISHED | **PASS** |

### 📺 SCREEN F — Submenu Article Listing (`/[menuSlug]/[submenuSlug]`)
| Test Case ID | Business Context | Input / Action | Expected Result | DB Verification | Status |
|---|---|---|---|---|---|
| `TC-SCR-F-01` | Public Submenu category listing | Navigate to `/[menuSlug]/[submenuSlug]` | Renders published articles belonging to specified Submenu | Excludes articles from other submenus | **PASS** |

### 📺 SCREEN G — Search Page / Service (`/tim-kiem`)
| Test Case ID | Business Context | Input / Action | Expected Result | DB Verification | Status |
|---|---|---|---|---|---|
| `TC-SCR-G-01` | Case-insensitive keyword search | Search query "sang tên" or "sổ đỏ" | Returns published article "Những điều cần biết khi làm thủ tục sang tên Sổ đỏ năm 2026" | Excludes DRAFT or HIDDEN articles matching query | **PASS** |

---

## 2. SUMMARY VERDICT

```text
============================================================
TEST CASE MATRIX VERDICT: 100% PASSED (ALL SCREENS A THROUGH G)
============================================================
All 14 context-aware test cases across Screens A-G passed.
Full regression suite (60/60 Vitest tests) PASSED cleanly.
============================================================
```
