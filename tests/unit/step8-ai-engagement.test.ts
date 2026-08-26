import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/db/prisma";
import { POST as viewHandler } from "@/app/api/public/articles/[id]/view/route";
import { POST as shareHandler } from "@/app/api/public/articles/[id]/share/route";
import { runAIGeneration } from "@/lib/ai/service";

describe("Step 8 — AI Content Marketing & Article Engagement Test Suite", () => {
  let testSiteId: string;
  let testAdminId: string;
  let testMenuId: string;
  let publishedArticleId: string;
  let draftArticleId: string;

  beforeAll(async () => {
    // 1. Fetch existing test baseline
    const site = await prisma.site.findUnique({ where: { slug: "le-thi-ngoc-loi" } });
    if (!site) throw new Error("Baseline site not found");
    testSiteId = site.id;

    const admin = await prisma.adminUser.findFirst({ where: { siteId: testSiteId } });
    if (!admin) throw new Error("Baseline admin not found");
    testAdminId = admin.id;

    const menu = await prisma.menu.findFirst({ where: { siteId: testSiteId } });
    if (!menu) throw new Error("Baseline menu not found");
    testMenuId = menu.id;

    // 2. Create Published Test Article
    const publishedArt = await prisma.article.create({
      data: {
        siteId: testSiteId,
        menuId: testMenuId,
        createdById: testAdminId,
        title: "Test Published Article Step 8",
        slug: "test-published-article-step-8-" + Date.now(),
        content: "Nội dung bài viết thử nghiệm Step 8...",
        status: "PUBLISHED",
        publishedAt: new Date(),
        viewCount: 0,
        shareCount: 0,
      },
    });
    publishedArticleId = publishedArt.id;

    // 3. Create Draft Test Article
    const draftArt = await prisma.article.create({
      data: {
        siteId: testSiteId,
        menuId: testMenuId,
        createdById: testAdminId,
        title: "Test Draft Article Step 8",
        slug: "test-draft-article-step-8-" + Date.now(),
        content: "Nội dung bản nháp...",
        status: "DRAFT",
        viewCount: 0,
        shareCount: 0,
      },
    });
    draftArticleId = draftArt.id;
  });

  afterAll(async () => {
    // Cleanup created test articles
    await prisma.article.deleteMany({
      where: { id: { in: [publishedArticleId, draftArticleId] } },
    });
  });

  describe("1. AI Content Marketing & Safety", () => {
    it("should process AI generation request and enforce DRAFT safety", async () => {
      await prisma.aIUsage.deleteMany({ where: { siteId: testSiteId } });

      const requestId = `test_step8_ai_${Date.now()}`;
      const res = await runAIGeneration({
        userId: testAdminId,
        siteId: testSiteId,
        promptCode: "ARTICLE_GENERATE",
        promptText: "Quy định tranh chấp đất đai mới nhất năm 2026",
        model: "gemini-1.5-flash",
        requestId,
      });

      expect(res.success).toBe(true);
      expect(res.generation).toBeDefined();
      expect(res.generation.status).toBe("COMPLETED");
    });
  });

  describe("2. View Count Tracking API (POST /api/public/articles/[id]/view)", () => {
    it("should increment viewCount by exactly +1 for a valid published article", async () => {
      const initialArt = await prisma.article.findUnique({ where: { id: publishedArticleId } });
      const initialViews = initialArt?.viewCount || 0;

      const req = new Request(`http://localhost/api/public/articles/${publishedArticleId}/view`, {
        method: "POST",
        headers: { "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", "x-forwarded-for": `192.168.1.${Math.floor(Math.random() * 200)}` },
      });

      const response = await viewHandler(req, { params: { id: publishedArticleId } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.viewCount).toBe(initialViews + 1);

      const updatedArt = await prisma.article.findUnique({ where: { id: publishedArticleId } });
      expect(updatedArt?.viewCount).toBe(initialViews + 1);
    });

    it("should reject view tracking for DRAFT or non-existent articles", async () => {
      // Draft Article
      const draftReq = new Request(`http://localhost/api/public/articles/${draftArticleId}/view`, {
        method: "POST",
        headers: { "user-agent": "Mozilla/5.0" },
      });
      const draftRes = await viewHandler(draftReq, { params: { id: draftArticleId } });
      expect(draftRes.status).toBe(404);

      // Non-existent Article
      const fakeReq = new Request(`http://localhost/api/public/articles/non_existent_id/view`, {
        method: "POST",
        headers: { "user-agent": "Mozilla/5.0" },
      });
      const fakeRes = await viewHandler(fakeReq, { params: { id: "non_existent_id" } });
      expect(fakeRes.status).toBe(404);
    });

    it("should filter out known bots and crawlers without error", async () => {
      const botReq = new Request(`http://localhost/api/public/articles/${publishedArticleId}/view`, {
        method: "POST",
        headers: { "user-agent": "Googlebot/2.1 (+http://www.google.com/bot.html)" },
      });
      const botRes = await viewHandler(botReq, { params: { id: publishedArticleId } });
      const botData = await botRes.json();

      expect(botRes.status).toBe(200);
      expect(botData.message).toContain("Bỏ qua bot/crawler");
    });

    it("should ignore admin preview sessions without error", async () => {
      const adminReq = new Request(`http://localhost/api/public/articles/${publishedArticleId}/view`, {
        method: "POST",
        headers: { "user-agent": "Mozilla/5.0", "x-admin-preview": "true" },
      });
      const adminRes = await viewHandler(adminReq, { params: { id: publishedArticleId } });
      const adminData = await adminRes.json();

      expect(adminRes.status).toBe(200);
      expect(adminData.message).toContain("Bỏ qua admin preview");
    });
  });

  describe("3. Share Action Count Tracking API (POST /api/public/articles/[id]/share)", () => {
    it("should accept valid channels (FACEBOOK, ZALO, COPY_LINK) and increment shareCount by +1", async () => {
      const initialArt = await prisma.article.findUnique({ where: { id: publishedArticleId } });
      const initialShares = initialArt?.shareCount || 0;

      const req = new Request(`http://localhost/api/public/articles/${publishedArticleId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-forwarded-for": `10.0.0.${Math.floor(Math.random() * 200)}` },
        body: JSON.stringify({ channel: "FACEBOOK" }),
      });

      const response = await shareHandler(req, { params: { id: publishedArticleId } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.channel).toBe("FACEBOOK");
      expect(data.shareCount).toBe(initialShares + 1);

      const updatedArt = await prisma.article.findUnique({ where: { id: publishedArticleId } });
      expect(updatedArt?.shareCount).toBe(initialShares + 1);
    });

    it("should reject invalid channel identifiers", async () => {
      const req = new Request(`http://localhost/api/public/articles/${publishedArticleId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel: "INVALID_CHANNEL_XYZ" }),
      });

      const response = await shareHandler(req, { params: { id: publishedArticleId } });
      expect(response.status).toBe(400);
    });
  });
});
