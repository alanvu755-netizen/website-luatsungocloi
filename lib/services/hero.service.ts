import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function getHero(siteId: string) {
  return await prisma.hero.findUnique({
    where: { siteId },
  });
}

export async function getPublishedHero(siteId: string) {
  const hero = await prisma.hero.findUnique({
    where: { siteId },
  });
  if (!hero || hero.status === "HIDDEN") return null;

  return {
    subtitle: hero.pubSubtitle,
    name: hero.pubName,
    imageUrl: hero.pubImageUrl || "/docs/design/customer-reference.png",
    imageId: hero.pubImageId,
    logoId: hero.pubLogoId,
  };
}

export async function updateHeroDraft(
  siteId: string,
  data: {
    draftSubtitle: string;
    draftName: string;
    draftImageUrl?: string | null;
    draftImageId?: string | null;
    draftLogoId?: string | null;
  }
) {
  return await prisma.hero.update({
    where: { siteId },
    data: {
      draftSubtitle: data.draftSubtitle,
      draftName: data.draftName,
      draftImageUrl: data.draftImageUrl,
      draftImageId: data.draftImageId,
      draftLogoId: data.draftLogoId,
    },
  });
}

export async function publishHero(siteId: string, adminUserId: string) {
  const hero = await prisma.hero.findUnique({ where: { siteId } });
  if (!hero) throw new Error("Hero record not found");

  // Atomic publish: copy draft* -> pub*
  const updatedHero = await prisma.hero.update({
    where: { siteId },
    data: {
      pubSubtitle: hero.draftSubtitle,
      pubName: hero.draftName,
      pubImageUrl: hero.draftImageUrl,
      pubImageId: hero.draftImageId,
      pubLogoId: hero.draftLogoId,
      status: "PUBLISHED",
    },
  });

  // AuditLog
  await prisma.auditLog.create({
    data: {
      siteId,
      adminUserId,
      action: "PUBLISH",
      entityType: "Hero",
      entityId: hero.id,
      metadata: JSON.stringify({
        pubSubtitle: hero.draftSubtitle,
        pubName: hero.draftName,
        pubImageUrl: hero.draftImageUrl,
      }),
    },
  });

  try { revalidatePath("/"); } catch (e) {}
  return updatedHero;
}
