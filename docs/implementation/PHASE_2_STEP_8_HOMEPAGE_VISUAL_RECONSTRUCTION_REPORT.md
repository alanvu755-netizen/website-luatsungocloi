# PHASE 2 — STEP 8 HOMEPAGE VISUAL RECONSTRUCTION REPORT

**Dự án:** Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi + AI Content Engine  
**PRD Baseline:** PRD v2.1 Baseline & Customer Reference Screenshot  
**Nhiệm vụ:** Tái cấu trúc toàn bộ giao diện Trang chủ (Homepage Visual Reconstruction) theo đúng Screenshot tham chiếu của khách hàng  
**Trạng thái Khóa Git & Deployment:** **NO COMMIT / NO PUSH / NO DEPLOY** *(Mã nguồn 100% tại Local Working Tree)*  
**Trạng thái Kiểm thử & Biên dịch:** **PASSED (67/67 Tests, 32/32 Build Pages)**  

---

## 1. CUSTOMER SCREENSHOT BASELINE

- **Hình ảnh tham chiếu chính thức**: `media_1787665012570.jpg` (Ảnh chụp toàn bộ giao diện Trang chủ phê duyệt bởi Khách hàng).
- **Yêu cầu cốt lõi**: Khôi phục 100% tỷ lệ, bố cục khối, màu sắc, vị trí chân dung và thứ tự hiển thị của từng phần trên Trang chủ mà không làm ảnh hưởng tới các chức năng PRD đã được nghiệm thu (ConsultationLead, Bài viết, N-N Practice Areas, SEO, AI Content Engine).

---

## 2. RECONSTRUCTED HOMEPAGE SECTIONS SUMMARY

1. **Top Bar (`components/public/Header.tsx`)**:
   - Nền màu tối (`#030f1e`).
   - Cột trái: `luatsungocloi.vn` | `luatsungocloi@gmail.com`.
   - Cột phải: `Phường Cao Lãnh, Đồng Tháp` | Icon liên kết Facebook, Zalo, TikTok.

2. **Main Header (`components/public/Header.tsx`)**:
   - Logo bên trái: Cán Cân Công Lý viền Gold + Danh xưng `LUẬT SƯ – THẠC SĨ`, Họ tên `LÊ THỊ NGỌC LỢI`, Slogan `VỮNG PHÁP LÝ – TRỌN NIỀM TIN`.
   - Menu trung tâm: `TRANG CHỦ` (gạch chân gold active), `GIỚI THIỆU`, `LĨNH VỰC HOẠT ĐỘNG`, `DỊCH VỤ`, `TIN TỨC`, `LIÊN HỆ`.
   - Khối Hotline góc phải: Khung viền vàng nổi bật `0902 081 061` kèm dòng chữ `Tư vấn pháp lý 24/7`.

3. **Hero Section (`components/public/Hero.tsx`)**:
   - **Nền toàn khối Xanh Navy đậm (`#051C38`)**.
   - Cột TRÁI: Ảnh chân dung Luật sư Lê Thị Ngọc Lợi đứng trong trang phục vest đen khoanh tay.
   - Cột PHẢI:
     - Tiêu đề chính: `ĐỒNG HÀNH PHÁP LÝ` (chữ vàng) / `BẢO VỆ QUYỀN & LỢI ÍCH HỢP PHÁP` (chữ trắng).
     - Mô tả: `Luật sư Lê Thị Ngọc Lợi và cộng sự cam kết mang đến giải pháp pháp lý hiệu quả – tận tâm – bảo mật – chuyên nghiệp.`
     - Grid 4 Badge cam kết: `Tận tâm`, `Chuyên nghiệp`, `Hiệu quả`, `Bảo mật`.
     - 2 Nút bấm: Nút vàng `TƯ VẤN NGAY ->` và Nút viền trắng `XEM LĨNH VỰC HOẠT ĐỘNG`.

4. **Lĩnh Vực Hoạt Động (`components/public/PracticeAreasSection.tsx`)**:
   - Tiêu đề `LĨNH VỰC HOẠT ĐỘNG` kèm icon Cán cân công lý gold.
   - Grid 6 thẻ card màu trắng bo góc có icon tượng hình & liên kết `Xem chi tiết ->`:
     1. Đất đai – Nhà ở
     2. Hôn nhân – Gia đình
     3. Dân sự – Hợp đồng
     4. Tranh tụng tại Tòa
     5. Doanh nghiệp
     6. Hình sự – Hành chính

5. **Statistics Counter Bar (`components/public/StatisticsSection.tsx`)**:
   - Thanh đếm số liệu nền Navy toàn phần chứa 4 con số: `500+ Khách hàng tin tưởng`, `800+ Vụ việc đã giải quyết`, `10+ Năm kinh nghiệm`, `100% Tận tâm vì khách hàng`.

6. **Giới Thiệu Luật Sư Section Độc Lập (`components/public/IntroductionSection.tsx`)**:
   - Cột TRÁI: Ảnh Luật sư ngồi tại bàn làm việc có máy tính & biển tên gỗ `LUẬT SƯ – THẠC SĨ LÊ THỊ NGỌC LỢI`.
   - Cột PHẢI: Tiêu đề `VỀ LUẬT SƯ LÊ THỊ NGỌC LỢI`, đoạn văn bản tiểu sử, 4 dòng tích chọn `✓` và nút bấm `XEM THÊM VỀ CHÚNG TÔI`.

7. **Tin Tức Pháp Luật (`components/public/LatestArticlesSection.tsx`)**:
   - Tiêu đề `TIN TỨC PHÁP LUẬT` kèm nút `XEM TẤT CẢ ->` ở góc phải.
   - Lưới 4 thẻ bài viết công khai với ảnh đại diện, tiêu đề và ngày đăng.

8. **Footer & Form Đăng Ký Tư Vấn (`components/public/Footer.tsx`)**:
   - Nền Navy toàn phần (`#030f1e`).
   - Cột 1: Thông tin liên hệ đầy đủ (`Luật sư - Thạc sĩ Lê Thị Ngọc Lợi`, `Phường Cao Lãnh, Đồng Tháp`, `0902 081 061`, `luatsungocloi@gmail.com`, `luatsungocloi.vn`).
   - Cột 2: Danh sách liên kết nhanh Lĩnh vực hoạt động.
   - Cột 3: Form Đăng ký tư vấn nhanh (`Họ và tên`, `Số điện thoại`, Nút vàng `GỬI YÊU CẦU`).
   - Thanh bản quyền chân trang: `© 2024 luatsungocloi.vn - All rights reserved.` | `VỮNG PHÁP LÝ – TRỌN NIỀM TIN`.

---

## 3. AUTOMATED VERIFICATION RESULTS

- **Vitest Unit & Integration Tests (`pnpm test`)**:  
  `✓ 11/11 Test Files PASSED, 67/67 Tests PASSED (100% PASS)`
- **Next.js Production Build (`pnpm build`)**:  
  `✓ Compiled successfully, 32/32 static pages generated (0 errors)`

---

## 4. FILES CHANGED

1. `components/public/Header.tsx`
2. `components/public/Hero.tsx`
3. `components/public/PracticeAreasSection.tsx`
4. `components/public/StatisticsSection.tsx`
5. `components/public/IntroductionSection.tsx`
6. `components/public/LatestArticlesSection.tsx`
7. `components/public/Footer.tsx`
8. `app/(public)/page.tsx`
9. `docs/implementation/PHASE_2_STEP_8_HOMEPAGE_VISUAL_RECONSTRUCTION_REPORT.md`
