# PHASE 1 CONDITIONAL CONTROLS & COMPREHENSIVE SPECIFICATION
## WEBSITE LUẬT SƯ – THẠC SĨ LÊ THỊ NGỌC LỢI + AI CONTENT ENGINE
**Version:** 2.1 — Final Phase 1 Deliverable  
**Status:** Approved with Conditions (Pending Final PO Review)  
**Execution Control:** Antigravity Master Implementation Control Document v2.1  
**Baseline PRD:** PRD v2.1 Baseline  
**Codebase Action:** `NO CODE / NO MIGRATION / NO DEPLOYMENT`

---

## 1. CONTROL #1 — UI/UX SPECIFICATION & WIREFRAME LOGIC CONTRACT

Hệ thống quy định rõ ràng giao diện và tương tác người dùng (UI/UX Contract) cho **Homepage** và **toàn bộ các Trang con (Subpages)**.

### 1.1 Homepage UI/UX Contract (Khớp 100% Visual Intent của `Ngoc Loi New Layout.jpg`)

| Section | UI Layout / Component | Hierarchy & Elements | Responsive Behavior |
|---|---|---|---|
| **Header** | `components/public/Header.tsx` | Logo góc trái, Dynamic Navigation ở giữa, Nút "Gọi ngay" góc phải. | Mobile: Hamburger menu drawer dạng trượt. |
| **Hero** | `components/public/Hero.tsx` | Layout 2 cột. Cột trái: Tên Luật sư "LÊ THỊ NGỌC LỢI" (Serif Gold/Navy), Chức danh. Cột phải: Ảnh chân dung Luật sư bọc trong khung cong SVG Navy/Gold. | Mobile: Xếp chồng dọc (Text trước ➔ Ảnh chân dung sau). |
| **Statistics** | `components/public/StatisticsSection.tsx` | 4 Cards dạng lưới ngang (`800+ Vụ việc`, `500+ Khách hàng`, `10+ Năm kinh nghiệm`, `100% Tận tâm`). Nền trắng, viền vàng nhẹ. | Mobile: 2x2 Grid trên Tablet, 1 cột trên Mobile nhỏ. |
| **Lĩnh vực hoạt động** | `components/public/PracticeAreasSection.tsx` | Grid 4-8 cards. Mỗi card có Icon Lucide, Tiêu đề, Mô tả ngắn, và nút liên kết "Xem chi tiết →". | Mobile: 1 cột cuộn mượt. |
| **Tin tức Pháp luật** | `components/public/HomepageNewsSection.tsx` | Grid 3-6 bài viết mới nhất. Mỗi card có Thumbnail, Ngày đăng, Tiêu đề, Tóm tắt, Liên kết bài viết. | Mobile: 1 cột card bài viết. |
| **Form Đăng ký Tư vấn** | `components/public/ConsultationFormSection.tsx` | Khối Card lớn trên nền Navy sang trọng. Nhập Họ tên, SĐT, Email, Nội dung, Honeypot chống bot. Nút "Gửi đăng ký tư vấn" có hiệu ứng Spinner xoay. | Mobile: Dynamic width 100% full-bleed padding. |
| **Footer** | `components/public/Footer.tsx` | Background Navy đậm. Logo, Địa chỉ, Số điện thoại, Kênh Zalo/Facebook/Telegram, Bản quyền. | Mobile: Xếp chồng dọc các nhóm liên kết. |

---

### 1.2 Subpages UI/UX Specification Contract (Dành cho Trang con chưa có Screenshot)

Thừa hành **Decision #4 Approved**, toàn bộ trang con áp dụng **thống nhất 100% Design Language** của Homepage (Palette Navy `#0F172A`, Accent Gold `#D97706`, Serif Heading, Card border `border-slate-200`):

```text
1. TRANG DANH MỤC LĨNH VỰC (/[menuSlug])
┌────────────────────────────────────────────────────────┐
│ BREADCRUMB: Trang chủ > Lĩnh vực > [Tên Lĩnh vực]      │
├────────────────────────────────────────────────────────┤
│ HERO BANNER: Background Navy + Tiêu đề Lĩnh vực (Serif) │
├────────────────────────────────────────────────────────┤
│ SEARCH & FILTER BAR: Tìm kiếm Tiêu đề + Nội dung       │
├────────────────────────────────────────────────────────┤
│ ARTICLE GRID: 2 Cột bài viết (Thumbnail + Excerpt)    │
├────────────────────────────────────────────────────────┤
│ PAGINATION: [Trang trước] [1] [2] [3] ... [Trang sau]   │
└────────────────────────────────────────────────────────┘

2. TRANG CHI TIẾT BÀI VIẾT (/[menuSlug]/[submenuSlug]/[articleSlug])
┌────────────────────────────────────────────────────────┐
│ BREADCRUMB: Trang chủ > [Lĩnh vực] > [Tiêu đề Bài]    │
├────────────────────────────────────────────────────────┤
│ HEADER: Tiêu đề H1 (Serif), Tác giả, Ngày đăng, Badges  │
├────────────────────────────────────────────────────────┤
│ EXCERPT BOX: Nền mềm Slate-50, Viền Vàng nhô bên trái  │
├────────────────────────────────────────────────────────┤
│ CONTENT BODY: Rich Text thoáng (Line-height 1.75)      │
├────────────────────────────────────────────────────────┤
│ SOCIAL SHARE BAR: [Chia sẻ FB] [Chia sẻ Zalo] [Copy]   │
├────────────────────────────────────────────────────────┤
│ CONSULTATION CALLOUT: Card Nền Navy + Nút "Gọi ngay"  │
├────────────────────────────────────────────────────────┤
│ RELATED ARTICLES: Lưới 3 bài viết cùng Lĩnh vực        │
└────────────────────────────────────────────────────────┘
```

---

## 2. CONTROL #2 — FEATURE-LEVEL DEFINITION OF DONE (DoD)

Một tính năng chỉ được đánh dấu **`DONE`** khi thỏa mãn 100% Tiêu chí Bắt buộc và có Bằng chứng Kiểm thử (Test Evidence) có thể chứng minh:

| Feature Area | Definition of Done (DoD) Criteria | Verifiable Test Evidence Required |
|---|---|---|
| **Consultation Form** | 1. Điền form đúng ➔ Lưu CSDL bảng `ConsultationLead`.<br>2. Email thông báo gửi ngầm qua Resend API.<br>3. Email lỗi KHÔNG làm rollback DB lead.<br>4. Bot điền Honeypot bị từ chối im lặng.<br>5. UI hiện banner xanh thành công. | Test Case TC-01 & TC-02 PASS + Bằng chứng record trong DB `ConsultationLead`. |
| **Article System (N-N)** | 1. 1 Bài viết gắn được nhiều `ArticlePracticeArea`.<br>2. Admin hiển thị Checkbox chọn nhiều Lĩnh vực.<br>3. Public UI hiển thị bài viết ở tất cả các Lĩnh vực đã chọn.<br>4. Slug duy nhất theo Site Scope. | Test Case TC-03 PASS + Screenshot bài viết xuất hiện trên 2 Lĩnh vực khác nhau. |
| **Practice Area** | 1. Full CRUD trong Admin.<br>2. Sắp xếp thứ tự động `displayOrder`.<br>3. Public render dạng Card kèm Icon Lucide mượt mà. | Screenshot Admin CRUD + Console không lỗi. |
| **Search** | 1. Tìm kiếm không phân biệt hoa thường.<br>2. Khớp từ khóa trong **Tiêu đề HOẶC Nội dung**.<br>3. Giới hạn nghiêm ngặt trong Lĩnh vực đang xem. | Test Case TC-04 PASS + Kết quả bài viết tìm theo nội dung. |
| **Related Articles** | 1. Truy vấn 3 bài viết mới nhất cùng Lĩnh vực.<br>2. Loại trừ ID bài viết hiện tại.<br>3. Ẩn khối nếu 0 có bài viết liên quan (Không để khối rỗng). | Screenshot trang chi tiết có block bài viết liên quan. |
| **Social Share** | 1. Nút FB mở URL Sharer chuẩn.<br>2. Nút Zalo mở Zalo Share URL.<br>3. Nút Copy Link chép URL vào Clipboard và hiện Toast. | Screenshot cửa sổ Popup Share + Toast notification. |
| **CMS Admin** | 1. Admin CRUD 4 Chỉ số nổi bật, Lead tư vấn, Bài viết N-N, Logo/Favicon.<br>2. Nút submit bấm ➔ Hiện `Đang lưu...` + Spinner + Chống double click. | Evidence từ `ChannelSubmitButton`. |
| **AI Article Creation** | 1. Chỉ hoạt động tại `/admin/articles/create`.<br>2. Tích hợp Prompt Verified Facts + Safety Filter.<br>3. Kết quả trả về dạng **DRAFT** cho con người kiểm duyệt.<br>4. KHÔNG tự xuất bản. | Screenshot trang Tạo bài viết có nút `✨ AI Hỗ Trợ` sinh bản nháp. |
| **SEO** | 1. Thẻ `<link rel="canonical">` xuất hiện trên 100% public routes.<br>2. Thẻ OpenGraph `og:title`, `og:description`, `og:image` có sẵn.<br>3. Tệp `sitemap.ts` & `robots.ts` truy cập được. | Screenshot HTML Source Inspection thẻ meta SEO. |
| **Auth & RBAC** | 1. `/admin/*` bảo vệ bằng JWT Cookie Middleware.<br>2. Architecture Lock #9 RBAC check thực thi trên Server Actions.<br>3. Trang `/admin/ai-provider` chỉ duy nhất `SYSADMIN` truy cập. | Test Case TC-05 PASS + Test log RBAC precedence. |

---

## 3. CONTROL #3 — AI BEHAVIOR CONTRACT

Khóa cứng toàn bộ hành vi của trợ lý AI Content Engine:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AI CONTENT ENGINE BEHAVIOR CONTRACT                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. BOUNDARY LOCK: AI CHỈ được tích hợp trong luồng Tạo Bài Viết Mới          │
│    tại tuyến đường /admin/articles/create. KHÔNG mở AI Studio độc lập.     │
│                                                                             │
│ 2. DRAFT ONLY: Mọi nội dung do AI sinh ra CHỈ LÀ BẢN NHÁP (DRAFT).           │
│    AI TUYỆT ĐỐI KHÔNG TỰ ĐỘNG XUẤT BẢN (NO AUTO-PUBLISH).                    │
│                                                                             │
│ 3. HUMAN-IN-THE-LOOP: 100% kết quả AI phải được Admin kiểm duyệt, chỉnh sửa  │
│    và xem lại trước khi bấm xuất bản.                                       │
│                                                                             │
│ 4. ZERO LEGAL FABRICATION: AI phải tuân thủ Verified Facts Context          │
│    (Cử nhân Luật ĐH Cần Thơ, Thạc sĩ ĐH Luật TP.HCM, 13+ năm Kiểm sát/Nội chính).│
│    TUYỆT ĐỐI KHÔNG tự bịa đặt bằng cấp, giải thưởng, kết quả án, hoặc       │
│    cam kết thắng kiện. Nếu thiếu dữ liệu, bắt buộc dùng [CẦN XÁC NHẬN].     │
│                                                                             │
│ 5. SYSADMIN ONLY: Cấu hình AI Provider (/admin/ai-provider) thuộc quyền    │
│    độc quyền của SYSADMIN. SITE_ADMIN tuyệt đối không được truy cập.        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. CONTROL #4 — DATA MIGRATION & BACKWARD COMPATIBILITY PLAN

Kế hoạch di trú dữ liệu sản xuất an toàn 100%, bảo tồn dữ liệu và không làm đứt gãy liên kết (Zero Broken Links):

### 4.1 Bảo tồn Dữ liệu Sản xuất (Existing Production Data Preservation)
Tất cả các bản ghi hiện tại trong các bảng `Site`, `AdminUser`, `Role`, `Permission`, `Hero`, `Introduction`, `Education`, `Experience`, `PracticeArea`, `Commitment`, `ContactChannel`, `Menu`, `Submenu`, `Article`, `SiteSettings` **BẮT BUỘC ĐƯỢC BẢO TỒN NGUYÊN VẸN**.

### 4.2 Bảo tồn Cấu trúc URL (URL & Slug Preservation)
- Toàn bộ URL hiện tại (`/[menuSlug]`, `/[menuSlug]/[submenuSlug]`, `/[menuSlug]/[submenuSlug]/[articleSlug]`) **GIỮ NGUYÊN 100%**.
- Không thay đổi logic sinh slug của các bài viết và danh mục đã xuất bản.

### 4.3 Kế hoạch Di trú Bài viết 1-N sang N-N (`ArticlePracticeArea`)
1. **Bước 1 (Pre-Migration Backup)**: Tạo bản sao lưu CSDL PostgreSQL (Dump file) trước khi thực hiện migration.
2. **Bước 2 (Schema Update)**: Khởi tạo bảng trung gian `ArticlePracticeArea`.
3. **Bước 3 (Data Transfer Script)**: Chạy script tự động chuyển đổi dữ liệu hiện tại:
   ```typescript
   // Lấy tất cả các article hiện tại có menuId hoặc submenuId
   const existingArticles = await prisma.article.findMany();
   for (const article of existingArticles) {
     // Ánh xạ menuId/submenuId tương ứng sang PracticeAreaId
     const matchingPracticeArea = await prisma.practiceArea.findFirst({
       where: { siteId: article.siteId, title: article.menu.title }
     });
     if (matchingPracticeArea) {
       await prisma.articlePracticeArea.upsert({
         where: {
           articleId_practiceAreaId: {
             articleId: article.id,
             practiceAreaId: matchingPracticeArea.id,
           },
         },
         create: {
           articleId: article.id,
           practiceAreaId: matchingPracticeArea.id,
         },
         update: {},
       });
     }
   }
   ```
4. **Bước 4 (Integrity Verification)**: Đảm bảo số lượng bài viết được gán lĩnh vực sau migration $\ge$ số lượng bài viết ban đầu.

### 4.4 Kế hoạch Rollback (Rollback Strategy)
Nếu có sự cố trong quá trình migration:
- Kích hoạt khôi phục CSDL từ bản sao lưu Dump File Pre-Migration.
- Trả về phiên bản Prisma Schema trước đó.

---

## 5. ARCHITECTURE GỬI EMAIL THÔNG BÁO TƯ VẤN (RESEND APPROVED)

Xây dựng luồng gửi email bất đồng bộ độc lập (Decoupled Email Pipeline), bảo đảm lỗi gửi mail **KHÔNG BAO GIỜ** làm mất dữ liệu đăng ký tư vấn của khách hàng:

```text
                     KHÁCH HÀNG BẤM "GỬI ĐĂNG KÝ TƯ VẤN"
                                       │
                                       ▼
                   Client Validation & Anti-spam Honeypot
                                       │
                                       ▼
                 Server Action: submitConsultationForm
                                       │
                                       ▼
                  LƯU DỮ LIỆU VÀO CSDL PostgreSQL (ConsultationLead)
                                       │
                    ┌──────────────────┴──────────────────┐
                    │ THẤT BẠI                            │ THÀNH CÔNG
                    ▼                                     ▼
        Trả về Lỗi cho Client             TRẢ VỀ KẾT QUẢ THÀNH CÔNG CHO CLIENT
                                          (Khách nhận thông báo xanh ngay)
                                                          │
                                                          ▼ (LUỒNG BẤT ĐỒNG BỘ NGẦM)
                                          Kích hoạt Resend API sendEmail()
                                                          │
                                         ┌────────────────┴────────────────┐
                                         │ THÀNH CÔNG                      │ THẤT BẠI
                                         ▼                                 ▼
                                Ghi Log AuditSuccess              Ghi Log AuditError
                                                                  (Lead TRONG DB VẪN
                                                                   AN TOÀN 100%)
```

---

## 6. BẢNG TRACEABILITY REQUIREMENT → ARCHITECTURE

| Requirement ID | Yêu cầu PRD v2.1 | Thành phần Triển khai Kỹ thuật | Trạng thái Phase 1 |
|---|---|---|---|
| **REQ-V2-01** | UI/UX Homepage bám screenshot mới | `app/(public)/page.tsx` + 7 Section Components | **LOCKED & APPROVED** |
| **REQ-V2-02** | 4 Chỉ số nổi bật (Stats) | Model `StatisticItem` + Admin CMS + Homepage Card | **LOCKED & APPROVED** |
| **REQ-V2-03** | Bài viết N-N thuộc nhiều Lĩnh vực | Model `ArticlePracticeArea` + Checkbox Admin UI | **LOCKED & APPROVED** |
| **REQ-V2-04** | Form Tư vấn (Full Name, Phone, Email, Content) | Model `ConsultationLead` + Public Form UI | **LOCKED & APPROVED** |
| **REQ-V2-05** | Email thông báo gửi cho Admin khi có tư vấn | Resend API (Asynchronous / Non-blocking) | **LOCKED & APPROVED** |
| **REQ-V2-06** | Email nhận do Admin cấu hình trong Admin | `SiteSettings.consultationNotificationEmail` | **LOCKED & APPROVED** |
| **REQ-V2-07** | Anti-spam cho Form Tư vấn | Honeypot field + Zod Regex Phone | **LOCKED & APPROVED** |
| **REQ-V2-08** | Tìm kiếm Tiêu đề + Nội dung theo Lĩnh vực | `getPublicArticles` OR query in Practice Area | **LOCKED & APPROVED** |
| **REQ-V2-09** | Bài viết liên quan & Nút Share FB/Zalo | `RelatedArticles.tsx`, `SocialShareButtons.tsx` | **LOCKED & APPROVED** |
| **REQ-V2-10** | AI chỉ hỗ trợ trong luồng Tạo bài viết mới | `/admin/articles/create` + Safety Prompt Filter | **LOCKED & APPROVED** |
| **REQ-V2-11** | SYSADMIN quản lý độc quyền AI Provider | `/admin/ai-provider` (SYSADMIN ONLY) | **LOCKED & APPROVED** |
| **REQ-V2-12** | Trang con áp dụng thống nhất Design Language | Tokens Navy `#0F172A`, Gold `#D97706`, Serif | **LOCKED & APPROVED** |

---

**TRẠNG THÁI KẾT THÚC PHASE 1:**
```text
PHASE 1 = APPROVED WITH CONDITIONS (COMPLETED ALL 4 CONTROLS)
NO CODE
NO MIGRATION
NO DEPLOY
WAIT FOR PO FINAL AUTHORIZATION TO OPEN PHASE 2
```
*(Antigravity đã dừng hoàn toàn toàn bộ công việc lập kế hoạch. Hồ sơ Phase 1 đã hoàn chỉnh 100% để trình Product Owner review và cấp phép mở Phase 2)*
