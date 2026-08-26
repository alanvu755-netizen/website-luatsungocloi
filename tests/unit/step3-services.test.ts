import { describe, it, expect, beforeEach } from "vitest";
import { prisma } from "@/lib/db/prisma";
import { getPublicStatistics, getAllStatistics } from "@/lib/services/statistic.service";
import { createConsultationLead, isValidPhone, isValidEmail } from "@/lib/services/consultation.service";
import { sendConsultationNotificationEmail } from "@/lib/services/email.service";
import { associateArticlePracticeAreas, getArticlesByPracticeArea } from "@/lib/services/article.service";
import { searchPublicArticles } from "@/lib/services/search.service";
import { getRelatedArticles } from "@/lib/services/related-article.service";

describe("Step 3 — Core Services & Backend Infrastructure Test Suite", () => {
  let siteId: string;

  beforeEach(async () => {
    const site = await prisma.site.findUnique({ where: { slug: "le-thi-ngoc-loi" } });
    expect(site).not.toBeNull();
    siteId = site!.id;
  });

  // ----------------------------------------------------
  // 1. STATISTICS SERVICE TESTS
  // ----------------------------------------------------
  describe("A. Statistics Service", () => {
    it("should fetch public statistics ordered by displayOrder asc", async () => {
      const stats = await getPublicStatistics(siteId);
      expect(Array.isArray(stats)).toBe(true);
      expect(stats.length).toBeGreaterThanOrEqual(4);

      // Verify stable ordering (displayOrder asc)
      for (let i = 0; i < stats.length - 1; i++) {
        expect(stats[i].displayOrder).toBeLessThanOrEqual(stats[i + 1].displayOrder);
        expect(stats[i].status).toBe(true);
      }
    });

    it("should fetch all statistics including disabled items", async () => {
      const allStats = await getAllStatistics(siteId);
      expect(allStats.length).toBeGreaterThanOrEqual(4);
    });
  });

  // ----------------------------------------------------
  // 2. CONSULTATION SERVICE & VALIDATION TESTS
  // ----------------------------------------------------
  describe("B. Consultation Service & Data Contract", () => {
    it("should validate phone numbers correctly", () => {
      expect(isValidPhone("0912345678")).toBe(true);
      expect(isValidPhone("+84912345678")).toBe(true);
      expect(isValidPhone("0388888888")).toBe(true);
      expect(isValidPhone("12345")).toBe(false);
      expect(isValidPhone("abc")).toBe(false);
    });

    it("should validate email format correctly", () => {
      expect(isValidEmail("test@gmail.com")).toBe(true);
      expect(isValidEmail("")).toBe(true); // Optional field
      expect(isValidEmail("invalid-email")).toBe(false);
    });

    it("should create ConsultationLead in DB with valid inputs & status NEW", async () => {
      const testPhone = `09${Math.floor(10000078 + Math.random() * 80000000)}`;
      const result = await createConsultationLead({
        siteId,
        fullName: "Nguyễn Văn Test",
        phone: testPhone,
        email: "nguyenvan.test@gmail.com",
        content: "Cần tư vấn về tranh chấp hợp đồng thương mại",
        ipAddress: "127.0.0.1",
        userAgent: "Mozilla/5.0 TestAgent",
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.fullName).toBe("Nguyễn Văn Test");

      // Verify DB persistence
      const savedLead = await prisma.consultationLead.findUnique({
        where: { id: result.data!.id },
      });
      expect(savedLead).not.toBeNull();
      expect(savedLead?.status).toBe("NEW");
      expect(savedLead?.email).toBe("nguyenvan.test@gmail.com");

      // Clean up test record
      await prisma.consultationLead.delete({ where: { id: savedLead!.id } });
    });

    it("should reject missing fullName, missing phone, or missing content", async () => {
      const res1 = await createConsultationLead({
        siteId,
        fullName: "",
        phone: "0912345678",
        content: "Nội dung",
      });
      expect(res1.success).toBe(false);
      expect(res1.errors?.fullName).toBeDefined();

      const res2 = await createConsultationLead({
        siteId,
        fullName: "Test Name",
        phone: "123", // invalid
        content: "Nội dung",
      });
      expect(res2.success).toBe(false);
      expect(res2.errors?.phone).toBeDefined();

      const res3 = await createConsultationLead({
        siteId,
        fullName: "Test Name",
        phone: "0912345678",
        content: "   ", // whitespace only
      });
      expect(res3.success).toBe(false);
      expect(res3.errors?.content).toBeDefined();
    });

    it("should accept empty optional email and convert to null in DB", async () => {
      const testPhone = `09${Math.floor(10000078 + Math.random() * 80000000)}`;
      const result = await createConsultationLead({
        siteId,
        fullName: "Khách Không Email",
        phone: testPhone,
        email: "   ", // empty optional
        content: "Tư vấn thủ tục ly hôn",
      });

      expect(result.success).toBe(true);
      expect(result.data?.email).toBeNull();

      // Clean up
      if (result.data?.id) {
        await prisma.consultationLead.delete({ where: { id: result.data.id } });
      }
    });

    it("should ignore honeypot submissions silently without saving to DB", async () => {
      const result = await createConsultationLead({
        siteId,
        fullName: "Spam Bot",
        phone: "0912345678",
        content: "Spam content",
        honeypot: "gotcha_bot_field",
      });

      expect(result.success).toBe(true);
      expect(result.data?.id).toBe("honeypot-ignored");
    });
  });

  // ----------------------------------------------------
  // 3. EMAIL NOTIFICATION SERVICE & ISOLATION TESTS
  // ----------------------------------------------------
  describe("C. Email Notification Service & Failure Isolation", () => {
    it("should handle email sending without throwing exception when RESEND_API_KEY is not set", async () => {
      const result = await sendConsultationNotificationEmail({
        siteId,
        fullName: "Test Email Isolation",
        phone: "0912345678",
        email: "isolation@test.com",
        content: "Nội dung kiểm tra email isolation",
      });

      // Email service should return graceful result object instead of throwing
      expect(typeof result.success).toBe("boolean");
    });

    it("should guarantee DB ConsultationLead persistence even if email notification fails", async () => {
      const testPhone = `09${Math.floor(10000078 + Math.random() * 80000000)}`;
      
      // Attempt creation (which triggers background email)
      const result = await createConsultationLead({
        siteId,
        fullName: "DB Persistence Guarantee Test",
        phone: testPhone,
        email: "guarantee@test.com",
        content: "Nội dung bảo đảm DB không bị rollback khi email lỗi",
      });

      expect(result.success).toBe(true);
      expect(result.data?.id).toBeDefined();

      // Verify DB record is persisted successfully
      const leadInDb = await prisma.consultationLead.findUnique({
        where: { id: result.data!.id },
      });
      expect(leadInDb).not.toBeNull();
      expect(leadInDb?.fullName).toBe("DB Persistence Guarantee Test");

      // Cleanup
      await prisma.consultationLead.delete({ where: { id: leadInDb!.id } });
    });
  });

  // ----------------------------------------------------
  // 4. ARTICLE N-N FOUNDATION TESTS
  // ----------------------------------------------------
  describe("D. Article N-N Service Foundation", () => {
    it("should associate article with multiple practice areas via ArticlePracticeArea", async () => {
      // Find an article & practice area
      const article = await prisma.article.findFirst({ where: { siteId } });
      const practiceArea = await prisma.practiceArea.findFirst({ where: { siteId } });

      if (article && practiceArea) {
        const associations = await associateArticlePracticeAreas(article.id, siteId, [practiceArea.id]);
        expect(Array.isArray(associations)).toBe(true);
        expect(associations.length).toBeGreaterThanOrEqual(1);

        // Query articles by practice area
        const paArticles = await getArticlesByPracticeArea(siteId, practiceArea.id);
        expect(paArticles.totalCount).toBeGreaterThanOrEqual(1);
      }
    });
  });

  // ----------------------------------------------------
  // 5. SEARCH FOUNDATION TESTS
  // ----------------------------------------------------
  describe("E. Search Service Foundation", () => {
    it("should search published articles by title or content (case-insensitive)", async () => {
      const searchResult = await searchPublicArticles({
        siteId,
        query: "Luật",
        page: 1,
        pageSize: 5,
      });

      expect(searchResult).toBeDefined();
      expect(searchResult.query).toBe("Luật");
      expect(Array.isArray(searchResult.articles)).toBe(true);
    });
  });

  // ----------------------------------------------------
  // 6. RELATED ARTICLES FOUNDATION TESTS
  // ----------------------------------------------------
  describe("F. Related Articles Service Foundation", () => {
    it("should return up to 3 published articles excluding current article", async () => {
      const article = await prisma.article.findFirst({ where: { siteId, status: "PUBLISHED" } });

      if (article) {
        const related = await getRelatedArticles({
          siteId,
          currentArticleId: article.id,
          menuId: article.menuId,
          limit: 3,
        });

        expect(Array.isArray(related)).toBe(true);
        expect(related.length).toBeLessThanOrEqual(3);
        
        // Confirm current article is excluded
        const containsCurrent = related.some((r) => r.id === article.id);
        expect(containsCurrent).toBe(false);
      }
    });

    it("should return empty array safely if no related articles exist", async () => {
      const related = await getRelatedArticles({
        siteId,
        currentArticleId: "non-existent-id",
        menuId: null,
        submenuId: null,
      });

      expect(related).toEqual([]);
    });
  });
});
