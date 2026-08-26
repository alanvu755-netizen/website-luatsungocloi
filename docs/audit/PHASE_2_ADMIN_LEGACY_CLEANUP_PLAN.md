# PHASE 2 — ADMIN LEGACY CLEANUP PLAN

**AUTHORITY**: PO DIRECTIVE — AUDIT ONLY  
**STATUS**: PLAN ONLY (NO CLEANUP EXECUTED IN THIS STEP)  
**DATE**: 2026-08-26  

> [!IMPORTANT]  
> THIS DOCUMENT IS A PLAN ONLY. ZERO CODE HAS BEEN DELETED OR MODIFIED DURING THIS STEP.

---

## 1. Cleanup Overview & Reconnaissance Findings

The reconciliation audit [`docs/audit/PHASE_2_ADMIN_ARCHITECTURE_RECONCILIATION_AUDIT.md`](file:///Users/thiemvv/Documents/website-luat/docs/audit/PHASE_2_ADMIN_ARCHITECTURE_RECONCILIATION_AUDIT.md) verified that:

1. All **19 Admin screens** under `app/admin/(protected)/` and `app/admin/login/` are **100% CANONICAL**.
2. All **9 Admin API Endpoints** under `app/api/admin/` are **100% CANONICAL**.
3. All **15 Backend Services** under `lib/services/` are **100% CANONICAL**.
4. **Zero dead, orphaned, or obsolete legacy files** exist in the repository.

Therefore, the cleanup execution plan focuses on **Navigation Alignment & Maintenance Standards**.

---

## 2. 7-Phase Execution Plan

### Phase 1: Navigation Alignment
- Add `/admin/ai-content` (AI Content Studio) to the `NỘI DUNG CONTENT CMS` sidebar group in [`app/admin/(protected)/layout.tsx`](file:///Users/thiemvv/Documents/website-luat/app/admin/%28protected%29/layout.tsx).
- Ensure mobile navigation links match sidebar navigation links 100%.

### Phase 2: Reference & Imports Migration
- Verify all relative import paths in `app/admin/` use clean `@/` root aliases.

### Phase 3: File Removal (Legacy Code Deletion)
- *Finding*: Audit verified **0 legacy files** to delete. No files will be removed.

### Phase 4: Test Suite Reconciliation
- Retain all 67 Vitest test cases across 11 test files (`pnpm test`).
- Ensure test coverage remains 100% green without test deletions.

### Phase 5: Automated Regression Testing
- Execute full test suite: `pnpm test`.
- Verify all 67 unit/E2E test cases pass cleanly.

### Phase 6: Production Build Verification
- Execute production compilation: `pnpm build`.
- Verify all 41 static/ISR pages compile with 0 errors.

### Phase 7: Independent Read-Only Post-Cleanup Audit
- Issue final audit report confirming navigation alignment and zero regression.

---

## 3. Execution Control

```text
STATUS: PLAN ONLY
ACTION: NO CLEANUP EXECUTED
NEXT STEP: WAITING FOR PRODUCT OWNER APPROVAL
```
