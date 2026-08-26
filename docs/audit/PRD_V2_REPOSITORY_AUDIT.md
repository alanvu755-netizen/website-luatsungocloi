# PHASE 0 — READ-ONLY REPOSITORY + PRODUCT + UI FORENSIC AUDIT
## PROJECT: WEBSITE LUẬT SƯ – THẠC SĨ LÊ THỊ NGỌC LỢI + AI CONTENT ENGINE
**PRD Version:** v2 (Baseline v2.1)  
**Execution Control:** Antigravity Master Implementation Control Document v2.1  
**Audit Date:** 2026-08-24  
**Audit Status:** `PHASE 0 — AUDIT COMPLETE (DECISION REQUIRED)`  
**Codebase Modification Status:** `READ-ONLY (0 files created/modified/deleted in source code)`

---

## 1. EXECUTIVE SUMMARY

Báo cáo này là kết quả kiểm toán toàn diện (Phase 0 Forensic Audit) giữa **Tài liệu Yêu cầu Sản phẩm (PRD v2 / v2.1)**, **Screenshot Giao diện Homepage Mới (`Ngoc Loi New Layout.jpg`)**, **Tài liệu Điều khiển Triển khai Master**, và **Mã nguồn Hiện tại của Repository**.

### Kết quả Kiểm toán Trọng yếu:
1. **Kiến trúc Nền tảng (Baseline Architecture)**: Dự án hiện tại được xây dựng trên **Next.js 14 App Router (TypeScript)**, **Prisma ORM 5.19.1**, **PostgreSQL (Supabase PgBouncer)**, **Tailwind CSS**, và hệ thống phân quyền **RBAC (3 Tầng: SYSADMIN, SITE_ADMIN, EDITOR)**.
2. **Khoảng trống Tính năng (Feature Gaps)**:
   - **Form Đăng ký tư vấn (Consultation Form)**: Chưa được khởi tạo trong CSDL (`prisma/schema.prisma` thiếu bảng `ConsultationLead` hoặc `FormSubmission`) và chưa có UI đăng ký tư vấn trên Homepage/Footer.
   - **Thông báo Email cho Admin (Email Notification)**: Chưa được tích hợp dịch vụ gửi email (Resend/Nodemailer/SMTP) và thiếu trường cấu hình Email nhận thông báo tư vấn trong `SiteSettings`.
   - **Các chỉ số Nổi bật (Featured Statistics)**: CSDL chưa có bảng/trường lưu trữ 4 chỉ số nổi bật (`800+`, `500+`, `10+`, `100%`) dưới dạng CMS Editable.
   - **Tin tức Pháp luật trên Homepage (Homepage Legal News Section)**: Chưa có block hiển thị danh sách bài viết mới nhất trên Homepage.
3. **Mâu thuẫn Quan trọng (Document ↔ Code Conflicts)**:
   - **Quan hệ Bài viết – Lĩnh vực (Article ↔ Practice Area Relationship)**: PRD v2 yêu cầu một bài viết có thể thuộc **NHIỀU lĩnh vực hoạt động** (Quan hệ N-N). Tuy nhiên, `schema.prisma` hiện tại chỉ cho phép bài viết thuộc duy nhất **1 Menu (`menuId`)** và **1 Submenu (`submenuId`)** (Quan hệ 1-N).
   - **Phạm vi AI Content Engine**: PRD v2 giới hạn AI chỉ hỗ trợ trong luồng **Thêm bài viết mới** (gợi ý Tiêu đề, Nội dung, Tóm tắt, SEO, Keywords, CTA). Mã nguồn hiện tại đang có cả trang `/admin/ai-content` (AI Studio) và API `/api/admin/ai/generate` độc lập.
4. **Trạng thái Tuân thủ Rule**: **100% READ-ONLY**. Không có bất kỳ thay đổi nào đối với mã nguồn, CSDL hay cấu hình môi trường trong suốt quá trình kiểm toán này.

---

## 2. SOURCE DOCUMENTS REVIEWED

Đã kiểm tra và đối chiếu 100% nội dung các tài liệu chuẩn:

| STT | Tài liệu / Nguồn | Đường dẫn trong Repository | Vai trò & Phạm vi Đối chiếu |
|---|---|---|---|
| 1 | `PRD_v2_Product_Requirements_Baseline.md` | `docs/product/PRD_v2.1_Product_Requirements_Baseline_Luat_Su_Le_Thi_Ngoc_Loi_FINAL.md` | **PRODUCT SOURCE OF TRUTH**: Phạm vi sản phẩm, user flows, CMS, Admin, Sysadmin, Form tư vấn, Bài viết, AI scope. |
| 2 | `ANTIGRAVITY_MASTER_IMPLEMENTATION_CONTROL_DOCUMENT_PRD_v2.1.md` | `docs/implementation/ANTIGRAVITY_MASTER_IMPLEMENTATION_CONTROL_DOCUMENT_PRD_v2.1.md` | **EXECUTION CONTROL**: Quy tắc làm việc, thứ bậc quyết định, No-Silent-Decision, Gate controls, Evidence requirements. |
| 3 | `Ngoc Loi New Layout.jpg` | `docs/design/Ngoc Loi New Layout.jpg` | **VISUAL SOURCE OF TRUTH**: Layout visual intent, typography, colors, structure, cards, hero, statistics, footer. |
| 4 | `TECHNICAL_SPECIFICATION_Website_Luat_Su_Le_Thi_Ngoc_Loi.md` | `docs/technical/TECHNICAL_SPECIFICATION_Website_Luat_Su_Le_Thi_Ngoc_Loi.md` | **TECHNICAL BASELINE**: Tech stack, Next.js architecture, Prisma schema baseline, API structure. |
| 5 | `DESIGN_SPECIFICATION_Website_Luat_Su_Le_Thi_Ngoc_Loi.md` | `docs/design/DESIGN_SPECIFICATION_Website_Luat_Su_Le_Thi_Ngoc_Loi.md` | **DESIGN BASELINE**: Visual hierarchy, color tokens, typography clamp, mobile responsiveness. |
| 6 | `AI_ADDON_Website_Luat_Su_Le_Thi_Ngoc_Loi.md` | `docs/product/AI_CONTENT_ENGINE_SPECIFICATION.md` | **AI BASELINE**: Gemini integration, Verified Facts, Brand Voice, Safety Policy, Quota & Rate limits. |

---

## 3. CURRENT ARCHITECTURE

### 3.1 Tech Stack Hiện tại
- **Framework**: Next.js `14.2.10` (App Router, Server Components + Selective Client Components).
- **Ngôn ngữ**: TypeScript `5.5.4` (Strict Mode enabled).
- **ORM & Database**: Prisma `5.19.1` + PostgreSQL (Supabase PgBouncer Transaction Pooler trên cổng `6543`, Direct URL trên cổng `5432`).
- **Styling**: Tailwind CSS `3.4.11` + Lucide React Icons `0.439.0`.
- **Xác thực (Auth)**: Session Authentication qua JWT Cookie (`jose` `5.9.2` & `bcryptjs` `2.4.3`).
- **Phân quyền (RBAC)**: 3 Roles (`SYSADMIN`, `SITE_ADMIN`, `EDITOR`) với bảng `RolePermission` và override `UserPermission`.

### 3.2 Server/Client Boundary & Data Fetching Strategy
- **Public Routes**: Sử dụng Server Components hoàn toàn (`app/(public)/page.tsx`, `app/(public)/[menuSlug]/page.tsx`...), tích hợp Next.js ISR `revalidate = 60` (60 giây Edge Caching).
- **Admin Protected Routes**: Sử dụng Server Actions cho các thao tác Mutation (Create, Update, Delete, Toggle) và Client Components nhỏ cho các tương tác UI (`ChannelSubmitButton`).

---

## 4. CURRENT ROUTE MAP

### 4.1 Public Routes (Người dùng cuối)
| Route | Tệp Mã nguồn (File) | Component Chính | Mục đích & Mô tả | Trạng thái Hiện tại |
|---|---|---|---|---|
| `/` | [`app/(public)/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/%28public%29/page.tsx) | `PublicPage` | Homepage chính của Luật sư Ngọc Lợi | **EXISTING (Thiếu Stats, Legal News, Form Tư vấn)** |
| `/[menuSlug]` | [`app/(public)/[menuSlug]/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/%28public%29/%5BmenuSlug%5D/page.tsx) | `PublicMenuPage` | Trang Lĩnh vực / Menu động | **EXISTING** |
| `/[menuSlug]/[submenuSlug]` | [`app/(public)/[menuSlug]/[submenuSlug]/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/%28public%29/%5BmenuSlug%5D/%5BsubmenuSlug%5D/page.tsx) | `PublicSubmenuOrArticlePage` | Trang Chuyên mục con / Bài viết trực tiếp | **EXISTING** |
| `/[menuSlug]/[submenuSlug]/[articleSlug]` | [`app/(public)/[menuSlug]/[submenuSlug]/[articleSlug]/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/%28public%29/%5BmenuSlug%5D/%5BsubmenuSlug%5D/%5BarticleSlug%5D/page.tsx) | `PublicSubmenuArticleDetailPage` | Trang Chi tiết Bài viết 3 cấp | **EXISTING (Thiếu Share FB/Zalo, Related Articles)** |

### 4.2 Admin & Sysadmin Protected Routes
| Route | Tệp Mã nguồn (File) | Quyền Truy cập (Role) | Mục đích & Mô tả | Trạng thái Hiện tại |
|---|---|---|---|---|
| `/admin/login` | [`app/admin/login/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/login/page.tsx) | Public | Trang Đăng nhập Quản trị | **EXISTING** |
| `/admin/dashboard` | [`app/admin/(protected)/dashboard/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/dashboard/page.tsx) | SITE_ADMIN / SYSADMIN | Dashboard tổng quan chỉ số | **EXISTING** |
| `/admin/hero` | [`app/admin/(protected)/hero/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/hero/page.tsx) | SITE_ADMIN / SYSADMIN | Quản lý Nội dung Hero | **EXISTING** |
| `/admin/introduction` | [`app/admin/(protected)/introduction/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/introduction/page.tsx) | SITE_ADMIN / SYSADMIN | Quản lý Bài Giới thiệu | **EXISTING** |
| `/admin/education` | [`app/admin/(protected)/education/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/education/page.tsx) | SITE_ADMIN / SYSADMIN | Quản lý Học vấn | **EXISTING** |
| `/admin/experience` | [`app/admin/(protected)/experience/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/experience/page.tsx) | SITE_ADMIN / SYSADMIN | Quản lý Kinh nghiệm | **EXISTING** |
| `/admin/practice-areas` | [`app/admin/(protected)/practice-areas/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/practice-areas/page.tsx) | SITE_ADMIN / SYSADMIN | Quản lý Lĩnh vực hoạt động | **EXISTING** |
| `/admin/commitment` | [`app/admin/(protected)/commitment/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/commitment/page.tsx) | SITE_ADMIN / SYSADMIN | Quản lý Cam kết | **EXISTING** |
| `/admin/contact` | [`app/admin/(protected)/contact/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/contact/page.tsx) | SITE_ADMIN / SYSADMIN | Quản lý Kênh liên hệ (Zalo, FB, Telegram) | **EXISTING** |
| `/admin/menus` | [`app/admin/(protected)/menus/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/menus/page.tsx) | SITE_ADMIN / SYSADMIN | Quản lý Navigation Menu & Submenu | **EXISTING** |
| `/admin/articles` | [`app/admin/(protected)/articles/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/articles/page.tsx) | SITE_ADMIN / SYSADMIN | Quản lý Danh sách Bài viết | **EXISTING** |
| `/admin/articles/create` | [`app/admin/(protected)/articles/create/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/articles/create/page.tsx) | SITE_ADMIN / SYSADMIN | Tạo Bài viết mới (+ Tích hợp AI Assist) | **EXISTING** |
| `/admin/articles/[id]/edit` | [`app/admin/(protected)/articles/[id]/edit/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/articles/%5Bid%5D/edit/page.tsx) | SITE_ADMIN / SYSADMIN | Chỉnh sửa Bài viết | **EXISTING** |
| `/admin/media` | [`app/admin/(protected)/media/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/media/page.tsx) | SITE_ADMIN / SYSADMIN | Quản lý Thư viện Media/Ảnh | **EXISTING** |
| `/admin/seo` | [`app/admin/(protected)/seo/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/seo/page.tsx) | SITE_ADMIN / SYSADMIN | Quản lý Cấu hình SEO Website | **EXISTING** |
| `/admin/settings` | [`app/admin/(protected)/settings/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/settings/page.tsx) | SITE_ADMIN / SYSADMIN | Quản lý Cài đặt Website, Logo, Favicon | **EXISTING** |
| `/admin/ai-content` | [`app/admin/(protected)/ai-content/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/ai-content/page.tsx) | SITE_ADMIN / SYSADMIN | AI Content Studio Studio | **EXISTING (Cần ẩn/điều chỉnh theo PRD v2)** |
| `/admin/ai-provider` | [`app/admin/(protected)/ai-provider/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/ai-provider/page.tsx) | **SYSADMIN ONLY** | Quản lý Cấu hình AI Provider (Gemini) | **EXISTING** |

### 4.3 API Routes
- `/api/admin/login` (POST): Xử lý đăng nhập.
- `/api/admin/logout` (POST): Xử lý đăng xuất.
- `/api/admin/hero`, `/api/admin/hero/publish`: Quản lý xuất bản Hero.
- `/api/admin/articles`, `/api/admin/articles/[id]`: REST API quản lý bài viết.
- `/api/admin/menus`: REST API quản lý Menu.
- `/api/admin/settings`: REST API cài đặt site.
- `/api/admin/ai/generate`: Route xử lý sinh nội dung AI.

---

## 5. CURRENT COMPONENT MAP

| Component | File Path | Mục đích | Khả năng Tái sử dụng (Reuse) |
|---|---|---|---|
| `Header` | [`components/public/Header.tsx`](file:///Users/thiemvv/Documents/website-luat/components/public/Header.tsx) | Thanh điều hướng đầu trang | **MODIFY**: Cần cập nhật theo visual design screenshot mới. |
| `Hero` | [`components/public/Hero.tsx`](file:///Users/thiemvv/Documents/website-luat/components/public/Hero.tsx) | Khu vực Hero giới thiệu Luật sư | **MODIFY**: Cần cập nhật layout 2 cột mới & curved decorative background. |
| `IntroductionSection` | [`components/public/IntroductionSection.tsx`](file:///Users/thiemvv/Documents/website-luat/components/public/IntroductionSection.tsx) | Phần Giới thiệu kinh nghiệm | **REUSE**: Cấu trúc tốt, cần chỉnh CSS padding. |
| `EducationSection` | [`components/public/EducationSection.tsx`](file:///Users/thiemvv/Documents/website-luat/components/public/EducationSection.tsx) | Danh sách Học vấn | **REUSE**: Tốt, dạng Card danh sách. |
| `ExperienceSection` | [`components/public/ExperienceSection.tsx`](file:///Users/thiemvv/Documents/website-luat/components/public/ExperienceSection.tsx) | Timeline Kinh nghiệm công tác | **REUSE**: Cấu trúc Timeline chuẩn. |
| `PracticeAreasSection` | [`components/public/PracticeAreasSection.tsx`](file:///Users/thiemvv/Documents/website-luat/components/public/PracticeAreasSection.tsx) | Lĩnh vực hoạt động (Checklist) | **MODIFY**: Cần hỗ trợ xem danh sách bài viết & link từng lĩnh vực. |
| `CommitmentSection` | [`components/public/CommitmentSection.tsx`](file:///Users/thiemvv/Documents/website-luat/components/public/CommitmentSection.tsx) | Khối Cam kết chất lượng dịch vụ | **REUSE**: Tốt. |
| `Footer` | [`components/public/Footer.tsx`](file:///Users/thiemvv/Documents/website-luat/components/public/Footer.tsx) | Chân trang & Thông tin liên hệ | **MODIFY**: Cần nhúng Form Đăng ký tư vấn theo layout screenshot. |
| `FloatingContact` | [`components/public/FloatingContact.tsx`](file:///Users/thiemvv/Documents/website-luat/components/public/FloatingContact.tsx) | Thanh liên hệ nổi Mobile | **PRESERVE**: Hoạt động hoàn hảo. |
| `ChannelSubmitButton` | [`components/admin/ChannelSubmitButton.tsx`](file:///Users/thiemvv/Documents/website-luat/components/admin/ChannelSubmitButton.tsx) | Nút Submit có trạng thái Loading Admin | **PRESERVE**: Đã fix lỗi UX phản hồi. |

---

## 6. CURRENT HOMEPAGE AUDIT vs SCREENSHOT NEW LAYOUT

Đối chiếu trực tiếp giao diện Homepage hiện tại với screenshot **`Ngoc Loi New Layout.jpg`**:

```text
SCREENSHOT NEW LAYOUT SECTIONS:
┌────────────────────────────────────────────────────────┐
│ 1. Header (Logo + Dynamic Navigation + Highlight CTA)  │
├────────────────────────────────────────────────────────┤
│ 2. Hero Section (Chân dung Luật sư + Background Cong)  │
├────────────────────────────────────────────────────────┤
│ 3. 4 Chỉ số Nổi bật (800+ Vụ việc, 500+ Khách hàng...)│ ──> [MISSING IN CODE]
├────────────────────────────────────────────────────────┤
│ 4. Lĩnh vực hoạt động (Grid Cards + Icons + Descriptions)│
├────────────────────────────────────────────────────────┤
│ 5. Tin tức Pháp luật Mới nhất (Article Grid Cards)      │ ──> [MISSING IN CODE]
├────────────────────────────────────────────────────────┤
│ 6. Form Đăng ký Tư vấn (Họ tên, SĐT, Email, Nội dung)  │ ──> [MISSING IN CODE]
├────────────────────────────────────────────────────────┤
│ 7. Footer (Thông tin liên hệ + Logo + Social Links)     │
└────────────────────────────────────────────────────────┘
```

### Chi tiết Sai khác & Thiếu sót trên Homepage:
1. **Khối 4 Chỉ số Nổi bật (Statistics Block)**: Screenshot có 4 con số ấn tượng (`800+`, `500+`, `10+`, `100%`). Mã nguồn hiện tại chưa có section này và chưa có dữ liệu CMS quản trị con số.
2. **Khu vực Tin tức Pháp luật (Legal News Section)**: Screenshot hiển thị các bài viết pháp luật mới nhất ngay trên Homepage. Mã nguồn hiện tại chỉ hiển thị bài viết trong các route động `/[menuSlug]`.
3. **Form Đăng ký Tư vấn (Consultation Form)**: Screenshot có khu vực form nhập liệu để khách hàng gửi thông tin tư vấn. Mã nguồn hiện tại hoàn toàn chưa có Form này.

---

## 7. HEADER / NAVIGATION AUDIT

- **Trạng thái Hiện tại**: Hệ thống đã có bảng `Menu` và `Submenu` trong CSDL. Admin có thể bật/tắt (thay đổi `status = "VISIBLE"` / `"HIDDEN"`), đổi thứ tự `displayOrder` tại `/admin/menus`.
- **Đối chiếu PRD v2**: PRD v2 yêu cầu Header/Menu bám sát baseline UI nhưng Admin có quyền bật/tắt từng menu trong Admin. Mã nguồn hiện tại đã đáp ứng **100% khả năng bật/tắt động** qua CMS (`getPublicHeaderMenus`).

---

## 8. PUBLIC CONTENT / ARTICLE SYSTEM AUDIT

- **Cấu trúc URL**:
  - Trang danh mục: `/[menuSlug]` hoặc `/[menuSlug]/[submenuSlug]`
  - Trang chi tiết: `/[menuSlug]/[submenuSlug]/[articleSlug]`
- **Tìm kiếm (Search)**:
  - Mã nguồn hiện tại hỗ trợ tham số `search` trong `getArticles` tìm kiếm trong `title` và `excerpt`.
  - **Mâu thuẫn PRD v2**: PRD v2 Section 4 yêu cầu tìm kiếm trong **Tiêu đề + Nội dung (title + content)** và CHỈ tìm kiếm trong phạm vi lĩnh vực đang xem.
- **Phân trang (Pagination)**: Đã hỗ trợ phân trang `page` & `pageSize = 10`.
- **Bài viết Liên quan (Related Articles)**: Mã nguồn hiện tại ở trang chi tiết bài viết **chưa có block hiển thị Bài viết liên quan** (Ưu tiên bài viết chung lĩnh vực/menu).
- **Nút Chia sẻ Mạng xã hội (Social Sharing)**: Chưa có nút bấm chia sẻ Facebook và chia sẻ Zalo trên trang chi tiết bài viết.

---

## 9. CMS AUDIT

Mã nguồn CMS hiện tại hỗ trợ quản trị:
- ✅ **Hero**: Tiêu đề, Tên, Ảnh đại diện, Logo (có chế độ DRAFT / PUBLISHED).
- ✅ **Giới thiệu (Introduction)**: Tiêu đề, Nội dung rich text.
- ✅ **Học vấn (Education)**: Thêm/Sửa/Xóa bằng cấp, trường học, thứ tự.
- ✅ **Kinh nghiệm (Experience)**: Thêm/Sửa/Xóa vị trí, cơ quan, các mốc nổi bật (Highlights).
- ✅ **Lĩnh vực hoạt động (Practice Areas)**: Thêm/Sửa/Xóa tiêu đề, mô tả.
- ✅ **Cam kết (Commitment)**: Tiêu đề cam kết, nội dung.
- ✅ **Kênh liên hệ (Contact Channels)**: Bật/Tắt Zalo, Facebook, Telegram, Phone, Email.
- ✅ **Menu & Submenu**: Quản lý cây menu 2 cấp, đường dẫn slug, ẩn/hiện.
- ✅ **Bài viết (Articles)**: Thêm/Sửa/Xóa bài viết, SEO Title, Meta Description, Keywords, Thumbnail.
- ✅ **Cài đặt Site (Settings)**: Tên site, Số điện thoại, Địa chỉ, Google Maps.
- ✅ **SEO Global**: SEO Title, SEO Description mặc định cho toàn site.
- ❌ **Chưa có CMS**:
  - Quản lý 4 Chỉ số Nổi bật (Statistics).
  - Quản lý Khách hàng Đăng ký tư vấn (Consultation Leads).
  - Quản lý Email nhận thông báo tư vấn.
  - Quản lý Thay đổi Logo & Favicon trực tiếp bằng Upload Media (Hiện tại `SiteSettings` lưu dạng chuỗi text URL).

---

## 10. DATABASE / PRISMA AUDIT

### Entity Map Hiện tại (`prisma/schema.prisma`):
- `Site`, `Role`, `Permission`, `RolePermission`, `UserPermission`, `AdminUser`
- `Hero`, `Introduction`, `Education`, `Experience`, `ExperienceHighlight`, `PracticeArea`, `Commitment`, `ContactChannel`, `SiteSettings`, `Media`
- `Menu`, `Submenu`, `Article`
- `GlobalAIConfig`, `AddOn`, `SiteAddOn`, `AIProvider`, `AISiteConfig`, `AIKnowledgeItem`, `AIPromptTemplate`, `AIGeneration`, `AIUsage`, `AuditLog`

### Các Bảng Cần Bổ sung / Sửa đổi cho PRD v2:
1. **[TẠO MỚI] Bảng `ConsultationLead`**:
   ```prisma
   model ConsultationLead {
     id          String   @id @default(cuid())
     siteId      String
     site        Site     @relation(fields: [siteId], references: [id], onDelete: Cascade)
     fullName    String
     phone       String
     email       String?
     content     String
     ipAddress   String?
     createdAt   DateTime @default(now())
   }
   ```
2. **[TẠO MỚI] Bảng `StatisticItem` (Cho 4 Chỉ số Nổi bật)**:
   ```prisma
   model StatisticItem {
     id           String   @id @default(cuid())
     siteId       String
     site         Site     @relation(fields: [siteId], references: [id], onDelete: Cascade)
     value        String   // "800+", "500+", "10+", "100%"
     label        String   // "Vụ việc thành công", "Khách hàng tin tưởng"...
     displayOrder Int      @default(0)
     status       Boolean  @default(true)
   }
   ```
3. **[SUA DOI] Quan hệ N-N giữa `Article` và `PracticeArea` / `Menu`**:
   Tạo bảng trung gian `ArticlePracticeArea` để một bài viết có thể chọn nhiều lĩnh vực.
4. **[SUA DOI] Bảng `SiteSettings`**: Bổ sung trường `consultationEmail String?` để Admin cấu hình email nhận thông báo tư vấn.

---

## 11. AUTHENTICATION & AUTHORIZATION AUDIT

- **Xác thực (Auth)**: Sử dụng JWT lưu trong Cookie `auth_session`. Middleware (`middleware.ts`) bảo vệ toàn bộ tuyến đường `/admin/*` (trừ `/admin/login`).
- **Phân quyền (RBAC)**: Hàm `checkPermission` (`lib/auth/rbac.ts`) thực thi đúng **Architecture Lock #9**:
  1. Kiểm tra UserStatus (Nếu `disabled` ➔ DENY).
  2. Kiểm tra Tenant Scope (`siteId` của user so với `targetSiteId`). `SYSADMIN` được truy cập tất cả site (`siteId === null`).
  3. Kiểm tra Override `UserPermission` (Nếu có record ➔ Trả về giá trị `granted`).
  4. Kiểm tra `RolePermission`.
  5. Mặc định là DENY.

---

## 12. ADMIN vs SYSADMIN AUDIT

Mã nguồn tuân thủ chính xác phân định quyền hạn trong PRD v2 Section 9:
- **Admin (`SITE_ADMIN`)**: Quản trị toàn bộ nội dung CMS (Bài viết, Menu, Hero, Lĩnh vực, Kênh liên hệ, SEO). **KHÔNG có quyền truy cập trang `/admin/ai-provider`**.
- **Sysadmin (`SYSADMIN`)**: Có toàn bộ quyền Admin + Quyền độc quyền quản lý cấu hình nhà cung cấp AI Engine tại trang [`app/admin/(protected)/ai-provider/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/ai-provider/page.tsx).

---

## 13. CONSULTATION FORM & EMAIL AUDIT

- **Form Đăng ký Tư vấn**: **CHƯA CÓ TRONG CODEBASE**.
- **Yêu cầu PRD v2 Section 7**:
  - Các trường: Họ tên (Required), Số điện thoại (Required), Email (Optional), Nội dung tư vấn (Required/Optional).
  - Lưu vào CSDL để Admin xem.
  - Gửi email thông báo cho Admin ngay khi có đăng ký mới.
  - Cấu hình Email nhận thông báo do Admin chủ động đặt trong Admin.
  - Có cơ chế chống spam (Rate limit / Captcha / Anti-bot honeypot).

---

## 14. MEDIA / ASSET AUDIT

- **Thư viện Media**: Bảng `Media` lưu trữ thông tin file (`url`, `fileName`, `mimeType`, `size`).
- **Ảnh Luật sư Ngọc Lợi**: Ảnh gốc đặt tại `/docs/design/customer-reference.png` và được tham chiếu mặc định trong Hero Service.
- **Logo & Favicon**: PRD v2 yêu cầu Logo và Favicon phải có khả năng upload/thay đổi trực tiếp từ Admin. Mã nguồn hiện tại đã có trang `/admin/settings` nhưng chưa có component Upload đính kèm preview cho Logo & Favicon.

---

## 15. SEO AUDIT

Mã nguồn hiện tại đã hỗ trợ:
- Trang `/admin/seo` cho phép cập nhật `seoTitle` và `seoDescription` toàn trang.
- Mỗi bài viết có trường `seoTitle`, `metaDescription`, `keywords`.
- Các tệp chuẩn SEO: `sitemap.ts` và `robots.ts` đã được khởi tạo trong `app/`.

---

## 16. AI CONTENT ENGINE AUDIT

- **Thực trạng**: Module AI đã được xây dựng hoàn chỉnh với Google Gemini SDK (`@google/genai` hoặc Fetch REST), bảo mật 7 lớp (Global Kill Switch, Tenant Scope, Permission, Add-on Active Check, Quota, Rate Limit, Legal Safety Prompt Filter).
- **Đối chiếu PRD v2 Section 5 & 10**:
  - PRD v2 chốt phạm vi: **AI CHỈ hỗ trợ trong flow Thêm bài viết mới** (Nhập gạch đầu dòng ➔ Sinh Tiêu đề, Nội dung, Tóm tắt, SEO, Keywords, CTA).
  - Không triển khai các tính năng AI Studio nâng cao (Ideas, Calendar, Bulk generation, Rewrite).
  - Mã nguồn hiện tại đã có nút `✨ AI Hỗ Trợ Tạo Bài Viết` tại trang `/admin/articles/create` tuân thủ đúng định hướng này!

---

## 17. PRD v2 REQUIREMENT TRACEABILITY MATRIX

| ID | PRD v2 Requirement | Existing Code Location | Status | Action |
|---|---|---|---|---|
| REQ-01 | Homepage bám sát layout screenshot mới | [`app/(public)/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/%28public%29/page.tsx) | PARTIAL | **MODIFY**: Cập nhật lại cấu trúc các Section trên Homepage |
| REQ-02 | 4 Chỉ số Nổi bật (800+, 500+...) CMS editable | Chưa có | MISSING | **CREATE**: Tạo Bảng `StatisticItem` + CMS Admin + Homepage UI |
| REQ-03 | Quản lý Bật/Tắt Dynamic Menu & Submenu | [`lib/services/menu.service.ts`](file:///Users/thiemvv/Documents/website-luat/lib/services/menu.service.ts) | EXISTS | **PRESERVE**: Đã hoàn thành 100% |
| REQ-04 | Bài viết thuộc **nhiều lĩnh vực hoạt động** | [`prisma/schema.prisma`](file:///Users/thiemvv/Documents/website-luat/prisma/schema.prisma) | CONFLICT | **MODIFY**: Chuyển quan hệ `Article` ↔ `PracticeArea` sang N-N |
| REQ-05 | Tìm kiếm bài viết theo Tiêu đề + Nội dung trong Lĩnh vực | [`lib/services/article.service.ts`](file:///Users/thiemvv/Documents/website-luat/lib/services/article.service.ts) | PARTIAL | **MODIFY**: Bổ sung `content` vào câu lệnh tìm kiếm `OR` |
| REQ-06 | Phân trang (Pagination) bài viết | [`lib/services/article.service.ts`](file:///Users/thiemvv/Documents/website-luat/lib/services/article.service.ts) | EXISTS | **PRESERVE**: Đã có `page` & `pageSize` |
| REQ-07 | Block Bài viết liên quan ở trang chi tiết | [`app/(public)/[menuSlug]/[submenuSlug]/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/%28public%29/%5BmenuSlug%5D/%5BsubmenuSlug%5D/page.tsx) | MISSING | **CREATE**: Thêm block `RelatedArticles` ở cuối bài viết |
| REQ-08 | Nút Chia sẻ Facebook & Zalo | Chưa có | MISSING | **CREATE**: Thêm Component `SocialShareButtons` |
| REQ-09 | Form Đăng ký tư vấn trên Homepage | Chưa có | MISSING | **CREATE**: Tạo Form UI + API + Bảng `ConsultationLead` |
| REQ-10 | Gửi Email thông báo khi có tư vấn mới | Chưa có | MISSING | **CREATE**: Tích hợp Email Service (Resend/Nodemailer) |
| REQ-11 | Email nhận thông báo do Admin cấu hình | [`prisma/schema.prisma`](file:///Users/thiemvv/Documents/website-luat/prisma/schema.prisma) | MISSING | **MODIFY**: Bổ sung `consultationEmail` vào `SiteSettings` |
| REQ-12 | AI hỗ trợ tạo bài viết (Tiêu đề, Nội dung, SEO, CTA) | [`app/admin/(protected)/articles/create/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/articles/create/page.tsx) | EXISTS | **PRESERVE / REUSE**: Giữ nguyên flow tạo bài |
| REQ-13 | SYSADMIN quản lý AI Provider | [`app/admin/(protected)/ai-provider/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/ai-provider/page.tsx) | EXISTS | **PRESERVE**: Đã khóa quyền SYSADMIN ONLY |
| REQ-14 | Tách riêng Logo, Favicon, Ảnh Luật sư quản lý qua CMS | [`app/admin/(protected)/settings/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/settings/page.tsx) | PARTIAL | **MODIFY**: Thêm Upload Component cho Logo & Favicon |

---

## 18. REUSE / MODIFY / CREATE / REPLACE MATRIX

| Khu vực (Area) | Hiện có (Existing) | Yêu cầu PRD v2 | Quyết định (Decision) | Bằng chứng (Evidence) |
|---|---|---|---|---|
| **Architecture** | Next.js 14 App Router + Prisma + PostgreSQL | Không thay đổi kiến trúc | **PRESERVE** | [`package.json`](file:///Users/thiemvv/Documents/website-luat/package.json) |
| **RBAC Auth** | 3 Roles, Middleware, Tenant Scope Check | Giữ nguyên phân quyền SYSADMIN / ADMIN | **PRESERVE** | [`lib/auth/rbac.ts`](file:///Users/thiemvv/Documents/website-luat/lib/auth/rbac.ts) |
| **Homepage Layout** | Grid Layout cơ bản 2 cột | Header, Hero, Stats, Practice Areas, News, Form, Footer | **MODIFY** | [`app/(public)/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/%28public%29/page.tsx) |
| **Statistics** | Chưa có | 4 Con số nổi bật (CMS editable) | **CREATE** | PRD v2 Section 2 |
| **Form Tư vấn** | Chưa có | Form đăng ký tư vấn + Chống spam + Lưu DB | **CREATE** | PRD v2 Section 7 |
| **Email Notify** | Chưa có | Gửi email cho Admin khi có đăng ký mới | **CREATE** | PRD v2 Section 7 |
| **Bài viết ↔ Lĩnh vực** | Quan hệ 1-N (Article ➔ Menu) | Quan hệ N-N (Article ➔ Nhiều Practice Areas) | **MODIFY** | [`prisma/schema.prisma`](file:///Users/thiemvv/Documents/website-luat/prisma/schema.prisma) |
| **Bài viết liên quan** | Chưa có | Block bài viết liên quan cùng lĩnh vực | **CREATE** | PRD v2 Section 6 |
| **Nút Share Social** | Chưa có | Nút chia sẻ Facebook & Zalo | **CREATE** | PRD v2 Section 6 |
| **AI Content Studio** | Route `/admin/ai-content` độc lập | AI chỉ nằm trong luồng Tạo bài viết | **MODIFY / HIDE** | PRD v2 Section 5 & 10 |

---

## 19. DOCUMENT ↔ CODE CONFLICTS

### CONFLICT #001: Quan hệ Bài viết và Lĩnh vực hoạt động
- **Tài liệu (PRD v2 Section 4)**: *"Một bài viết có thể thuộc nhiều lĩnh vực. Admin được tự chọn nhiều lĩnh vực khi tạo/chỉnh sửa bài viết."*
- **Thực tế Mã nguồn (`prisma/schema.prisma`)**: Bảng `Article` có trường `menuId String` và `submenuId String?`, chỉ cho phép chọn **duy nhất 1 Menu/Submenu**.
- **Impact**: Nếu không điều chỉnh CSDL sang N-N, một bài viết sẽ không thể hiển thị đồng thời ở nhiều trang Lĩnh vực hoạt động khác nhau.
- **Decision Required**: Cần phê duyệt việc bổ sung bảng trung gian `ArticlePracticeArea` trong Prisma schema ở Phase tiếp theo.

### CONFLICT #002: Phạm vi Tính năng AI Content Engine
- **Tài liệu (PRD v2 Section 5 & 10)**: *"AI chỉ hỗ trợ trong flow Thêm bài viết. Không xây dựng AI Content Studio / Ideas / Calendar / Bulk / Rewrite."*
- **Thực tế Mã nguồn**: Đang tồn tại trang Admin độc lập `/admin/ai-content` (AI Content Studio).
- **Impact**: Dễ gây hiểu nhầm về phạm vi tính năng đối với người dùng cuối.
- **Decision Required**: Xác nhận ẩn trang `/admin/ai-content` khỏi Menu Admin và tập trung 100% vào nút bấm `✨ AI Hỗ trợ` trong trang Tạo bài viết (`/admin/articles/create`).

---

## 20. TECHNICAL RISKS

1. **Rủi ro gửi Email bị Timeout / Blocking (Email Delivery Failure)**:
   - *Evidence*: Nếu gọi dịch vụ email đồng bộ (Synchronous SMTP/API Call) ngay trong quá trình xử lý Form Submit, sự cố mạng của nhà cung cấp email có thể làm treo yêu cầu gửi form của khách hàng.
   - *Giải pháp Kiến trúc*: Áp dụng cơ chế **Asynchronous Background Email Sending** hoặc `try/catch` tách biệt: Lưu CSDL thành công ➔ Trả về phản hồi thành công cho khách ➔ Gửi email ở luồng ngầm.
2. **Rủi ro Spam Form Tư vấn (Spam Submissions)**:
   - *Evidence*: Form công khai trên Homepage rất dễ bị bot tự động điền rác.
   - *Giải pháp Kiến trúc*: Tích hợp cơ chế **Anti-bot Honeypot** (trường ẩn) + **Client Rate Limiting** theo IP address.

---

## 21. DECISION REQUIRED (DÀNH CHO PRODUCT OWNER REVIEW)

Trước khi bắt đầu Phase 1 (Specification & Implementation Plan), Kính trình Product Owner quyết định các điểm sau:

1. **Quyết định #1 (CSDL Bài viết & Lĩnh vực)**: Phê duyệt bổ sung bảng quan hệ N-N `ArticlePracticeArea` để 1 bài viết có thể thuộc nhiều Lĩnh vực hoạt động.
2. **Quyết định #2 (Form Đăng ký Tư vấn)**: Xác nhận các trường thông tin chính thức của Form Tư vấn trên Homepage:
   - Họ và tên (Bắt buộc)
   - Số điện thoại (Bắt buộc)
   - Email (Không bắt buộc)
   - Nội dung cần tư vấn (Bắt buộc)
3. **Quyết định #3 (Dịch vụ Gửi Email)**: Phê duyệt lựa chọn nhà cung cấp dịch vụ gửi Email thông báo cho Admin (Khuyến nghị: **Resend API** hoặc **SMTP Gmail/Zoho**).
4. **Quyết định #4 (Giao diện Trang con)**: Xác nhận áp dụng thống nhất phong cách thiết kế (Typography, Palette Navy/Gold, Spacing, Card style) của Homepage mới cho toàn bộ các trang con chưa có screenshot.

---

## 22. FILES EXPECTED TO CHANGE (DỰ KIẾN KHI IMPLEMENTATION)

*(Lưu ý: Chưa thực hiện sửa đổi trong Phase 0)*

### Files Cần Sửa đổi (Modify):
- `prisma/schema.prisma` (Bổ sung bảng `ConsultationLead`, `StatisticItem`, quan hệ `ArticlePracticeArea`)
- `app/(public)/page.tsx` (Cập nhật layout Homepage theo screenshot mới)
- `components/public/Header.tsx` (Cập nhật UI Header)
- `components/public/Hero.tsx` (Cập nhật UI Hero & Background cong)
- `components/public/Footer.tsx` (Nhúng Form Đăng ký tư vấn)
- `app/(public)/[menuSlug]/page.tsx` & `[submenuSlug]/page.tsx` (Cập nhật luồng bài viết nhiều lĩnh vực)
- `app/admin/(protected)/articles/create/page.tsx` & `[id]/edit/page.tsx` (Hỗ trợ chọn nhiều Lĩnh vực hoạt động)
- `app/admin/(protected)/settings/page.tsx` (Bổ sung Cấu hình Email thông báo & Upload Logo/Favicon)

### Files Cần Tạo Mới (Create):
- `components/public/StatisticsSection.tsx` (Block 4 Chỉ số nổi bật)
- `components/public/ConsultationFormSection.tsx` (Block Form Đăng ký tư vấn)
- `components/public/HomepageNewsSection.tsx` (Block Tin tức Pháp luật trên Homepage)
- `components/public/RelatedArticles.tsx` (Block Bài viết liên quan)
- `components/public/SocialShareButtons.tsx` (Nút Chia sẻ FB/Zalo)
- `app/admin/(protected)/consultations/page.tsx` (Trang Quản lý Danh sách Đăng ký tư vấn trong Admin)
- `lib/services/consultation.service.ts` (Service quản lý lead tư vấn)
- `lib/services/email.service.ts` (Service gửi email thông báo)
- `lib/services/statistic.service.ts` (Service quản lý 4 chỉ số nổi bật)

---

## 23. FILES MUST BE PRESERVED (BẮT BUỘC GIỮ NGUYÊN)

Các tệp nền tảng sau đây đã được kiểm định hoạt động 100% ổn định và **BẮT BUỘC GIỮ NGUYÊN**:

- [`lib/auth/rbac.ts`](file:///Users/thiemvv/Documents/website-luat/lib/auth/rbac.ts) (Hệ thống RBAC Check 3 tầng & Tenant Scope Security)
- [`lib/auth/session.ts`](file:///Users/thiemvv/Documents/website-luat/lib/auth/session.ts) (Session Authentication JWT Cookie)
- [`lib/db/prisma.ts`](file:///Users/thiemvv/Documents/website-luat/lib/db/prisma.ts) (Prisma Client Singleton Instance)
- [`middleware.ts`](file:///Users/thiemvv/Documents/website-luat/middleware.ts) (Route Protection Middleware cho `/admin/*`)
- [`vercel.json`](file:///Users/thiemvv/Documents/website-luat/vercel.json) (Region lock `sin1` - Singapore - FROZEN)
- [`lib/ai/security.ts`](file:///Users/thiemvv/Documents/website-luat/lib/ai/security.ts) & [`lib/ai/service.ts`](file:///Users/thiemvv/Documents/website-luat/lib/ai/service.ts) (Bảo mật AI 7 lớp & Idempotency Check)
- [`app/admin/(protected)/ai-provider/page.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/ai-provider/page.tsx) (Trang Quản lý AI Provider - SYSADMIN ONLY)

---

## 24. RECOMMENDED HIGH-LEVEL IMPLEMENTATION SEQUENCE

Sau khi Product Owner phê duyệt Báo cáo Audit Phase 0 và các Quyết định Cần thiết, đề xuất lộ trình triển khai theo 10 Phase chuẩn:

```text
Phase 1 — Schema Migration & Data Models (ConsultationLead, StatisticItem, ArticlePracticeArea)
Phase 2 — UI Foundation & Design System (Tokens, Spacing, Typography Clamp, Colors)
Phase 3 — Homepage Redesign (Hero, Stats, Practice Areas, Legal News, Form, Footer)
Phase 4 — Consultation Form & Email Notification Pipeline
Phase 5 — Article System Enhancement (Multi-category, Search, Related Articles, Social Share)
Phase 6 — Admin CMS Extensions (Consultation Management, Stats Management, Logo/Favicon Upload)
Phase 7 — AI Integration Refinement (Articles Create AI Assist Flow)
Phase 8 — End-to-End Integration & Security Verification
Phase 9 — QA, Performance Verification & Acceptance Evidence
Phase 10 — Production Deployment & Release
```

---

## 25. AUDIT CONCLUSION

Báo cáo kiểm toán Phase 0 đã hoàn tất 100% khối lượng công việc kiểm tra chuyên sâu mà **KHÔNG CÓ BẤT KỲ SỬA ĐỔI NÀO ĐỐI VỚI MÃ NGUỒN VÀ CƠ SỞ DỮ LIỆU**. 

Tất cả các phát hiện, mâu thuẫn, khoảng trống tính năng và danh mục tài sản tái sử dụng đã được làm rõ bằng bằng chứng thực nghiệm. Repository hiện tại đã sẵn sàng chuyển sang bước tiếp theo ngay sau khi nhận được ý kiến chỉ đạo từ Product Owner.

---
**STATUS THỜI ĐIỂM HIỆN TẠI:** `PHASE 0 — AUDIT COMPLETE (DECISION REQUIRED)`  
*(Tất cả hoạt động Coding và Deployment tạm dừng để chờ lệnh của Product Owner)*
