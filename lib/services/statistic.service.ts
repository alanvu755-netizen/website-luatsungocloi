import { prisma } from "@/lib/db/prisma";

export interface StatisticItemData {
  id: string;
  siteId: string;
  value: string;
  label: string;
  subtext: string | null;
  displayOrder: number;
  status: boolean;
}

/**
 * Fetch active public statistic items for Homepage/Public display
 * Strictly CMS-editable via database, ordered by displayOrder asc
 */
export async function getPublicStatistics(siteId: string): Promise<StatisticItemData[]> {
  try {
    const items = await prisma.statisticItem.findMany({
      where: {
        siteId,
        status: true,
      },
      orderBy: {
        displayOrder: "asc",
      },
    });

    return items;
  } catch (error) {
    console.error("[StatisticService] Error fetching public statistics:", error);
    return [];
  }
}

/**
 * Fetch all statistic items (including disabled) for Admin CMS management
 */
export async function getAllStatistics(siteId: string): Promise<StatisticItemData[]> {
  try {
    const items = await prisma.statisticItem.findMany({
      where: { siteId },
      orderBy: { displayOrder: "asc" },
    });
    return items;
  } catch (error) {
    console.error("[StatisticService] Error fetching all statistics:", error);
    return [];
  }
}

/**
 * Update an existing StatisticItem (value, label, subtext, displayOrder, status)
 */
export async function updateStatisticItem(
  id: string,
  siteId: string,
  data: {
    value?: string;
    label?: string;
    subtext?: string | null;
    displayOrder?: number;
    status?: boolean;
  }
): Promise<StatisticItemData> {
  const item = await prisma.statisticItem.update({
    where: { id, siteId },
    data,
  });
  return item;
}

/**
 * Create a new StatisticItem
 */
export async function createStatisticItem(
  siteId: string,
  data: {
    value: string;
    label: string;
    subtext?: string | null;
    displayOrder?: number;
    status?: boolean;
  }
): Promise<StatisticItemData> {
  const item = await prisma.statisticItem.create({
    data: {
      siteId,
      value: data.value,
      label: data.label,
      subtext: data.subtext || null,
      displayOrder: data.displayOrder ?? 0,
      status: data.status ?? true,
    },
  });
  return item;
}

