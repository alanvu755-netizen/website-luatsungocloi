import { prisma } from "@/lib/db/prisma";
import { memoize } from "@/lib/utils/cache";

let cachedDefaultSiteId: string | null = null;

export async function getEffectiveSiteId(user: { siteId?: string | null } | null): Promise<string | null> {
  try {
    if (!user) return null;
    if (user.siteId) return user.siteId;
    if (cachedDefaultSiteId) return cachedDefaultSiteId;

    const firstSite = await prisma.site.findFirst({ select: { id: true } });
    if (firstSite) {
      cachedDefaultSiteId = firstSite.id;
    }
    return cachedDefaultSiteId || "cmt85l4jq00001442cly58d04";
  } catch (e) {
    return "cmt85l4jq00001442cly58d04";
  }
}

export const getSiteBySlug = memoize(async (slug = "le-thi-ngoc-loi") => {
  try {
    return await prisma.site.findUnique({
      where: { slug },
      include: { settings: true },
    });
  } catch (e) {
    return null;
  }
});

export const getPublicHeaderMenus = memoize(async (siteId: string) => {
  try {
    return await prisma.menu.findMany({
      where: {
        siteId,
        status: "VISIBLE",
      },
      include: {
        submenus: {
          where: { status: "VISIBLE" },
          orderBy: { displayOrder: "asc" },
        },
      },
      orderBy: { displayOrder: "asc" },
    });
  } catch (e) {
    return [];
  }
});
