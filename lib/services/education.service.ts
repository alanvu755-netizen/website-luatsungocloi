import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { memoize } from "@/lib/utils/cache";

export type ContentStatus = "DRAFT" | "PUBLISHED" | "HIDDEN";

export async function getEducations(siteId: string) {
  return await prisma.education.findMany({
    where: { siteId },
    orderBy: { displayOrder: "asc" },
  });
}

export const getPublishedEducations = memoize(async (siteId: string) => {
  return await prisma.education.findMany({
    where: {
      siteId,
      status: "PUBLISHED",
    },
    orderBy: { displayOrder: "asc" },
  });
});

export async function createEducation(
  siteId: string,
  data: {
    degree: string;
    institution: string;
    description?: string | null;
    startYear?: number | null;
    endYear?: number | null;
    displayOrder?: number;
    status?: ContentStatus;
  }
) {
  const result = await prisma.education.create({
    data: {
      siteId,
      degree: data.degree,
      institution: data.institution,
      description: data.description,
      startYear: data.startYear,
      endYear: data.endYear,
      displayOrder: data.displayOrder ?? 0,
      status: data.status ?? "PUBLISHED",
    },
  });
  revalidatePath("/");
  return result;
}

export async function updateEducation(
  id: string,
  siteId: string,
  data: {
    degree?: string;
    institution?: string;
    description?: string | null;
    startYear?: number | null;
    endYear?: number | null;
    displayOrder?: number;
    status?: ContentStatus;
  }
) {
  const result = await prisma.education.update({
    where: { id, siteId },
    data,
  });
  revalidatePath("/");
  return result;
}

export async function deleteEducation(id: string, siteId: string) {
  const result = await prisma.education.delete({
    where: { id, siteId },
  });
  revalidatePath("/");
  return result;
}
