import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { prisma } from "@/lib/db/prisma";
import { getPublicStatistics } from "@/lib/services/statistic.service";
import { getPublicArticles, createArticle } from "@/lib/services/article.service";
import { createConsultationLead } from "@/lib/services/consultation.service";

describe("Step 5 — Homepage Implementation & Screen Context Test Suite", () => {
  let siteId: string;
  let adminUserId: string;
  let createdArticleIds: string[] = [];
  let createdLeadIds: string[] = [];

  beforeEach(async () => {
    const site = await prisma.site.findUnique({ where: { slug: "le-thi-ngoc-loi" } });
    expect(site).not.toBeNull();
    siteId = site!.id;

    const adminUser = await prisma.adminUser.findFirst({ where: { siteId } });
    expect(adminUser).not.toBeNull();
    adminUserId = adminUser!.id;

    createdArticleIds = [];
    createdLeadIds = [];
  });

  afterEach(async () => {
    // Teardown cleanup
    if (createdArticleIds.length > 0) {
      await prisma.articlePracticeArea.deleteMany({ where: { articleId: { in: createdArticleIds } } });
      await prisma.article.deleteMany({ where: { id: { in: createdArticleIds } } });
    }
    if (createdLeadIds.length > 0) {
      const validIds = createdLeadIds.filter((id) => id && id !== "honeypot-ignored");
      if (validIds.length > 0) {
        await prisma.consultationLead.deleteMany({ where: { id: { in: validIds } } });
      }
    }
  });

  // ----------------------------------------------------
  // A. STATISTICS SECTION INTEGRATION
  // ----------------------------------------------------
  describe("A. Statistics Section Integration", () => {
    it("TC-HOME-STAT-01: should fetch public statistics ordered by displayOrder asc and exclude disabled items", async () => {
      const stats = await getPublicStatistics(siteId);
      expect(stats.length).toBeGreaterThan(0);

      // Verify displayOrder asc
      for (let i = 0; i < stats.length - 1; i++) {
        expect(stats[i].displayOrder).toBeLessThanOrEqual(stats[i + 1].displayOrder);
      }

      // Verify all fetched items are active (status = true)
      stats.forEach((s) => expect(s.status).toBe(true));
    });
  });

  // ----------------------------------------------------
  // B. LATEST ARTICLES SECTION INTEGRATION
  // ----------------------------------------------------
  describe("B. Latest Articles Section Integration", () => {
    it("TC-HOME-ART-01: should query up to 3 published articles for Homepage and exclude DRAFT/HIDDEN", async () => {
      const menu = await prisma.menu.findFirst({ where: { siteId } });
      expect(menu).not.toBeNull();

      // Create Published Article
      const pubArt = await createArticle(siteId, adminUserId, {
        menuId: menu!.id,
        title: "Bài viết xuất bản cho Homepage",
        slug: `home-pub-article-${Date.now()}`,
        content: "Nội dung bài viết xuất bản...",
        status: "PUBLISHED",
      });
      createdArticleIds.push(pubArt.id);

      // Create Draft Article
      const draftArt = await createArticle(siteId, adminUserId, {
        menuId: menu!.id,
        title: "Bài viết nháp không hiện Homepage",
        slug: `home-draft-article-${Date.now()}`,
        content: "Nội dung bài viết nháp...",
        status: "DRAFT",
      });
      createdArticleIds.push(draftArt.id);

      // Query public articles
      const publicResult = await getPublicArticles(siteId, { pageSize: 3 });
      const publicIds = publicResult.articles.map((a) => a.id);

      expect(publicIds).toContain(pubArt.id);
      expect(publicIds).not.toContain(draftArt.id);
    });
  });

  // ----------------------------------------------------
  // C. CONSULTATION FORM INTEGRATION & HONEYPOT BOUNDARY
  // ----------------------------------------------------
  describe("C. Consultation Form Integration", () => {
    it("TC-HOME-FORM-01: should submit valid consultation lead successfully with status NEW", async () => {
      const result = await createConsultationLead({
        siteId,
        fullName: "Khách hàng Tư vấn Trang chủ",
        phone: "0912345678",
        email: "khachhang@gmail.com",
        content: "Cần tư vấn tranh chấp hợp đồng thương mại...",
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      if (result.data?.id) {
        createdLeadIds.push(result.data.id);
        expect(result.data.fullName).toBe("Khách hàng Tư vấn Trang chủ");
      }
    });

    it("TC-HOME-FORM-02: should accept empty optional email and store null in DB", async () => {
      const result = await createConsultationLead({
        siteId,
        fullName: "Khách hàng Không Email",
        phone: "0987654321",
        email: "",
        content: "Tư vấn luật đất đai...",
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      if (result.data?.id) {
        createdLeadIds.push(result.data.id);
        expect(result.data.email).toBeNull();
      }
    });

    it("TC-HOME-FORM-03: should reject submission when required field fullName is missing", async () => {
      const result = await createConsultationLead({
        siteId,
        fullName: "",
        phone: "0912345678",
        content: "Nội dung cần tư vấn...",
      });

      expect(result.success).toBe(false);
      expect(result.errors?.fullName).toBeDefined();
    });

    it("TC-HOME-FORM-04: should reject submission when required field phone is missing", async () => {
      const result = await createConsultationLead({
        siteId,
        fullName: "Nguyễn Văn A",
        phone: "",
        content: "Nội dung cần tư vấn...",
      });

      expect(result.success).toBe(false);
      expect(result.errors?.phone).toBeDefined();
    });

    it("TC-HOME-FORM-05: should reject submission when phone format is invalid", async () => {
      const result = await createConsultationLead({
        siteId,
        fullName: "Nguyễn Văn A",
        phone: "12345",
        content: "Nội dung cần tư vấn...",
      });

      expect(result.success).toBe(false);
      expect(result.errors?.phone).toBeDefined();
    });

    it("TC-HOME-FORM-06: Honeypot boundary — bot submissions with honeypot field filled must return honeypot-ignored result without saving DB lead", async () => {
      const result = await createConsultationLead({
        siteId,
        fullName: "Spam Bot",
        phone: "0912345678",
        content: "Spam content...",
        honeypot: "http://spambot-link.com",
      });

      expect(result.success).toBe(true);
      expect(result.data?.id).toBe("honeypot-ignored");
    });
  });
});
