import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export interface ArticleFilterOptions {
  menuId?: string;
  submenuId?: string;
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export async function getArticles(siteId: string, options?: ArticleFilterOptions) {
  const page = options?.page || 1;
  const pageSize = options?.pageSize || 10;
  const skip = (page - 1) * pageSize;

  const where: any = { siteId };
  if (options?.menuId) where.menuId = options.menuId;
  if (options?.submenuId) where.submenuId = options.submenuId;
  if (options?.status) where.status = options.status;
  if (options?.search) {
    where.OR = [
      { title: { contains: options.search } },
      { excerpt: { contains: options.search } },
    ];
  }

  const [articles, totalCount] = await Promise.all([
    prisma.article.findMany({
      where,
      include: {
        menu: true,
        submenu: true,
        createdBy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
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
  };
}

export async function getPublicArticles(
  siteId: string,
  options?: {
    menuSlug?: string;
    submenuSlug?: string;
    page?: number;
    pageSize?: number;
  }
) {
  const page = options?.page || 1;
  const pageSize = options?.pageSize || 10;
  const skip = (page - 1) * pageSize;

  const where: any = {
    siteId,
    status: "PUBLISHED",
    menu: { status: "VISIBLE" },
  };

  if (options?.menuSlug) {
    where.menu = { slug: options.menuSlug, status: "VISIBLE" };
  }

  if (options?.submenuSlug) {
    where.submenu = { slug: options.submenuSlug, status: "VISIBLE" };
  }

  const [articles, totalCount] = await Promise.all([
    prisma.article.findMany({
      where,
      select: {
        id: true,
        siteId: true,
        menuId: true,
        submenuId: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        thumbnailUrl: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        menu: { select: { id: true, title: true, slug: true } },
        submenu: { select: { id: true, title: true, slug: true } },
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
  };
}

export async function getPublicArticleBySlug(
  siteId: string,
  menuSlug: string,
  articleSlug: string,
  submenuSlug?: string
) {
  const where: any = {
    siteId,
    slug: articleSlug,
    status: "PUBLISHED",
    menu: { slug: menuSlug, status: "VISIBLE" },
  };

  if (submenuSlug) {
    where.submenu = { slug: submenuSlug, status: "VISIBLE" };
  }

  return await prisma.article.findFirst({
    where,
    include: {
      menu: true,
      submenu: true,
    },
  });
}

export async function createArticle(
  siteId: string,
  createdById: string,
  data: {
    menuId: string;
    submenuId?: string | null;
    title: string;
    slug: string;
    excerpt?: string | null;
    content: string;
    thumbnailUrl?: string | null;
    status?: "DRAFT" | "PUBLISHED" | "HIDDEN";
    seoTitle?: string | null;
    metaDescription?: string | null;
    keywords?: string | null;
  }
) {
  const isPublishing = data.status === "PUBLISHED";

  const result = await prisma.article.create({
    data: {
      siteId,
      createdById,
      menuId: data.menuId,
      submenuId: data.submenuId || null,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      thumbnailUrl: data.thumbnailUrl,
      status: data.status || "DRAFT",
      publishedAt: isPublishing ? new Date() : null,
      seoTitle: data.seoTitle,
      metaDescription: data.metaDescription,
      keywords: data.keywords,
    },
  });

  try {
    revalidatePath("/");
    revalidatePath("/admin/articles");
    revalidatePath("/[menuSlug]", "page");
    revalidatePath("/[menuSlug]/[submenuSlug]", "page");
  } catch (e) {}
  return result;
}

export async function updateArticle(
  id: string,
  siteId: string,
  data: {
    menuId?: string;
    submenuId?: string | null;
    title?: string;
    slug?: string;
    excerpt?: string | null;
    content?: string;
    thumbnailUrl?: string | null;
    status?: "DRAFT" | "PUBLISHED" | "HIDDEN";
    seoTitle?: string | null;
    metaDescription?: string | null;
    keywords?: string | null;
  }
) {
  const existing = await prisma.article.findUnique({ where: { id, siteId } });
  if (!existing) throw new Error("Article not found");

  const willBePublished = data.status === "PUBLISHED" && existing.status !== "PUBLISHED";

  const result = await prisma.article.update({
    where: { id, siteId },
    data: {
      ...data,
      publishedAt: willBePublished ? new Date() : existing.publishedAt,
    },
  });

  try {
    revalidatePath("/");
    revalidatePath("/admin/articles");
    revalidatePath("/[menuSlug]", "page");
    revalidatePath("/[menuSlug]/[submenuSlug]", "page");
  } catch (e) {}
  return result;
}

export async function publishArticle(id: string, siteId: string) {
  const result = await prisma.article.update({
    where: { id, siteId },
    data: {
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  try {
    revalidatePath("/");
    revalidatePath("/admin/articles");
    revalidatePath("/[menuSlug]", "page");
    revalidatePath("/[menuSlug]/[submenuSlug]", "page");
  } catch (e) {}
  return result;
}

export async function deleteArticle(id: string, siteId: string) {
  const result = await prisma.article.delete({
    where: { id, siteId },
  });

  try {
    revalidatePath("/");
    revalidatePath("/admin/articles");
    revalidatePath("/[menuSlug]", "page");
    revalidatePath("/[menuSlug]/[submenuSlug]", "page");
  } catch (e) {}
  return result;
}
