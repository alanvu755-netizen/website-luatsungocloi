import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { updateArticle } from "@/lib/services/article.service";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getAuthenticatedUser();
  if (!user || !user.siteId) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  const article = await prisma.article.findUnique({
    where: { id: params.id, siteId: user.siteId },
    include: { menu: true, submenu: true },
  });

  if (!article) {
    return NextResponse.json({ message: "Article not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, article });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || !user.siteId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const body = await request.json();
    const article = await updateArticle(params.id, user.siteId, body);
    return NextResponse.json({ success: true, article });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Server Error" }, { status: 500 });
  }
}
