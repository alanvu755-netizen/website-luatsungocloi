# AI CONTENT ENGINE SPECIFICATION
## WEBSITE GIỚI THIỆU LUẬT SƯ – THẠC SĨ LÊ THỊ NGỌC LỢI

**Version:** 1.0  
**Status:** Approved for implementation  
**Feature Type:** Optional Paid Add-on  
**Add-on Code:** `AI_CONTENT_ENGINE`

## 1. Purpose

AI Content Engine là module AI tùy chọn, tích hợp Gemini để hỗ trợ Admin tạo, viết lại, tối ưu và phát triển nội dung marketing cho website. Mục tiêu là tăng tốc độ sản xuất nội dung, hỗ trợ SEO, tăng khả năng thu hút khách hàng tiềm năng và tạo CTA hướng tới liên hệ tư vấn.

AI Content Engine **không phải AI Legal Advisor**; Phase 1 chỉ phục vụ marketing/professional content.

## 2. Product Positioning

Core Product: Professional Legal Profile Website.

Optional paid add-on: AI Content Engine.

Kiến trúc phải cho phép tái sử dụng module này cho các website khách hàng khác; mỗi site có Brand Voice, Knowledge, Verified Facts, quota, usage và entitlement riêng.

## 3. Supported Content

AI hỗ trợ: Giới thiệu, profile chuyên môn, học vấn, kinh nghiệm nghề nghiệp, lĩnh vực hoạt động, commitment, blog/article, FAQ, SEO title, meta description, keywords, CTA, social post và content outline.

Actions: Generate, Rewrite, Expand, Shorten, Improve clarity, Improve professionalism, Generate SEO, Generate CTA.

## 4. AI Content Studio

Site Admin chỉ thấy và dùng AI Content Studio khi add-on `AI_CONTENT_ENGINE` ở trạng thái `ACTIVE` và user có permission phù hợp.

Các thao tác chính: Generate, Rewrite, Expand, Shorten, Improve, SEO, CTA.

AI result không ghi đè dữ liệu hiện tại ngay lập tức.

## 5. Generation Flow

```text
Admin → AI Content Studio → Validation → Permission → Add-on → Quota/Rate Limit → Build Context → Gemini → Output Validation → DRAFT → Human Review → Edit → Preview → Publish
```

AI tuyệt đối không tự Publish.

## 6. Verified Facts

Site Admin có khu vực `AI → Verified Information`. Chỉ thông tin được xác nhận/approved mới được AI coi là Approved Facts. Nếu thiếu dữ liệu, dùng `[CẦN XÁC NHẬN]` hoặc yêu cầu Admin bổ sung; không suy diễn thành sự thật.

## 7. Brand Voice

Site Admin cấu hình tone, audience, writing style, formality, preferred terminology và CTA style. Global safety policy luôn có priority cao hơn Brand Voice.

## 8. Knowledge Context

```text
SYSTEM POLICY
↓
GLOBAL AI POLICY
↓
SITE BRAND VOICE
↓
SITE VERIFIED FACTS
↓
SITE KNOWLEDGE
↓
PUBLISHED CMS CONTENT
↓
CURRENT TASK
```

## 9. Legal Content Safety

AI không được tự tạo/khẳng định nếu không có dữ liệu xác nhận: bằng cấp, chức danh, thành tích, đơn vị công tác, số năm kinh nghiệm, kết quả vụ việc, khách hàng, giải thưởng, án/vụ án cụ thể, cam kết thắng kiện hoặc kết quả pháp lý chắc chắn.

Không dùng các tuyên bố như “chắc chắn thắng”, “cam kết thắng kiện”, “đảm bảo kết quả”.

## 10. Marketing Content Only

Phase 1 không dùng module này để tư vấn pháp lý tự động, xử lý hồ sơ vụ án, phân tích confidential case files, xử lý bí mật khách hàng, dữ liệu cá nhân nhạy cảm hoặc tự động đưa ra legal advice.

## 11. Structured Output

AI output phải có schema rõ ràng, ví dụ:

```json
{
  "title": "",
  "excerpt": "",
  "content": "",
  "seoTitle": "",
  "metaDescription": "",
  "keywords": [],
  "cta": "",
  "suggestedCategory": "",
  "riskFlags": []
}
```

## 12. AI Article Generator

Có thể tạo SEO Title, H1, Introduction, Body, FAQ, Conclusion, CTA, Meta Description và Keywords. Article mới luôn có `status = DRAFT`.

## 13. AI Assist Inside CMS

Các CMS field phù hợp có nút `✨ AI hỗ trợ viết` với các action: Viết mới, Viết lại, Chuyên nghiệp hơn, Dễ hiểu hơn, Ngắn gọn hơn, Mở rộng, Tạo CTA, Tạo SEO.

## 14. Usage / Quota

Theo dõi request count, input tokens, output tokens, model, estimated cost, generation time, site và user. Quota có thể theo monthly generations, monthly tokens, per-request token limit và requests per minute.

## 15. Add-on Plans

Architecture sẵn sàng cho `AI Content Basic`, `AI Content Pro`, `AI Content Premium`. Pricing/billing thực tế không thuộc Phase 1; Phase 1 chỉ cần entitlement, quota, usage và estimated cost.

## 16. Definition of Done

- AI Content Studio hoạt động.
- Generate/Rewrite/Expand/Shorten hoạt động.
- SEO/CTA generation hoạt động.
- Verified Facts và Brand Voice hoạt động.
- AI chỉ tạo Draft.
- Không auto-publish.
- Add-on entitlement, usage và quota được enforce.
- AI Safety Policy được enforce.
- Site isolation hoạt động.
