import { prisma } from "@/lib/db/prisma";
import { memoize, cachedQuery } from "@/lib/utils/cache";

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
