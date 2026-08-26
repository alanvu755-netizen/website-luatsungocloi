import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { memoize } from "@/lib/utils/cache";

export async function getHero(siteId: string) {
  return await prisma.hero.findUnique({
    where: { siteId },
  });
}

export const getPublishedHero = memoize(async (siteId: string) => {
  const hero = await prisma.hero.findUnique({
    where: { siteId },
  });
  if (!hero || hero.status === "HIDDEN") return null;

  return {
    subtitle: hero.pubSubtitle,
    name: hero.pubName,
    imageUrl: hero.pubImageUrl || "/customer-reference.png",
    title1: hero.pubTitle1 || "ĐỒNG HÀNH PHÁP LÝ",
    title2: hero.pubTitle2 || "BẢO VỆ QUYỀN & LỢI ÍCH HỢP PHÁP",
    description: hero.pubDescription,
    badgesJson: hero.pubBadgesJson,
    ctaPrimaryText: hero.pubCtaPrimaryText,
    ctaSecondaryText: hero.pubCtaSecondaryText,
    imageId: hero.pubImageId,
    logoId: hero.pubLogoId,
  };
});

export async function updateHeroDraft(
  siteId: string,
  data: {
    draftSubtitle: string;
    draftName: string;
    draftImageUrl?: string | null;
    draftTitle1?: string | null;
    draftTitle2?: string | null;
    draftDescription?: string | null;
    draftBadgesJson?: string | null;
    draftCtaPrimaryText?: string | null;
    draftCtaSecondaryText?: string | null;
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
      draftTitle1: data.draftTitle1,
      draftTitle2: data.draftTitle2,
      draftDescription: data.draftDescription,
      draftBadgesJson: data.draftBadgesJson,
      draftCtaPrimaryText: data.draftCtaPrimaryText,
      draftCtaSecondaryText: data.draftCtaSecondaryText,
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
      pubTitle1: hero.draftTitle1,
      pubTitle2: hero.draftTitle2,
      pubDescription: hero.draftDescription,
      pubBadgesJson: hero.draftBadgesJson,
      pubCtaPrimaryText: hero.draftCtaPrimaryText,
      pubCtaSecondaryText: hero.draftCtaSecondaryText,
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
