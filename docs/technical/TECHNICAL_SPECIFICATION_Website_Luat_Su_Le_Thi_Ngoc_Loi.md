# TECHNICAL SPECIFICATION
## WEBSITE GIỚI THIỆU LUẬT SƯ – THẠC SĨ LÊ THỊ NGỌC LỢI

**Version:** 1.0  
**Status:** Ready for implementation  
**Related PRD:** `PRD_Website_Luat_Su_Le_Thi_Ngoc_Loi.md`  
**Primary language:** TypeScript  
**Architecture:** Full-stack Next.js application + PostgreSQL + Prisma + Admin CMS

---

# 1. PURPOSE

Tài liệu này chuyển các yêu cầu trong PRD thành các quyết định kỹ thuật có thể triển khai trực tiếp.

Technical Specification là nguồn tham chiếu cho:

- Kiến trúc hệ thống.
- Technology stack.
- Database schema.
- CMS architecture.
- Public website architecture.
- Authentication.
- Media management.
- Content publishing.
- Contact channels.
- SEO.
- Security.
- Performance.
- Testing.
- Deployment.

## Nguyên tắc

**PRD quyết định sản phẩm cần gì.**

**Technical Specification quyết định hệ thống được xây như thế nào.**

Nếu có xung đột:

1. Yêu cầu khách hàng đã xác nhận.
2. PRD.
3. Technical Specification.
4. Implementation detail của developer.

Không tự ý thay đổi visual concept của screenshot chỉ vì lý do kỹ thuật nếu không cần thiết.

---

# 2. TECH STACK

## 2.1. Required stack

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Framework | Next.js |
| Runtime | Node.js LTS |
| Frontend | React |
| Styling | Tailwind CSS |
| Admin UI | shadcn/ui |
| Database | PostgreSQL |
| ORM | Prisma |
| Validation | Zod |
| Authentication | Production-ready session authentication |
| Media | S3-compatible object storage / Cloudinary |
| Package manager | pnpm |
| Version control | Git |

## 2.2. TypeScript

Bắt buộc sử dụng TypeScript.

Không tạo business logic mới bằng JavaScript nếu có thể sử dụng TypeScript.

Bật strict mode.

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

Không sử dụng `any` trừ trường hợp thực sự cần thiết và phải có lý do.

---

# 3. NEXT.JS ARCHITECTURE

Sử dụng:

- Next.js App Router.
- Server Components mặc định.
- Client Components chỉ khi cần interactivity/browser APIs.

## Không sử dụng Client Component toàn bộ website

Public content nên được render server-side khi có thể.

Mục tiêu:

- SEO tốt.
- HTML có nội dung.
- Performance tốt.
- JavaScript tối thiểu.

---

# 4. HIGH-LEVEL ARCHITECTURE

```text
                        INTERNET
                            │
                            ▼
                 ┌────────────────────┐
                 │   PUBLIC WEBSITE   │
                 │     Next.js        │
                 └─────────┬──────────┘
                           │
                           │
                 ┌─────────▼──────────┐
                 │  APPLICATION LAYER │
                 │                    │
                 │ Server Components  │
                 │ Server Actions     │
                 │ API Routes         │
                 └─────────┬──────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
       ┌──────────────┐          ┌──────────────┐
       │  PostgreSQL  │          │ Object       │
       │              │          │ Storage      │
       │ Content      │          │ Images       │
       │ Admin        │          │ Media        │
       │ Settings     │          │              │
       └──────────────┘          └──────────────┘
```

---

# 5. APPLICATION AREAS

Application có 2 khu vực chính:

```text
/
└── Public Website

/admin
├── login
├── dashboard
├── hero
├── introduction
├── education
├── experience
├── practice-areas
├── commitment
├── contact
├── navigation
├── media
├── seo
└── settings
```

---

# 6. PROJECT STRUCTURE

Đề xuất:

```text
project-root/
│
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── ...
│   │
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   ├── hero/
│   │   ├── introduction/
│   │   ├── education/
│   │   ├── experience/
│   │   ├── practice-areas/
│   │   ├── commitment/
│   │   ├── contact/
│   │   ├── navigation/
│   │   ├── media/
│   │   ├── seo/
│   │   └── settings/
│   │
│   ├── api/
│   │   └── ...
│   │
│   ├── sitemap.ts
│   ├── robots.ts
│   └── layout.tsx
│
├── components/
│   ├── public/
│   │   ├── hero/
│   │   ├── introduction/
│   │   ├── education/
│   │   ├── experience/
│   │   ├── practice-areas/
│   │   ├── commitment/
│   │   └── contact/
│   │
│   ├── admin/
│   │   ├── forms/
│   │   ├── tables/
│   │   ├── dialogs/
│   │   └── layout/
│   │
│   └── ui/
│
├── lib/
│   ├── auth/
│   ├── db/
│   ├── media/
│   ├── validation/
│   ├── seo/
│   └── utils/
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── public/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

Developer có thể điều chỉnh folder structure nếu có lý do kỹ thuật rõ ràng, nhưng phải giữ nguyên separation:

**Public / Admin / Data / Services / Validation.**

---

# 7. DOMAIN MODEL

Các domain chính:

```text
Site Configuration
    │
    ├── Site Settings
    ├── SEO
    └── Navigation

Content
    │
    ├── Hero
    ├── Introduction
    ├── Education
    ├── Experience
    ├── Practice Areas
    └── Commitment

Contact
    │
    └── Contact Channels

Media
    │
    └── Media Assets

Administration
    │
    ├── Admin Users
    └── Audit Logs
```

---

# 8. DATABASE DESIGN

## 8.1. General conventions

Primary key:

```text
cuid() hoặc UUID
```

Khuyến nghị dùng `cuid()` nếu không có yêu cầu khác.

Tất cả entity có thể thay đổi nên có:

```text
createdAt
updatedAt
```

Content có trạng thái:

```text
DRAFT
PUBLISHED
HIDDEN
```

---

# 9. SITE SETTINGS

```text
SiteSettings
├── id
├── siteName
├── logoMediaId
├── faviconMediaId
├── phone
├── email
├── address
├── googleMapsUrl
├── analyticsId
├── tagManagerId
├── metaPixelId
├── createdAt
└── updatedAt
```

Chỉ có một active record.

---

# 10. HERO

```text
Hero
├── id
├── subtitle
├── name
├── imageMediaId
├── logoMediaId
├── status
├── createdAt
└── updatedAt
```

Hero là singleton content.

Không tạo nhiều hero trong Phase 1.

---

# 11. INTRODUCTION

```text
Introduction
├── id
├── title
├── iconMediaId
├── content
├── status
├── createdAt
└── updatedAt
```

Content có thể hỗ trợ rich text nhưng phải sanitize HTML.

---

# 12. EDUCATION

```text
Education
├── id
├── degree
├── institution
├── description
├── startYear
├── endYear
├── iconMediaId
├── displayOrder
├── status
├── createdAt
└── updatedAt
```

`startYear` và `endYear` optional.

Không giới hạn số record.

---

# 13. EXPERIENCE

```text
Experience
├── id
├── startYear
├── endYear
├── position
├── organization
├── description
├── displayOrder
├── status
├── createdAt
└── updatedAt
```

Highlights:

Có thể triển khai bằng relation:

```text
Experience
    │
    └── ExperienceHighlight[]
```

```text
ExperienceHighlight
├── id
├── experienceId
├── content
└── displayOrder
```

Không hard-code số lượng highlights.

---

# 14. PRACTICE AREAS

```text
PracticeArea
├── id
├── title
├── description
├── iconMediaId
├── displayOrder
├── status
├── createdAt
└── updatedAt
```

Không giới hạn số lượng.

---

# 15. COMMITMENT

Singleton:

```text
Commitment
├── id
├── heading
├── content
├── iconMediaId
├── status
├── createdAt
└── updatedAt
```

---

# 16. CONTACT CHANNELS

Đây là một phần bắt buộc của kiến trúc Phase 1.

Không hard-code Facebook/Zalo/Telegram vào frontend.

```text
ContactChannel
├── id
├── platform
├── label
├── value
├── url
├── iconMediaId
├── displayOrder
├── status
├── openInNewTab
├── createdAt
└── updatedAt
```

## Supported platforms

Phase 1:

```text
ZALO
TELEGRAM
FACEBOOK
```

Có thể mở rộng:

```text
LINKEDIN
YOUTUBE
WHATSAPP
OTHER
```

## Platform enum

```text
ZALO
TELEGRAM
FACEBOOK
LINKEDIN
YOUTUBE
WHATSAPP
OTHER
```

## Status

```text
ON
OFF
```

Frontend chỉ render:

```text
status = ON
```

## Business rule

Nếu `status = ON`:

```text
url must not be empty
```

Nếu thiếu URL:

- Không cho publish.
- Hiển thị validation error.

---

# 17. NAVIGATION

```text
NavigationItem
├── id
├── label
├── anchor
├── displayOrder
├── status
├── createdAt
└── updatedAt
```

Admin có thể:

- Edit label.
- Reorder.
- Hide/show.

Anchor phải được validate.

---

# 18. SECTIONS

Để hỗ trợ ordering và visibility:

```text
Section
├── id
├── type
├── titleOverride
├── displayOrder
├── status
└── updatedAt
```

Section type:

```text
INTRODUCTION
EDUCATION
EXPERIENCE
PRACTICE_AREAS
COMMITMENT
CONTACT
```

Hero và Footer là fixed structural components.

---

# 19. MEDIA

Không lưu binary image vào PostgreSQL.

Database:

```text
Media
├── id
├── fileName
├── originalName
├── mimeType
├── size
├── width
├── height
├── storageKey
├── url
├── alt
├── createdAt
└── updatedAt
```

File thực tế nằm trong object storage.

---

# 20. ADMIN USER

```text
AdminUser
├── id
├── name
├── email
├── passwordHash
├── role
├── status
├── lastLoginAt
├── createdAt
└── updatedAt
```

Role Phase 1:

```text
SUPER_ADMIN
```

Status:

```text
ACTIVE
DISABLED
```

---

# 21. AUDIT LOG

```text
AuditLog
├── id
├── adminUserId
├── action
├── entityType
├── entityId
├── metadata
├── createdAt
└── ipAddress
```

Actions:

```text
CREATE
UPDATE
DELETE
PUBLISH
UNPUBLISH
LOGIN
LOGOUT
```

Metadata có thể lưu JSON.

Không lưu password hoặc secret vào audit log.

---

# 22. DATABASE RELATIONSHIP

```text
AdminUser
    │
    └── AuditLog[]

Media
    │
    ├── Hero
    ├── Education
    ├── Experience
    ├── PracticeArea
    └── ContactChannel

Experience
    │
    └── ExperienceHighlight[]

Section
    │
    └── controls public ordering/visibility
```

---

# 23. CONTENT STATUS MODEL

Content lifecycle:

```text
DRAFT
  │
  ▼
PREVIEW
  │
  ▼
PUBLISHED
  │
  ▼
HIDDEN
```

Preview không nhất thiết là database status riêng.

Có thể dùng draft data + preview authorization.

## Public website

Chỉ render:

```text
PUBLISHED
```

hoặc content được xác định là visible.

## Admin

Có thể xem:

- Draft.
- Published.
- Hidden.

---

# 24. PUBLISHING STRATEGY

Phase 1 không cần versioning phức tạp.

Mỗi content record có:

```text
status
```

Admin:

```text
Save Draft
    ↓
Preview
    ↓
Publish
```

Publish phải:

1. Validate data.
2. Update status.
3. Revalidate relevant Next.js cache/path.
4. Ghi AuditLog.

---

# 25. CACHE / REVALIDATION

Public content có thể được cache.

Sau khi Admin publish:

```text
CMS update
     ↓
Database update
     ↓
revalidatePath("/")
     ↓
Public website updated
```

Không yêu cầu full deployment.

---

# 26. ADMIN AUTHENTICATION

Admin routes phải được protected.

```text
/admin/*
```

trừ:

```text
/admin/login
```

## Requirements

- Secure password hashing.
- Secure session.
- HttpOnly cookies.
- Secure cookies production.
- CSRF protection nếu kiến trúc cần.
- Rate limit login.
- Logout.
- Session expiration.

Không dùng password plaintext.

---

# 27. AUTHORIZATION

Phase 1:

```text
SUPER_ADMIN
```

có quyền:

```text
READ
CREATE
UPDATE
DELETE
PUBLISH
MEDIA
SEO
SETTINGS
USER MANAGEMENT
```

Kiến trúc phải có khả năng mở rộng role sau này.

---

# 28. ADMIN ROUTE PROTECTION

Middleware hoặc server-side authorization phải kiểm tra:

```text
authenticated?
        │
       YES
        ↓
authorized?
        │
       YES
        ↓
render admin
```

Không chỉ ẩn menu frontend.

API/server actions cũng phải kiểm tra authorization.

---

# 29. SERVER ACTIONS / API

Ưu tiên Server Actions cho thao tác CMS nội bộ khi phù hợp.

API Routes sử dụng khi:

- External integration.
- Upload callback.
- Webhook.
- Public API thực sự cần thiết.

Không tạo API endpoint chỉ vì “REST API nghe chuyên nghiệp”.

---

# 30. VALIDATION

Sử dụng Zod.

Mỗi form có schema riêng:

```text
heroSchema
educationSchema
experienceSchema
practiceAreaSchema
commitmentSchema
contactChannelSchema
seoSchema
settingsSchema
```

Validation phải tồn tại ở server.

Client-side validation chỉ để cải thiện UX.

---

# 31. SANITIZATION

Rich text content phải được sanitize.

Không render HTML từ CMS trực tiếp bằng `dangerouslySetInnerHTML` nếu chưa sanitize.

Không cho phép:

- `<script>`
- event handlers
- unsafe iframe
- javascript URLs

trừ khi có explicit trusted configuration.

---

# 32. PUBLIC PAGE DATA FLOW

```text
Request /
    ↓
Next.js Server Component
    ↓
Content service
    ↓
Prisma
    ↓
PostgreSQL
    ↓
Filter PUBLISHED / ON
    ↓
Render UI
```

Public frontend không truy cập database trực tiếp từ browser.

---

# 33. PUBLIC PAGE COMPONENTS

```text
PublicPage
│
├── Header
├── Hero
├── IntroductionSection
├── EducationSection
├── ExperienceTimeline
├── PracticeAreasSection
├── CommitmentSection
├── ContactSection
├── FloatingContact
└── Footer
```

`FloatingContact` chỉ render khi có contact channel được bật.

---

# 34. VISUAL DESIGN IMPLEMENTATION

Screenshot là visual source of truth.

Không sử dụng template legal website có sẵn rồi sửa màu.

Public UI phải được custom-build.

## Core tokens

```text
Primary Navy
Accent Gold
White
Off White
Dark Text
Muted Gray
Border Gray
```

Exact color values cần được lấy/điều chỉnh theo screenshot thực tế.

Không tự ý đổi palette thành:

- Red.
- Purple.
- Green.
- Bright blue.

---

# 35. DESIGN TOKENS

Tập trung màu và spacing vào một nơi.

Ví dụ:

```text
--color-primary
--color-accent
--color-background
--color-text
--color-muted
--color-border
```

Không rải mã màu hard-coded khắp component.

---

# 36. TYPOGRAPHY

Heading:

- Serif hoặc display serif phù hợp screenshot.

Body:

- Sans-serif dễ đọc.

Typography phải responsive.

Không dùng quá nhiều font family.

---

# 37. HERO IMAGE

Ảnh thật do khách hàng cung cấp.

Requirements:

- Không AI replace.
- Không stock photo.
- Không làm méo ảnh.
- Object-fit phù hợp.
- Responsive.
- Alt text từ CMS.

Ảnh nên được optimize qua image pipeline.

---

# 38. CURVED DESIGN ELEMENT

Đường cong navy/gold trong screenshot là design feature bắt buộc.

Ưu tiên:

- SVG.
- CSS border/shape.
- Clip-path.

Không dùng ảnh raster để giả lập nếu không cần.

---

# 39. ICON SYSTEM

Icon:

- Consistent stroke style.
- Navy/gold.
- Không emoji.
- Không icon style hỗn hợp.

Nếu sử dụng icon library, chọn một hệ thống nhất quán.

---

# 40. RESPONSIVE BREAKPOINTS

Tối thiểu:

```text
Mobile
Tablet
Desktop
Large Desktop
```

Không thiết kế desktop trước rồi chỉ “thu nhỏ”.

Mobile phải được thiết kế chủ động.

---

# 41. MOBILE CONTACT

Trên mobile:

- Phone clickable.
- Zalo clickable nếu ON.
- Telegram clickable nếu ON.
- Facebook clickable nếu ON.

Nếu floating contact được bật:

```text
Phone
Zalo
Telegram
Facebook
```

chỉ hiển thị những channel đang ON.

---

# 42. SEO

Next.js Metadata API.

Global:

```text
title
description
favicon
OG image
canonical
robots
```

Tạo:

```text
sitemap.xml
robots.txt
```

Nếu phù hợp có thể bổ sung structured data:

```text
Person
ProfessionalService
```

Nhưng không được đưa thông tin pháp lý/chứng nhận không có trong content source.

---

# 43. IMAGE SEO

Mỗi image cần:

```text
alt
width
height
```

Không dùng:

```text
alt="image"
```

Alt nên mô tả đúng nội dung.

Ví dụ:

```text
"Luật sư – Thạc sĩ Lê Thị Ngọc Lợi"
```

---

# 44. SECURITY

## Required

- Password hashing.
- Protected admin routes.
- Secure session.
- Input validation.
- Output sanitization.
- File upload validation.
- MIME validation.
- File size limits.
- Authorization on server.
- No secrets in client bundle.
- `.env` excluded from Git.

---

# 45. FILE UPLOAD SECURITY

Allowed:

```text
JPEG
PNG
WebP
SVG
```

SVG phải được xử lý cẩn thận.

Validate:

- Extension.
- MIME.
- Size.

Không tin extension do client gửi.

---

# 46. ENVIRONMENT VARIABLES

`.env.example` phải được commit.

Ví dụ:

```env
DATABASE_URL=

AUTH_SECRET=

STORAGE_ENDPOINT=
STORAGE_BUCKET=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=

NEXT_PUBLIC_SITE_URL=

NEXT_PUBLIC_ANALYTICS_ID=
```

Secrets không commit vào Git.

---

# 47. ERROR HANDLING

User-facing errors phải thân thiện.

Admin:

```text
Không thể lưu nội dung.
Vui lòng thử lại.
```

Developer log có chi tiết hơn.

Không expose:

- SQL error.
- Stack trace.
- Secret.
- Internal path.

---

# 48. LOGGING

Production logging cần đủ để debug:

- Error.
- Authentication failures.
- Publish.
- Upload.
- Database failure.

Không log:

- Password.
- Session token.
- Secret.
- Sensitive authentication data.

---

# 49. PERFORMANCE

Target:

- Fast first render.
- Minimal client JS.
- Optimized images.
- Lazy loading.
- Cache public content.
- Avoid unnecessary third-party scripts.

Không thêm:

- Heavy animation framework.
- Video background.
- Large UI framework không cần thiết.

---

# 50. IMAGE OPTIMIZATION

Ưu tiên Next.js Image hoặc image optimization tương đương.

Requirements:

- Responsive images.
- Proper dimensions.
- Lazy loading ngoài hero.
- Modern format nếu storage/CDN hỗ trợ.

Hero image được ưu tiên tải sớm.

---

# 51. ACCESSIBILITY

Minimum:

- Semantic HTML.
- Proper heading hierarchy.
- Keyboard navigation.
- Visible focus.
- Alt text.
- Accessible buttons.
- Labels cho form.
- Sufficient contrast.
- No information conveyed only by color.

---

# 52. ADMIN CMS REQUIREMENTS

Admin UI phải bằng tiếng Việt.

Navigation:

```text
Dashboard

NỘI DUNG
├── Hero
├── Giới thiệu
├── Học vấn
├── Kinh nghiệm
├── Lĩnh vực hoạt động
├── Cam kết
├── Liên hệ
└── Navigation

MEDIA
└── Thư viện

SEO
└── SEO Website

HỆ THỐNG
├── Cài đặt
└── Tài khoản
```

---

# 53. ADMIN CRUD STANDARD

Mọi CRUD resource phải hỗ trợ:

```text
List
Create
Edit
Delete
Hide/Show
Reorder
```

Nếu applicable:

```text
Draft
Preview
Publish
```

---

# 54. REORDERING

Các entity có:

```text
displayOrder
```

Admin có thể kéo thả.

Backend cập nhật order transactionally.

Không tạo order duplicate không kiểm soát.

---

# 55. MEDIA LIBRARY

Admin:

- Upload.
- Search.
- Preview.
- Select.
- Delete.
- Edit alt.
- Replace.

Media đang được entity sử dụng không được xóa mà không cảnh báo.

---

# 56. SEO CMS

Admin fields:

```text
SEO Title
Meta Description
OG Title
OG Description
OG Image
Canonical URL
```

Có default fallback từ Site Settings.

---

# 57. CONTACT CMS

Admin phải thấy:

```text
Phone
Email
Address
Google Maps

Contact Channels
----------------
Zalo       ON/OFF
Telegram   ON/OFF
Facebook   ON/OFF
```

Mỗi channel:

```text
Platform
Label
URL
Status
Display Order
Open in New Tab
```

---

# 58. CONTACT CHANNEL UX

Mặc định Phase 1:

```text
Zalo       OFF
Telegram   OFF
Facebook   OFF
```

Lý do:

Không tự ý thay đổi giao diện screenshot khi khách chưa yêu cầu.

Khi khách cần:

```text
Admin
→ nhập URL
→ ON
→ Save
→ Publish
```

Website tự động hiển thị.

---

# 59. ADMIN PREVIEW

Preview phải cho phép Admin xem content trước khi publish.

Preview URL phải protected hoặc dùng signed/temporary token.

Không expose draft content công khai.

---

# 60. PUBLISH WORKFLOW

```text
Admin edit
    ↓
Validate
    ↓
Save Draft
    ↓
Preview
    ↓
Publish
    ↓
Database update
    ↓
Audit log
    ↓
Cache revalidation
    ↓
Public website updated
```

---

# 61. CONTENT INTEGRITY

Không được tự động “sáng tạo” nội dung pháp lý.

CMS chỉ quản lý content được Admin nhập.

AI/developer không tự bổ sung:

- Chức danh.
- Bằng cấp.
- Cơ quan.
- Thành tích.
- Kinh nghiệm.
- Chứng chỉ.

nếu khách hàng chưa cung cấp/xác nhận.

---

# 62. CURRENT CONTENT DATA

Seed data phải lấy từ PRD.

Có một nội dung cần đánh dấu:

```text
2025 - 2026
Luật sư chuyên nghiệp tại [CẦN XÁC NHẬN]
```

Không publish placeholder này như nội dung chính thức.

Admin phải xác nhận/cập nhật trước khi production publish.

---

# 63. SEED DATA

Development seed nên tạo:

- 1 Super Admin.
- 1 Site Settings.
- 1 Hero.
- 1 Introduction.
- Education records.
- Experience records.
- Practice areas.
- Commitment.
- Contact settings.
- Navigation.

Contact channels:

```text
ZALO = OFF
TELEGRAM = OFF
FACEBOOK = OFF
```

---

# 64. DATABASE MIGRATION

Prisma migrations phải được version control.

Không sửa production DB thủ công nếu có thể tránh.

Workflow:

```text
Schema change
    ↓
Prisma migration
    ↓
Test
    ↓
Commit
    ↓
Deploy
```

---

# 65. TESTING STRATEGY

## Unit tests

Test:

- Validation.
- Business rules.
- Contact channel visibility.
- Ordering.
- Content filtering.

## Integration tests

Test:

- Database.
- CRUD.
- Publish.
- Authentication.
- Media metadata.

## E2E

Test:

```text
Admin login
→ Edit
→ Save
→ Publish
→ Public website
```

---

# 66. CRITICAL E2E TESTS

## Test 1 — Zalo ON

```text
Admin
→ Zalo ON
→ Save
→ Publish

Expected:
Zalo appears on website.
```

## Test 2 — Zalo OFF

```text
Admin
→ Zalo OFF
→ Publish

Expected:
Zalo disappears.
```

## Test 3 — Telegram

Same logic.

## Test 4 — Facebook

Same logic.

## Test 5 — Add education

```text
Admin
→ Add Education
→ Publish

Expected:
New education appears in correct order.
```

## Test 6 — Hide experience

```text
Admin
→ Hide Experience
→ Publish

Expected:
Experience not visible publicly.
```

---

# 67. VISUAL QA

Screenshot comparison cần kiểm tra:

- Hero dimensions.
- Image crop.
- Navy color.
- Gold accent.
- Typography.
- Spacing.
- Curve geometry.
- Cards.
- Timeline.
- Footer.
- Mobile layout.

Không chỉ kiểm tra functional correctness.

---

# 68. RESPONSIVE QA

Test tối thiểu:

```text
Mobile
375px
390px
412px

Tablet
768px
1024px

Desktop
1280px
1440px
1920px
```

Kiểm tra:

- No overflow.
- No clipped text.
- No broken image.
- No layout collapse.
- No inaccessible CTA.

---

# 69. BROWSER SUPPORT

Target current versions:

- Chrome.
- Safari.
- Edge.
- Firefox.

Mobile:

- iOS Safari.
- Android Chrome.

---

# 70. DEPLOYMENT

Có thể deploy:

```text
Next.js
     ↓
Vercel
     ↓
PostgreSQL managed
     ↓
Object Storage/CDN
```

Hoặc cloud/VPS tương đương.

Không lock architecture vào một vendor duy nhất.

---

# 71. PRODUCTION ENVIRONMENTS

Tối thiểu:

```text
Development
Production
```

Khuyến nghị:

```text
Development
Staging
Production
```

---

# 72. BACKUP

Backup:

- PostgreSQL.
- Media.

Database backup phải có retention policy phù hợp.

Media nên được lưu trong object storage có durability cao.

---

# 73. DOMAIN / HTTPS

Production phải:

- Có custom domain.
- HTTPS.
- Redirect HTTP → HTTPS.
- Canonical domain rõ ràng.

---

# 74. ANALYTICS

Có thể tích hợp:

- Google Analytics.
- Google Tag Manager.
- Meta Pixel.

Nhưng chỉ load khi ID được Admin cấu hình.

Không hard-code tracking IDs.

---

# 75. THIRD-PARTY SCRIPTS

Third-party scripts phải:

- Configurable.
- Không block critical rendering.
- Không load nếu không cần.
- Không đưa secret vào frontend.

---

# 76. SEO STRUCTURED DATA

Có thể triển khai:

```text
Person
```

và/hoặc:

```text
ProfessionalService
```

Chỉ sử dụng dữ liệu thực tế đã được xác nhận.

Không khai báo review/rating giả.

---

# 77. NO FAKE CONTENT

Không tạo:

- Fake testimonials.
- Fake reviews.
- Fake case studies.
- Fake awards.
- Fake client logos.
- Fake legal credentials.

Website phải giữ tính xác thực cao.

---

# 78. CODING RULES FOR ANTIGRAVITY

Antigravity phải:

1. Không hard-code CMS content trong public components.
2. Không hard-code contact channels.
3. Không hard-code số lượng education/experience/practice areas.
4. Không hard-code URL social.
5. Không lưu secrets trong source.
6. Không dùng `any` không cần thiết.
7. Không bypass server authorization.
8. Không expose draft content.
9. Không sửa visual concept ngoài PRD.
10. Không thêm dependency lớn nếu không cần.
11. Không tạo microservice không cần thiết.
12. Không over-engineer.

---

# 79. COMPONENT RULES

Public components nên nhận data:

```ts
<ExperienceTimeline items={experiences} />
```

Không:

```ts
<ExperienceTimeline />
```

với data hard-coded bên trong.

Admin forms nên tách:

```text
schema
form
server action
database
```

Không đặt toàn bộ logic vào component UI.

---

# 80. SERVICE LAYER

Database access nên tập trung.

Ví dụ:

```text
lib/services/
├── hero.service.ts
├── education.service.ts
├── experience.service.ts
├── practice-area.service.ts
├── contact-channel.service.ts
├── media.service.ts
└── seo.service.ts
```

Mục tiêu:

UI không chứa raw Prisma query.

---

# 81. DATABASE ACCESS RULE

Không để component gọi:

```ts
prisma.education.findMany()
```

rải rác khắp project.

Thay vào đó:

```ts
getPublishedEducation()
```

hoặc service tương đương.

Lợi ích:

- Dễ test.
- Dễ thay đổi query.
- Dễ cache.
- Dễ kiểm soát authorization.

---

# 82. TRANSACTIONS

Dùng database transaction cho thao tác liên quan nhiều record.

Ví dụ reorder:

```text
Education A → 1
Education B → 2
Education C → 3
```

khi reorder phải tránh trạng thái dữ liệu không nhất quán.

---

# 83. DELETE POLICY

Content quan trọng:

Khuyến nghị soft delete hoặc archive.

Media:

Không xóa file đang được tham chiếu mà không cảnh báo.

Admin user:

Không xóa Super Admin cuối cùng.

---

# 84. AUDITABILITY

Mọi mutation quan trọng phải có audit:

```text
CREATE
UPDATE
DELETE
PUBLISH
UNPUBLISH
```

Audit log phải xác định:

- Who.
- What.
- When.

---

# 85. ADMIN DASHBOARD

Dashboard hiển thị:

- Website status.
- Last published time.
- Content counts.
- Media count.
- Contact channels active.
- Recent changes.

Không cần dashboard analytics phức tạp trong Phase 1.

---

# 86. UI/UX ADMIN

Admin:

- Tiếng Việt.
- Responsive.
- Desktop-first nhưng usable trên tablet.
- Form rõ.
- Validation rõ.
- Confirmation trước delete.
- Toast sau save.
- Loading states.
- Empty states.

---

# 87. ADMIN EMPTY STATES

Ví dụ:

```text
Chưa có kinh nghiệm công tác.

[ + Thêm kinh nghiệm ]
```

Không hiển thị blank table khó hiểu.

---

# 88. ADMIN ERROR STATES

Ví dụ:

```text
Không thể tải dữ liệu.

[ Thử lại ]
```

Không để màn hình trắng.

---

# 89. CONTENT PREVIEW

Preview phải phản ánh gần như chính xác public website.

Không tạo một preview UI hoàn toàn khác.

Nếu có draft:

```text
Preview Draft
```

nếu published:

```text
View Published
```

---

# 90. MIGRATION / FUTURE EXTENSIBILITY

Kiến trúc phải có khả năng mở rộng:

```text
Blog
FAQ
Services
Booking
Contact Form
Testimonials
Case Studies
```

nhưng **không implement trong Phase 1** nếu chưa có requirement.

Không tạo database table hàng loạt cho tính năng chưa có nhu cầu chỉ để “cho tương lai”.

Nguyên tắc:

**Architecture extensible, implementation focused.**

---

# 91. FUTURE CONTACT CHANNEL EXTENSION

Nếu sau này cần:

```text
WhatsApp
LinkedIn
YouTube
TikTok
```

không cần tạo component riêng cho từng platform nếu chỉ khác:

- icon.
- label.
- URL.

Có thể thêm enum/config.

---

# 92. DEFINITION OF DONE

Một feature chỉ được xem là hoàn thành khi:

- UI hoàn thành.
- Responsive hoàn thành.
- Database hoàn thành nếu cần.
- Validation hoàn thành.
- Authorization hoàn thành.
- Error state hoàn thành.
- Loading state hoàn thành.
- Test hoàn thành.
- Visual QA hoàn thành.
- Không có console error nghiêm trọng.
- Không có TypeScript error.
- Không có lint error nghiêm trọng.
- Không phá vỡ feature hiện có.

---

# 93. PRODUCTION CHECKLIST

## Public

- [ ] Homepage hoạt động.
- [ ] Responsive.
- [ ] Hero đúng screenshot.
- [ ] Ảnh thật.
- [ ] Nội dung chính xác.
- [ ] Contact hoạt động.
- [ ] Zalo/Telegram/Facebook chỉ hiển thị khi ON.
- [ ] SEO.
- [ ] Sitemap.
- [ ] Robots.
- [ ] HTTPS.
- [ ] Performance.

## Admin

- [ ] Login.
- [ ] Authentication.
- [ ] CRUD.
- [ ] Publish.
- [ ] Preview.
- [ ] Media.
- [ ] SEO.
- [ ] Contact channels.
- [ ] ON/OFF.
- [ ] Ordering.
- [ ] Audit log.

## Security

- [ ] No plaintext password.
- [ ] No secrets in Git.
- [ ] Protected routes.
- [ ] Server-side authorization.
- [ ] File validation.
- [ ] Input validation.
- [ ] Rich text sanitization.

---

# 94. IMPLEMENTATION ORDER

Antigravity nên triển khai theo thứ tự:

## Phase A — Foundation

1. Initialize Next.js.
2. TypeScript strict.
3. Tailwind.
4. shadcn/ui.
5. Prisma.
6. PostgreSQL.
7. Environment configuration.
8. Authentication foundation.

## Phase B — Database

1. Schema.
2. Migrations.
3. Seed.
4. Services.
5. Validation.

## Phase C — Admin CMS

1. Login.
2. Dashboard.
3. Hero.
4. Introduction.
5. Education.
6. Experience.
7. Practice Areas.
8. Commitment.
9. Contact.
10. Navigation.
11. Media.
12. SEO.
13. Settings.

## Phase D — Public Website

1. Layout.
2. Hero.
3. Introduction.
4. Education.
5. Experience.
6. Practice Areas.
7. Commitment.
8. Contact.
9. Footer.
10. Responsive.

## Phase E — Integration

1. CMS → Database.
2. Database → Public.
3. Publish.
4. Revalidation.
5. Contact ON/OFF.
6. Media.
7. SEO.

## Phase F — QA

1. Unit.
2. Integration.
3. E2E.
4. Responsive.
5. Visual comparison.
6. Security.
7. Performance.

## Phase G — Production

1. Production DB.
2. Storage.
3. Domain.
4. HTTPS.
5. Environment.
6. Backup.
7. Monitoring.
8. Final acceptance.

---

# 95. ANTIGRAVITY EXECUTION RULE

Antigravity không được bắt đầu bằng việc viết toàn bộ frontend dựa trên screenshot rồi mới nghĩ về CMS.

Thứ tự đúng:

```text
PRD
 ↓
Technical Specification
 ↓
Database Schema
 ↓
CMS/Data Layer
 ↓
Public UI
 ↓
Integration
 ↓
Testing
 ↓
Deployment
```

---

# 96. FINAL ARCHITECTURAL DECISION

## Chốt stack

```text
TypeScript
    +
Next.js
    +
React
    +
Tailwind CSS
    +
shadcn/ui
    +
PostgreSQL
    +
Prisma
    +
Zod
    +
Production-ready Auth
    +
Object Storage
```

## Chốt architecture

```text
                ┌───────────────────┐
                │   Public Website  │
                └─────────┬─────────┘
                          │
                    Next.js App
                          │
                ┌─────────┴─────────┐
                │                   │
           Admin CMS           Public Renderer
                │                   │
                └─────────┬─────────┘
                          │
                    Service Layer
                          │
                       Prisma
                          │
                     PostgreSQL
                          │
                  ┌───────┴───────┐
                  │               │
              Content           Media
                              Object Storage
```

## Core principle

> **Build the system as a CMS-driven application from day one.**

> **Do not build a static website and retrofit CMS later.**

> **Screenshot controls visual design. CMS/database controls content. Frontend controls presentation.**

> **Features such as Zalo, Telegram and Facebook should be available in CMS from Phase 1 but can default to OFF so the current design remains faithful to the customer's screenshot.**

---

# 97. HANDOFF TO ANTIGRAVITY

Antigravity should treat these two documents as the primary project specification:

```text
PRD_Website_Luat_Su_Le_Thi_Ngoc_Loi.md
TECHNICAL_SPECIFICATION_Website_Luat_Su_Le_Thi_Ngoc_Loi.md
```

Expected behavior:

1. Read both documents completely.
2. Audit requirements for contradictions or missing decisions.
3. Propose implementation plan before coding.
4. Create database schema first.
5. Implement CMS/data layer.
6. Implement public website.
7. Integrate CMS with frontend.
8. Run tests.
9. Run visual QA against the provided screenshot.
10. Report completed requirements with evidence.
11. Do not silently invent content.
12. Do not silently remove requirements.
13. If a requirement is ambiguous, document the assumption before implementation.

## Final deliverable

The completed system must provide:

```text
Public Website
        +
Admin CMS
        +
Database
        +
Media Management
        +
SEO
        +
Authentication
        +
Publish Workflow
        +
Contact Channel Management
        +
Responsive UI
        +
Production Deployment Readiness
```

The result must be maintainable by another developer without depending on the original developer's undocumented knowledge.
