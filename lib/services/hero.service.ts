import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { memoize } from "@/lib/utils/cache";

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
}

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

export async function publishHero(siteId: string, adminUserId: string, data?: any) {
  const hero = await prisma.hero.findUnique({ where: { siteId } });
  if (!hero) throw new Error("Hero record not found");

  const subtitle = data?.draftSubtitle !== undefined ? data.draftSubtitle : hero.draftSubtitle;
  const name = data?.draftName !== undefined ? data.draftName : hero.draftName;
  const imageUrl = data?.draftImageUrl !== undefined ? data.draftImageUrl : hero.draftImageUrl;
  const title1 = data?.draftTitle1 !== undefined ? data.draftTitle1 : hero.draftTitle1;
  const title2 = data?.draftTitle2 !== undefined ? data.draftTitle2 : hero.draftTitle2;
  const description = data?.draftDescription !== undefined ? data.draftDescription : hero.draftDescription;
  const badgesJson = data?.draftBadgesJson !== undefined ? data.draftBadgesJson : hero.draftBadgesJson;
  const ctaPrimaryText = data?.draftCtaPrimaryText !== undefined ? data.draftCtaPrimaryText : hero.draftCtaPrimaryText;
  const ctaSecondaryText = data?.draftCtaSecondaryText !== undefined ? data.draftCtaSecondaryText : hero.draftCtaSecondaryText;

  // Atomic publish: save draft* & pub* simultaneously
  const updatedHero = await prisma.hero.update({
    where: { siteId },
    data: {
      draftSubtitle: subtitle,
      draftName: name,
      draftImageUrl: imageUrl,
      draftTitle1: title1,
      draftTitle2: title2,
      draftDescription: description,
      draftBadgesJson: badgesJson,
      draftCtaPrimaryText: ctaPrimaryText,
      draftCtaSecondaryText: ctaSecondaryText,

      pubSubtitle: subtitle,
      pubName: name,
      pubImageUrl: imageUrl,
      pubTitle1: title1,
      pubTitle2: title2,
      pubDescription: description,
      pubBadgesJson: badgesJson,
      pubCtaPrimaryText: ctaPrimaryText,
      pubCtaSecondaryText: ctaSecondaryText,

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
        pubSubtitle: subtitle,
      }),
    },
  });

  try {
    revalidatePath("/");
    revalidatePath("/admin/hero");
  } catch (e) {}

  return updatedHero;
}
