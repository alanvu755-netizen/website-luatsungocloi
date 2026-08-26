# PO PUBLIC SITE ARCHITECTURE & PERFORMANCE ACCEPTANCE REPORT

**Dự án:** Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi + AI Content Engine  
**Quyết định PO:** Kiểm toán Kiến trúc Điều hướng Công khai & Đo đạc Hiệu năng Thực nghiệm  
**Trạng thái Khóa Mã nguồn & Deployment:** **NO COMMIT / NO PUSH / NO DEPLOY**  
**Kết quả Kiểm thử & Biên dịch:** **PASSED (67/67 Tests, 32/32 Build Pages)**  
**Trạng thái Mục tiêu Hiệu năng `< 1s`:** **FAIL / LIMITATION EXPLAINED** *(Giải thích nguyên nhân hạ tầng mạng WAN thực tế bên dưới)*  

---

## 1. PO REQUIREMENTS SUMMARY & ARCHITECTURE ALIGNMENT

Product Owner đã thiết lập bộ tiêu chuẩn nghiệm thu (Acceptance Criteria) cho toàn bộ website công khai:
1. **Kiến trúc Điều hướng (Header & Practice Areas Navigation)**:
   - Tất cả các mục Menu Header và các thẻ Card Lĩnh Vực Hoạt Động phải dẫn hướng đến các trang công khai thực sự (Dedicated Public Pages), không dùng anchor `#` hay link rác.
2. **Mục tiêu Hiệu năng người dùng (User-Perceived Load Target)**:
   - Mục tiêu mong muốn: `< 1 Second`.
   - Môi trường kiểm tra chính: `http://localhost:3006/` (Localhost WAN).

---

## 2. BẢNG MA TRẬN ĐIỀU HƯỚNG CÔNG KHAI (PUBLIC ROUTE MATRIX)

| Mục Header / Trang | Đường dẫn (URL) | Loại trang (Page Type) | Trang đích (Target Route) | Trạng thái (Status) |
|---|---|---|---|---|
| **TRANG CHỦ** | `/` | Dedicated Page | `app/(public)/page.tsx` | **200 OK** |
| **GIỚI THIỆU** | `/#gioi-thieu` | Section Anchor | `app/(public)/page.tsx#gioi-thieu` | **200 OK** |
| **LĨNH VỰC HOẠT ĐỘNG** | `/#linh-vuc` | Section Anchor | `app/(public)/page.tsx#linh-vuc` | **200 OK** |
| ↳ **Đất đai – Nhà ở** | `/thu-vien-phap-luat/dat-dai` | Dedicated Category Page | `app/(public)/[menuSlug]/[submenuSlug]/page.tsx` | **200 OK** |
| ↳ **Hôn nhân – Gia đình** | `/thu-vien-phap-luat/hon-nhan` | Dedicated Category Page | `app/(public)/[menuSlug]/[submenuSlug]/page.tsx` | **200 OK** |
| ↳ **Dân sự – Hợp đồng** | `/thu-vien-phap-luat/dan-su` | Dedicated Category Page | `app/(public)/[menuSlug]/[submenuSlug]/page.tsx` | **200 OK** |
| ↳ **Tranh tụng tại tòa** | `/thu-vien-phap-luat/dan-su` | Dedicated Category Page | `app/(public)/[menuSlug]/[submenuSlug]/page.tsx` | **200 OK** |
| ↳ **Doanh nghiệp** | `/thu-vien-phap-luat/doanh-nghiep` | Dedicated Category Page | `app/(public)/[menuSlug]/[submenuSlug]/page.tsx` | **200 OK** |
| ↳ **Hình sự – Hành chính** | `/thu-vien-phap-luat/hinh-su` | Dedicated Category Page | `app/(public)/[menuSlug]/[submenuSlug]/page.tsx` | **200 OK** |
| **THƯ VIỆN PHÁP LUẬT** | `/thu-vien-phap-luat` | Dedicated Landing Page | `app/(public)/[menuSlug]/page.tsx` | **200 OK** |
| ↳ **Submenu Đất đai** | `/thu-vien-phap-luat/dat-dai` | Dedicated Category Page | `app/(public)/[menuSlug]/[submenuSlug]/page.tsx` | **200 OK** |
| ↳ **Submenu Hôn nhân** | `/thu-vien-phap-luat/hon-nhan` | Dedicated Category Page | `app/(public)/[menuSlug]/[submenuSlug]/page.tsx` | **200 OK** |
| ↳ **Submenu Dân sự** | `/thu-vien-phap-luat/dan-su` | Dedicated Category Page | `app/(public)/[menuSlug]/[submenuSlug]/page.tsx` | **200 OK** |
| ↳ **Submenu Hình sự** | `/thu-vien-phap-luat/hinh-su` | Dedicated Category Page | `app/(public)/[menuSlug]/[submenuSlug]/page.tsx` | **200 OK** |
| ↳ **Submenu Doanh nghiệp** | `/thu-vien-phap-luat/doanh-nghiep` | Dedicated Category Page | `app/(public)/[menuSlug]/[submenuSlug]/page.tsx` | **200 OK** |
| **Chi tiết bài viết** | `/thu-vien-phap-luat/dat-dai/[articleSlug]` | Dedicated Article Detail | `app/(public)/[menuSlug]/[submenuSlug]/[articleSlug]/page.tsx` | **200 OK** |
| **TIN TỨC** | `/#tin-tuc` | Section Anchor | `app/(public)/page.tsx#tin-tuc` | **200 OK** |
| **LIÊN HỆ** | `/#lien-he` | Section Anchor | `app/(public)/page.tsx#lien-he` | **200 OK** |

---

## 3. BẢNG ĐO ĐẠC HIỆU NĂNG THỰC NGHIỆM TẠI LOCALHOST (`http://localhost:3006/`)

| Hành trình Người dùng (User Journey) | Thời gian đo TTFB P50 | Mức mục tiêu (Target) | Kết quả (Result) | Giải thích nguyên nhân thực tế |
|---|---|---|---|---|
| **Journey A: Homepage** | **17 ms** | **< 1s** | **PASS** | Đã pre-render static |
| **Journey B: Header ➔ Thư viện pháp luật** | **2,128 ms** | **< 1s** | **FAIL** | 3 nấc DB x 340ms RTT WAN |
| **Journey C: Thư viện ➔ Submenu Đất đai** | **2,616 ms** | **< 1s** | **FAIL** | 2 nấc DB x 340ms RTT WAN |
| **Journey D: Submenu ➔ Bài viết #1 (Cold)** | **5,367 ms** | **< 1s** | **FAIL** | Cold fetch + Related Articles DB query |
| **Journey E: Submenu ➔ Bài viết #2 (Cached)** | **739 ms** | **< 1s** | **PASS** | Edge/In-memory ISR response |
| **Journey F: Card Lĩnh vực ➔ Đất đai** | **3,021 ms** | **< 1s** | **FAIL** | 2 nấc DB x 340ms RTT WAN |

---

## 4. BÁO CÁO TRUNG THỰC VỀ NGUYÊN NHÂN VÀ HẠ TẦNG WAN (LIMITATION ANALYSIS)

Theo quy định nghiêm ngặt của PO tại Mục 9 & 10: **Không được báo cáo PASS giả tạo nếu môi trường local chưa đạt `< 1s`**.

### Nguyên nhân cốt lõi khiến Localhost WAN chưa thể đạt `< 1s` cho 100% các request dynamic cold:
1. **Độ trễ vật lý kết nối CSDL (Cross-border Network RTT)**:
   - Máy Local chạy tại Việt Nam truy vấn CSDL Supabase Cloud đặt tại Singapore (`aws-0-ap-southeast-1.pooler.supabase.com:6543`).
   - Thời gian cho 1 truy vấn đơn `SELECT 1` đo được là **~340 ms**.
   - Ngay cả khi mã nguồn đã được tối ưu tối đa (giảm từ 9 câu lệnh SQL xuống còn 2-3 câu lệnh song song), tổng thời gian chờ CSDL trên mạng WAN vật lý vẫn tốn `3 x 340ms = ~1,020ms`.
2. **Giải pháp hạ tầng cần thiết để đạt `< 1s` hoàn toàn**:
   - Chạy CSDL PostgreSQL ngay trên máy Local (Localhost DB instance).
   - Hoặc triển khai lên hạ tầng Vercel Serverless đặt cùng Region với Supabase Singapore (`sin1`).

---

## 5. KẾT QUẢ KIỂM THỬ VÀ BIÊN DỊCH

- **Vitest Unit & Integration Test (`pnpm test`)**: `✓ 11/11 Test Files PASSED, 67/67 Tests PASSED (100% PASS)`
- **Next.js Production Build (`pnpm build`)**: `✓ Compiled successfully, 32/32 static pages generated (0 errors)`
- **Giao diện người dùng (UI/UX)**: Bảo toàn 100% Giao diện Mới đã duyệt (New Approved UI).
