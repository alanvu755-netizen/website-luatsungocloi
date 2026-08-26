# NGOCLOI — PRD v2.1 DOCUMENT SET

## Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi + AI Content Engine

**Project ID:** NGOCLOI  
**Product:** `luatsungocloi.vn`  
**Baseline:** PRD v2.1

---

## IMPORTANT PROJECT IDENTITY

This document set belongs ONLY to the Ngọc Lợi website.

**DO NOT MIX WITH PROFITCAL.**

Do not copy architecture, business rules, schema, terminology, or implementation decisions from ProfitCal into this project.

---

## DOCUMENTS

1. `TECHNICAL_SPECIFICATION_PRD_v2.1.md`
2. `DESIGN_SPECIFICATION_PRD_v2.1.md`
3. `AI_ADDON_SECURITY_SPECIFICATION_PRD_v2.1.md`
4. `AI_CONTENT_ENGINE_SPECIFICATION_PRD_v2.1.md`
5. `IMPLEMENTATION_PLAN_PRD_v2.1.md`
6. `ACCEPTANCE_TEST_MATRIX_PRD_v2.1.md`
7. `MASTER_IMPLEMENTATION_CONTROL_PRD_v2.1.md`
8. `README.md`

Primary Product Source of Truth:

`PRD_v2.1_Product_Requirements_Baseline_Luat_Su_Le_Thi_Ngoc_Loi_FINAL.md`

---

## CURRENT PROJECT STATUS

Phase 0: completed  
Phase 1: completed with controls  
Phase 2: NOT AUTHORIZED until explicit PO approval.

These documents are prepared for review and baseline freeze.

---

## CORE PRODUCT LOCKS

- New Homepage follows customer screenshot.
- Screenshot is the complete Homepage.
- Header/menu is CMS-manageable.
- Statistics are CMS-editable.
- Practice Areas are CMS-managed.
- Each Practice Area has article listing.
- Article listing has pagination.
- Search covers title + content within current Practice Area.
- One article can belong to multiple Practice Areas.
- Article detail has consultation CTA.
- Article detail supports Facebook + Zalo sharing.
- Related Articles are supported.
- Consultation form saves leads.
- Phone is required; email is optional.
- Admin receives email notification.
- Admin does not manage lead status workflow.
- Anti-spam is required.
- Logo/favicon/lawyer portrait are replaceable through Admin.
- Admin and SYSADMIN can change their own password.
- Admin cannot configure AI Provider.
- SYSADMIN can configure AI Provider.
- AI is limited to Create Article.
- AI outputs Draft only.
- AI supports all approved article/SEO/CTA outputs.
- SEO is Core Product.
- Performance changes require evidence before authorization.

---

## REVIEW RULE

Do not start coding from this ZIP until the Product Owner reviews and freezes the documents.
