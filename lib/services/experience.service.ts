import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { memoize } from "@/lib/utils/cache";

export type ContentStatus = "DRAFT" | "PUBLISHED" | "HIDDEN";

export async function getExperiences(siteId: string) {
  return await prisma.experience.findMany({
    where: { siteId },
    include: {
      highlights: {
        orderBy: { displayOrder: "asc" },
      },
    },
    orderBy: { displayOrder: "asc" },
  });
}

export const getPublishedExperiences = memoize(async (siteId: string) => {
  return await prisma.experience.findMany({
    where: {
      siteId,
      status: "PUBLISHED",
    },
    include: {
      highlights: {
        orderBy: { displayOrder: "asc" },
      },
    },
    orderBy: { displayOrder: "asc" },
  });
});

export async function createExperience(
  siteId: string,
  data: {
    startYear: number;
    endYear?: number | null;
    position: string;
    organization: string;
    description?: string | null;
    displayOrder?: number;
    status?: ContentStatus;
    highlights?: string[];
  }
) {
  const result = await prisma.experience.create({
    data: {
      siteId,
      startYear: data.startYear,
      endYear: data.endYear,
      position: data.position,
      organization: data.organization,
      description: data.description,
      displayOrder: data.displayOrder ?? 0,
      status: data.status ?? "PUBLISHED",
      highlights: {
        create: (data.highlights || []).map((content, idx) => ({
          content,
          displayOrder: idx + 1,
        })),
      },
    },
    include: { highlights: true },
  });
  revalidatePath("/");
  return result;
}

export async function updateExperience(
  id: string,
  siteId: string,
  data: {
    startYear?: number;
    endYear?: number | null;
    position?: string;
    organization?: string;
    description?: string | null;
    displayOrder?: number;
    status?: ContentStatus;
    highlights?: string[];
  }
) {
  if (data.highlights) {
    await prisma.experienceHighlight.deleteMany({
      where: { experienceId: id },
    });
  }

  const result = await prisma.experience.update({
    where: { id, siteId },
    data: {
      startYear: data.startYear,
      endYear: data.endYear,
      position: data.position,
      organization: data.organization,
      description: data.description,
      displayOrder: data.displayOrder,
      status: data.status,
      ...(data.highlights && {
        highlights: {
          create: data.highlights.map((content, idx) => ({
            content,
            displayOrder: idx + 1,
          })),
        },
      }),
    },
    include: { highlights: true },
  });
  revalidatePath("/");
  return result;
}

export async function deleteExperience(id: string, siteId: string) {
  const result = await prisma.experience.delete({
    where: { id, siteId },
  });
  revalidatePath("/");
  return result;
}
