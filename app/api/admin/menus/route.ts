import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { getMenus } from "@/lib/services/menu.service";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user || !user.siteId) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  const menus = await getMenus(user.siteId);
  return NextResponse.json({ success: true, menus });
}
