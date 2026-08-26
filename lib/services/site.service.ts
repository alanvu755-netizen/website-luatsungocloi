import { prisma } from "@/lib/db/prisma";
import { memoize, cachedQuery } from "@/lib/utils/cache";

let cachedDefaultSiteId: string | null = null;

export async function getEffectiveSiteId(user: { siteId?: string | null } | null): Promise<string | null> {
  if (!user) return null;
  if (user.siteId) return user.siteId;
  if (cachedDefaultSiteId) return cachedDefaultSiteId;

  const firstSite = await prisma.site.findFirst({ select: { id: true } });
  if (firstSite) {
    cachedDefaultSiteId = firstSite.id;
  }
  return cachedDefaultSiteId;
}

export const getSiteBySlug = memoize(async (slug = "le-thi-ngoc-loi") => {
  return await cachedQuery(
    async () =>
      prisma.site.findUnique({
        where: { slug },
        include: { settings: true },
      }),
    [`site_by_slug_${slug}`],
    { revalidate: 60, tags: ["site_settings"] }
  )();
});

export const getPublicHeaderMenus = memoize(async (siteId: string) => {
  return await cachedQuery(
    async () =>
      prisma.menu.findMany({
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
      }),
    [`public_header_menus_${siteId}`],
    { revalidate: 60, tags: ["public_menus"] }
  )();
});
