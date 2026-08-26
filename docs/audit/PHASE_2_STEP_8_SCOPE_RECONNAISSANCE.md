# PHASE 2 — STEP 8 SCOPE RECONNAISSANCE & PRODUCT CONTRACT LOCK
## READ-ONLY SPECIFICATION & ARCHITECTURE RECONNAISSANCE REPORT

**Dự án:** Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi + AI Content Engine  
**PRD Version:** PRD v2.1 Baseline  
**Gate Status:** STEP 7 CLOSED / FULL PASS  
**Step 8 Authorization Status:** **`NOT AUTHORIZED FOR IMPLEMENTATION`** *(Specification & Scope Reconnaissance Only)*  
**Trạng thái Khóa Git & Deployment:** **NO COMMIT / NO PUSH / NO DEPLOY / NO CODE / NO DB MIGRATION**  

---

## 1. EXECUTIVE SUMMARY & RECONNAISSANCE OBJECTIVE

Báo cáo này thực hiện khảo sát độc lập 100% Read-Only trên toàn bộ hệ thống để phục vụ việc khóa Hợp đồng Sản phẩm (Product Contract Lock) cho **Step 8 — AI Content Marketing + Article Engagement & Conversion**.

Mục tiêu trọng tâm của Step 8:
1. Nâng cấp luồng tạo bài viết AI hiện có từ "tạo văn bản thô" thành **AI Content Marketing chuyên sâu**: Tận dụng ý chính (bullet points) do Admin nhập để nảy sinh bài viết tư vấn pháp luật hấp dẫn, đúng chuyên môn, xây dựng lòng tin cho Luật sư Lê Thị Ngọc Lợi và định hướng người đọc thực hiện hành động **"ĐĂNG KÝ TƯ VẤN"**.
2. Giữ nguyên quy định **Human-in-the-loop & Safety**: AI không bao giờ tự động xuất bản hay tự động lưu CSDL. Kết quả AI sinh ra luôn ở trạng thái `DRAFT`, cần con người xem xét, duyệt và bấm "Dùng nội dung này" trước khi xuất bản.
3. Tích hợp tính năng theo dõi tương tác **View Count** (Lượt đọc bài viết) và **Share Action Count** (Lượt bấm chia sẻ Facebook, Zalo, Copy Link) không gây nghẽn hiệu năng (Non-blocking analytics).

---

## 2. PO SCOPE CLARIFICATIONS — FINAL (PO DECISIONS LOCK)

Product Owner đã đưa ra các quyết định làm rõ scope cho Step 8 như sau:

| Domain | PO Decision Status | Detailed Business & Architectural Rule |
|---|---|---|
| **1. AI Content Marketing** | **CONFIRMED IN SCOPE** | Admin nhập ý chính ➔ AI tạo nội dung chuẩn Marketing, giải quyết đúng nỗi đau khách hàng, tạo uy tín chuyên môn và dẫn dắt tự nhiên tới khối **"ĐĂNG KÝ TƯ VẤN"**. Kết quả AI luôn ở trạng thái `DRAFT`, con người phải duyệt trước khi xuất bản. |
| **2. Article View Count** | **CONFIRMED IN SCOPE** | Quy tắc: **1 lượt xem hợp lệ = 1 view per article per browser tab session** (Sử dụng `sessionStorage` cho từng tab session). Không tăng view khi Admin preview hoặc khi Bot/Crawler truy cập. Tracking phải là **Non-blocking**, không chặn render HTML trang bài viết. |
| **3. Article Share Count** | **CONFIRMED IN SCOPE** | Thuật ngữ kỹ thuật: **`shareCount` = SHARE ACTION COUNT** (Số lượt bấm hành động chia sẻ Facebook, Zalo, Copy Link). Không tuyên bố đây là lượt chia sẻ thành công trên ứng dụng bên thứ ba. Sử dụng cơ chế client-side debouncing an toàn. |
| **4. Public Visibility** | **CONFIRMED IN SCOPE** | Con số `viewCount` và `shareCount` hiển thị cho Admin. Hiển thị trên công khai nếu Design Specification hỗ trợ vị trí phù hợp. Không xây dựng dashboard analytics riêng ngoài scope. |
| **5. CTA Click Tracking** | ❌ **OUT OF SCOPE** | **LOẠI BỎ KHỎI SCOPE STEP 8**. Không triển khai tracking lượt click CTA hay conversion funnel analytics. Khối CTA phục vụ nội dung chuyển đổi, không phục vụ đo đạc analytics phức tạp. |
| **6. AI Log Retention Policy** | ❌ **OUT OF SCOPE** | **LOẠI BỎ KHỎI SCOPE STEP 8**. Không xây dựng chính sách xóa/lưu trữ nhật ký AI 90 ngày mới. |
| **7. Tracking Endpoint Security** | **TECHNICAL REQUIREMENT** | Tracking API bắt buộc phải có Rate Limit và chống spam abuse. Client tuyệt đối KHÔNG được gửi giá trị increment tùy ý (`increment` luôn do Server cố định = 1). |
| **8. Performance Lock** | **CRITICAL LOCK** | Ghi nhận View/Share tuyệt đối **KHÔNG nằm trên Critical Path**. Việc render HTML trang bài viết không được chờ ghi CSDL đếm số. Giữ vững baseline hiệu năng (Vercel Singapore `sin1`). |

---

## 3. EXISTING ARCHITECTURE & AI FLOW RECONNAISSANCE

Khảo sát thực địa mã nguồn hiện tại xác nhận luồng vận hành AI Article Creation đang hoạt động như sau:

```text
Admin nhập ý chính (bullet points) tại /admin/articles/create
        ↓
Admin bấm "TẠO NỘI DUNG BẰNG AI"
        ↓
Client gửi POST /api/admin/ai/generate (requestId, promptCode: "ARTICLE_GENERATE")
        ↓
Server thực thi lib/ai/service.ts:
  1. Idempotency Check (AIGeneration.findUnique by requestId)
  2. Security Gate Check (validateAIGenerationGate: Role, Quota, RateLimit, KillSwitch)
  3. Status Lifecycle (REQUESTED -> GENERATING -> COMPLETED / BLOCKED / FAILED)
  4. System Instruction Injection (Verified Facts, Brand Tone: Trang trọng, Chuyên nghiệp)
  5. Gọi Gemini Provider (gemini-1.5-flash)
        ↓
Giao diện Admin hiển thị hộp kiểm tra "Kết quả Bản Nháp AI"
        ↓
Admin bấm "Dùng nội dung này" -> Điền nội dung vào Form Editor
        ↓
Admin tùy chỉnh văn bản (nếu cần) -> Bấm "Lưu bản nháp" (DRAFT) hoặc "Xuất bản" (PUBLISHED)
```

---

## 4. FINAL IN-SCOPE VS OUT-OF-SCOPE SUMMARY

### ✅ FINAL IN-SCOPE:
1. Nâng cấp prompt AI Content Marketing (ý chính ➔ bài viết chuyển đổi cao).
2. Lời dẫn nhập tự nhiên hướng tới khối **"ĐĂNG KÝ TƯ VẤN"** hiện có.
3. Theo dõi `viewCount` (1 view / article / browser tab session, non-blocking).
4. Theo dõi `shareCount` (Share Action Count: Facebook, Zalo, Copy Link, client-side debounce).
5. Lọc Admin preview session và Bot/Crawler.
6. Bảo mật API tracking (Rate limit, Server fixed increment = 1).
7. Bộ test tự động Vitest cho AI prompt, View tracking, Share tracking & Non-blocking performance.

### ❌ EXPLICITLY OUT OF SCOPE:
1. CTA Click tracking / Conversion funnel analytics.
2. AI Generation Log retention policy 90 ngày.
3. Dashboard Analytics độc lập.
4. AI Content Studio / AI Ideas / AI Calendar / AI Bulk Generation.
5. CRM / Booking / Newsletter / Automated Publishing.

---

## 5. STEP 8 EXECUTION BOUNDARY & LOCKS

```text
============================================================
STEP 8 BOUNDARY LOCK:
- STEP 7: CLOSED / FULL PASS
- STEP 8: NOT AUTHORIZED FOR IMPLEMENTATION
- CODE CHANGES: NONE
- DATABASE CHANGES: NONE
- MIGRATION: NONE
- GIT: NO COMMIT / NO PUSH
- DEPLOYMENT: NO DEPLOY
============================================================
Awaiting Product Owner final Execution Control Prompt.
Only an explicit PO STEP 8 EXECUTION CONTROL PROMPT can authorize code implementation.
============================================================
```
