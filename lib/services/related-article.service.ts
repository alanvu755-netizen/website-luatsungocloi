import { prisma } from "@/lib/db/prisma";

export interface RelatedArticleItem {
  id: string;
  siteId: string;
  title: string;
  slug: string;
  excerpt: string | null;
  thumbnailUrl: string | null;
  publishedAt: Date | null;
  menu?: { title: string; slug: string } | null;
  submenu?: { title: string; slug: string } | null;
}

export interface GetRelatedArticlesParams {
  siteId: string;
  currentArticleId: string;
  submenuId?: string | null;
  menuId?: string | null;
  practiceAreaIds?: string[];
  limit?: number;
}

/**
 * Backend Service Foundation for Related Articles
 * Fetches published articles sharing the same Practice Area or Submenu/Menu,
 * excluding the current article, ordered newest first (max 3).
 */
export async function getRelatedArticles(
  params: GetRelatedArticlesParams
): Promise<RelatedArticleItem[]> {
  const limit = params.limit && params.limit > 0 ? params.limit : 3;

  try {
    const where: any = {
      siteId: params.siteId,
      status: "PUBLISHED",
      id: { not: params.currentArticleId },
    };

    // Match by N-N PracticeArea junction first if available
    if (params.practiceAreaIds && params.practiceAreaIds.length > 0) {
      where.articlePracticeAreas = {
        some: {
          practiceAreaId: { in: params.practiceAreaIds },
        },
      };
    } else if (params.submenuId) {
      where.submenuId = params.submenuId;
    } else if (params.menuId) {
      where.menuId = params.menuId;
    } else {
      // If no category context is available, return empty safe collection
      return [];
    }

    const relatedArticles = await prisma.article.findMany({
      where,
      select: {
        id: true,
        siteId: true,
        title: true,
        slug: true,
        excerpt: true,
        thumbnailUrl: true,
        publishedAt: true,
        menu: { select: { title: true, slug: true } },
        submenu: { select: { title: true, slug: true } },
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });

    return relatedArticles;
  } catch (error) {
    console.error("[RelatedArticleService] Error fetching related articles:", error);
    return [];
  }
}
