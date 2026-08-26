import { prisma } from "@/lib/db/prisma";

export interface ArticleSearchResultItem {
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

export interface SearchArticlesOptions {
  siteId: string;
  query: string;
  practiceAreaId?: string;
  menuSlug?: string;
  submenuSlug?: string;
  page?: number;
  pageSize?: number;
}

export interface SearchArticlesResult {
  articles: ArticleSearchResultItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  query: string;
}

/**
 * Backend Search Service Foundation
 * Searches articles matching query in TITLE or CONTENT (case-insensitive)
 * Scoped by siteId and optional Practice Area / Menu / Submenu context.
 */
export async function searchPublicArticles(
  options: SearchArticlesOptions
): Promise<SearchArticlesResult> {
  const page = options.page && options.page > 0 ? options.page : 1;
  const pageSize = options.pageSize && options.pageSize > 0 ? options.pageSize : 10;
  const skip = (page - 1) * pageSize;
  const searchQuery = options.query ? options.query.trim() : "";

  if (!searchQuery) {
    return {
      articles: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: page,
      query: "",
    };
  }

  const where: any = {
    siteId: options.siteId,
    status: "PUBLISHED",
    OR: [
      { title: { contains: searchQuery, mode: "insensitive" } },
      { content: { contains: searchQuery, mode: "insensitive" } },
    ],
  };

  // Scope filter by N-N PracticeArea or Menu/Submenu if provided
  if (options.practiceAreaId) {
    where.articlePracticeAreas = {
      some: {
        practiceAreaId: options.practiceAreaId,
      },
    };
  } else if (options.submenuSlug) {
    where.submenu = { slug: options.submenuSlug, status: "VISIBLE" };
  } else if (options.menuSlug) {
    where.menu = { slug: options.menuSlug, status: "VISIBLE" };
  }

  try {
    const [articles, totalCount] = await Promise.all([
      prisma.article.findMany({
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
        skip,
        take: pageSize,
      }),
      prisma.article.count({ where }),
    ]);

    return {
      articles,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page,
      query: searchQuery,
    };
  } catch (error) {
    console.error("[SearchService] Error searching articles:", error);
    return {
      articles: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: page,
      query: searchQuery,
    };
  }
}
