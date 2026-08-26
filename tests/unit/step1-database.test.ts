import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/db/prisma";

describe("Step 1 Database Schema & Data Integrity Tests", () => {
  let siteId: string;
  let practiceAreaId: string;
  let articleId: string;

  beforeAll(async () => {
    // 1. Fetch default seeded Site
    const site = await prisma.site.findUnique({
      where: { slug: "le-thi-ngoc-loi" },
    });
    expect(site).toBeDefined();
    siteId = site!.id;

    // 2. Fetch or create a test Practice Area
    let pa = await prisma.practiceArea.findFirst({
      where: { siteId },
    });
    if (!pa) {
      pa = await prisma.practiceArea.create({
        data: {
          siteId,
          title: "Đất đai - Nhập môn",
          status: "PUBLISHED",
        },
      });
    }
    practiceAreaId = pa.id;

    // 3. Fetch or create a test Article
    let art = await prisma.article.findFirst({
      where: { siteId },
    });
    if (!art) {
      const menu = await prisma.menu.findFirst({ where: { siteId } });
      const admin = await prisma.adminUser.findFirst({ where: { email: "luatsu.loi@gmail.com" } });
      art = await prisma.article.create({
        data: {
          siteId,
          createdById: admin!.id,
          menuId: menu!.id,
          title: "Bài viết thử nghiệm Step 1",
          slug: "test-step-1-article",
          content: "Nội dung bài viết thử nghiệm",
          status: "PUBLISHED",
        },
      });
    }
    articleId = art.id;
  });

  it("Invariant A: ArticlePracticeArea N-N relationship works as expected", async () => {
    // Create junction record
    const junction = await prisma.articlePracticeArea.upsert({
      where: {
        articleId_practiceAreaId: {
          articleId,
          practiceAreaId,
        },
      },
      create: {
        siteId,
        articleId,
        practiceAreaId,
      },
      update: {},
    });

    expect(junction).toBeDefined();
    expect(junction.articleId).toBe(articleId);
    expect(junction.practiceAreaId).toBe(practiceAreaId);

    // Verify querying article with practiceAreaArticles relation
    const fetchedArticle = await prisma.article.findUnique({
      where: { id: articleId },
      include: {
        articlePracticeAreas: {
          include: { practiceArea: true },
        },
      },
    });

    expect(fetchedArticle).toBeDefined();
    expect(fetchedArticle?.articlePracticeAreas.length).toBeGreaterThan(0);
    expect(
      fetchedArticle?.articlePracticeAreas.some((apa) => apa.practiceAreaId === practiceAreaId)
    ).toBe(true);
  });

  it("Invariant B: ConsultationLead model enforces required & optional fields", async () => {
    // Create Consultation Lead with required fields & optional email
    const lead = await prisma.consultationLead.create({
      data: {
        siteId,
        fullName: "Nguyễn Văn A",
        phone: "0912345678",
        email: "nguyenvana@example.com",
        content: "Cần tư vấn thủ tục tranh chấp đất đai",
        ipAddress: "127.0.0.1",
      },
    });

    expect(lead).toBeDefined();
    expect(lead.fullName).toBe("Nguyễn Văn A");
    expect(lead.phone).toBe("0912345678");
    expect(lead.status).toBe("NEW");

    // Clean up test lead
    await prisma.consultationLead.delete({ where: { id: lead.id } });
  });

  it("Invariant C: StatisticItem model contains initial seeded values (800+, 500+, 10+, 100%)", async () => {
    const stats = await prisma.statisticItem.findMany({
      where: { siteId, status: true },
      orderBy: { displayOrder: "asc" },
    });

    expect(stats.length).toBeGreaterThanOrEqual(4);
    const values = stats.map((s) => s.value);
    expect(values).toContain("800+");
    expect(values).toContain("500+");
    expect(values).toContain("10+");
    expect(values).toContain("100%");
  });

  it("Invariant D: SiteSettings includes consultationNotificationEmail field", async () => {
    const settings = await prisma.siteSettings.findUnique({
      where: { siteId },
    });

    expect(settings).toBeDefined();
    expect(settings?.consultationNotificationEmail).toBeDefined();
    expect(settings?.consultationNotificationEmail).toBe("luatsungocloi@gmail.com");
  });
});
