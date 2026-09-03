import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { memoize } from "@/lib/utils/cache";

export async function getIntroduction(siteId: string) {
  return await prisma.introduction.findUnique({
    where: { siteId },
  });
}

export async function getPublishedIntroduction(siteId: string) {
  const intro = await prisma.introduction.findUnique({
    where: { siteId },
  });
  if (!intro || intro.status === "HIDDEN") return null;

  return {
    title: intro.pubTitle,
    content: intro.pubContent,
    imageUrl: intro.pubImageUrl || "/NgocLoi-office.jpg",
    highlightsJson: intro.pubHighlightsJson,
  };
}

export async function updateIntroductionDraft(
  siteId: string,
  data: {
    draftTitle: string;
    draftContent: string;
    draftImageUrl?: string | null;
    draftHighlightsJson?: string | null;
  }
) {
  return await prisma.introduction.update({
    where: { siteId },
    data: {
      draftTitle: data.draftTitle,
      draftContent: data.draftContent,
      draftImageUrl: data.draftImageUrl || "/NgocLoi-office.jpg",
      draftHighlightsJson: data.draftHighlightsJson,
    },
  });
}

export async function publishIntroduction(
  siteId: string,
  adminUserId: string,
  data?: {
    draftTitle?: string;
    draftContent?: string;
    draftImageUrl?: string | null;
    draftHighlightsJson?: string | null;
  }
) {
  const intro = await prisma.introduction.findUnique({ where: { siteId } });
  if (!intro) throw new Error("Introduction record not found");

  const titleToUse = data?.draftTitle ?? intro.draftTitle;
  const contentToUse = data?.draftContent ?? intro.draftContent;
  const imageToUse = (data?.draftImageUrl !== undefined ? data.draftImageUrl : intro.draftImageUrl) || "/NgocLoi-office.jpg";
  const highlightsToUse = data?.draftHighlightsJson !== undefined ? data.draftHighlightsJson : intro.draftHighlightsJson;

  // Atomic publish: save draft* & pub* simultaneously
  const updatedIntro = await prisma.introduction.update({
    where: { siteId },
    data: {
      draftTitle: titleToUse,
      draftContent: contentToUse,
      draftImageUrl: imageToUse,
      draftHighlightsJson: highlightsToUse,
      pubTitle: titleToUse,
      pubContent: contentToUse,
      pubImageUrl: imageToUse,
      pubHighlightsJson: highlightsToUse,
      status: "PUBLISHED",
    },
  });

  // AuditLog
  await prisma.auditLog.create({
    data: {
      siteId,
      adminUserId,
      action: "PUBLISH",
      entityType: "Introduction",
      entityId: intro.id,
      metadata: JSON.stringify({
        pubTitle: titleToUse,
      }),
    },
  });

  try {
    revalidatePath("/");
    revalidatePath("/gioi-thieu");
    revalidatePath("/admin/introduction");
  } catch (e) {}

  return updatedIntro;
}
