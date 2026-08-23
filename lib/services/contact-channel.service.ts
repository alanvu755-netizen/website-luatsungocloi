import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { memoize } from "@/lib/utils/cache";

export type Platform = "ZALO" | "TELEGRAM" | "FACEBOOK" | "LINKEDIN" | "YOUTUBE" | "WHATSAPP" | "OTHER";

export async function getContactChannels(siteId: string) {
  return await prisma.contactChannel.findMany({
    where: { siteId },
    orderBy: { displayOrder: "asc" },
  });
}

export const getEnabledContactChannels = memoize(async (siteId: string) => {
  return await prisma.contactChannel.findMany({
    where: {
      siteId,
      status: true, // ON status only
    },
    orderBy: { displayOrder: "asc" },
  });
});

export async function updateContactChannel(
  id: string,
  siteId: string,
  data: {
    platform?: Platform;
    label?: string;
    value?: string | null;
    url?: string;
    displayOrder?: number;
    status?: boolean;
    openInNewTab?: boolean;
  }
) {
  // Check validation rules if turning ON
  if (data.status === true) {
    const existing = await prisma.contactChannel.findUnique({ where: { id, siteId } });
    const targetUrl = data.url ?? existing?.url;
    if (!targetUrl || targetUrl.trim() === "") {
      throw new Error("Không thể BẬT (ON) kênh liên hệ khi URL chưa được nhập.");
    }
  }

  const result = await prisma.contactChannel.update({
    where: { id, siteId },
    data,
  });
  revalidatePath("/");
  return result;
}

export async function toggleContactChannelStatus(
  id: string,
  siteId: string,
  status: boolean
) {
  const existing = await prisma.contactChannel.findUnique({ where: { id, siteId } });
  if (!existing) throw new Error("ContactChannel not found");

  if (status === true && (!existing.url || existing.url.trim() === "")) {
    throw new Error("Không thể BẬT (ON) kênh liên hệ khi URL chưa được nhập.");
  }

  const result = await prisma.contactChannel.update({
    where: { id, siteId },
    data: { status },
  });
  revalidatePath("/");
  return result;
}
