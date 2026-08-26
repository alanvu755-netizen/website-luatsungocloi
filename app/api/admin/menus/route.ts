import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { getMenus, createMenu } from "@/lib/services/menu.service";
import { getEffectiveSiteId } from "@/lib/services/site.service";

export async function GET() {
  const user = await getAuthenticatedUser();
  const siteId = await getEffectiveSiteId(user);

  if (!user || !siteId) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  const menus = await getMenus(siteId);
  return NextResponse.json({ success: true, menus });
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    const siteId = await getEffectiveSiteId(user);

    if (!user || !siteId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const body = await req.json();
    const menu = await createMenu(siteId, body);
    return NextResponse.json({ success: true, menu });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Lỗi tạo Menu" }, { status: 500 });
  }
}
