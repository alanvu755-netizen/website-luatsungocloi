# PHASE 2 — PRE-IMPLEMENTATION BASELINE REPORT
## PROJECT: WEBSITE LUẬT SƯ – THẠC SĨ LÊ THỊ NGỌC LỢI + AI CONTENT ENGINE
**Version:** 2.1 — Phase 2 Execution Baseline  
**Execution Control:** Antigravity Master Implementation Control Document PRD v2.1  
**Baseline PRD:** PRD v2.1 Baseline  
**Visual Source of Truth:** `Ngoc Loi New Layout.jpg`  
**Authorization:** Product Owner Authorized Phase 2 Execution  
**Current Code Action:** `NO CODE WRITTEN IN BASELINE STEP (READ-ONLY INSPECTION COMPLETE)`

---

## 1. EXECUTIVE SUMMARY

Thực thi chỉ thị tại **Mục 27 & Mục 3** của *Antigravity Phase 2 Execution Control Prompt*, Antigravity đã hoàn thành kiểm tra thực địa toàn bộ hệ thống repository hiện tại đối chiếu với **Bộ 10 Tài liệu Chuẩn (Authoritative Documents)** và **Screenshot Visual Intent `Ngoc Loi New Layout.jpg`**.

Báo cáo Baseline này ghi nhận trạng thái hiện tại (Current State), mục tiêu đạt được (Target State), danh mục tệp thay đổi, danh mục tệp bảo tồn, phân tích rủi ro di trú dữ liệu, và lộ trình thực thi 10 Bước nghiêm ngặt.

---

## 2. CURRENT STATE vs TARGET STATE MATRIX

| Thành phần System | Trạng thái Hiện tại (Current State) | Mục tiêu Phase 2 (Target State) | Mức độ Thay đổi |
|---|---|---|---|
| **Database Schema** | Bảng `Article` quan hệ 1-N với `Menu`/`Submenu`. Thiếu `ArticlePracticeArea` (N-N), `ConsultationLead`, `StatisticItem`. Thiếu `consultationNotificationEmail` trong `SiteSettings`. | Thêm `ArticlePracticeArea` (N-N), `ConsultationLead`, `StatisticItem`, `SiteSettings.consultationNotificationEmail`. | **MODIFIED (Schema Migration)** |
| **Design System** | Tailwind Tokens cơ bản Navy `#0F172A` & Gold `#D97706`. Nút bấm Admin đã có `ChannelSubmitButton`. | Chuẩn hóa Design Tokens, Reusable Components (`StatCard`, `ArticleCard`, `SectionHeading`, `SubmitButtonWithSpinner`). Khóa Design System các trang con theo Navy/Gold. | **MODIFIED** |
| **Backend Services** | Service `article.service.ts` lọc 1-N theo `menuId`/`submenuId`. `contact-channel`, `hero`, `introduction`, `education`, `experience`, `practice-area`, `commitment`, `site`, `menu`. | Thêm `statistic.service.ts`, `consultation.service.ts`, `email.service.ts` (Resend API ngầm). Cập nhật `article.service.ts` tìm kiếm Tiêu đề + Nội dung & quan hệ N-N. | **EXTENDED / MODIFIED** |
| **CMS / Admin** | Admin Routes: Hero, Intro, Education, Experience, Practice Areas, Commitment, Contact, Menus, Articles, Media, SEO, Settings, AI Provider. | Thêm `/admin/statistics` (CRUD 4 Stats), `/admin/consultations` (Lead Viewer). Cập nhật `/admin/articles/create` & `edit` chọn Checkbox nhiều Lĩnh vực. Upload Logo/Favicon & Email nhận thông báo tư vấn trong Settings. Ẩn `/admin/ai-content`. | **EXTENDED / MODIFIED** |
| **Homepage Layout** | `app/(public)/page.tsx` render 6 section cơ bản. Thiếu 4 Stats Cards, News Grid bài viết, và Form Tư vấn. | Render đủ 7 Section bám 100% `Ngoc Loi New Layout.jpg`: 1. Header, 2. Hero (2 cột + background cong), 3. Stats (4 con số), 4. Practice Grid, 5. Legal News, 6. Consultation Form, 7. Footer. | **MODIFIED (Layout Redesign)** |
| **Consultation Flow** | Chưa có Form Tư vấn & Chưa có Email Notification. | Form Tư vấn trên Homepage (Full Name, Phone, Email, Content, Honeypot). Server Action validate ➔ Lưu DB `ConsultationLead` ➔ Trả SUCCESS ngay ➔ Gửi mail ngầm qua Resend API không làm đơ UI hay rollback DB. | **NEW FEATURE** |
| **Article System** | Lọc bài viết 1-N. Tìm kiếm title/excerpt. Chưa có Related Articles. Chưa có Social Share. | Bài viết N-N thuộc nhiều Lĩnh vực, Search Tiêu đề + Nội dung phạm vi Lĩnh vực đang xem, Phân trang 10 bài/trang, Block `RelatedArticles` 3 bài cùng Lĩnh vực, Nút Share FB/Zalo/Copy Link. | **EXTENDED / MODIFIED** |
| **AI Content Engine** | Có trang `/admin/ai-content` Studio & nút AI tại `/admin/articles/create`. | Giới hạn 100% AI CHỈ nằm trong luồng `/admin/articles/create`. Nội dung sinh ra dạng DRAFT. Prompt chứa Verified Facts. Không auto-publish. `/admin/ai-provider` chỉ duy nhất `SYSADMIN` truy cập. | **RESTRICTED / LOCKED** |
| **SEO & Security** | Canonical, OpenGraph cơ bản, Middleware JWT Auth, RBAC 3 tầng Lock #9, Vercel Region `sin1` Lock. | Giữ nguyên 100% RBAC & Region Lock `sin1`. Bổ sung Canonical & OpenGraph Meta động cho 100% bài viết. | **PRESERVED & EXTENDED** |

---

## 3. FILE CHANGE FORECAST MATRIX

### 3.1 Files Expected to Change (Danh mục Tệp Cần Sửa / Tạo mới):
- `prisma/schema.prisma` (Thêm model `ArticlePracticeArea`, `ConsultationLead`, `StatisticItem`, sửa `SiteSettings`)
- `prisma/seed.ts` (Nạp 4 chỉ số nổi bật mặc định)
- `tailwind.config.ts` (Bổ sung Design Tokens Navy/Gold)
- `app/(public)/page.tsx` (Tái thiết kế Homepage 7 Section)
- `components/public/Header.tsx` (Cập nhật UI Header)
- `components/public/Hero.tsx` (Cập nhật Hero 2 cột & background cong)
- `components/public/Footer.tsx` (Cập nhật Footer)
- `components/public/PracticeAreasSection.tsx` (Cập nhật Lĩnh vực kèm link)
- `app/(public)/[menuSlug]/page.tsx` (Cập nhật trang Lĩnh vực N-N, Search Title+Content, Pagination)
- `app/(public)/[menuSlug]/[submenuSlug]/[articleSlug]/page.tsx` (Cập nhật Related Articles & Social Share Buttons)
- `app/admin/(protected)/articles/create/page.tsx` & `[id]/edit/page.tsx` (Cập nhật chọn nhiều Lĩnh vực hoạt động)
- `app/admin/(protected)/settings/page.tsx` (Cập nhật Upload Logo/Favicon & Email nhận thông báo)
- `lib/services/article.service.ts` (Cập nhật truy vấn N-N & Search Title+Content)
- **[NEW]** `components/public/StatisticsSection.tsx` (Block 4 Chỉ số nổi bật)
- **[NEW]** `components/public/ConsultationFormSection.tsx` (Block Form Đăng ký tư vấn)
- **[NEW]** `components/public/HomepageNewsSection.tsx` (Block Tin tức Pháp luật)
- **[NEW]** `components/public/RelatedArticles.tsx` (Block Bài viết liên quan)
- **[NEW]** `components/public/SocialShareButtons.tsx` (Nút Chia sẻ FB/Zalo/Copy Link)
- **[NEW]** `app/admin/(protected)/statistics/page.tsx` (Trang Admin Quản lý 4 Stats)
- **[NEW]** `app/admin/(protected)/consultations/page.tsx` (Trang Admin Xem Lead Tư vấn)
- **[NEW]** `lib/services/statistic.service.ts` (Service quản lý 4 stats)
- **[NEW]** `lib/services/consultation.service.ts` (Service quản lý consultation leads)
- **[NEW]** `lib/services/email.service.ts` (Service gửi email thông báo qua Resend API)
- **[NEW]** `lib/actions/consultation.action.ts` (Server Action xử lý Form Tư vấn)

### 3.2 Files Expected to Remain Untouched (Danh mục Tệp Bắt buộc Giữ nguyên):
- `lib/auth/rbac.ts` (Architecture Lock #9 - CheckPermission 3 Tầng)
- `lib/auth/session.ts` (JWT Cookie Session Auth)
- `lib/db/prisma.ts` (Prisma Client Singleton Instance)
- `middleware.ts` (Route Protection cho `/admin/*`)
- `vercel.json` (Vercel Function Region Lock `sin1` - Singapore)
- `lib/ai/security.ts` & `lib/ai/service.ts` (Security AI 7 lớp & Idempotency Check)
- `app/admin/(protected)/ai-provider/page.tsx` (Trang Quản lý AI Provider - SYSADMIN ONLY)

---

## 4. MIGRATION RISKS & BACKWARD COMPATIBILITY ANALYSIS

### 4.1 Bảo tồn Dữ liệu & Slug URL (Zero Broken Links)
- Tất cả các bài viết hiện tại (`Article`), Menu, Submenu, User, Settings... **ĐƯỢC BẢO TỒN NGUYÊN VẸN 100%**.
- Các URL hiện tại (`/[menuSlug]`, `/[menuSlug]/[submenuSlug]`, `/[menuSlug]/[submenuSlug]/[articleSlug]`) giữ nguyên 100% không bị đứt gãy.

### 4.2 Kế hoạch Migration Dữ liệu Bài viết 1-N ➔ N-N (`ArticlePracticeArea`)
- Migration script tự động đọc `menuId` / `submenuId` của bài viết hiện tại và chèn các bản ghi tương ứng vào bảng `ArticlePracticeArea` trong quá trình migration.
- Trước khi chạy migration trên sản xuất, bắt buộc thực hiện sao lưu CSDL (Dump SQL Backup).

---

## 5. RECONNAISSANCE VERIFICATION & DECISION STATUS

- **Authoritative Documents Check**: Đã kiểm tra và đối chiếu 100% thông số giữa PRD v2.1, Technical Spec v2.1, Design Spec, AI Security Spec, Master Implementation Control, và Screenshot `Ngoc Loi New Layout.jpg`.
- **Decision Required Status**: **KHÔNG CÓ BẤT KỲ DECISION REQUIRED NÀO CÒN TỒN ĐẠI**. Tất cả 4 quyết định trọng yếu đã được Product Owner phê duyệt chính thức.

---

**TRẠNG THÁI HIỆN TẠI**: `PHASE 2 — BASELINE COMPLETE & READY FOR STEP 1`  
*(Antigravity báo cáo Product Owner hoàn thành Pre-implementation Baseline và đã sẵn sàng bắt đầu STEP 1: Architecture & Database Migration)*
