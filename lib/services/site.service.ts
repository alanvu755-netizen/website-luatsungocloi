import { prisma } from "@/lib/db/prisma";
import { memoize } from "@/lib/utils/cache";

export const getSiteBySlug = memoize(async (slug = "le-thi-ngoc-loi") => {
  return await prisma.site.findUnique({
    where: { slug },
    include: { settings: true },
  });
});

export const getPublicHeaderMenus = memoize(async (siteId: string) => {
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
});
