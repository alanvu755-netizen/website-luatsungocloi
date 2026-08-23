# DESIGN SPECIFICATION
## WEBSITE GIỚI THIỆU LUẬT SƯ – THẠC SĨ LÊ THỊ NGỌC LỢI

**Version:** 1.0  
**Status:** Ready for UI implementation  
**Design Source:** Customer-provided website screenshot

**Related documents**
- `PRD_Website_Luat_Su_Le_Thi_Ngoc_Loi.md`
- `TECHNICAL_SPECIFICATION_Website_Luat_Su_Le_Thi_Ngoc_Loi.md`
- `ANTIGRAVITY_IMPLEMENTATION_PROMPT.md`

---

# 1. PURPOSE

Tài liệu này chuyển screenshot giao diện khách hàng cung cấp thành các nguyên tắc thiết kế có thể triển khai.

Mục tiêu:

> Xây Public Website có visual identity trung thành với screenshot khách hàng, nhưng nội dung phải được quản trị động thông qua CMS.

**Screenshot = Visual Source of Truth**  
**PRD = Product Source of Truth**  
**Technical Specification = Technical Source of Truth**

Không dùng screenshot để hard-code content.

---

# 2. DESIGN DIRECTION

Visual direction:

- Professional
- Premium
- Elegant
- Trustworthy
- Minimal
- Serious
- Personal branding
- Legal / professional services

Thiết kế cần truyền tải:

`Professional + Trust + Experience + Personal Authority`

Không sử dụng phong cách:

- Quá màu mè.
- Quá nhiều animation.
- Startup SaaS.
- Law-firm corporate template generic.
- Neon / gradient mạnh.
- Glassmorphism nặng.

---

# 3. SCREENSHOT REFERENCE

Screenshot khách hàng phải được đặt trong repository, khuyến nghị:

`docs/design/customer-reference.png`

Antigravity **phải mở và kiểm tra trực tiếp screenshot trước khi implement Public UI**.

Không chỉ đọc mô tả text rồi tự thiết kế lại.

Screenshot không được dùng như một ảnh background để giả lập website.

Phải xây UI thật bằng:

- HTML
- React
- CSS
- Tailwind
- SVG/CSS shapes
- Image components

---

# 4. OVERALL COMPOSITION

Website là một single-page professional profile:

```text
HEADER
   ↓
HERO / PERSONAL BRAND
   ↓
INTRODUCTION
   ↓
EDUCATION
   ↓
EXPERIENCE
   ↓
PRACTICE AREAS
   ↓
COMMITMENT
   ↓
CONTACT
   ↓
FOOTER
```

Mỗi section phải có khoảng thở rõ ràng, không dính sát nhau.

---

# 5. HEADER

Header phải có cảm giác:

- sạch
- chuyên nghiệp
- nhẹ
- không chiếm quá nhiều chiều cao

Desktop:

```text
[LOGO]      Navigation
```

Mobile:

```text
[LOGO]                         [MENU]
```

Navigation phải responsive và không tràn màn hình nhỏ.

---

# 6. BRANDING & COLOR

Visual identity tập trung vào:

- Navy
- Gold
- White / warm off-white
- Dark neutral text

Logo thật của khách hàng được ưu tiên.

## Color tokens

```css
--color-primary-navy
--color-accent-gold
--color-background
--color-background-soft
--color-text
--color-text-muted
--color-border
```

### Navy

Dùng cho:

- Hero
- Footer
- Accent blocks
- Decorative shapes

Navy phải sâu, sang trọng, không phải blue sáng.

### Gold

Dùng cho:

- line
- icon
- highlight
- decorative detail

Gold là accent, không phủ toàn bộ giao diện.

Nguyên tắc:

```text
Navy = Authority
Gold = Premium Accent
White = Clarity
```

### Tỷ lệ màu tham khảo

```text
White / Off-white ≈ 60–75%
Navy              ≈ 20–30%
Gold              ≈ 3–8%
```

Exact values phải được tinh chỉnh qua visual QA theo screenshot.

---

# 7. TYPOGRAPHY

Typography cần tạo cảm giác:

- legal
- premium
- editorial
- professional

Khuyến nghị:

```text
1 display/serif family
+
1 sans-serif family
```

Heading ưu tiên serif/display serif phù hợp screenshot.

Body dùng sans-serif dễ đọc.

Hierarchy:

```text
H1
↓
Section Heading
↓
Subheading
↓
Body
↓
Caption / Metadata
```

Starting point:

```text
Display: clamp(2.5rem, 5vw, 5rem)
H2:      clamp(2rem, 3.5vw, 3.5rem)
H3:      clamp(1.25rem, 2vw, 1.75rem)
Body:    1rem – 1.125rem
Small:   0.875rem
```

Đây là starting point, không phải giá trị cứng.

---

# 8. HERO

Hero là visual focal point quan trọng nhất.

Cấu trúc dự kiến:

```text
┌──────────────────────────────────────────────┐
│                                              │
│   TEXT / PERSONAL BRAND       PORTRAIT       │
│                                              │
│   Subtitle                                   │
│   Name                                       │
│   Professional identity                      │
│                                              │
└──────────────────────────────────────────────┘
```

Hero phải tạo ấn tượng ngay lập tức.

## Hero image

- Ưu tiên ảnh thật của khách hàng.
- Không AI face.
- Không stock lawyer.
- Không random portrait.
- Không làm méo ảnh.
- Không cắt mất khuôn mặt.
- Responsive.
- Chất lượng cao.

Nếu screenshot có decorative shape phía sau ảnh, implement bằng CSS/SVG, không crop screenshot.

---

# 9. HERO CURVED ELEMENT

Đường cong navy/gold là visual feature quan trọng.

Ưu tiên:

```text
SVG
hoặc
CSS border/shape
hoặc
clip-path
```

Shape phải responsive và không gây horizontal overflow.

---

# 10. HERO CTA

Nếu screenshot có CTA, giữ đúng hierarchy.

Primary CTA:

- Navy hoặc style tương ứng screenshot.

Secondary CTA:

- Outline/subtle.

Không tạo quá nhiều CTA.

Nếu contact channels được bật, CTA có thể dẫn tới phone/Zalo/Telegram/Facebook.

---

# 11. INTRODUCTION

Introduction có cảm giác editorial/professional:

```text
SECTION LABEL / ICON
        ↓
HEADING
        ↓
BODY CONTENT
```

Text có line-height thoáng.

Không để paragraph chạy toàn bộ viewport.

---

# 12. SECTION HEADING SYSTEM

Các section phải có design language nhất quán.

Có thể dùng:

```text
small gold accent
        ↓
SECTION TITLE
        ↓
supporting text
```

Không bắt buộc mọi section giống 100%, nhưng phải cùng visual system.

---

# 13. EDUCATION

Education phải có cảm giác structured.

Mỗi record:

```text
Degree
Institution
Description
```

Nếu screenshot có timeline/icon thì giữ visual language đó.

UI phải dynamic:

- Không giới hạn 2 records.
- Admin có thể thêm records.
- Thứ tự lấy từ CMS.

Card nếu có:

- white background
- border nhẹ
- radius vừa phải
- shadow rất nhẹ hoặc không shadow
- navy heading
- gold accent

---

# 14. EXPERIENCE

Experience là section quan trọng để thể hiện authority.

Nên có visual timeline:

```text
●────────────
│
│ Year
│ Position
│ Organization
│ Description
│
●────────────
│
│ Year
│ Position
│ Organization
```

Timeline:

- Navy hoặc neutral line.
- Gold marker/accent.

Desktop có thể dùng layout nhiều cột nếu screenshot yêu cầu.

Mobile phải chuyển thành một cột rõ ràng.

---

# 15. PRACTICE AREAS

Practice Areas nên dùng grid/card.

Desktop:

```text
┌──────┐ ┌──────┐ ┌──────┐
│ Area │ │ Area │ │ Area │
└──────┘ └──────┘ └──────┘
```

Tablet:

```text
┌──────┐ ┌──────┐
│ Area │ │ Area │
└──────┘ └──────┘
```

Mobile:

```text
┌─────────────┐
│ Area        │
└─────────────┘
```

Số lượng card dynamic.

Icon:

- consistent
- professional
- thin/medium stroke
- có thể dùng gold accent
- không dùng emoji

---

# 16. COMMITMENT

Commitment cần tạo cảm giác:

- personal
- confident
- trustworthy

Ưu tiên:

```text
Large heading
+
Supporting statement
+
Decorative visual
```

Nhiều khoảng trắng.

Không biến thành marketing block quá mạnh.

---

# 17. CONTACT

Contact là conversion section.

Hierarchy:

```text
Contact Heading
      ↓
Phone
Email
Address
Google Maps
      ↓
Social / Messaging Channels
```

Zalo / Telegram / Facebook chỉ render khi:

```text
status = ON
```

---

# 18. CONTACT CHANNELS

Supported Phase 1:

```text
Zalo
Telegram
Facebook
```

Ví dụ:

```text
Admin:
Zalo       OFF
Telegram   ON
Facebook   ON
```

Frontend:

```text
[Telegram] [Facebook]
```

Không render Zalo.

Nếu channel ON nhưng URL rỗng:

- CMS validation error.
- Không cho publish.

---

# 19. FLOATING CONTACT

Nếu được bật trong CMS/design configuration, mobile có thể dùng floating contact.

Các channel:

```text
Phone
Zalo
Telegram
Facebook
```

Chỉ render channel active.

Floating button:

- không che content
- không che CTA
- không che cookie/banner
- đủ lớn để tap
- không chiếm quá nhiều màn hình

---

# 20. FOOTER

Footer nên dùng navy background.

Có thể chứa:

- Logo/brand
- Contact
- Navigation
- Social/contact channels
- Copyright

Gold chỉ làm accent.

Footer phải giữ cảm giác premium.

---

# 21. SPACING

Dùng spacing scale thống nhất:

```text
4
8
12
16
24
32
48
64
80
96
120
```

Starting point:

```text
Section padding desktop: 80–120px
Section padding mobile:   48–72px
```

Final values phải được visual QA theo screenshot.

---

# 22. CONTAINER & GRID

Desktop:

```text
max-width: 1200–1280px
margin: auto
padding-inline: 24–48px
```

Mobile:

```text
padding-inline: 20–24px
```

Reading width cho đoạn văn dài:

```text
60–75ch
```

Không để text chạy toàn màn hình.

---

# 23. BORDER / RADIUS / SHADOW

Border:

- nhẹ
- tinh tế

Radius:

- vừa phải
- đồng nhất

Không dùng pill cho mọi element.

Không dùng:

```text
border-radius: 9999px
```

trừ khi design thực sự yêu cầu.

Shadow:

- subtle
- không nặng
- không neon

---

# 24. BUTTONS

Button phải có:

- clear label
- sufficient height
- comfortable horizontal padding
- hover
- focus
- active

Tap target khoảng:

```text
44px+
```

Mobile phải dễ thao tác.

---

# 25. INTERACTION & ANIMATION

Interaction phải subtle:

- color shift
- border shift
- small translate
- opacity

Transition khoảng:

```text
150–300ms
```

Không dùng:

- parallax nặng
- animation liên tục
- spinning decoration
- excessive scroll animation

Respect:

```text
prefers-reduced-motion
```

---

# 26. MOBILE DESIGN

Mobile không phải desktop thu nhỏ.

Phải chủ động thiết kế:

- navigation
- hero
- image crop
- timeline
- cards
- contact
- footer

Ưu tiên:

```text
readability
+
tapability
+
visual hierarchy
```

Hero có thể chuyển từ:

```text
Text | Image
```

sang:

```text
Text
↓
Image
```

hoặc layout phù hợp screenshot.

---

# 27. RESPONSIVE TARGETS

Test tối thiểu:

```text
375px
390px
412px
768px
1024px
1280px
1440px
1920px
```

Không nhất thiết tạo breakpoint cho từng width; ưu tiên fluid layout.

Không được có:

- horizontal overflow
- clipped text
- broken image
- inaccessible CTA

---

# 28. DESIGN TOKENS

Centralize design tokens:

```css
:root {
  --navy: ...;
  --gold: ...;
  --background: ...;
  --background-soft: ...;
  --text: ...;
  --text-muted: ...;
  --border: ...;

  --container: 1280px;

  --radius-sm: ...;
  --radius-md: ...;

  --section-padding-desktop: ...;
  --section-padding-mobile: ...;
}
```

Không rải mã màu tùy ý khắp components.

---

# 29. ICONS / SVG

Ưu tiên:

- SVG
- icon library thống nhất
- custom SVG nếu screenshot có icon đặc biệt

Không dùng screenshot crop làm icon.

---

# 30. IMAGE BEHAVIOR

Mỗi image cần:

```text
width
height
alt
object-fit
object-position
```

Hero image:

```text
priority loading
```

Image ngoài viewport:

```text
lazy loading
```

---

# 31. CONTENT VS DESIGN

Screenshot quyết định:

- layout
- visual hierarchy
- color
- typography
- spacing
- component style

CMS/database quyết định:

- content
- số lượng item
- order
- status
- images
- contact channels

Ví dụ screenshot có 2 education items không có nghĩa database chỉ hỗ trợ 2.

Phải:

```text
Education[]
→ CMS CRUD
→ Database
→ Dynamic rendering
```

---

# 32. ACCESSIBILITY

Required:

- semantic HTML
- heading hierarchy
- keyboard navigation
- visible focus
- accessible labels
- contrast
- meaningful alt text

ON/OFF không được chỉ thể hiện bằng màu; phải có label/switch rõ ràng trong Admin.

---

# 33. VISUAL QA

Sau khi implement:

1. Mở screenshot reference.
2. Chạy website.
3. Render ở viewport tương đương.
4. So sánh trực quan.
5. Ghi nhận mismatch.
6. Fix.
7. So sánh lại.

Checklist:

```text
[ ] Composition
[ ] Header
[ ] Hero
[ ] Portrait
[ ] Typography
[ ] Colors
[ ] Spacing
[ ] Education
[ ] Experience
[ ] Practice Areas
[ ] Commitment
[ ] Contact
[ ] Footer
[ ] Mobile
```

---

# 34. DESIGN QA MATRIX

Antigravity phải báo cáo:

| Section | Desktop | Tablet | Mobile | Screenshot Match |
|---|---|---|---|---|
| Header | PASS/FAIL | PASS/FAIL | PASS/FAIL | PASS/FAIL |
| Hero | PASS/FAIL | PASS/FAIL | PASS/FAIL | PASS/FAIL |
| Introduction | PASS/FAIL | PASS/FAIL | PASS/FAIL | PASS/FAIL |
| Education | PASS/FAIL | PASS/FAIL | PASS/FAIL | PASS/FAIL |
| Experience | PASS/FAIL | PASS/FAIL | PASS/FAIL | PASS/FAIL |
| Practice Areas | PASS/FAIL | PASS/FAIL | PASS/FAIL | PASS/FAIL |
| Commitment | PASS/FAIL | PASS/FAIL | PASS/FAIL | PASS/FAIL |
| Contact | PASS/FAIL | PASS/FAIL | PASS/FAIL | PASS/FAIL |
| Footer | PASS/FAIL | PASS/FAIL | PASS/FAIL | PASS/FAIL |

Không báo Visual QA PASS nếu chưa thực sự kiểm tra.

---

# 35. VISUAL PRIORITY

Khi cần ưu tiên:

1. Overall composition
2. Hero
3. Typography
4. Colors
5. Image treatment
6. Section spacing
7. Cards/timeline
8. Footer
9. Micro interactions

Không tối ưu hover animation trong khi Hero còn sai.

---

# 36. NON-NEGOTIABLES

Không được:

- đổi navy thành màu khác;
- đổi gold thành màu khác;
- thay portrait thật bằng ảnh khác;
- biến layout thành generic legal template;
- hard-code content;
- bỏ CMS;
- bỏ responsive;
- bỏ contact ON/OFF;
- dùng emoji thay icon;
- thêm animation nặng;
- làm UI quá flashy.

---

# 37. FLEXIBILITY

Có thể tinh chỉnh sau visual QA:

- exact font size
- exact line height
- exact spacing
- exact radius
- exact shadow
- breakpoint
- image crop
- decorative curve dimensions

Nhưng không được thay đổi:

- overall design direction
- color identity
- section hierarchy
- personal branding
- professional tone

---

# 38. ACCEPTANCE CRITERIA

UI được PASS khi:

- [ ] Screenshot đã được xem trực tiếp.
- [ ] Hero đúng visual hierarchy.
- [ ] Portrait đúng.
- [ ] Navy/gold đúng tinh thần.
- [ ] Typography phù hợp.
- [ ] Section hierarchy đúng.
- [ ] Education đúng.
- [ ] Experience timeline đúng.
- [ ] Practice Areas đúng.
- [ ] Commitment đúng.
- [ ] Contact đúng.
- [ ] Footer đúng.
- [ ] Responsive tốt.
- [ ] Không horizontal overflow.
- [ ] Accessibility cơ bản đạt.
- [ ] Zalo/Telegram/Facebook render đúng theo CMS status.
- [ ] Không có content hard-code ngoài structural UI.
- [ ] Visual QA đã thực hiện.

---

# 39. FINAL DESIGN PRINCIPLE

Thiết kế phải đạt:

```text
CUSTOMER SCREENSHOT
        ↓
DESIGN SYSTEM
        ↓
REUSABLE COMPONENTS
        ↓
CMS-DRIVEN CONTENT
        ↓
RESPONSIVE PUBLIC WEBSITE
```

Không làm:

```text
Screenshot
   ↓
Hard-coded HTML
   ↓
Finished
```

Mà phải làm:

```text
Screenshot
   ↓
Design System
   ↓
Component System
   ↓
CMS
   ↓
Database
   ↓
Public UI
```

Mục tiêu cuối cùng:

> Người dùng nhìn website phải nhận ra đúng tinh thần và bố cục mà khách hàng đã yêu cầu, trong khi Admin có thể thay đổi nội dung, hình ảnh, thứ tự, trạng thái và các kênh liên hệ mà không cần sửa code.
