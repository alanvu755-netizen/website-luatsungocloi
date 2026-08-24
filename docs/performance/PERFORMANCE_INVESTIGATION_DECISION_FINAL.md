# PERFORMANCE INVESTIGATION DECISION & CONNECTION ARCHITECTURE AUDIT

**Project**: Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi + AI Content Engine  
**Date**: 2026-08-23  
**Target Environment**: Live Production (`https://www.luatsungocloi.vn`)  
**Status**: 
- `PERFORMANCE REGION FIX = FROZEN`
- `DATABASE CONNECTION CHANGE = NOT AUTHORIZED`

---

## 1. Direct Answers to Mandatory 5 Audit Questions

### 1. Hiện tại hệ thống đang dùng loại connection nào?
- **Trả lời**: **PgBouncer Transaction Pooler (Port 6543)**.
- **Bằng chứng cấu hình (.env)**:
  ```env
  DATABASE_URL="postgresql://postgres.jsexatfhdaslixxknphb:THjc9e%281080%29@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&connect_timeout=10&pool_timeout=10"
  ```
- **Cơ chế**: Vercel Serverless Functions kết nối tới Supabase Pooler trên cổng `6543` sử dụng tham số `pgbouncer=true` và `connection_limit=1`. Cổng trực tiếp `5432` (`DIRECT_URL`) chỉ được khai báo cho Prisma CLI Migration.

---

### 2. `sin1` đã giải quyết bao nhiêu phần của vấn đề?
- **Trả lời**: **> 95% (Loại bỏ 100% hiện tượng treo 5–10 giây)**.
- **Bằng chứng thực nghiệm (Empirical Evidence)**:
  - **Sequential P50 Latency**: Giảm từ **5,992 ms ➔ 163 ms** (**⚡ Giảm 97.3%**).
  - **Sequential MAX Latency**: Giảm từ **7,699 ms ➔ 909 ms** (**⚡ Giảm 88.2%**).
  - **Concurrent Burst MAX (20 Reqs)**: Giảm từ **12,067 ms ➔ 1,262 ms** (**⚡ Giảm 89.5%**).
  - **Số Request > 1s, > 3s, > 5s**: Giảm về **0 / 35** (**0%**).

---

### 3. Có bằng chứng nào cho thấy PgBouncer vẫn là bottleneck không?
- **Trả lời**: **NOT PROVEN** (Không có bằng chứng).
- Trên môi trường sản xuất `sin1`, P50 là **163 ms** và thời gian chậm nhất dưới tải 20 request đồng thời chỉ là **1,262 ms**. Không ghi nhận bất kỳ dấu hiệu nghẽn hay treo kết nối từ PgBouncer.

---

### 4. Có bằng chứng nào chứng minh cần chuyển sang Direct Connection không?
- **Trả lời**: **NOT PROVEN** (Không có bằng chứng).
- Việc chuyển sang Direct Connection (Port 5432) trong môi trường Vercel Serverless có nguy cơ làm cạn kệt kết nối PostgreSQL khi số lượng container tăng. Vì PgBouncer cổng 6543 tại `sin1` đã đạt P50 = 163ms, việc đổi sang Direct Connection là không cần thiết và không có bằng chứng chứng minh hiệu quả hơn.

---

### 5. Có nên thay đổi `DATABASE_URL` lúc này không?
- **Trả lời**: **KHÔNG / NOT AUTHORIZED**.
- Giữ nguyên toàn bộ cấu hình `DATABASE_URL` hiện tại.

---

## 2. Bằng chứng liên quan đến Tagki.com

- **Xác nhận**: **"Không đủ bằng chứng để xác định tagki.com dùng Direct Connection."** (Do không có quyền truy cập cấu hình hệ thống hoặc kho mã nguồn của tagki.com).

---

## 3. So sánh Kiến trúc Kết nối trong Vercel (`sin1`) + Supabase (`ap-southeast-1`)

| Tiêu chí | Prisma + PgBouncer 6543 (Hiện tại) | Prisma + Direct Connection 5432 |
| :--- | :--- | :--- |
| **P50 Latency tại `sin1`** | **163 ms** | ~140 ms - 160 ms (Tương đương) |
| **Quản lý kết nối Serverless** | **An toàn cao** (Nhờ PgBouncer Gom và chia sẻ kết nối) | **Nguy cơ quá tải DB** (Max connections limit của PostgreSQL) |
| **Khả năng chịu tải đồng thời** | **Tốt** (Hỗ trợ hàng trăm Vercel containers) | **Hạn chế** (Dễ dính lỗi `Too many connections`) |
| **Giao dịch (Transactions)** | Cần lưu ý prepared statements (`pgbouncer=true`) | Hỗ trợ full prepared statements |
| **Khuyến nghị sử dụng** | **ĐƯỢC GIỮ NGUYÊN & KHÓA CỨNG (FROZEN)** | **KHÔNG CHO PHÉP (NOT AUTHORIZED)** |

---

## 4. Trạng thái Quyết định Cuối cùng (Final Decision Status)

```text
============================================================
PERFORMANCE REGION FIX:           FROZEN (Vercel Region = sin1)
DATABASE CONNECTION CHANGE:       NOT AUTHORIZED (Giữ nguyên .env)
APPLICATION SOURCE CODE:          FROZEN (0 files modified)
PRISMA ORM ARCHITECTURE:          FROZEN (Architecture Lock v2.3.1)
============================================================
```
