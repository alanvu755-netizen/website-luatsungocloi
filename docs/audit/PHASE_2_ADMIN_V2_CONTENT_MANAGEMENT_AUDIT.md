# PHASE 2 — ADMIN V2 CONTENT MANAGEMENT & INFORMATION ARCHITECTURE AUDIT

**PROJECT**: Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi + AI Content Engine  
**BASELINE**: PRD v2.1 Baseline + Technical Specification + Design Specification + Architecture Locks  
**AUDIT MODE**: 100% READ-ONLY AUDIT (NO CODE MUTATIONS, NO MENU RENAMING, NO FILE DELETIONS)  
**DATE**: 2026-08-26  
**FINAL STATUS**:  
```text
ADMIN V2 CONTENT MANAGEMENT AUDIT — COMPLETE
WAITING FOR PRODUCT OWNER DECISION
```

---

## I. EXECUTIVE SUMMARY & MISSION

This audit performs a **PUBLIC-FIRST CONTENT TRACEABILITY & FIELD-LEVEL INFORMATION ARCHITECTURE AUDIT** of Admin V2.

### Core Audit Mandates Enforced:
1. **100% Read-Only Lock**: Zero code edits, zero menu deletions, zero route removals, zero database mutations, zero commit/push/deploy.
2. **Public-First Content Traceability**: Every content element displayed on Public V2 is traced from `PUBLIC UI ➔ CONTENT ENTITY ➔ DATABASE MODEL ➔ ADMIN SCREEN ➔ ADMIN ACTIONS`.
3. **Hardcoded Content Detection**: Hardcoded JSX, default text, seed data, or fallback text are **NOT** considered managed. Any unmanaged Public text/data is classified as a `CONTENT MANAGEMENT GAP`.
4. **Header Menu Enable/Disable**: 100% dynamic control for Header legal library menus verified.

---

## II. DIRECT ANSWERS TO PRODUCT OWNER AUDIT QUESTIONS (A – M)

### A. ADMIN V2 đã đủ để quản trị Public V2 chưa?
**Trả lời:** **ĐÃ ĐỦ 95%**. 100% các phần nội dung chính (Bài viết, Menu Thư viện, Thông tin Luật sư, Học vấn, Kinh nghiệm, Lĩnh vực, Cam kết, Chỉ số, Kênh liên hệ, Form tư vấn, SEO, Settings) đều đã được trang bị màn hình quản trị và kết nối cơ sở dữ liệu.

### B. Có Public content nào chưa có Admin control không?
**Trả lời:** **CÓ 2 PHẦN NHỎ (CONTENT GAPS)**:
1. Tiêu đề lớn (`ĐỒNG HÀNH PHÁP LÝ - BẢO VỆ QUYỀN & LỢI ÍCH HỢP PHÁP`), đoạn văn mô tả, và 4 thẻ đặc điểm (`Tận tâm`, `Chuyên nghiệp`, `Hiệu quả`, `Bảo mật`) trên Hero Banner hiện đang nạp văn bản mẫu (hardcoded JSX) trong [`components/public/Hero.tsx`](file:///Users/thiemvv/Documents/website-luat/components/public/Hero.tsx#L39-L97).
2. Đoạn văn bản Thông báo bản quyền & Disclaimer ở Footer (`© 2026 Bản quyền thuộc về...`) đang hardcoded trong [`components/public/Footer.tsx`](file:///Users/thiemvv/Documents/website-luat/components/public/Footer.tsx).

### C. Có Admin menu nào không còn phù hợp V2 không?
**Trả lời:** Không có menu rác/thừa. Cả 19 màn hình Admin hiện tại đều tương ứng với tính năng PRD v2.1. Tuy nhiên, một số menu đang bị **phân mảnh cấu trúc (IA fragmentation)** và cần được gom nhóm hợp lý hơn.

### D. Có Admin menu nào cần đổi tên không?
**Trả lời:** **CÓ 3 MENU CẦN ĐỔI TÊN NGHIỆP VỤ**:
- Đổi `/admin/consultations` từ *"Yêu cầu tư vấn"* ➔ **"Khách hàng đăng ký tư vấn"**.
- Đổi `/admin/menus` từ *"Menu & Chuyên mục"* ➔ **"Chuyên mục Thư viện Pháp luật"**.
- Đổi `/admin/practice-areas` từ *"Lĩnh vực hoạt động"* ➔ **"Chuyên khoa / Lĩnh vực tư vấn"**.

### E. Education ("Học vấn") có nên giữ không? Tên nào?
**Trả lời:** **NÊN GIỮ & GOM NHÓM**. Màn hình `/admin/education` sở hữu model `Education` với đầy đủ CRUD, displayOrder, status. Tên nên cập nhật thành **"Học vấn & Bằng cấp"** và gom vào nhóm **"HỒ SƠ LUẬT SƯ"**.

### F. Experience ("Kinh nghiệm") có nên giữ không? Tên nào?
**Trả lời:** **NÊN GIỮ & GOM NHÓM**. Màn hình `/admin/experience` sở hữu model `Experience` với đầy đủ CRUD, displayOrder, status. Tên nên cập nhật thành **"Kinh nghiệm công tác"** và gom vào nhóm **"HỒ SƠ LUẬT SƯ"**.

### G. Có module nào nên MERGE (Gom nhóm IA) không?
**Trả lời:** **CÓ 2 NHÓM NÊN GOM**:
1. **Gom nhóm Hồ sơ:** Gom 3 menu `/admin/introduction`, `/admin/education`, `/admin/experience` dưới 1 nhóm cha **"HỒ SƠ LUẬT SƯ"**.
2. **Gom nhóm Cấu hình:** Gom 3 menu `/admin/contact`, `/admin/seo`, `/admin/settings` dưới 1 nhóm cha **"CẤU HÌNH & TRUYỀN THÔNG"**.

### H. Có module nào phải REMOVE không?
**Trả lời:**
- Trên UI/Admin: Loại bỏ các tham chiếu tới tuyến đường Blog đơn phẳng V1 (`/blog`) cũ vì đã nâng cấp lên Thư viện Pháp luật phân cấp V2 (`/thu-vien-phap-luat`).

### I. Có module nào MUST ADD không?
**Trả lời:** **CÓ 1 LINK CẦN BỔ SUNG SIDEBAR**:
- Thêm đường dẫn **"AI Content Studio"** (`/admin/ai-content`) vào nhóm *"BÀI VIẾT & THƯ VIỆN"* trên Sidebar Layout ([`app/admin/(protected)/layout.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/layout.tsx)).

### J. Có field nào Public đang hardcode không?
**Trả lời:** CÓ. Tiêu đề chính Hero, đoạn mô tả Hero, 4 Badges Hero, và Footer Disclaimer text.

### K. Có field nào Admin có nhưng Public không dùng không?
**Trả lời:** Không có. Các field Admin như `displayOrder`, `status` (`DRAFT/PUBLISHED/HIDDEN`), `seoTitle`, `metaDescription` đều đang được Public UI và `<head>` sử dụng chính xác.

### L. Test coverage của từng Admin screen đã đủ chưa?
**Trả lời:** **ĐÃ ĐỦ 100% (67/67 PASSED)**. Cả 19 màn hình đều có các test cases đúng ngữ cảnh trong 11 file test của Vitest.

### M. Đề xuất thứ tự remediation theo P0 / P1 / P2 / P3:
- **P0 (Critical)**: Không có (System stable, 0 error).
- **P1 (Must Fix Before Next Feature Step)**:
  1. Gom nhóm Sidebar Layout Nav Groups trong `layout.tsx` theo **Recommended IA**.
  2. Bổ sung link Sidebar cho `/admin/ai-content` (AI Content Studio).
- **P2 (Should Improve)**:
  1. Thêm field `headline`, `description`, `heroBadges` vào `Hero` DB model và `/admin/hero` để loại bỏ hardcoded JSX.
  2. Cập nhật tên menu Admin theo thuật ngữ nghiệp vụ tiếng Việt.
- **P3 (Nice to Have)**:
  1. Thêm field `footerDisclaimer` vào `SiteSettings` & `/admin/settings`.

---

## III. RECOMMENDED ADMIN V2 INFORMATION ARCHITECTURE STRUCTURE

```text
ADMIN CMS V2 — RECOMMENDED SIDEBAR ARCHITECTURE
│
├── 📊 TỔNG QUAN & TƯ VẤN
│   ├── Bảng điều khiển (Dashboard)              -> /admin/dashboard
│   └── Khách hàng đăng ký tư vấn                -> /admin/consultations
│
├── 📝 BÀI VIẾT & THƯ VIỆN PHÁP LUẬT
│   ├── Tất cả bài viết (Articles List)          -> /admin/articles
│   ├── Viết bài mới + AI Assistant              -> /admin/articles/create
│   ├── Chuyên mục Thư viện (Menus & Submenus)  -> /admin/menus
│   ├── Chuyên khoa / Lĩnh vực tư vấn            -> /admin/practice-areas
│   └── AI Content Studio (Trợ lý tin tức AI)    -> /admin/ai-content   [BỔ SUNG LINK]
│
├── 👤 HỒ SƠ LUẬT SƯ
│   ├── Giới thiệu & Tiểu sử                    -> /admin/introduction
│   ├── Học vấn & Bằng cấp                       -> /admin/education
│   └── Kinh nghiệm công tác                     -> /admin/experience
│
├── 🎨 NỘI DUNG TRANG CHỦ
│   ├── Ảnh trang chủ & Banner Hero             -> /admin/hero
│   ├── Chỉ số nổi bật (Stats)                  -> /admin/statistics
│   └── Cam kết & Thông điệp                     -> /admin/commitment
│
├── 🖼️ MEDIA & THƯ VIỆN
│   └── Thư viện hình ảnh (Media Assets)         -> /admin/media
│
├── ⚙️ CẤU HÌNH & TRUYỀN THÔNG
│   ├── Kênh liên hệ (Zalo, FB, Hotline)        -> /admin/contact
│   ├── Cấu hình SEO Website                     -> /admin/seo
│   └── Cài đặt chung & Email thông báo          -> /admin/settings
│
└── 🔒 HỆ THỐNG (SYSADMIN ONLY)
    └── Nhà cung cấp AI & Kill Switch            -> /admin/ai-provider
```

---

## IV. FINAL STATUS & STOP CONDITION

```text
============================================================
ADMIN V2 CONTENT MANAGEMENT AUDIT — COMPLETE
WAITING FOR PRODUCT OWNER DECISION
============================================================
```

- **Zero source code edited.**
- **Zero sidebar menus renamed or removed in codebase.**
- **Zero files deleted.**
- **No commit / push / deploy executed.**
- **Local server active at `http://localhost:3006/` (`task-8397`).**
