import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { memoize } from "@/lib/utils/cache";

export async function getIntroduction(siteId: string) {
  return await prisma.introduction.findUnique({
    where: { siteId },
  });
}

export const getPublishedIntroduction = memoize(async (siteId: string) => {
  const intro = await prisma.introduction.findUnique({
    where: { siteId },
  });
  if (!intro || intro.status === "HIDDEN") return null;

  return {
    title: intro.pubTitle,
    content: intro.pubContent,
  };
});

export async function updateIntroductionDraft(
  siteId: string,
  data: {
    draftTitle: string;
    draftContent: string;
  }
) {
  return await prisma.introduction.update({
    where: { siteId },
    data: {
      draftTitle: data.draftTitle,
      draftContent: data.draftContent,
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
