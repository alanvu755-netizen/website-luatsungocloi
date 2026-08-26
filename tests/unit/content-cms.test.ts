import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { prisma } from "@/lib/db/prisma";
import {
  createMenu,
  createSubmenu,
  getPublicMenus,
  MAX_SUBMENU_PER_MENU,
} from "@/lib/services/menu.service";
import {
  createArticle,
  getPublicArticles,
  getArticles,
} from "@/lib/services/article.service";
import { updateHeroDraft, publishHero, getPublishedHero } from "@/lib/services/hero.service";

describe("Content CMS, Dynamic Menu & Hero Image Business Rules", () => {
  let testSiteId: string;
  let sysAdminUserId: string;

  beforeEach(async () => {
    // Setup clean test site & user
    const site = await prisma.site.upsert({
      where: { slug: "test-site-content" },
      update: {},
      create: {
        name: "Test Site Content",
        slug: "test-site-content",
        status: true,
      },
    });
    testSiteId = site.id;

    const role = await prisma.role.findUnique({ where: { name: "SYSADMIN" } });
    const user = await prisma.adminUser.upsert({
      where: { email: "test-cms-admin@luatsuloi.vn" },
      update: {},
      create: {
        name: "CMS Admin",
        email: "test-cms-admin@luatsuloi.vn",
        passwordHash: "hash",
        roleId: role!.id,
        status: true,
      },
    });
    sysAdminUserId = user.id;

    await prisma.hero.upsert({
      where: { siteId: testSiteId },
      update: {},
      create: {
        siteId: testSiteId,
        draftSubtitle: "Luật sư - Thạc sĩ",
        draftName: "LÊ THỊ NGỌC LỢI",
        draftImageUrl: "/docs/design/customer-reference.png",
        pubSubtitle: "Luật sư - Thạc sĩ",
        pubName: "LÊ THỊ NGỌC LỢI",
        pubImageUrl: "/docs/design/customer-reference.png",
      },
    });
  });

  afterAll(async () => {
    if (testSiteId) {
      await prisma.articlePracticeArea.deleteMany({ where: { article: { siteId: testSiteId } } });
      await prisma.article.deleteMany({ where: { siteId: testSiteId } });
      await prisma.submenu.deleteMany({ where: { menu: { siteId: testSiteId } } });
      await prisma.menu.deleteMany({ where: { siteId: testSiteId } });
      await prisma.hero.deleteMany({ where: { siteId: testSiteId } });
      if (sysAdminUserId) {
        await prisma.auditLog.deleteMany({ where: { adminUserId: sysAdminUserId } });
        await prisma.adminUser.deleteMany({ where: { id: sysAdminUserId } });
      }
      await prisma.site.deleteMany({ where: { id: testSiteId } });
    }
  });

  it("should update and publish Homepage Hero image dynamically", async () => {
    const newImageUrl = "/uploads/new-hero-lawyer.png";
    
    await updateHeroDraft(testSiteId, {
      draftSubtitle: "Luật sư - Thạc sĩ",
      draftName: "LÊ THỊ NGỌC LỢI",
      draftImageUrl: newImageUrl,
    });

    await publishHero(testSiteId, sysAdminUserId);

    const publishedHero = await getPublishedHero(testSiteId);
    expect(publishedHero?.imageUrl).toBe(newImageUrl);
  });

  it("should create Menu and enforce MAX_SUBMENU_PER_MENU = 5 rule", async () => {
    const menu = await createMenu(testSiteId, {
      title: "Pháp luật Đất đai",
      slug: `phap-luat-dat-dai-${Date.now()}`,
      status: "VISIBLE",
    });

    expect(menu.id).toBeDefined();

    // Create 5 submenus successfully
    for (let i = 1; i <= 5; i++) {
      const sub = await createSubmenu(testSiteId, menu.id, {
        title: `Chuyên mục ${i}`,
        slug: `chuyen-muc-${i}-${Date.now()}`,
        status: "VISIBLE",
      });
      expect(sub.id).toBeDefined();
    }

    // Attempt 6th Submenu -> Must throw Error
    await expect(
      createSubmenu(testSiteId, menu.id, {
        title: "Chuyên mục thứ 6 vượt giới hạn",
        slug: `chuyen-muc-6-${Date.now()}`,
        status: "VISIBLE",
      })
    ).rejects.toThrow(`Menu này đã có tối đa ${MAX_SUBMENU_PER_MENU} chuyên mục.`);
  });

  it("should hide hidden menus from public navigation query", async () => {
    const visibleMenu = await createMenu(testSiteId, {
      title: "Menu Hiển Thị",
      slug: `menu-hien-thi-${Date.now()}`,
      status: "VISIBLE",
    });

    const hiddenMenu = await createMenu(testSiteId, {
      title: "Menu Ẩn",
      slug: `menu-an-${Date.now()}`,
      status: "HIDDEN",
    });

    const publicMenus = await getPublicMenus(testSiteId);
    const visibleSlugs = publicMenus.map((m) => m.slug);

    expect(visibleSlugs).toContain(visibleMenu.slug);
    expect(visibleSlugs).not.toContain(hiddenMenu.slug);
  });

  it("should filter out Draft and Hidden articles from public queries", async () => {
    const menu = await createMenu(testSiteId, {
      title: "Menu Bài Viết",
      slug: `menu-bai-viet-${Date.now()}`,
      status: "VISIBLE",
    });

    // Create Published article
    const pubArt = await createArticle(testSiteId, sysAdminUserId, {
      menuId: menu.id,
      title: "Bài viết Đã xuất bản",
      slug: `bai-viet-published-${Date.now()}`,
      content: "Nội dung public...",
      status: "PUBLISHED",
    });

    // Create Draft article
    const draftArt = await createArticle(testSiteId, sysAdminUserId, {
      menuId: menu.id,
      title: "Bài viết Bản nháp",
      slug: `bai-viet-draft-${Date.now()}`,
      content: "Nội dung nháp...",
      status: "DRAFT",
    });

    // Public query check
    const publicResult = await getPublicArticles(testSiteId, { menuSlug: menu.slug });
    const publicArticleIds = publicResult.articles.map((a) => a.id);

    expect(publicArticleIds).toContain(pubArt.id);
    expect(publicArticleIds).not.toContain(draftArt.id);

    // Admin query check (Admin sees both Draft & Published)
    const adminResult = await getArticles(testSiteId);
    const adminArticleIds = adminResult.articles.map((a) => a.id);

    expect(adminArticleIds).toContain(pubArt.id);
    expect(adminArticleIds).toContain(draftArt.id);
  });
});
