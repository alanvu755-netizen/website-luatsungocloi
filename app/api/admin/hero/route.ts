import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { getHero, updateHeroDraft } from "@/lib/services/hero.service";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user || !user.siteId) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  const hero = await getHero(user.siteId);
  return NextResponse.json({ success: true, hero });
}

export async function PUT(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || !user.siteId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const body = await request.json();
    const hero = await updateHeroDraft(user.siteId, body);
    return NextResponse.json({ success: true, hero });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Server Error" }, { status: 500 });
  }
}
