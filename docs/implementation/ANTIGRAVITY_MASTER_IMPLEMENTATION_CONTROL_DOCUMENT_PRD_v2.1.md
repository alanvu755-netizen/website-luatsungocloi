# ANTIGRAVITY MASTER IMPLEMENTATION CONTROL DOCUMENT
## Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi + AI Content Engine
### Dùng sau khi PRD v2.1 đã được Product Owner phê duyệt

**Document Type:** Implementation Control / Execution Standard  
**Baseline:** PRD v2.1 — Product Requirements Baseline  
**Vai trò:** Master instruction cho Antigravity trong toàn bộ quá trình thiết kế, triển khai, kiểm thử và nghiệm thu  
**Mục tiêu:** Triển khai đúng yêu cầu ngay từ đầu, giảm tối đa vòng lặp sửa sai, ngăn tự suy diễn và tạo evidence có thể kiểm chứng.

---

# 1. MỤC ĐÍCH VÀ NGUYÊN TẮC TỐI CAO

Antigravity phải coi tài liệu này cùng PRD v2.1 là **hợp đồng triển khai**, không phải tài liệu tham khảo.

Mục tiêu không phải chỉ là:
- code chạy;
- giao diện nhìn giống screenshot;
- build/deploy thành công.

Mục tiêu là:

> **Sản phẩm phải đúng Product Requirement + đúng UI/UX + đúng interaction/logic + đúng quyền + đúng data behavior + đúng responsive behavior + có evidence chứng minh.**

Antigravity **không được tự suy diễn Product Decision**.

Nếu một behavior chưa được quyết định:
- không tự chọn phương án;
- không tự thêm requirement;
- không tự bỏ requirement;
- không “làm theo best practice” nếu làm thay đổi business behavior;
- phải đánh dấu `UNRESOLVED` và hỏi Product Owner.

---

# 2. HỆ THỐNG THỨ BẬC QUYẾT ĐỊNH

Thứ tự ưu tiên:

1. Quyết định trực tiếp của Product Owner.
2. PRD v2.1.
3. Master Implementation Control Document này.
4. Các tài liệu specification đã được phê duyệt.
5. Architecture/technical constraints đã được LOCK/FROZEN.
6. Best practice kỹ thuật.

**Best practice không được phép ghi đè Product Decision.**

Nếu hai tài liệu mâu thuẫn:
- STOP phần bị ảnh hưởng;
- báo rõ conflict;
- chỉ tiếp tục sau khi được quyết định.

---

# 3. CÁC TRẠNG THÁI REQUIREMENT

Mỗi requirement phải thuộc một trong các trạng thái:

### LOCKED
Đã quyết định. Antigravity phải triển khai chính xác.

### FROZEN
Không được tự ý thay đổi.

### UNRESOLVED
Chưa có quyết định. Không được tự suy diễn.

### PROPOSED
Antigravity có thể đề xuất phương án nhưng **chưa được coi là requirement**.

### APPROVED
Phương án đề xuất đã được Product Owner chấp thuận và trở thành requirement.

---

# 4. NO-SILENT-DECISION POLICY

Antigravity tuyệt đối không được âm thầm quyết định các vấn đề như:

- business logic;
- validation;
- required/optional field;
- trạng thái dữ liệu;
- quyền người dùng;
- navigation behavior;
- CTA behavior;
- email behavior;
- AI behavior;
- database behavior;
- deletion behavior;
- search behavior;
- pagination behavior;
- upload behavior;
- error handling;
- security behavior.

Nếu thiếu quyết định:

```text
QUESTION
→ CONTEXT
→ OPTIONS
→ RECOMMENDATION (nếu có)
→ WAIT FOR APPROVAL
→ IMPLEMENT
```

Không được:

```text
QUESTION
→ TỰ CHỌN
→ CODE
→ BÁO ĐÃ XONG
```

---

# 5. QUY TRÌNH TRIỂN KHAI BẮT BUỘC

Không triển khai toàn bộ dự án trong một lần.

Phải đi theo Gate:

```text
PRD
 ↓
REPOSITORY AUDIT
 ↓
REQUIREMENT DECOMPOSITION
 ↓
USER FLOW / UX LOGIC
 ↓
UI SPECIFICATION
 ↓
DATA & COMPONENT CONTRACT
 ↓
IMPLEMENTATION PLAN
 ↓
UI IMPLEMENTATION
 ↓
UI/UX VERIFICATION
 ↓
BACKEND IMPLEMENTATION
 ↓
INTEGRATION
 ↓
TESTING
 ↓
SECURITY / SEO / PERFORMANCE AUDIT
 ↓
ACCEPTANCE
 ↓
DEPLOYMENT
```

Mỗi Gate phải có:
- output;
- evidence;
- status;
- known issues;
- next gate.

Không có evidence thì không được đánh dấu `COMPLETED`.

---

# 6. PHASE 0 — REPOSITORY AUDIT READ-ONLY

Trước khi code, Antigravity phải audit repository hiện tại.

Không sửa code trong phase này.

Phải kiểm tra tối thiểu:

- framework;
- routes;
- layouts;
- components;
- current Homepage;
- Header/Footer;
- Admin;
- authentication;
- authorization;
- Prisma;
- database schema;
- existing API;
- AI Content Engine;
- media/assets;
- logo;
- favicon;
- SEO;
- metadata;
- sitemap;
- robots;
- existing article system;
- existing forms;
- email integration;
- dependencies;
- deployment configuration;
- environment variables;
- existing tests;
- reusable components.

Output bắt buộc:

`IMPLEMENTATION_BASELINE_AUDIT.md`

Phải phân loại:

| Item | Current State | Keep | Modify | Replace | New | Risk |
|---|---|---|---|---|---|---|

Không được tự ý refactor trong Audit.

---

# 7. PHASE 1 — REQUIREMENT DECOMPOSITION

Từ PRD, Antigravity phải tạo requirement matrix.

Mỗi requirement phải có:

| ID | Requirement | Actor | Trigger | Expected Behavior | Data | Permission | Acceptance |
|---|---|---|---|---|---|---|---|

Không được bỏ qua requirement chỉ vì nó không phải UI.

Đặc biệt phải tách:

- visual requirement;
- interaction requirement;
- business logic;
- validation;
- data persistence;
- notification;
- authorization;
- error behavior;
- SEO;
- accessibility;
- responsive.

---

# 8. UI/UX — SCREENSHOT KHÔNG PHẢI LÀ TOÀN BỘ SPEC

Screenshot chỉ xác định những gì nhìn thấy.

Antigravity phải chuyển screenshot thành UI/UX specification.

Phải xác định:

### Visual
- layout;
- grid;
- spacing;
- typography;
- hierarchy;
- image ratio;
- button style;
- card;
- colors;
- borders;
- radius;
- icons.

### Responsive
- desktop;
- tablet;
- mobile;
- breakpoint behavior;
- menu behavior;
- stacking;
- image behavior;
- text truncation.

### Interaction
- hover;
- focus;
- active;
- disabled;
- loading;
- success;
- error;
- empty;
- validation;
- modal/drawer nếu có;
- keyboard behavior.

### Content
- heading;
- CTA;
- labels;
- placeholder;
- helper text;
- error message;
- empty state.

Không được chỉ làm happy-path UI.

---

# 9. UI-FIRST RULE

Với feature có UI, phải xác định UI/UX flow trước khi triển khai backend tương ứng.

Flow:

```text
User Goal
 ↓
User Flow
 ↓
Screen
 ↓
Component
 ↓
Interaction
 ↓
State
 ↓
Data Contract
 ↓
Backend
```

Không được xây backend một cách tách rời rồi sau đó ép UI vào.

Tuy nhiên UI-first không có nghĩa là frontend và backend tách hoàn toàn.

**Data contract phải được xác định trước khi implementation để hai phía khớp nhau.**

---

# 10. FORM LOGIC — PHẢI MÔ TẢ TRƯỚC KHI CODE

Mọi form phải có specification rõ ràng.

Ví dụ Form Đăng ký tư vấn:

| Field | Required | Validation | Submit Behavior |
|---|---:|---|---|
| Họ tên | Theo PRD | Theo PRD | Không hợp lệ → không submit |
| Số điện thoại | **YES** | Validate phone | Thiếu/sai → báo lỗi |
| Email | **NO** | Nếu nhập thì validate email | Bỏ trống vẫn submit |
| Nội dung | Theo PRD | Theo PRD | Theo validation |

Behavior bắt buộc phải được mô tả cho:

1. Initial state.
2. User nhập dữ liệu.
3. Validation.
4. Invalid state.
5. Valid state.
6. Submit.
7. Loading.
8. Double click / duplicate submit.
9. Success.
10. Server error.
11. Network error.
12. Notification error.
13. Reset/continue behavior.

Ví dụ:

```text
User Submit
 ↓
Client Validation
 ↓
Invalid?
 ├─ YES → Show field errors → STOP
 └─ NO
      ↓
Submitting state
      ↓
Persist data
      ↓
Send Admin Email
      ↓
Success state
```

Nếu có failure ở bất kỳ bước nào, behavior phải được quy định trước.

---

# 11. FORM UX — DỄ DÙNG LÀ REQUIREMENT

Không được coi usability là phần “tự Antigravity tối ưu”.

Phải kiểm tra:

- label rõ ràng;
- required indicator;
- placeholder phù hợp;
- lỗi nằm gần field;
- lỗi dễ hiểu;
- không mất dữ liệu đã nhập khi lỗi;
- button có trạng thái submitting;
- chống submit nhiều lần;
- mobile-friendly;
- keyboard-friendly;
- focus rõ;
- success feedback rõ.

Không dùng thông báo kỹ thuật cho người dùng cuối.

Ví dụ không hiển thị:

`PrismaClientKnownRequestError`

Phải chuyển thành UX message phù hợp.

---

# 12. ADMIN / SYSADMIN AUTHORIZATION

Phân quyền phải được định nghĩa bằng matrix, không suy diễn.

Baseline:

| Capability | Admin | Sysadmin |
|---|---:|---:|
| Content management | YES | YES |
| Article management | YES | YES |
| Category/field management | YES | YES |
| Consultation data | YES | YES |
| Logo/Favicon | YES | YES |
| Social links | YES | YES |
| Change own password | YES | YES |
| AI Provider configuration | **NO** | **YES** |
| System administration | **NO** | **YES** |

Mọi endpoint/server action/API liên quan permission phải enforce authorization ở server-side.

Không chỉ ẩn button trên UI.

---

# 13. AI CONTENT ENGINE

AI chỉ thực hiện những gì PRD đã quyết định.

Baseline:

Khi Admin tạo bài viết, AI hỗ trợ:

- Tiêu đề;
- Nội dung bài viết;
- Tóm tắt;
- SEO Title;
- SEO Description;
- Keywords;
- Gợi ý cấu trúc bài;
- CTA.

Input chính:

> Admin mô tả các gạch đầu dòng / điểm chính của bài viết.

Không tự mở rộng thành:
- AI Content Studio;
- Ideas;
- Calendar;
- Bulk generation;
- Rewrite;
- Edit Article;
- các workflow AI khác,

nếu PRD chưa yêu cầu.

AI Provider configuration thuộc **Sysadmin**.

---

# 14. CMS CONTENT MODEL

Mọi nội dung CMS phải xác định:

- owner;
- field;
- required/optional;
- type;
- validation;
- slug;
- publish state;
- SEO;
- relation;
- display location;
- editing permission.

Đặc biệt:

### Article ↔ Field/Category

Một bài viết **có thể thuộc nhiều lĩnh vực**.

Admin/User lựa chọn các lĩnh vực phù hợp.

Trang lĩnh vực:
- hiển thị danh sách bài viết;
- pagination;
- search theo **tiêu đề + nội dung**;
- search chỉ trong lĩnh vực đang xem;
- related articles ở trang chi tiết.

---

# 15. ARTICLE DETAIL UX

Trang chi tiết bài viết phải có:

- title;
- metadata cần thiết;
- content;
- SEO;
- CTA liên hệ/đăng ký tư vấn;
- share Facebook;
- share Zalo;
- bài viết liên quan.

Share action phải được kiểm tra trên desktop và mobile.

CTA phải dẫn đến flow đã được PRD quy định, không tự tạo behavior khác.

---

# 16. HOMEPAGE

Homepage phải bám screenshot đã được Product Owner xác nhận là **toàn bộ Homepage**.

Ngoài visual, phải map từng section với:

- content source;
- CMS field;
- CTA;
- link;
- image;
- responsive behavior.

Các số liệu:

`800+ / 500+ / 10+ / 100%`

là **CMS editable**.

Header/menu:
- menu là các trang riêng;
- Admin có thể bật/tắt menu theo requirement.

Homepage phải có link:
- Facebook;
- Zalo.

Các social URL phải là cấu hình quản trị, không hard-code nếu PRD yêu cầu CMS.

---

# 17. BRAND ASSETS

Phải tách và quản lý:

- Logo;
- Favicon;
- ảnh Luật sư;
- các asset cần thiết khác.

Admin có giao diện để thay:
- Logo;
- Favicon.

Upload phải có:
- file validation;
- preview;
- error state;
- save state;
- permission check.

Không thay asset bằng cách sửa source code nếu CMS đã được yêu cầu.

---

# 18. SEARCH

Search bài viết trong từng lĩnh vực:

```text
Current Field
   ↓
Search Query
   ↓
Search title OR content
   ↓
Results within current field only
```

Phải định nghĩa:
- empty query;
- no result;
- special characters;
- pagination;
- reset search;
- mobile UX;
- loading;
- error.

Không được tự mở rộng search sang toàn website nếu PRD chưa yêu cầu.

---

# 19. PAGINATION

Mỗi lĩnh vực có danh sách bài viết và pagination.

Phải xác định:

- page size;
- first page;
- last page;
- next;
- previous;
- empty;
- search + pagination interaction;
- URL behavior;
- refresh behavior;
- mobile behavior.

Không để implementation tạo ra pagination UX không nhất quán.

---

# 20. EMAIL NOTIFICATION

Form tư vấn:

```text
User submits
 ↓
Validate
 ↓
Persist
 ↓
Notify configured Admin email
 ↓
Show success
```

Email Admin được cấu hình bởi Admin theo PRD.

Phải xử lý riêng:
- database success + email success;
- database success + email failure;
- database failure;
- network failure.

Không được tự suy luận rằng email failure đồng nghĩa database failure.

Behavior cuối cùng phải tuân theo approved specification.

---

# 21. SECURITY

Không được đánh giá security chỉ bằng UI.

Phải kiểm tra:

- authentication;
- authorization;
- server-side permission;
- input validation;
- upload validation;
- injection;
- unsafe HTML;
- XSS;
- CSRF nếu applicable;
- rate limiting / anti-spam;
- secret exposure;
- API access;
- unauthorized mutation;
- password change flow;
- session handling.

Anti-spam cho consultation form là requirement.

---

# 22. SEO

Article system phải hỗ trợ SEO theo PRD.

Kiểm tra tối thiểu:

- title;
- meta description;
- canonical;
- slug;
- Open Graph;
- structured data nếu được yêu cầu;
- sitemap;
- robots;
- indexing behavior;
- article URL;
- pagination/search indexing behavior.

Không tự thêm SEO behavior làm thay đổi product behavior nếu chưa được phê duyệt.

---

# 23. PERFORMANCE

Không tối ưu mù quáng.

Trước khi tối ưu phải có measurement.

Không được tự ý:
- đổi architecture;
- đổi database connection;
- đổi region;
- thêm cache;
- thay data fetching;
- refactor lớn

chỉ vì “best practice”.

Nếu performance issue xuất hiện:

```text
REPRODUCE
 ↓
MEASURE
 ↓
LOCATE
 ↓
PROVE
 ↓
PROPOSE
 ↓
APPROVE
 ↓
CHANGE
 ↓
RE-MEASURE
```

Không có evidence → không gọi là root cause.

---

# 24. NO-CODE-CHANGE / FROZEN AREA

Nếu một thành phần được đánh dấu `FROZEN` hoặc `LOCKED`:

Antigravity không được sửa nếu chưa có explicit approval.

Nếu implementation mới phụ thuộc vào frozen component và phát hiện conflict:

```text
STOP
→ REPORT CONFLICT
→ IMPACT
→ PROPOSE OPTIONS
→ WAIT
```

---

# 25. ACCEPTANCE CRITERIA

Mỗi feature phải có acceptance criteria trước khi được đánh dấu hoàn thành.

Format:

```text
Given
When
Then
```

Ví dụ:

```text
Given user đang ở trang lĩnh vực Đất đai
When user tìm kiếm "hợp đồng"
Then hệ thống chỉ trả về bài viết thuộc lĩnh vực Đất đai
và query được tìm trong title + content.
```

---

# 26. EVIDENCE-FIRST REPORTING

Antigravity phải chứng minh:

- screenshot;
- route;
- test result;
- network evidence khi relevant;
- console sạch;
- responsive evidence;
- permission evidence;
- database evidence khi relevant;
- email evidence khi relevant.

Không báo:

> “Đã test và OK.”

Phải báo:

> Test case → Expected → Actual → Evidence → PASS/FAIL.

---

# 27. DEFINITION OF DONE

Một feature chỉ `DONE` khi:

- requirement implemented;
- UI đúng;
- UX đúng;
- logic đúng;
- validation đúng;
- permission đúng;
- responsive đúng;
- error state đúng;
- loading state đúng;
- empty state đúng;
- data persistence đúng;
- integration đúng;
- test PASS;
- evidence có;
- không có known critical issue.

`Code compiles` **không đồng nghĩa** `DONE`.

---

# 28. GATE CONTROL

Mỗi phase kết thúc bằng một Gate.

Antigravity phải báo:

```text
PHASE:
STATUS:

COMPLETED:
1.
2.
3.

NOT COMPLETED:
1.

ISSUES:
1.

DECISIONS REQUIRED:
1.

EVIDENCE:
1.

RECOMMENDATION:
1.

NEXT GATE:
```

Không tự chuyển Gate nếu còn blocker.

---

# 29. PRODUCT OWNER / MONITORING & CONTROLLING

Vai trò:

### Product Owner
Người quyết định:
- business;
- UX preference;
- unresolved requirements;
- scope;
- acceptance.

### ChatGPT / Project Controller
Hỗ trợ:
- phân tích;
- kiểm tra requirement;
- phát hiện gap;
- kiểm soát logic;
- review evidence;
- kiểm tra consistency;
- tạo test/acceptance framework.

### Antigravity
Chịu trách nhiệm:
- repository inspection;
- implementation;
- testing;
- evidence;
- reporting.

Antigravity không được tự trở thành Product Owner.

---

# 30. MASTER RULE

Luôn nhớ:

> **DO NOT GUESS.**
>
> **DO NOT SILENTLY DECIDE.**
>
> **DO NOT IMPLEMENT UNRESOLVED REQUIREMENTS.**
>
> **DO NOT MARK DONE WITHOUT EVIDENCE.**
>
> **DO NOT CHANGE LOCKED/FROZEN ARCHITECTURE WITHOUT APPROVAL.**
>
> **UI IS NOT COMPLETE WITHOUT UX BEHAVIOR.**
>
> **A FORM IS NOT COMPLETE WITHOUT VALIDATION + LOADING + SUCCESS + ERROR STATES.**
>
> **A FEATURE IS NOT COMPLETE BECAUSE THE CODE COMPILES.**
>
> **PRODUCT REQUIREMENTS HAVE PRIORITY OVER ENGINEERING PREFERENCE.**

---

# 31. FINAL EXECUTION COMMAND TO ANTIGRAVITY

Bắt đầu dự án bằng:

## PHASE 0 — READ-ONLY REPOSITORY AUDIT

**KHÔNG CODE.  
KHÔNG REFACTOR.  
KHÔNG DEPLOY.**

Đọc:
1. PRD v2.1.
2. Master Implementation Control Document này.
3. Repository hiện tại.
4. Các architecture/specification document đã được approved.

Sau đó tạo:

`IMPLEMENTATION_BASELINE_AUDIT.md`

và báo cáo:

1. Current architecture.
2. Existing reusable components.
3. Existing functionality.
4. Existing database/schema.
5. Existing Admin/Sysadmin.
6. Existing AI architecture.
7. Existing assets.
8. Existing routes.
9. What will be preserved.
10. What must change.
11. What must be built.
12. Risks.
13. Conflicts with PRD.
14. Questions requiring Product Owner decision.

**Không được bắt đầu coding cho đến khi Phase 0 được review và Gate tiếp theo được mở.**

---

# 32. FINAL SUCCESS CRITERIA

Mục tiêu của tài liệu này là biến quá trình:

```text
PRD
→ Antigravity tự hiểu
→ code
→ phát hiện sai
→ hỏi lại
→ sửa
→ phát hiện sai tiếp
→ sửa tiếp
```

thành:

```text
PRD
→ Decompose
→ Explicit UX/Logic
→ Lock Decisions
→ Audit
→ Plan
→ Implement
→ Verify
→ Evidence
→ Gate
→ Next Phase
```

**Mục tiêu cuối cùng: giảm tối đa rework, giảm số lần phải yêu cầu lại, bảo đảm Antigravity hiểu đúng ngay từ đầu và tạo ra sản phẩm hoàn chỉnh, dễ dùng, đúng logic và có thể nghiệm thu.**
