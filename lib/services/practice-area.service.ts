import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { memoize } from "@/lib/utils/cache";

export type ContentStatus = "DRAFT" | "PUBLISHED" | "HIDDEN";

export async function getPracticeAreas(siteId: string) {
  return await prisma.practiceArea.findMany({
    where: { siteId },
    orderBy: { displayOrder: "asc" },
  });
}

export async function getPublishedPracticeAreas(siteId: string) {
  return await prisma.practiceArea.findMany({
    where: {
      siteId,
      status: "PUBLISHED",
    },
    orderBy: { displayOrder: "asc" },
  });
}

export async function createPracticeArea(
  siteId: string,
  data: {
    title: string;
    description?: string | null;
    icon?: string | null;
    displayOrder?: number;
    status?: ContentStatus;
  }
) {
  const result = await prisma.practiceArea.create({
    data: {
      siteId,
      title: data.title,
      description: data.description,
      icon: data.icon,
      displayOrder: data.displayOrder ?? 0,
      status: data.status ?? "PUBLISHED",
    },
  });
  revalidatePath("/");
  return result;
}

export async function updatePracticeArea(
  id: string,
  siteId: string,
  data: {
    title?: string;
    description?: string | null;
    icon?: string | null;
    displayOrder?: number;
    status?: ContentStatus;
  }
) {
  const result = await prisma.practiceArea.update({
    where: { id, siteId },
    data,
  });
  revalidatePath("/");
  return result;
}

export async function deletePracticeArea(id: string, siteId: string) {
  const result = await prisma.practiceArea.delete({
    where: { id, siteId },
  });
  revalidatePath("/");
  return result;
}
