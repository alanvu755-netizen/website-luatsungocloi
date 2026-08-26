import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { memoize, cachedQuery } from "@/lib/utils/cache";

export type Platform = "ZALO" | "TELEGRAM" | "FACEBOOK" | "LINKEDIN" | "YOUTUBE" | "WHATSAPP" | "PHONE" | "EMAIL" | "OTHER";

const DEFAULT_CHANNELS_SEED = [
  {
    platform: "ZALO",
    label: "Zalo Tư Vấn",
    url: "https://zalo.me/0902081061",
    displayOrder: 1,
    status: true,
  },
  {
    platform: "FACEBOOK",
    label: "Facebook Messenger",
    url: "https://m.me/luatsu.lethingocloi",
    displayOrder: 2,
    status: true,
  },
  {
    platform: "TELEGRAM",
    label: "Telegram",
    url: "",
    displayOrder: 3,
    status: false,
  },
  {
    platform: "PHONE",
    label: "Hotline 24/7",
    url: "tel:0902081061",
    displayOrder: 4,
    status: true,
  },
  {
    platform: "EMAIL",
    label: "Email Tư Vấn",
    url: "mailto:luatsuloi@gmail.com",
    displayOrder: 5,
    status: true,
  },
];

export async function getContactChannels(siteId: string) {
  let channels = await prisma.contactChannel.findMany({
    where: { siteId },
    orderBy: { displayOrder: "asc" },
  });

  if (channels.length === 0) {
    await prisma.contactChannel.createMany({
      data: DEFAULT_CHANNELS_SEED.map((ch) => ({
        siteId,
        platform: ch.platform,
        label: ch.label,
        url: ch.url,
        displayOrder: ch.displayOrder,
        status: ch.status,
      })),
    });

    channels = await prisma.contactChannel.findMany({
      where: { siteId },
      orderBy: { displayOrder: "asc" },
    });
  }

  return channels;
}

export const getEnabledContactChannels = memoize(async (siteId: string) => {
  return await cachedQuery(
    async () =>
      prisma.contactChannel.findMany({
        where: {
          siteId,
          status: true, // ON status only
        },
        orderBy: { displayOrder: "asc" },
      }),
    [`enabled_contact_channels_${siteId}`],
    { revalidate: 60, tags: ["contact_channels"] }
  )();
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
  let existing = await prisma.contactChannel.findFirst({
    where: { id, siteId },
  });

  if (!existing && data.platform) {
    existing = await prisma.contactChannel.findFirst({
      where: { siteId, platform: data.platform },
    });
  }

  if (!existing) {
    const channels = await getContactChannels(siteId);
    existing = channels.find((c) => c.id === id || c.platform === data.platform) || null;
  }

  const targetUrl = data.url !== undefined ? data.url : existing?.url;
  const targetStatus = data.status !== undefined ? data.status : existing?.status;

  if (targetStatus === true) {
    if (!targetUrl || targetUrl.trim() === "") {
      throw new Error("Không thể BẬT (ON) kênh liên hệ khi URL chưa được nhập.");
    }
  }

  if (existing) {
    const result = await prisma.contactChannel.update({
      where: { id: existing.id },
      data: {
        ...(data.platform && { platform: data.platform }),
        ...(data.label && { label: data.label }),
        ...(data.value !== undefined && { value: data.value }),
        ...(data.url !== undefined && { url: data.url }),
        ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.openInNewTab !== undefined && { openInNewTab: data.openInNewTab }),
      },
    });
    revalidatePath("/");
    return result;
  } else {
    const result = await prisma.contactChannel.create({
      data: {
        siteId,
        platform: data.platform || "OTHER",
        label: data.label || "Kênh liên hệ",
        url: data.url || "",
        displayOrder: data.displayOrder ?? 0,
        status: data.status ?? false,
        openInNewTab: data.openInNewTab ?? true,
      },
    });
    revalidatePath("/");
    return result;
  }
}

export async function toggleContactChannelStatus(
  id: string,
  siteId: string,
  status: boolean
) {
  let existing = await prisma.contactChannel.findFirst({
    where: { id, siteId },
  });

  if (!existing) {
    const channels = await getContactChannels(siteId);
    existing = channels.find((c) => c.id === id) || null;
  }

  if (!existing) {
    throw new Error("Kênh liên hệ không tồn tại trong hệ thống.");
  }

  if (status === true && (!existing.url || existing.url.trim() === "")) {
    throw new Error("Không thể BẬT (ON) kênh liên hệ khi URL chưa được nhập.");
  }

  const result = await prisma.contactChannel.update({
    where: { id: existing.id },
    data: { status },
  });
  revalidatePath("/");
  return result;
}
