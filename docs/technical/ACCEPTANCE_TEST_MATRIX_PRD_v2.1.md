# ACCEPTANCE TEST MATRIX — PRD v2.1
## Website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi

**Project Identity:** NGOCLOI  
**Version:** 2.1  
**Status:** Review Draft — NOT AUTHORIZED FOR FINAL ACCEPTANCE

---

# 1. TEST STATUS RULE

Allowed states:

`NOT RUN` / `PASS` / `FAIL` / `BLOCKED`

Antigravity MUST provide evidence for PASS.

---

# 2. HOMEPAGE

| ID | Scenario | Expected |
|---|---|---|
| HP-01 | Open Homepage | Correct screenshot-based structure renders |
| HP-02 | Header | Correct menu structure renders |
| HP-03 | Hero | Portrait/text/visual hierarchy correct |
| HP-04 | Profile | CMS content renders |
| HP-05 | Education | Dynamic records render |
| HP-06 | Experience | Dynamic records render |
| HP-07 | Practice Areas | CMS records render |
| HP-08 | Statistics | Four editable values render |
| HP-09 | News | Published articles render |
| HP-10 | Consultation | Form renders correctly |
| HP-11 | Footer | Contact/footer renders |
| HP-12 | Social | Facebook + Zalo links work when configured |
| HP-13 | Mobile | No horizontal overflow |
| HP-14 | Branding | CMS logo/favicon/portrait are used |

---

# 3. NAVIGATION

| ID | Scenario | Expected |
|---|---|---|
| NAV-01 | Admin disables menu | Menu disappears publicly |
| NAV-02 | Admin reorders menu | Public order changes |
| NAV-03 | Click menu | Correct page opens |
| NAV-04 | Mobile menu | No overflow; keyboard/tap usable |
| NAV-05 | Disabled route | Not exposed through navigation |

---

# 4. PRACTICE AREAS

| ID | Scenario | Expected |
|---|---|---|
| PA-01 | Create area | Area appears when active |
| PA-02 | Edit area | Public content updates |
| PA-03 | Hide area | Hidden area is not public |
| PA-04 | Reorder | Public order follows CMS |
| PA-05 | Area page | Correct title/context |
| PA-06 | Article list | Only published related articles |
| PA-07 | Pagination | Correct page results |
| PA-08 | Search title | Matching title results |
| PA-09 | Search content | Matching content results |
| PA-10 | Search scope | Only current area searched |
| PA-11 | Empty | Explicit empty state |
| PA-12 | Error | Explicit error state |

---

# 5. ARTICLE SYSTEM

| ID | Scenario | Expected |
|---|---|---|
| ART-01 | Create article | Draft saved |
| ART-02 | Edit article | Changes persist |
| ART-03 | Preview | Draft preview works |
| ART-04 | Publish | Article becomes public |
| ART-05 | Hidden/Draft | Not public |
| ART-06 | Multi-area | Article can select multiple areas |
| ART-07 | Public multi-area | Same article appears in each selected area |
| ART-08 | No duplicate | One article record/content |
| ART-09 | SEO fields | Metadata renders |
| ART-10 | Detail CTA | Consultation/contact action works |
| ART-11 | Facebook | Correct canonical URL shared |
| ART-12 | Zalo | Correct canonical URL shared |
| ART-13 | Related | Related articles exclude current article |
| ART-14 | Related empty | Block hidden when none |

---

# 6. CONSULTATION

| ID | Scenario | Expected |
|---|---|---|
| CON-01 | Valid form | Lead saved |
| CON-02 | Missing name | Validation blocks |
| CON-03 | Missing phone | Validation blocks |
| CON-04 | Missing message | Validation blocks |
| CON-05 | Email omitted | Submission still valid |
| CON-06 | Admin views lead | Lead details available |
| CON-07 | Email notification | Admin receives notification |
| CON-08 | Email failure | Lead remains saved |
| CON-09 | Honeypot | Bot submission blocked |
| CON-10 | Server validation | Client bypass cannot bypass validation |
| CON-11 | Success UX | Success shown only after save |
| CON-12 | Loading UX | Duplicate accidental submission prevented appropriately |

---

# 7. BRANDING / MEDIA

| ID | Scenario | Expected |
|---|---|---|
| MED-01 | Replace logo | New logo renders |
| MED-02 | Replace favicon | New favicon renders |
| MED-03 | Replace portrait | New portrait renders |
| MED-04 | Invalid file | Validation rejects |
| MED-05 | Used asset delete | Protection/warning shown |
| MED-06 | Alt text | Accessible alt text renders |

---

# 8. AUTH / RBAC

| ID | Scenario | Expected |
|---|---|---|
| AUTH-01 | Unauthenticated Admin route | Denied |
| AUTH-02 | Admin content access | Allowed |
| AUTH-03 | Admin AI Provider | Denied |
| AUTH-04 | SYSADMIN AI Provider | Allowed |
| AUTH-05 | Client-side role tampering | Server denies |
| AUTH-06 | Admin change password | Works |
| AUTH-07 | SYSADMIN change password | Works |
| AUTH-08 | Wrong current password | Rejected |
| AUTH-09 | Password confirmation mismatch | Rejected |

---

# 9. AI

| ID | Scenario | Expected |
|---|---|---|
| AI-01 | Create Article AI | Available in approved flow |
| AI-02 | Bullet input | Accepted |
| AI-03 | Generate | Approved fields returned |
| AI-04 | Draft | Result is Draft |
| AI-05 | Edit | Human can modify |
| AI-06 | Auto-publish | Impossible |
| AI-07 | Provider access | Admin denied |
| AI-08 | Provider access | SYSADMIN allowed |
| AI-09 | AI disabled | Request denied |
| AI-10 | Secret exposure | No key in browser |
| AI-11 | AI failure | User input preserved |
| AI-12 | Fabrication | Safety policy enforced |

---

# 10. SEO / ACCESSIBILITY

| ID | Scenario | Expected |
|---|---|---|
| SEO-01 | Article title/meta | Correct |
| SEO-02 | Canonical | Correct public URL |
| SEO-03 | OG | Correct metadata |
| SEO-04 | Sitemap | Published content only |
| SEO-05 | Robots | Valid |
| SEO-06 | Headings | Logical hierarchy |
| A11Y-01 | Keyboard | Main controls usable |
| A11Y-02 | Focus | Visible |
| A11Y-03 | Labels | Form labels available |
| A11Y-04 | Contrast | Acceptable |
| A11Y-05 | Alt | Images have meaningful alt |

---

# 11. RESPONSIVE

Required widths:

```text
375 / 390 / 412 / 768 / 1024 / 1280 / 1440 / 1920
```

Verify:

- no horizontal overflow
- no clipped text
- no broken cards
- usable search
- usable pagination
- usable consultation form
- usable navigation
- readable article content

---

# 12. DATA MIGRATION

| ID | Scenario | Expected |
|---|---|---|
| MIG-01 | Backup before migration | Backup exists |
| MIG-02 | Existing articles | Preserved |
| MIG-03 | Existing relation | Migrated to N:N |
| MIG-04 | Article counts | Reconciled |
| MIG-05 | URLs | Existing required URLs remain valid |
| MIG-06 | Rollback plan | Tested/verified as required |
| MIG-07 | No destructive loss | No unexplained data loss |

---

# 13. PERFORMANCE

| ID | Scenario | Expected |
|---|---|---|
| PERF-01 | First load | Measured |
| PERF-02 | Navigation | Measured |
| PERF-03 | Article page | Measured |
| PERF-04 | Slow incident | Reproduced and localized before fix |
| PERF-05 | Regression | Before/after evidence recorded |

No performance claim is accepted without measurement evidence.

---

# 14. FINAL ACCEPTANCE

Product Owner acceptance requires:

- all critical tests PASS
- no unresolved critical security/data issue
- visual QA evidence
- migration evidence
- production smoke evidence where authorized
- final scope reconciliation
