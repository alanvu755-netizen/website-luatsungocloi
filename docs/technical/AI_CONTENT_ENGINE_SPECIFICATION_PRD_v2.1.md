# AI CONTENT ENGINE SPECIFICATION — PRD v2.1
## Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi

**Project Identity:** NGOCLOI  
**Version:** 2.1  
**Status:** Review Draft — NOT AUTHORIZED FOR CODE

---

# 1. PRODUCT ROLE

AI is a writing assistant inside the existing Article Creation workflow.

It is NOT a separate AI product surface.

---

# 2. USER FLOW

```text
Admin
  ↓
Tin tức pháp luật
  ↓
Thêm bài viết
  ↓
Nhập các gạch đầu dòng / ý chính
  ↓
AI hỗ trợ tạo nội dung
  ↓
Draft được điền vào form
  ↓
Admin đọc / sửa
  ↓
Lưu / Preview
  ↓
Publish khi con người quyết định
```

---

# 3. INPUT

Primary input:

- bullet points
- key facts
- intended topic
- selected Practice Areas where applicable

The UI should make it easy for a non-technical Admin to describe the desired article.

Do not require the user to write a complicated prompt.

---

# 4. AI OUTPUT CONTRACT

The generation result should support:

```text
Title
Summary
Content
SEO Title
SEO Description
Keywords
Suggested Structure
CTA
```

The UI may expose these as editable fields.

AI should return structured output that can be mapped deterministically to the article form.

---

# 5. DRAFT CONTRACT

AI generation does not equal publishing.

```text
GENERATED → DRAFT
```

The user must be able to edit every generated field before publication.

If generation partially fails, the system must not silently overwrite existing user-entered content.

---

# 6. UX STATES

The AI control must explicitly support:

### Idle
`Tạo nội dung bằng AI`

### Loading
`Đang tạo nội dung...`

### Success
Generated fields populated as Draft.

### Validation error
Explain what input is missing.

### Provider/system error
Explain that generation could not be completed and preserve user input.

### Unauthorized
Show permission/access error without exposing system secrets.

---

# 7. USER CONTROL

The user controls:

- whether to invoke AI
- whether to accept generated text
- edits
- save
- preview
- publish

AI does not control publication.

---

# 8. LEGAL CONTENT SAFETY

Generation policy must explicitly prohibit:

- invented legal credentials
- invented case outcomes
- invented clients
- invented awards
- invented professional history
- guaranteed results
- unsupported legal claims presented as verified facts

When a fact cannot be verified:

`[CẦN XÁC NHẬN]`

AI is not a substitute for legal professional judgment.

---

# 9. VERIFIED PROJECT FACTS

Use only approved facts from project source documents.

Current approved profile source includes:

- Luật sư – Thạc sĩ Lê Thị Ngọc Lợi
- Cử nhân Luật — Đại học Cần Thơ
- Thạc sĩ Luật — Đại học Luật Thành phố Hồ Chí Minh
- professional experience information that has been confirmed by the project source

Any unconfirmed item remains explicitly marked for confirmation.

---

# 10. AI PROVIDER

Initial provider:

**Gemini**

The content-generation feature must call a server-side provider abstraction.

No Gemini API key in client-side code.

---

# 11. MODEL CONFIGURATION

Model name must not be hard-coded into the public UI.

SYSADMIN controls approved provider/model configuration.

Admin uses the currently approved model without seeing provider secrets.

---

# 12. FAILURE SAFETY

If AI fails:

- preserve user bullet points
- do not lose typed content
- do not publish
- show actionable error
- allow manual article creation

AI is an enhancement, not a dependency for saving a normal article.

---

# 13. PERFORMANCE

Do not block normal CMS navigation unnecessarily.

Generation can show a dedicated loading state.

Do not introduce streaming/complex async infrastructure unless it materially improves UX and is approved in Technical Specification.

---

# 14. ACCEPTANCE TESTS

AT-AI-01: Admin can open Create Article.

AT-AI-02: Admin can enter bullet points.

AT-AI-03: AI action generates all approved output categories.

AT-AI-04: Generated result is Draft.

AT-AI-05: Admin can edit generated content.

AT-AI-06: AI cannot publish automatically.

AT-AI-07: Admin cannot access Provider configuration.

AT-AI-08: SYSADMIN can access Provider configuration.

AT-AI-09: AI failure preserves user input.

AT-AI-10: No secret is exposed to browser.

AT-AI-11: Prohibited factual invention policy is applied.

AT-AI-12: Public site never renders Draft content.
