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
  };
}

export async function updateIntroductionDraft(
  siteId: string,
  data: {
    draftTitle: string;
    draftContent: string;
    draftImageUrl?: string | null;
  }
) {
  return await prisma.introduction.update({
    where: { siteId },
    data: {
      draftTitle: data.draftTitle,
      draftContent: data.draftContent,
      draftImageUrl: data.draftImageUrl || "/NgocLoi-office.jpg",
    },
  });
}

export async function publishIntroduction(siteId: string, adminUserId: string) {
  const intro = await prisma.introduction.findUnique({ where: { siteId } });
  if (!intro) throw new Error("Introduction record not found");

  // Atomic publish: copy draft* -> pub*
  const updatedIntro = await prisma.introduction.update({
    where: { siteId },
    data: {
      pubTitle: intro.draftTitle,
      pubContent: intro.draftContent,
      pubImageUrl: intro.draftImageUrl || "/NgocLoi-office.jpg",
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
        pubTitle: intro.draftTitle,
      }),
    },
  });

  revalidatePath("/");
  return updatedIntro;
}
