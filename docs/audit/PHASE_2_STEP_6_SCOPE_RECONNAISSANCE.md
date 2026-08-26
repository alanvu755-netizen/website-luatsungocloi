# PHASE 2 — STEP 6 SCOPE RECONNAISSANCE REPORT
## PUBLIC SUBPAGE ROUTES & DYNAMIC CONTENT INTEGRATION RECONNAISSANCE

**Dự án:** Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi + AI Content Engine  
**PRD Version:** PRD v2.1 Baseline  
**Current Gate:** STEP 5 = CLOSED (FULL PASS) | STEP 6 = IN PROGRESS  
**Execution Objective:** Scope Reconnaissance & Requirements Alignment before implementation  

---

## 1. PHẠM VI XÂY DỰNG CỦA STEP 6 (WHAT TO BUILD)

Step 6 tập trung hoàn thiện toàn bộ **4 Public Subpage Routes + Dynamic CMS Content Integration + Dynamic SEO Page Metadata**:

1. **Route 1: `/[menuSlug]` (Public Menu Subpage Category Listing)**
   - Hiển thị danh sách các bài viết đã xuất bản (`PUBLISHED`) thuộc Chuyên mục chính Menu.
   - Hỗ trợ Phân trang (Pagination), Tabs chuyển nhanh sang Chuyên mục con Submenu, Breadcrumb navigation.
2. **Route 2: `/[menuSlug]/[submenuSlug]` (Public Submenu Subpage Category Listing)**
   - Hiển thị danh sách bài viết thuộc Chuyên mục con Submenu.
   - Breadcrumb 3 cấp (`Trang chủ › Menu › Submenu`), Phân trang.
3. **Route 3: `/[menuSlug]/[submenuSlug]/[articleSlug]` (Public Article Detail Subpage)**
   - Hiển thị nội dung bài viết tư vấn chi tiết.
   - Đọc và hiển thị thẻ Thẻ Lĩnh vực Hoạt động liên quan (Multi-Practice Area N-N tags từ `ArticlePracticeArea`).
   - Tích hợp Widget Bài viết liên quan (`RelatedArticleService`).
   - Breadcrumb 4 cấp (`Trang chủ › Menu › Submenu › Tên Bài viết`).
4. **Dynamic Search & SEO Page Metadata Integration**
   - Hỗ trợ tìm kiếm từ khóa bài viết qua `SearchService`.
   - Sinh động thẻ Meta SEO (`generateMetadata`) cho toàn bộ các Subpage Routes.

---

## 2. PHẠM VI KHÔNG XÂY DỰNG TRONG STEP 6 (WHAT NOT TO BUILD)

1. **KHÔNG** làm lại Admin CMS / Management (Đã hoàn thành ở Step 4).
2. **KHÔNG** chạy N-N Migration Backfill cho các bài viết cũ (Tiếp tục giữ **CARRY-FORWARD LOCK**).
3. **KHÔNG** commit, push, hay deploy Vercel (Tuân thủ **STRICT GIT LOCK**).
4. **KHÔNG** tự động mở Step 7.

---

## 3. IMPACT ANALYSIS (ROUTES, COMPONENTS, SERVICES, DATABASE)

- **Routes bị ảnh hưởng:**
  - `/[menuSlug]/page.tsx`
  - `/[menuSlug]/[submenuSlug]/page.tsx`
  - `/[menuSlug]/[submenuSlug]/[articleSlug]/page.tsx`
- **Components bị ảnh hưởng:**
  - `components/public/Header.tsx`
  - `components/public/Footer.tsx`
  - `components/public/ArticleCard.tsx`
  - `components/public/Breadcrumbs.tsx` [New/Enhanced]
  - `components/public/RelatedArticlesWidget.tsx` [New/Enhanced]
- **Services được tích hợp:**
  - `ArticleService` (`getPublicArticles`, `getArticleBySlug`)
  - `SearchService` (`searchPublicArticles`)
  - `RelatedArticleService` (`getRelatedArticles`)
  - `SiteService` (`getPublicHeaderMenus`, `getSiteBySlug`)
  - `ContactChannelService` (`getEnabledContactChannels`)
- **Database Models liên quan:** `Site`, `Menu`, `Submenu`, `Article`, `PracticeArea`, `ArticlePracticeArea`, `SiteSettings`.

---

## 4. REQUIREMENTS TO COMPONENT TRACEABILITY MATRIX

| Requirement ID | Target Route | UI Component | Core Service / Data Model | User Flow | Test Group | Acceptance Criteria |
|---|---|---|---|---|---|---|
| **REQ-SUB-01** | `/[menuSlug]` | `PublicMenuListingPage` | `ArticleService` & `Menu` | Người dùng chọn Menu chính từ Header | `TC-SUB-MENU-01..06` | Render đúng bài viết PUBLISHED thuộc Menu, phân trang 10 bài/trang, ẩn bài DRAFT/HIDDEN. |
| **REQ-SUB-02** | `/[menuSlug]/[submenuSlug]` | `PublicSubmenuListingPage` | `ArticleService` & `Submenu` | Người dùng chọn Submenu | `TC-SUB-SUB-01..06` | Render bài viết thuộc Submenu, Breadcrumb 3 cấp. |
| **REQ-SUB-03** | `/[menuSlug]/[submenuSlug]/[articleSlug]` | `PublicArticleDetailPage` | `ArticleService` & `Article` | Người dùng nhấp xem chi tiết bài viết | `TC-SUB-ART-01..10` | Render bài viết chi tiết, hiển thị tags N-N Lĩnh vực hoạt động, Breadcrumb 4 cấp. |
| **REQ-SUB-04** | `/[menuSlug]/[submenuSlug]/[articleSlug]` | `RelatedArticlesWidget` | `RelatedArticleService` | Hiển thị cuối trang bài viết | `TC-SUB-REL-01..04` | Hiển thị tối đa 3 bài viết liên quan cùng chuyên mục (loại trừ bài hiện tại). |
| **REQ-SUB-05** | All Subpages | `generateMetadata` | `SiteSettings` & `Article` | Bot Google / Facebook CRAWL | `TC-SUB-SEO-01..04` | Sinh dynamic SEO title & meta description cho từng Subpage. |

---

## 5. ARCHITECTURE & SECURITY LOCK COMPLIANCE

1. **Tenant Isolation**: 100% các route Subpage đều query bằng `siteId` chính thức `le-thi-ngoc-loi`.
2. **Draft/Hidden Exclusion**: Khóa công khai công khai tuyệt đối, bài viết `DRAFT` và `HIDDEN` khi truy cập đường dẫn trực tiếp phải trả về `notFound()` (404).
3. **Design Tokens**: 100% tuân thủ Tailwind color tokens (`navy`, `navy-dark`, `gold`, `gold-dark`, `slate-200`).

---

## 6. RECONNAISSANCE VERDICT

```text
============================================================
SCOPE RECONNAISSANCE VERDICT: PASSED & LOCKED
============================================================
Phạm vi triển khai Step 6 đã được xác định rõ ràng, đối chiếu 100%
với PRD v2.1 §4 và Architecture Locks.
Sẵn sàng bước vào PHASE 3 (Implementation Plan) & PHASE 4 (Implementation).
============================================================
```
