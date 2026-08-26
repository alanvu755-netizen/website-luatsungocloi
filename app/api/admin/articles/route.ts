import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { createArticle, getArticles } from "@/lib/services/article.service";
import { getEffectiveSiteId } from "@/lib/services/site.service";

export async function GET(request: Request) {
  const user = await getAuthenticatedUser();
  const siteId = await getEffectiveSiteId(user);

  if (!user || !siteId) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const menuId = searchParams.get("menuId") || "";

  const result = await getArticles(siteId, { page, search, menuId });
  return NextResponse.json({ success: true, ...result });
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    const siteId = await getEffectiveSiteId(user);

    if (!user || !siteId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const body = await request.json();
    const article = await createArticle(siteId, user.id, body);
    return NextResponse.json({ success: true, article });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Server Error" }, { status: 500 });
  }
}
