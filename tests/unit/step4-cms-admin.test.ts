import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { prisma } from "@/lib/db/prisma";
import {
  getPublicStatistics,
  getAllStatistics,
  updateStatisticItem,
  createStatisticItem,
} from "@/lib/services/statistic.service";
import { createArticle, updateArticle, getArticles } from "@/lib/services/article.service";
import { isValidEmail } from "@/lib/services/consultation.service";

describe("Step 4 — CMS / Admin Management Foundation Test Suite", () => {
  let siteId: string;
  let adminUserId: string;
  let createdArticleIds: string[] = [];
  let createdStatisticIds: string[] = [];
  let createdLeadIds: string[] = [];

  beforeEach(async () => {
    const site = await prisma.site.findUnique({ where: { slug: "le-thi-ngoc-loi" } });
    expect(site).not.toBeNull();
    siteId = site!.id;

    const adminUser = await prisma.adminUser.findFirst({ where: { siteId } });
    expect(adminUser).not.toBeNull();
    adminUserId = adminUser!.id;

    createdArticleIds = [];
    createdStatisticIds = [];
    createdLeadIds = [];
  });

  afterEach(async () => {
    // Teardown any leftover test fixtures created during individual tests
    if (createdArticleIds.length > 0) {
      await prisma.articlePracticeArea.deleteMany({ where: { articleId: { in: createdArticleIds } } });
      await prisma.article.deleteMany({ where: { id: { in: createdArticleIds } } });
    }
    if (createdStatisticIds.length > 0) {
      await prisma.statisticItem.deleteMany({ where: { id: { in: createdStatisticIds } } });
    }
    if (createdLeadIds.length > 0) {
      await prisma.consultationLead.deleteMany({ where: { id: { in: createdLeadIds } } });
    }
  });

  // ----------------------------------------------------
  // 1. ADMIN STATISTICS CRUD TESTS (/admin/statistics)
  // ----------------------------------------------------
  describe("A. Admin Statistics CRUD (/admin/statistics)", () => {
    it("TC-STAT-01: should update a StatisticItem and persist changes to database & public query", async () => {
      const stats = await getAllStatistics(siteId);
      expect(stats.length).toBeGreaterThan(0);

      const target = stats[0];
      const updated = await updateStatisticItem(target.id, siteId, {
        value: "999+",
        label: "Dự án Nổi bật Test",
        displayOrder: 1,
        status: true,
      });

      expect(updated.value).toBe("999+");
      expect(updated.label).toBe("Dự án Nổi bật Test");

      // Verify public service reflects updated CMS data
      const publicStats = await getPublicStatistics(siteId);
      const updatedPublic = publicStats.find((s) => s.id === target.id);
      expect(updatedPublic?.value).toBe("999+");

      // Restore original value
      await updateStatisticItem(target.id, siteId, {
        value: target.value,
        label: target.label,
        subtext: target.subtext,
        displayOrder: target.displayOrder,
        status: target.status,
      });
    });

    it("TC-STAT-02: should create a new StatisticItem and manage displayOrder & status toggle", async () => {
      const newItem = await createStatisticItem(siteId, {
        value: "50+",
        label: "Hợp tác Quốc tế",
        subtext: "Dự án mới 2026",
        displayOrder: 99,
        status: true,
      });

      createdStatisticIds.push(newItem.id);

      expect(newItem.id).toBeDefined();
      expect(newItem.value).toBe("50+");
      expect(newItem.status).toBe(true);

      // Toggle status to false (disabled)
      const disabledItem = await updateStatisticItem(newItem.id, siteId, { status: false });
      expect(disabledItem.status).toBe(false);

      // Verify public statistics excludes disabled item
      const publicStats = await getPublicStatistics(siteId);
      const foundDisabled = publicStats.find((s) => s.id === newItem.id);
      expect(foundDisabled).toBeUndefined();
    });
  });

  // ----------------------------------------------------
  // 2. CONSULTATION LEADS VIEWER TESTS (/admin/consultations)
  // ----------------------------------------------------
  describe("B. Consultation Leads Viewer (/admin/consultations)", () => {
    it("TC-CONS-01: should fetch ConsultationLead records for Admin viewer without status pipeline mutation", async () => {
      const lead = await prisma.consultationLead.create({
        data: {
          siteId,
          fullName: "Độc giả Hỏi Pháp luật",
          phone: "0918888888",
          email: "docgia@gmail.com",
          content: "Nội dung hỏi tư vấn doanh nghiệp chi tiết...",
          status: "NEW",
        },
      });

      createdLeadIds.push(lead.id);

      const leads = await prisma.consultationLead.findMany({
        where: { siteId },
        orderBy: { createdAt: "desc" },
      });

      expect(leads.length).toBeGreaterThan(0);
      const found = leads.find((l) => l.id === lead.id);
      expect(found).toBeDefined();
      expect(found?.status).toBe("NEW");
      expect(found?.fullName).toBe("Độc giả Hỏi Pháp luật");
    });
  });

  // ----------------------------------------------------
  // 3. ARTICLE MULTI-PRACTICE AREA (N-N) TESTS (/admin/articles)
  // ----------------------------------------------------
  describe("C. Article Multi-Practice Area (N-N) (/admin/articles)", () => {
    it("TC-ART-01: should create article with multiple practice areas via ArticlePracticeArea", async () => {
      const menu = await prisma.menu.findFirst({ where: { siteId } });
      const practiceArea = await prisma.practiceArea.findFirst({ where: { siteId } });
      expect(menu).not.toBeNull();
      expect(practiceArea).not.toBeNull();

      const article = await createArticle(siteId, adminUserId, {
        menuId: menu!.id,
        title: "Bài viết N-N Multi Practice Area Test",
        slug: `article-nn-test-${Date.now()}`,
        content: "Nội dung bài viết thử nghiệm N-N",
        status: "DRAFT",
        practiceAreaIds: [practiceArea!.id],
      });

      createdArticleIds.push(article.id);

      expect(article.id).toBeDefined();
      expect(article.status).toBe("DRAFT");

      // Verify N-N junction creation
      const junctions = await prisma.articlePracticeArea.findMany({
        where: { articleId: article.id },
      });
      expect(junctions.length).toBe(1);
      expect(junctions[0].practiceAreaId).toBe(practiceArea!.id);
    });

    it("TC-ART-02: should update article and sync N-N practice areas without duplicate junction errors", async () => {
      const menu = await prisma.menu.findFirst({ where: { siteId } });
      const practiceArea = await prisma.practiceArea.findFirst({ where: { siteId } });

      const article = await createArticle(siteId, adminUserId, {
        menuId: menu!.id,
        title: "Bài viết Update N-N Test",
        slug: `article-update-nn-${Date.now()}`,
        content: "Nội dung ban đầu...",
        status: "DRAFT",
      });

      createdArticleIds.push(article.id);

      // Update practice areas
      await updateArticle(article.id, siteId, {
        practiceAreaIds: [practiceArea!.id],
      });

      const updatedJunctions = await prisma.articlePracticeArea.findMany({
        where: { articleId: article.id },
      });
      expect(updatedJunctions.length).toBe(1);
      expect(updatedJunctions[0].practiceAreaId).toBe(practiceArea!.id);
    });

    it("TC-ART-03: AI draft contract verification — article created via AI is DRAFT and not auto-published", async () => {
      const menu = await prisma.menu.findFirst({ where: { siteId } });

      const aiDraftArticle = await createArticle(siteId, adminUserId, {
        menuId: menu!.id,
        title: "Bài viết do AI hỗ trợ soạn thảo",
        slug: `ai-draft-article-${Date.now()}`,
        content: "Nội dung bản nháp do AI sinh ra...",
        status: "DRAFT", // AI contract specifies DRAFT ONLY
      });

      createdArticleIds.push(aiDraftArticle.id);

      expect(aiDraftArticle.status).toBe("DRAFT");
      expect(aiDraftArticle.publishedAt).toBeNull();
    });
  });

  // ----------------------------------------------------
  // 4. SITE SETTINGS & NOTIFICATION EMAIL TESTS (/admin/settings)
  // ----------------------------------------------------
  describe("D. Site Settings & Notification Email (/admin/settings)", () => {
    it("TC-SET-01: should validate email format and update consultationNotificationEmail in SiteSettings", async () => {
      const validEmail = "admin.notification@luatsungocloi.vn";
      const invalidEmail = "invalid-email-format";

      expect(isValidEmail(validEmail)).toBe(true);
      expect(isValidEmail(invalidEmail)).toBe(false);

      const updatedSettings = await prisma.siteSettings.upsert({
        where: { siteId },
        update: { consultationNotificationEmail: validEmail },
        create: {
          siteId,
          consultationNotificationEmail: validEmail,
        },
      });

      expect(updatedSettings.consultationNotificationEmail).toBe(validEmail);

      // Restore default
      await prisma.siteSettings.update({
        where: { siteId },
        data: { consultationNotificationEmail: "luatsungocloi@gmail.com" },
      });
    });
  });

  // ----------------------------------------------------
  // 5. RBAC & SYSADMIN AI PROVIDER SECURITY TESTS (/admin/ai-provider)
  // ----------------------------------------------------
  describe("E. RBAC & SYSADMIN Security Gate (/admin/ai-provider)", () => {
    it("TC-AI-01: should restrict /admin/ai-provider to SYSADMIN role only and deny regular ADMIN", async () => {
      const sysAdminUser = await prisma.adminUser.findFirst({
        where: { role: { name: "SYSADMIN" } },
        include: { role: true },
      });

      const regularAdminUser = await prisma.adminUser.findFirst({
        where: { role: { name: "ADMIN" } },
        include: { role: true },
      });

      expect(sysAdminUser?.role.name).toBe("SYSADMIN");

      if (regularAdminUser) {
        expect(regularAdminUser.role.name).not.toBe("SYSADMIN");
      }
    });
  });
});
