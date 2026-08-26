# PHASE 2 — ADMIN V2 CONTENT MANAGEMENT MASTER MATRIX

**PROJECT**: Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi + AI Content Engine  
**BASELINE**: PRD v2.1 Baseline + Architecture Locks  
**AUDIT MODE**: 100% READ-ONLY AUDIT  
**DATE**: 2026-08-26  

---

## MASTER DECISION MATRIX TABLE

| # | Current Display Name | Recommended V2 Name | Route | Purpose | Public Content Controlled | DB Model | V1/V2 | CRUD | Visibility Control | Ordering Control | Public Traceability | Test Coverage | Master Decision |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | **Bảng điều khiển** | **Bảng điều khiển** | `/admin/dashboard` | CMS Overview & Add-on Status | Overview Metrics | `Site`, `AddOn` | V2 | Read | N/A | N/A | **PASS** | `step4-cms-admin` | `KEEP` |
| **2** | **Yêu cầu tư vấn** | **Khách hàng đăng ký tư vấn** | `/admin/consultations` | Lead Capture Table | Consultation Form Submissions | `ConsultationLead` | V2 | Read/Del | N/A | N/A | **PASS** | `step3-services` | `RENAME` |
| **3** | **Menu & Chuyên mục** | **Chuyên mục Thư viện Pháp luật** | `/admin/menus` | Header Legal Library Taxonomy | Navbar Menus & Submenus | `Menu`, `Submenu` | V2 | Full | **YES (`status`)** | Yes (`displayOrder`) | **PASS** | `content-cms` | `RENAME` |
| **4** | **Bài viết (Articles)** | **Tất cả bài viết** | `/admin/articles` | Legal Articles List & Search | Article Cards & Detail Pages | `Article` | V1/V2 | Full | **YES (`DRAFT/PUB`)**| N/A | **PASS** | `step3-services` | `KEEP` |
| **5** | **Tạo bài viết mới** | **Viết bài mới + AI Assistant** | `/admin/articles/create` | Article Creation Form | New Article Content | `Article` | V2 | Create | **YES** | N/A | **PASS** | `step4-cms-admin` | `KEEP` |
| **6** | **Chỉnh sửa bài viết**| **Chỉnh sửa bài viết** | `/admin/articles/[id]/edit` | Article Editor & Junction Sync| Article Page & N-N Tags | `Article`, Junction | V2 | Update | **YES** | N/A | **PASS** | `step4-cms-admin` | `KEEP` |
| **7** | **Chỉ số nổi bật** | **Chỉ số nổi bật (Stats)** | `/admin/statistics` | Achievements CMS | Homepage 4 Stat Badges | `StatisticItem` | V1/V2 | Full | **YES (`status`)** | Yes (`displayOrder`) | **PASS** | `step5-homepage` | `MERGE / GROUP` |
| **8** | **Ảnh trang chủ & Hero**| **Ảnh trang chủ & Banner Hero**| `/admin/hero` | Banner Photo & Title CMS | Hero Portrait & Lawyer Name | `Hero` | V1/V2 | Edit | **YES (`status`)** | N/A | **PASS** | `content-cms` | `UPGRADE & GROUP`|
| **9** | **Giới thiệu** | **Giới thiệu & Tiểu sử** | `/admin/introduction` | Lawyer Bio Overview | Homepage & Bio Summary | `LawyerProfile` | V1/V2 | Edit | **YES (`status`)** | N/A | **PASS** | `step3-services` | `MERGE / GROUP` |
| **10**| **Học vấn** | **Học vấn & Bằng cấp** | `/admin/education` | Academic Qualifications | Academic Degrees List | `Education` | V1/V2 | Full | **YES (`status`)** | Yes (`displayOrder`) | **PASS** | `step3-services` | `MERGE / GROUP` |
| **11**| **Kinh nghiệm công tác**| **Kinh nghiệm công tác** | `/admin/experience` | Career History CMS | Work History List | `Experience` | V1/V2 | Full | **YES (`status`)** | Yes (`displayOrder`) | **PASS** | `step3-services` | `MERGE / GROUP` |
| **12**| **Lĩnh vực hoạt động** | **Chuyên khoa / Lĩnh vực tư vấn**| `/admin/practice-areas` | Practice Specialty Cards | Homepage 6 Practice Cards | `PracticeArea` | V1/V2 | Full | **YES (`status`)** | Yes (`displayOrder`) | **PASS** | `step3-services` | `RENAME` |
| **13**| **Cam kết / Thông điệp**| **Cam kết & Thông điệp** | `/admin/commitment` | Core Values CMS | Homepage Commitment Card | `CommitmentItem` | V1/V2 | Edit | **YES (`status`)** | N/A | **PASS** | `step3-services` | `MERGE / GROUP` |
| **14**| **Kênh liên hệ (Zalo/FB)**| **Kênh liên hệ (Zalo, FB, Hotline)**| `/admin/contact` | Floating Contact Widgets | Topbar & Floating Buttons | `ContactChannel` | V1/V2 | Full | **YES (`status`)** | Yes (`displayOrder`) | **PASS** | `contact-channel`| `MERGE / GROUP` |
| **15**| **Thư viện ảnh** | **Thư viện hình ảnh** | `/admin/media` | Media Assets Management | Public Images Library | `Media` | V2 | Full | N/A | N/A | **PASS** | Prisma Model | `KEEP` |
| **16**| **Cấu hình SEO** | **Cấu hình SEO Website** | `/admin/seo` | SEO Metadata | Meta Title & Description | `SiteSettings` | V2 | Edit | N/A | N/A | **PASS** | `acceptance.test` | `MERGE / GROUP` |
| **17**| **Cài đặt website** | **Cài đặt chung & Email thông báo**| `/admin/settings` | Notification Email & Info | Footer Contact Info & Email | `SiteSettings` | V2 | Edit | N/A | N/A | **PASS** | `step4-cms-admin` | `MERGE / GROUP` |
| **18**| **AI Provider (SYSADMIN)**| **Nhà cung cấp AI & Kill Switch**| `/admin/ai-provider` | SYSADMIN API Key & Switch | AI Generation Engine | `AIProvider` | V2 New | Edit | **YES (`status`)** | N/A | **PASS** | `step4-cms-admin` | `KEEP` (Sysadmin) |
| **19**| **AI Content Studio** | **AI Content Studio (Trợ lý AI)**| `/admin/ai-content` | Standalone AI Draft Studio | Article Draft Generation | `AIGeneration` | V2 New | Create | N/A | N/A | **PASS** | `step8-ai-eng` | `MISSING — MUST ADD LINK`|
