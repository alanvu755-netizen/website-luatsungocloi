# DESIGN SPECIFICATION — PRD v2.1
## Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi

**Project Identity:** NGOCLOI  
**Version:** 2.1  
**Status:** AUTHORIZED FOR IMPLEMENTATION — STEP 2 APPROVED  
**Visual Source of Truth:** Customer-provided new Homepage screenshot  
**Product Source of Truth:** PRD v2.1

---

# 1. DESIGN AUTHORITY

- Screenshot controls visual intent for Homepage.
- PRD controls product requirements.
- This document translates both into implementable UI/UX behavior.
- Antigravity MUST inspect the actual screenshot before implementing public UI.
- Screenshot must NOT be used as a full-page background.
- Editable content must remain CMS-driven.

---

# 2. DESIGN DIRECTION

Target qualities:

- Professional
- Premium
- Elegant
- Trustworthy
- Minimal
- Serious
- Personal authority
- Legal/professional service

Avoid:

- generic legal template
- SaaS look
- excessive gradients
- neon
- heavy glassmorphism
- excessive animation
- decorative UI that competes with legal/professional content

Visual principle:

```text
Navy = authority
Gold = premium accent
White / warm white = clarity
Dark neutral = readable content
```

---

# 3. HOMEPAGE CONTRACT

The customer confirmed the screenshot represents the entire Homepage.

Do NOT add sections below the screenshot unless a later approved requirement explicitly adds them.

The Homepage content groups are:

1. Header / Navigation
2. Hero / personal branding
3. Profile / Introduction
4. Education
5. Work Experience
6. Practice Areas
7. Statistics
8. Commitment / trust
9. Legal News
10. Consultation CTA/Form
11. Contact / Footer

These are content groups; visual composition must follow the supplied screenshot.

---

# 4. HEADER / NAVIGATION

Desktop:

```text
[LOGO]                         MENU ITEMS
```

Mobile:

```text
[LOGO]                     [MENU]
```

Requirements:

- clean
- low visual weight
- responsive
- no overflow
- active/current state must be understandable
- menu items are separate pages according to the current product decision
- menu visibility/order is CMS-controlled

Admin interaction:

```text
Menu
├── Label
├── Link/target
├── Enabled
├── Order
└── Hierarchy (where supported)
```

Do not invent extra menu items.

---

# 5. HERO

Hero is the primary visual anchor.

Baseline composition:

```text
┌──────────────────────────────────────────────┐
│                                              │
│   PERSONAL BRAND              PORTRAIT       │
│                                              │
│   Professional identity                      │
│   LÊ THỊ NGỌC LỢI                            │
│                                              │
└──────────────────────────────────────────────┘
```

The screenshot's curved Navy/Gold visual separator is a key visual feature.

Implement the curve with:

- SVG
- CSS shape
- clip-path
- equivalent real UI technique

Do NOT crop the screenshot to create the shape.

Portrait:

- use the supplied/customer-approved portrait
- no AI face replacement
- no random stock portrait
- preserve facial proportions
- responsive crop
- accessible alt text

Hero image should be prioritized for loading.

---

# 6. BRANDING ASSETS

Separate assets:

- logo
- favicon
- lawyer portrait

Admin must be able to replace these through CMS/Media.

Public UI must render the configured assets.

Do not hard-code asset URLs.

---

# 7. COLOR TOKENS

Centralize design tokens in Tailwind configuration (`tailwind.config.ts`).

### Design Token Classification Lock:

1. **PRIMARY (Màu chủ đạo chính thức)**:
   - `Primary Brand Navy`: `#073B78` (`navy.DEFAULT` / `--color-primary-navy`) — Hero, Header navigation, Primary CTA buttons, Scrollbar.
   - `Official Primary Accent Gold`: `#D8A84E` (`gold.DEFAULT` / `--color-accent-gold`) — Section accent divider lines, Logo accent, Badge borders.

2. **SECONDARY (Màu bổ trợ chuẩn hóa)**:
   - `Dark Slate Navy`: `#0F172A` (`navy.dark`) — Footer background, dark card borders, display title text.
   - `Dark Gold`: `#D97706` (`gold.dark`) — Accessible text labels, calendar icons, stat card values on light background (WCAG AA compliant).
   - `Light Gold`: `#F59E0B` (`gold.light`) — Button hover state gradients, glowing badge background.
   - `Warm Gold`: `#E5BC6E` (`gold.warm`) — Subtle text accents on dark backgrounds.

3. **LEGACY COMPATIBILITY**:
   - `Legacy Deep Navy`: `#063B7A` (`navy.deep` / `--color-navy-dark`) — Retained in Tailwind config strictly for backward compatibility with pre-existing code. FORBIDDEN for new UI unless technically required.

4. **FORBIDDEN FOR NEW CODE**:
   - Do NOT hardcode Hex color values in JSX or CSS for new code (e.g., `bg-[#073B78]`, `text-[#D8A84E]`).
   - New code MUST consume design tokens via Tailwind utility classes (e.g., `bg-navy`, `text-gold-dark`, `border-surface-border`).

Gold is an accent, not the dominant surface color.

---

# 8. TYPOGRAPHY

Desired feel:

- legal
- premium
- editorial
- professional

Recommended:

```text
Display / heading: serif or display-serif
Body: readable sans-serif
```

Hierarchy:

```text
H1
↓
Section heading
↓
Subheading
↓
Body
↓
Metadata
```

Use fluid sizing rather than many arbitrary breakpoints.

---

# 9. PROFILE / INTRODUCTION

Visual treatment:

- spacious
- editorial
- professional
- restrained
- clear heading hierarchy

Do not stretch long paragraphs across the full viewport.

Content comes from CMS.

---

# 10. EDUCATION

Education is dynamic.

Each item may contain:

- degree
- institution
- description
- display order
- visibility

Do not hard-code a fixed number of education records.

If cards are used:

- subtle border
- restrained radius
- minimal shadow
- navy heading
- gold accent

---

# 11. EXPERIENCE

Use a structured timeline or equivalent visual hierarchy consistent with the screenshot.

Each item may contain:

- period
- position
- organization
- description
- highlights
- display order
- visibility

Desktop can use a multi-column/timeline composition.

Mobile must become a clear single-column flow.

---

# 12. PRACTICE AREAS

Homepage Practice Areas:

- CMS-driven
- dynamic item count
- responsive grid
- professional iconography
- consistent card treatment
- no emoji icons

Suggested responsive behavior:

```text
Desktop → 3+ columns as appropriate
Tablet  → 2 columns
Mobile  → 1 column
```

Each Practice Area should provide a clear route to its public page when the page is enabled.

---

# 13. STATISTICS

Four CMS-editable values:

```text
800+
500+
10+
100%
```

Each card:

- value
- label
- consistent visual hierarchy
- responsive behavior

Admin can edit value/label/order/visibility.

Do not hard-code the numbers in the frontend.

---

# 14. LEGAL NEWS — HOMEPAGE

News is Core Product.

Homepage News section:

- follows screenshot visual language
- shows recent published articles
- uses reusable article cards
- has clear title/date/metadata where appropriate
- links to canonical article page
- must not show Draft/Hidden articles

The exact number of cards is a Design/Technical decision unless the screenshot/PRD fixes it.

---

# 15. CONSULTATION SECTION

The consultation form is a conversion component, not a generic contact form.

Required fields:

| Field | Required |
|---|---|
| Họ và tên | Yes |
| Số điện thoại | Yes |
| Email | No |
| Nội dung cần tư vấn | Yes |

UX rules:

- clear labels
- inline validation
- submit disabled/processing state as appropriate
- no confusing multi-step flow
- success feedback after server-confirmed save
- error feedback that explains what the user can do
- anti-spam should be invisible/low-friction where possible

The form must never claim success before the lead has been persisted successfully.

Email delivery failure should not make the saved lead disappear.

---

# 16. FOOTER

Footer follows screenshot direction.

Possible content:

- logo/brand
- contact information
- navigation
- Facebook
- Zalo
- copyright

Homepage social links MUST include Facebook and Zalo when configured/enabled.

Do not render a social channel with no valid configured destination.

---

# 17. SUBPAGE DESIGN SYSTEM

Customer did not provide screenshots for all subpages.

### Mandatory Terminology Lock:
All Phase 2 implementation and documentation strictly adhere to:

```text
1 Homepage (`/`)
+
4 Public Subpage Routes:
  1. /[menuSlug]                              (Menu Level 1 / Practice Area Category Listing)
  2. /[menuSlug]/[submenuSlug]                (Menu Level 2 / Practice Area Sub-Category)
  3. /[menuSlug]/[submenuSlug]/[articleSlug]  (Menu Level 3 / Legal Article Detail)
  4. /tim-kiem                                (Global Search Results)
+
2 Reusable Public UI Sections (NOT standalone subpages):
  1. Consultation Form Section                 (Embedded in Homepage & Article Detail)
  2. Related Articles Block                    (Embedded in Article Detail)
```

> Subpages MUST inherit the Homepage visual language, but must NOT be copied mechanically.

Shared system:

- same typography
- same Navy/Gold identity
- same container
- same spacing rhythm
- same card language
- same button language
- same header/footer
- same accessibility standard

---

# 18. PRACTICE AREA PAGE

Suggested structure:

```text
Header
↓
Breadcrumb
↓
Practice Area Title
↓
Short Description
↓
Search
↓
Article List
↓
Pagination
↓
Footer
```

States:

- default
- searching
- loading
- results
- empty
- error

Search must clearly communicate the current Practice Area context.

---

# 19. ARTICLE LIST CARD

Card should expose enough information to support scanning:

- title
- date
- excerpt/summary where available
- featured image where available
- Practice Area context where useful
- CTA/read link

Avoid excessive metadata.

---

# 20. SEARCH UX

Search applies to:

- title
- content

Scope:

- current Practice Area only

Requirements:

- clear input
- clear submit/search action
- preserve query on pagination
- refresh/shareable URL state where implemented
- empty state
- error state
- mobile-friendly controls

No advanced filters in this version.

---

# 21. PAGINATION UX

Pagination must:

- show current page
- expose previous/next when applicable
- disable impossible actions
- preserve search query
- preserve Practice Area context
- be usable by keyboard
- be responsive

Exact pagination style is a Design Decision; behavior is mandatory.

---

# 22. ARTICLE DETAIL

Suggested structure:

```text
Header
↓
Breadcrumb
↓
Article title
↓
Metadata
↓
Featured image
↓
Article content
↓
CTA / Consultation
↓
Social Share
↓
Related Articles
↓
Footer
```

CTA must lead to the configured consultation/contact path.

---

# 23. SOCIAL SHARE

Required:

- Facebook
- Zalo

Optional fallback:

- Copy Link / equivalent if useful and approved by implementation

Share must use the canonical public article URL.

Buttons must have accessible labels and not obscure article content on mobile.

---

# 24. RELATED ARTICLES

Visual block appears after article content.

Rules:

- related by shared Practice Area
- exclude current article
- Published only
- no duplicate article cards
- hide entire block if there are no valid results

Design should be compact and consistent with News cards.

---

# 25. ADMIN FORM UX

All Admin forms must have explicit:

- label
- required/optional indicator
- validation
- loading state
- success state
- error state
- unsaved-change awareness where applicable

Submit actions must use unambiguous labels such as:

```text
Lưu
Đang lưu...
Hủy
Xóa
Xác nhận
```

Do not silently submit or silently discard data.

---

# 26. ADMIN BRANDING UX

Admin should provide clear controls for:

- Logo
- Favicon
- Lawyer portrait

Each should show:

- current asset
- replace/select action
- preview
- alt text where relevant
- save state
- validation for unsupported files

---

# 27. PASSWORD CHANGE UX

Both Admin and SYSADMIN:

```text
Mật khẩu hiện tại
Mật khẩu mới
Xác nhận mật khẩu mới
[Đổi mật khẩu]
```

Rules:

- password values never displayed
- clear validation
- success feedback
- failure feedback
- no ambiguous success

---

# 28. ACCESSIBILITY

Required:

- semantic HTML
- heading hierarchy
- keyboard navigation
- visible focus
- accessible labels
- meaningful alt text
- adequate contrast
- minimum comfortable tap target
- no color-only state indicators

Admin ON/OFF controls must have explicit labels.

---

# 29. RESPONSIVE TARGETS

Test at minimum:

```text
375
390
412
768
1024
1280
1440
1920
```

Do not create unnecessary breakpoint fragmentation.

No:

- horizontal overflow
- clipped text
- distorted portrait
- inaccessible CTA
- broken cards
- unusable search/pagination

---

# 30. PERFORMANCE-AWARE DESIGN

- Optimize images.
- Prioritize hero image.
- Lazy-load appropriate below-fold media.
- Avoid heavy animation.
- Minimize unnecessary client JavaScript.
- Avoid unnecessary third-party scripts.

Performance debugging follows:

```text
Reproduce → Measure → Localize → Prove → Authorize → Regression test
```

---

# 31. VISUAL QA MATRIX

Antigravity must report:

| Area | Desktop | Tablet | Mobile | Screenshot/Design Match |
|---|---|---|---|---|
| Header | | | | |
| Hero | | | | |
| Profile | | | | |
| Education | | | | |
| Experience | | | | |
| Practice Areas | | | | |
| Statistics | | | | |
| News | | | | |
| Consultation | | | | |
| Footer | | | | |
| Practice Area page | | | | |
| Article list | | | | |
| Article detail | | | | |

No Visual QA PASS without actual inspection.

---

# 32. NON-NEGOTIABLE DESIGN RULES

Do not:

- replace the portrait with unrelated imagery
- change the visual identity into a generic law template
- hard-code editable content
- remove CMS behavior
- remove responsive behavior
- use emoji instead of professional icons
- add excessive animation
- add unapproved sections
- invent page content
- claim screenshot fidelity without comparison
