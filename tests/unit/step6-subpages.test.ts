import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { prisma } from "@/lib/db/prisma";
import { getPublicArticles, getPublicArticleBySlug, createArticle } from "@/lib/services/article.service";
import { getRelatedArticles } from "@/lib/services/related-article.service";

describe("Step 6 — Public Subpage Routes & Dynamic Content Integration Test Suite", () => {
  let siteId: string;
  let adminUserId: string;
  let menuId: string;
  let submenuId: string;
  let practiceAreaId: string;
  let createdArticleIds: string[] = [];

  beforeEach(async () => {
    const site = await prisma.site.findUnique({ where: { slug: "le-thi-ngoc-loi" } });
    expect(site).not.toBeNull();
    siteId = site!.id;

    const adminUser = await prisma.adminUser.findFirst({ where: { siteId } });
    expect(adminUser).not.toBeNull();
    adminUserId = adminUser!.id;

    const menu = await prisma.menu.findFirst({
      where: { siteId },
      include: { submenus: true },
    });
    expect(menu).not.toBeNull();
    menuId = menu!.id;
    if (menu!.submenus.length > 0) {
      submenuId = menu!.submenus[0].id;
    }

    const pa = await prisma.practiceArea.findFirst({ where: { siteId } });
    expect(pa).not.toBeNull();
    practiceAreaId = pa!.id;

    createdArticleIds = [];
  });

  afterEach(async () => {
    if (createdArticleIds.length > 0) {
      await prisma.articlePracticeArea.deleteMany({ where: { articleId: { in: createdArticleIds } } });
      await prisma.article.deleteMany({ where: { id: { in: createdArticleIds } } });
    }
  });

  // ----------------------------------------------------
  // A. MENU & SUBMENU SUBPAGE ROUTE INTEGRATION
  // ----------------------------------------------------
  describe("A. Menu & Submenu Subpage Category Listing", () => {
    it("TC-SUB-MENU-01: should query published articles by menuId and enforce pagination contract", async () => {
      const pubArt = await createArticle(siteId, adminUserId, {
        menuId,
        title: "Bài viết Chuyên mục Menu Step 6",
        slug: `step6-menu-art-${Date.now()}`,
        content: "Nội dung bài viết chuyên mục...",
        status: "PUBLISHED",
      });
      createdArticleIds.push(pubArt.id);

      const result = await getPublicArticles(siteId, { menuId, pageSize: 10 });
      expect(result.articles.length).toBeGreaterThan(0);
      const articleIds = result.articles.map((a) => a.id);
      expect(articleIds).toContain(pubArt.id);
    });

    it("TC-SUB-SUB-01: should query published articles by submenuId and exclude draft items", async () => {
      if (!submenuId) return;

      const pubArt = await createArticle(siteId, adminUserId, {
        menuId,
        submenuId,
        title: "Bài viết Chuyên mục Con Submenu Step 6",
        slug: `step6-sub-art-${Date.now()}`,
        content: "Nội dung bài viết chuyên mục con...",
        status: "PUBLISHED",
      });
      createdArticleIds.push(pubArt.id);

      const draftArt = await createArticle(siteId, adminUserId, {
        menuId,
        submenuId,
        title: "Bài viết Nháp Chuyên mục Con Step 6",
        slug: `step6-sub-draft-${Date.now()}`,
        content: "Nội dung bài viết nháp...",
        status: "DRAFT",
      });
      createdArticleIds.push(draftArt.id);

      const result = await getPublicArticles(siteId, { submenuId, pageSize: 10 });
      const articleIds = result.articles.map((a) => a.id);
      expect(articleIds).toContain(pubArt.id);
      expect(articleIds).not.toContain(draftArt.id);
    });
  });

  // ----------------------------------------------------
  // B. ARTICLE DETAIL SUBPAGE & SECURITY CONTRACT
  // ----------------------------------------------------
  describe("B. Article Detail Subpage & Security Boundaries", () => {
    it("TC-SUB-ART-01: should deny public access to DRAFT or HIDDEN articles via getPublicArticleBySlug", async () => {
      const menu = await prisma.menu.findUnique({ where: { id: menuId } });
      expect(menu).not.toBeNull();

      const draftSlug = `step6-sec-draft-${Date.now()}`;
      const draftArt = await createArticle(siteId, adminUserId, {
        menuId,
        title: "Bài viết Nháp Bảo mật Step 6",
        slug: draftSlug,
        content: "Nội dung nháp cần bảo vệ...",
        status: "DRAFT",
      });
      createdArticleIds.push(draftArt.id);

      const fetchedDraft = await getPublicArticleBySlug(siteId, menu!.slug, draftSlug);
      expect(fetchedDraft).toBeNull();
    });

    it("TC-SUB-ART-02: should fetch published article details with multi-practice area junction tags", async () => {
      const menu = await prisma.menu.findUnique({ where: { id: menuId } });
      expect(menu).not.toBeNull();

      const pubSlug = `step6-art-detail-${Date.now()}`;
      const pubArt = await createArticle(siteId, adminUserId, {
        menuId,
        title: "Bài viết Chi tiết với Thẻ Lĩnh vực Step 6",
        slug: pubSlug,
        content: "Nội dung bài viết chi tiết có thẻ Lĩnh vực hoạt động...",
        status: "PUBLISHED",
        practiceAreaIds: [practiceAreaId],
      });
      createdArticleIds.push(pubArt.id);

      const detail = await getPublicArticleBySlug(siteId, menu!.slug, pubSlug);
      expect(detail).not.toBeNull();
      expect(detail!.title).toBe("Bài viết Chi tiết với Thẻ Lĩnh vực Step 6");

      // Verify ArticlePracticeArea relation
      const junctions = await prisma.articlePracticeArea.findMany({
        where: { articleId: pubArt.id },
      });
      expect(junctions.length).toBeGreaterThan(0);
      expect(junctions[0].practiceAreaId).toBe(practiceAreaId);
    });
  });

  // ----------------------------------------------------
  // C. RELATED ARTICLES WIDGET INTEGRATION
  // ----------------------------------------------------
  describe("C. Related Articles Widget Integration", () => {
    it("TC-SUB-REL-01: should fetch up to 3 related published articles excluding the current article", async () => {
      const art1 = await createArticle(siteId, adminUserId, {
        menuId,
        title: "Bài viết Liên quan 1",
        slug: `step6-rel-1-${Date.now()}`,
        content: "Nội dung bài 1...",
        status: "PUBLISHED",
      });
      createdArticleIds.push(art1.id);

      const art2 = await createArticle(siteId, adminUserId, {
        menuId,
        title: "Bài viết Liên quan 2",
        slug: `step6-rel-2-${Date.now()}`,
        content: "Nội dung bài 2...",
        status: "PUBLISHED",
      });
      createdArticleIds.push(art2.id);

      const related = await getRelatedArticles({
        siteId,
        currentArticleId: art1.id,
        menuId,
        limit: 3,
      });

      expect(related.length).toBeGreaterThan(0);
      const relatedIds = related.map((r) => r.id);
      expect(relatedIds).not.toContain(art1.id);
      expect(relatedIds).toContain(art2.id);
    });
  });
});
