import { prisma } from "@/lib/db/prisma";
import { cache } from "react";

export const getSiteBySlug = cache(async (slug = "le-thi-ngoc-loi") => {
  return await prisma.site.findUnique({
    where: { slug },
    include: { settings: true },
  });
});

export const getPublicHeaderMenus = cache(async (siteId: string) => {
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
