# PHASE 2 — SUBMENU RUNTIME PERFORMANCE TRACE REPORT

**Dự án:** Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi + AI Content Engine  
**Trạng thái Audit:** **ROOT-CAUSE AUDIT COMPLETED — READ-ONLY / NO FIX APPLIED**  
**Thời gian thực hiện:** 2026-08-25  
**Trạng thái Khóa Mã nguồn & Deployment:** **NO OPTIMIZATION / NO CODE CHANGE / NO COMMIT / NO PUSH / NO DEPLOY**  

---

## 1. EXECUTIVE SUMMARY

Vòng Audit P0 Submenu Runtime Performance Trace này được thực hiện theo chỉ đạo độc lập của Product Owner nhằm điều tra hiện tượng trễ khi người dùng click vào các Submenu trên Header (ví dụ `/thu-vien-phap-luat` hoặc `/thu-vien-phap-luat/dat-dai`).

### Kết luận quan trọng:
1. **Thời gian đo đạc thực tế (Empirical Latency)**:
   - `/thu-vien-phap-luat` HTTP TTFB: P50 = **2,108 ms** (Max: 2,794 ms).
   - `/thu-vien-phap-luat/dat-dai` HTTP TTFB: P50 = **1,984 ms** (Max: 2,024 ms).
2. **Nguyên nhân cốt lõi (Root Cause)**: **THÁC NƯỚC TRUY VẤN NỐI TIẾP TRÙNG LẶP (SEQUENTIAL MULTI-ROUND-TRIP WATERFALLS)**.
3. **So sánh với Article Detail Trace**: **SAME ROOT CAUSE** (Cùng nguyên nhân cấu trúc với trang Bài viết chi tiết đã được lập hồ sơ tại `docs/audit/PHASE_2_PERFORMANCE_ROOT_CAUSE_AUDIT.md`).
4. **Phân rã Browser Client vs Server TTFB**: Độ trễ ~2.0s - 2.8s xảy ra **100% tại Server TTFB** do chờ phản hồi từ 6-9 vòng mạng CSDL nối tiếp từ Việt Nam tới Supabase Cloud DB Singapore.

---

## 2. BASELINE NETWORK RTT & ENVIRONMENT

- **Môi trường Test**: Máy Local (Việt Nam) ➔ CSDL Supabase Cloud (`aws-0-ap-southeast-1.pooler.supabase.com:6543`).
- **Độ trễ RTT cơ sở (SELECT 1)**: P50 = **316 ms** (Min: 314 ms, Max: 321 ms).

---

## 3. SUBMENU DATABASE QUERY TRACE & WATERFALL ANALYSIS

### Route A: Menu Listing (`/thu-vien-phap-luat`)

| Bước | Tên truy vấn (Query Name) | Thời gian DB (ms) | Nối tiếp / Song song | Trùng lặp? (Duplicate) |
|---|---|---|---|---|
| **Step 1** | `Q1: generateMetadata -> site.findUnique` | 330 ms | Nối tiếp | Không |
| **Step 2** | `Q2: generateMetadata -> menu.findMany` (with submenus) | 444 ms | Nối tiếp | Không |
| **Step 3** | `Q3: PublicMenuListingPage -> site.findUnique` | 319 ms | Nối tiếp | **TRÙNG LẶP Q1** |
| **Step 4** | `Q4-Q5: Page -> Promise.all([menu.findMany, channels])` | 766 ms | Song song | **TRÙNG LẶP Q2** |
| **Step 5** | `Q6-Q7: Page -> getPublicArticles (findMany + count)` | 909 ms | Song song | Không |
| **Step 6** | `Q8-Q9: Header -> site.findUnique & menu.findMany` | 772 ms | Nối tiếp | **LẶP LẦN 3** |
| **TỔNG** | **Tổng 9 thao tác SQL qua 6 nấc Waterfall** | **3,540 ms DB Time** | **Sequential Waterfall** | **5/9 Lặp dư thừa** |

### Route B: Submenu Listing (`/thu-vien-phap-luat/dat-dai`)

| Bước | Tên truy vấn (Query Name) | Thời gian DB (ms) | Nối tiếp / Song song | Trùng lặp? (Duplicate) |
|---|---|---|---|---|
| **Step 1** | `Q1: Page -> site.findUnique` | 316 ms | Nối tiếp | Không |
| **Step 2** | `Q2-Q3: Page -> Promise.all([menu.findMany, channels])` | 814 ms | Song song | Không |
| **Step 3** | `Q4-Q5: Page -> getPublicArticles (findMany + count)` | 894 ms | Song song | Không |
| **Step 4** | `Q6-Q7: Header -> site.findUnique & menu.findMany` | 764 ms | Nối tiếp | **TRÙNG LẶP Q1 & Q2** |
| **TỔNG** | **Tổng 7 thao tác SQL qua 4 nấc Waterfall** | **2,788 ms DB Time** | **Sequential Waterfall** | **2/7 Lặp dư thừa** |

---

## 4. COMPARISON WITH ARTICLE DETAIL TRACE

- **Kết luận**: **SAME ROOT CAUSE** (CÙNG NGUYÊN NHÂN CỐT LÕI).
- Cả hai trang Bài viết chi tiết và Trang danh mục Submenu đều chịu tác động từ việc thực thi nhiều nấc truy vấn CSDL trùng lặp giữa `generateMetadata`, Page Component và `<Header />` qua đường truyền RTT ~316ms.

---

## 5. RECOMMENDED OPTIMIZATION PLAN (DỰ KIẾN KHI PO PHÊ DUYỆT)

*(Lưu ý: Không tự ý thực thi, chỉ đề xuất phương án cho PO xem xét)*

1. Sử dụng `React.cache()` hoặc gộp dữ liệu gõ vào cho `site.findUnique` và `menu.findMany` để tránh việc gọi lại DB 3 lần cho cùng một trang.
2. Đưa các lệnh `getPublicArticles` và `getEnabledContactChannels` vào một khối `Promise.all` song song ở cấp cao nhất, giảm từ 6 nấc waterfall xuống **2 nấc CSDL duy nhất**.

---

## 6. ABSOLUTE STOP CONDITION COMPLIANCE

Audit và Trace đã hoàn thành theo đúng nguyên tắc READ-ONLY. Antigravity không thực hiện bất kỳ thay đổi mã nguồn hay tối ưu hóa nào và dừng lại chuyển giao kết quả tới Product Owner.
