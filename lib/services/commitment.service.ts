import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { memoize } from "@/lib/utils/cache";

export async function getCommitment(siteId: string) {
  return await prisma.commitment.findUnique({
    where: { siteId },
  });
}

export const getPublishedCommitment = memoize(async (siteId: string) => {
  const commitment = await prisma.commitment.findUnique({
    where: { siteId },
  });
  if (!commitment || commitment.status === "HIDDEN") return null;

  return {
    heading: commitment.pubHeading,
    content: commitment.pubContent,
  };
});

export async function updateCommitmentDraft(
  siteId: string,
  data: {
    draftHeading: string;
    draftContent: string;
  }
) {
  return await prisma.commitment.update({
    where: { siteId },
    data: {
      draftHeading: data.draftHeading,
      draftContent: data.draftContent,
    },
  });
}

export async function publishCommitment(siteId: string, adminUserId: string) {
  const commitment = await prisma.commitment.findUnique({ where: { siteId } });
  if (!commitment) throw new Error("Commitment record not found");

  // Atomic publish: copy draft* -> pub*
  const updatedCommitment = await prisma.commitment.update({
    where: { siteId },
    data: {
      pubHeading: commitment.draftHeading,
      pubContent: commitment.draftContent,
      status: "PUBLISHED",
    },
  });

  // AuditLog
  await prisma.auditLog.create({
    data: {
      siteId,
      adminUserId,
      action: "PUBLISH",
      entityType: "Commitment",
      entityId: commitment.id,
      metadata: JSON.stringify({
        pubHeading: commitment.draftHeading,
      }),
    },
  });

  revalidatePath("/");
  return updatedCommitment;
}
