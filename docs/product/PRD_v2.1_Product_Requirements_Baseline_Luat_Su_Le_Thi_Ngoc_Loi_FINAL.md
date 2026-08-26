# PRD v2.1 — Product Requirements Baseline
## Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi + AI Content Engine

**Version:** 2.1  
**Status:** Product Requirements Baseline  
**Project:** Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi  
**Purpose:** Baseline chính thức cho Design Specification, Technical Specification và Implementation Plan.

---

## 1. Product Direction

Website được xây dựng theo giao diện Homepage mới đã được khách hàng xác nhận qua screenshot.

Homepage gồm toàn bộ các section thể hiện trong screenshot được cung cấp, với phong cách thiết kế thống nhất cho các trang con chưa có screenshot.

Header/Menu phải đúng cấu trúc đã thống nhất nhưng có khả năng bật/tắt từng menu trong Admin.

---

## 2. Homepage

Homepage bao gồm các nhóm nội dung đã được xác nhận:

- Header / Navigation
- Hero / khu vực giới thiệu chính
- Lĩnh vực hoạt động
- Các chỉ số nổi bật: 800+, 500+, 10+, 100%
- Tin tức pháp luật
- Khu vực đăng ký tư vấn
- Footer

Các số liệu nổi bật là **CMS editable**.

Logo, favicon và hình ảnh Luật sư là các asset riêng biệt. Admin có thể thay đổi logo và favicon từ trang quản trị.

---

## 3. Header / Navigation

Menu theo screenshot là baseline UI.

Admin có thể:

- Bật/tắt menu.
- Quản lý thứ tự hiển thị.
- Quản lý nội dung/liên kết của menu theo phạm vi CMS được thiết kế.

Không hard-code business rule khiến Admin không thể quản trị menu.

---

## 4. Lĩnh vực hoạt động

Lĩnh vực hoạt động là nội dung CMS.

Mỗi lĩnh vực có:

- Tên
- Slug
- Mô tả
- Hình ảnh/icon nếu cần theo UI
- Trạng thái hiển thị
- Thứ tự

Trang lĩnh vực phải có layout phù hợp với visual style của Homepage.

### Danh sách bài viết theo lĩnh vực

Mỗi lĩnh vực có danh sách bài viết riêng.

Yêu cầu:

- Có pagination.
- Có tìm kiếm bài viết.
- Search trong **tiêu đề + nội dung**.
- Search chỉ áp dụng cho các bài viết thuộc lĩnh vực đang xem.

### Quan hệ bài viết – lĩnh vực

Một bài viết có thể thuộc **nhiều lĩnh vực**.

Admin được tự chọn nhiều lĩnh vực khi tạo/chỉnh sửa bài viết.

Không duplicate bài viết chỉ vì bài viết thuộc nhiều lĩnh vực.

---

## 5. Tin tức pháp luật

Tin tức pháp luật là **Core Product**, không còn là Phase 2.

Mục tiêu:

- Chuẩn SEO.
- CMS bài viết đầy đủ.
- Quản trị bài viết.
- Phân loại theo nhiều lĩnh vực.
- Tìm kiếm.
- Pagination.
- Bài viết liên quan.
- CTA liên hệ/đăng ký tư vấn.
- Chia sẻ Facebook và Zalo.

### AI hỗ trợ tạo bài viết

AI chỉ hỗ trợ trong flow **Thêm bài viết**.

Không xây dựng AI Content Studio / Ideas / Calendar / Bulk / Rewrite / Edit Article.

Admin chỉ cần nhập các gạch đầu dòng/nội dung chính; AI hỗ trợ tạo:

- Tiêu đề
- Nội dung bài viết
- Tóm tắt
- SEO Title
- SEO Description
- Keywords
- Gợi ý cấu trúc bài
- CTA

AI là công cụ hỗ trợ; Admin vẫn kiểm tra và quyết định nội dung trước khi xuất bản.

---

## 6. Trang chi tiết bài viết

Trang chi tiết phải có:

- Tiêu đề
- Nội dung
- Metadata cần thiết cho SEO
- Lĩnh vực liên quan
- CTA **Liên hệ / Đăng ký tư vấn**
- Nút chia sẻ Facebook
- Nút chia sẻ Zalo
- Khu vực **Bài viết liên quan**

### Bài viết liên quan

Có.

Ưu tiên các bài viết có chung lĩnh vực với bài đang xem.

Không hiển thị chính bài viết hiện tại.

Nếu không có bài phù hợp thì không hiển thị block rỗng.

---

## 7. Đăng ký tư vấn

Homepage có form **ĐĂNG KÝ TƯ VẤN**.

Thông tin khách đăng ký được lưu để Admin xem và quản lý.

Các trường dữ liệu đã được xác nhận trong PRD trước đó và không bổ sung trường thời gian.

### Thông báo

Khi có đăng ký mới:

- Hệ thống gửi thông báo qua **email cho Admin**.
- Email nhận thông báo được **Admin user cấu hình**.

### Chống spam

Form phải có cơ chế chống spam.

Không yêu cầu Admin quản lý trạng thái lead.

---

## 8. CMS / Admin

Admin có quyền quản trị nội dung website.

Admin có thể quản lý:

- Homepage content
- Header/Menu
- Lĩnh vực hoạt động
- Bài viết
- Logo
- Favicon
- Các nội dung CMS khác theo phạm vi sản phẩm

Admin có quyền thay đổi mật khẩu của chính mình.

---

## 9. System Admin

System Admin có toàn bộ quyền của Admin và thêm quyền cấu hình hệ thống.

System Admin có thể:

- Quản lý toàn bộ Admin
- Quản lý quyền hệ thống
- Cấu hình AI Provider
- Quản lý các cấu hình system-level

System Admin có quyền thay đổi mật khẩu của chính mình.

### AI Provider

**Chỉ System Admin** được cấu hình AI Provider.

Admin thông thường **không có quyền** thay đổi AI Provider.

---

## 10. AI Content Engine — Boundary

AI Content Engine vẫn được giữ trong sản phẩm.

Phạm vi AI hiện tại:

**AI hỗ trợ tạo nội dung khi Admin tạo bài viết.**

AI hỗ trợ:

1. Tiêu đề
2. Nội dung bài viết
3. Tóm tắt
4. SEO Title
5. SEO Description
6. Keywords
7. Gợi ý cấu trúc bài
8. CTA

Không triển khai:

- AI Content Studio
- Ideas
- Calendar
- Bulk generation
- Rewrite
- Edit Article

trừ khi có yêu cầu sản phẩm mới được phê duyệt.

---

## 11. Asset Management

Các asset chính cần được tách riêng:

- Logo
- Favicon
- Ảnh Luật sư

Logo và favicon phải có khả năng thay đổi từ Admin.

Ảnh Luật sư cần được quản lý theo cơ chế CMS/asset phù hợp với thiết kế.

---

## 12. Các trang con chưa có screenshot

Khách hàng chưa cung cấp screenshot cho toàn bộ trang con.

Do đó:

- Không tự ý sao chép một UI khác không liên quan.
- Thiết kế layout trang con dựa trên visual language của Homepage mới.
- Bảo đảm typography, spacing, màu sắc, component language và CTA nhất quán.
- Các trang con phải được thiết kế trước khi implementation để khách hàng có thể review.

---

## 13. Product Workflow

Quy trình chuẩn của dự án:

### Phase 1 — UI Reference Analysis

Khách hàng cung cấp screenshot/UI reference.

Phân tích:

- Layout
- Navigation
- Components
- Content
- User flows
- Functional requirements
- Data requirements
- CMS requirements
- Các điểm chưa rõ

### Phase 2 — Clarification

Đặt câu hỏi cho khách hàng.

Không tự suy đoán các business rule quan trọng.

Mọi quyết định ảnh hưởng tới product behavior phải được xác nhận.

### Phase 3 — PRD

Hoàn tất PRD làm Product Requirements Baseline.

PRD là nguồn sự thật cho các tài liệu kỹ thuật và implementation.

### Phase 4 — Design Specification

Thiết kế UI/UX cho Homepage và toàn bộ trang con cần thiết.

### Phase 5 — Technical Specification

Xác định:

- Architecture
- Data model
- API
- Authentication / Authorization
- CMS
- AI integration
- Email notification
- Anti-spam
- SEO
- Performance
- Security

### Phase 6 — Implementation Plan

Chia implementation thành các task nhỏ, có dependency rõ ràng và acceptance criteria.

### Phase 7 — Antigravity Implementation

Antigravity triển khai theo tài liệu đã khóa.

Không tự ý thay đổi Product Requirements.

### Phase 8 — Monitoring & Controlling

Khách hàng + ChatGPT + Antigravity cùng kiểm soát:

- Scope
- UI fidelity
- Functional correctness
- Data correctness
- Security
- Performance
- Acceptance criteria

---

## 14. Antigravity Operating Principles

Khi chuyển PRD cho Antigravity:

1. PRD là baseline, không phải gợi ý.
2. Không tự suy diễn business rule chưa được xác nhận.
3. Nếu phát hiện ambiguity ảnh hưởng implementation, phải dừng và hỏi.
4. Không sửa architecture đã được freeze nếu chưa được phê duyệt.
5. Không refactor ngoài scope.
6. Không deploy khi chưa đạt acceptance criteria.
7. Mọi thay đổi phải có evidence.
8. Mỗi milestone phải báo cáo:
   - Đã làm gì
   - File/component nào thay đổi
   - Acceptance criteria nào đã đạt
   - Test evidence
   - Vấn đề còn lại
   - Quyết định cần khách hàng xác nhận

---

## 15. Performance Gate

Kế thừa nguyên tắc từ dự án hiện tại:

- Performance baseline phải được đo trước khi kết luận.
- Không tối ưu tự phát.
- Không thay đổi database connection, region hoặc architecture chỉ vì cảm giác chậm.
- Khi có lỗi performance intermittent, phải tái hiện và trace đúng execution path trước khi kết luận root cause.
- Không gọi một giả thuyết là root cause nếu chưa có evidence.

---

## 16. Acceptance Philosophy

Một tính năng chỉ được xem là hoàn tất khi:

- Đúng yêu cầu PRD.
- Đúng UI/Design Specification.
- Hoạt động đúng user flow.
- Có test evidence.
- Không phá vỡ chức năng hiện hữu.
- Không có unresolved critical issue.

Trạng thái cuối cùng phải dựa trên bằng chứng nghiệm thu, không dựa trên tuyên bố "đã làm xong".

---

## 17. Out of Scope hiện tại

Không tự động mở rộng scope sang:

- AI Content Studio
- AI Ideas
- AI Calendar
- Bulk generation
- Rewrite
- Edit Article
- Lead status workflow
- Các tính năng chưa được khách hàng xác nhận

Mọi scope mới phải được xác nhận trước khi đưa vào implementation.

---

# PRODUCT REQUIREMENTS BASELINE

Đây là baseline sản phẩm dùng để chuyển sang:

**PRD → Design Specification → Technical Specification → Implementation Plan → Antigravity Implementation → Monitoring & Controlling → Final Acceptance**

Mọi tài liệu tiếp theo phải trace được về baseline này.
