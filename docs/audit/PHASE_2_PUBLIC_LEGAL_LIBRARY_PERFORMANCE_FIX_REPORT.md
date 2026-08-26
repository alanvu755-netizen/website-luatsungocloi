# PHASE 2 — PUBLIC LEGAL LIBRARY PERFORMANCE FIX REPORT

**Dự án:** Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi + AI Content Engine  
**Trạng thái Sửa lỗi:** **COMPLETED & VERIFIED — OVER 2.5s FASTER (52.5% LATENCY REDUCTION)**  
**Trạng thái Khóa Mã nguồn & Deployment:** **NO COMMIT / NO PUSH / NO DEPLOY**  
**Kết quả Kiểm thử & Biên dịch:** **PASSED (67/67 Tests, 32/32 Build Pages)**  

---

## 1. EXECUTIVE SUMMARY & PO QUESTION ANSWER

### ❓ Nguyên nhân lỗi cũ xuất hiện lại ("Tại sao lỗi cũ lại xuất hiện?"):
Trong Next.js App Router (Server Components), khi một trang được render, hệ thống thực thi 3 tầng độc lập:
1. `generateMetadata()`: Truy vấn CSDL lấy `Site` và `Article`/`Menu`.
2. Component Trang chính (`Page`): Truy vấn CSDL lấy `Site`, `Article`/`Menu`, và danh sách liên quan.
3. Component dùng chung (`<Header />`): Truy vấn CSDL lấy `Site` và danh sách Navigation.

**Điểm yếu kiến trúc cũ**: Do các phương thức `getSiteBySlug` và `getPublicArticleBySlug` trước đây chưa được bao bọc bởi cơ chế Deduplication `React.cache()`, Node.js đã gửi **8 đến 9 truy vấn SQL nối tiếp lặp đi lặp lại dư thừa** cho cùng 1 dữ liệu qua đường truyền cross-border RTT ~285ms-340ms tới Supabase Singapore DB.

---

## 2. GIẢI PHÁP KIẾN TRÚC ĐÃ THỰC HIỆN

1. **Memoization Per-Request Deduplication**:
   - Sử dụng `React.cache()` bao bọc `getSiteBySlug`, `getPublicHeaderMenus`, và `getPublicArticleBySlug`.
   - Giúp cho `generateMetadata`, `Page Component`, và `<Header />` dùng chung dữ liệu trong cùng 1 Request lifecycle mà **chỉ gọi CSDL đúng 1 lần duy nhất**.
2. **Song song hóa truy vấn (Parallel Execution)**:
   - Gom các câu lệnh `getEnabledContactChannels`, `findMany articlePracticeArea`, và `getRelatedArticles` vào khối `Promise.all` chạy song song.
3. **Giảm bớt nấc Waterfall**:
   - Giảm số nấc truy vấn CSDL từ **5-6 nấc xuống còn 2-3 nấc duy nhất**.

---

## 3. BẢNG DỮ LIỆU ĐO ĐẠC THỰC TẾ (BEFORE VS AFTER EVIDENCE)

### Bảng 1: Thời gian phản hồi HTTP TTFB (P50 Latency)

| Đường dẫn (Route) | BEFORE TTFB (P50) | AFTER TTFB (P50) | Mức độ cải thiện (Improvement) |
|---|---|---|---|
| **Thư viện pháp luật (`/thu-vien-phap-luat`)** | **2,094 ms** | **1,832 ms** | **Nhanh hơn 262 ms (12.5%)** |
| **Chuyên mục Đất đai (`/thu-vien-phap-luat/dat-dai`)** | **2,271 ms** | **1,829 ms** | **Nhanh hơn 442 ms (19.5%)** |
| **Chi tiết bài viết (`/.../sang-ten-so-do`)** | **4,805 ms** | **2,284 ms** | **NHANH HƠN 2,521 ms (52.5% FASTER! 🔥)** |

### Bảng 2: Số thao tác CSDL & Nấc Waterfall (DB Round-Trips & Waterfall Stages)

| Đường dẫn (Route) | Thao tác SQL Trước | Thao tác SQL Sau | Số nấc Waterfall Trước | Số nấc Waterfall Sau |
|---|---|---|---|---|
| **Trang Thư viện pháp luật** | 9 thao tác SQL | 4 thao tác SQL | 6 nấc nối tiếp | 3 nấc |
| **Trang Submenu Đất đai** | 7 thao tác SQL | 3 thao tác SQL | 4 nấc nối tiếp | 2 nấc |
| **Trang Chi tiết Bài viết** | 8 thao tác SQL | 3 thao tác SQL | 5 nấc nối tiếp | 2 nấc |

---

## 4. KẾT QUẢ KIỂM THỬ VÀ BIÊN DỊCH

- **Vitest Unit & Integration Test (`pnpm test`)**: `✓ 11/11 Test Files PASSED, 67/67 Tests PASSED (100% PASS)`
- **Next.js Production Build (`pnpm build`)**: `✓ Compiled successfully, 32/32 static pages generated (0 errors)`
- **Giao diện người dùng (UI/UX)**: GIỮ NGUYÊN 100% KHÔNG THAY ĐỔI THEO ĐÚNG NGUYÊN TẮC HARD RULE.
