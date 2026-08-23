import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export const MAX_SUBMENU_PER_MENU = 5;

export async function getMenus(siteId: string) {
  return await prisma.menu.findMany({
    where: { siteId },
    include: {
      submenus: {
        orderBy: { displayOrder: "asc" },
      },
    },
    orderBy: { displayOrder: "asc" },
  });
}

export async function getPublicMenus(siteId: string) {
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
}

export async function createMenu(
  siteId: string,
  data: {
    title: string;
    slug: string;
    displayOrder?: number;
    status?: "VISIBLE" | "HIDDEN";
  }
) {
  const result = await prisma.menu.create({
    data: {
      siteId,
      title: data.title,
      slug: data.slug,
      displayOrder: data.displayOrder ?? 0,
      status: data.status ?? "VISIBLE",
    },
  });

  try { revalidatePath("/"); } catch (e) {}
  return result;
}

export async function updateMenu(
  id: string,
  siteId: string,
  data: {
    title?: string;
    slug?: string;
    displayOrder?: number;
    status?: "VISIBLE" | "HIDDEN";
  }
) {
  const result = await prisma.menu.update({
    where: { id, siteId },
    data,
  });

  try { revalidatePath("/"); } catch (e) {}
  return result;
}

export async function deleteMenu(id: string, siteId: string) {
  const result = await prisma.menu.delete({
    where: { id, siteId },
  });

  try { revalidatePath("/"); } catch (e) {}
  return result;
}

// ----------------------------------------------------
// Chuyên Mục (Submenu) Business Logic & Enforcements
// ----------------------------------------------------

export async function createSubmenu(
  siteId: string,
  menuId: string,
  data: {
    title: string;
    slug: string;
    displayOrder?: number;
    status?: "VISIBLE" | "HIDDEN";
  }
) {
  // Enforce MAX_SUBMENU_PER_MENU = 5 Business Rule
  const currentCount = await prisma.submenu.count({
    where: { menuId },
  });

  if (currentCount >= MAX_SUBMENU_PER_MENU) {
    throw new Error(`Menu này đã có tối đa ${MAX_SUBMENU_PER_MENU} chuyên mục.`);
  }

  const result = await prisma.submenu.create({
    data: {
      siteId,
      menuId,
      title: data.title,
      slug: data.slug,
      displayOrder: data.displayOrder ?? 0,
      status: data.status ?? "VISIBLE",
    },
  });

  try { revalidatePath("/"); } catch (e) {}
  return result;
}

export async function updateSubmenu(
  id: string,
  siteId: string,
  data: {
    title?: string;
    slug?: string;
    displayOrder?: number;
    status?: "VISIBLE" | "HIDDEN";
  }
) {
  const result = await prisma.submenu.update({
    where: { id, siteId },
    data,
  });

  try { revalidatePath("/"); } catch (e) {}
  return result;
}

export async function deleteSubmenu(id: string, siteId: string) {
  const result = await prisma.submenu.delete({
    where: { id, siteId },
  });

  try { revalidatePath("/"); } catch (e) {}
  return result;
}
