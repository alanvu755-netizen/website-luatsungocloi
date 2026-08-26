import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { getHero, updateHeroDraft } from "@/lib/services/hero.service";
import { getEffectiveSiteId } from "@/lib/services/site.service";

export async function GET() {
  const user = await getAuthenticatedUser();
  const siteId = await getEffectiveSiteId(user);

  if (!user || !siteId) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  const hero = await getHero(siteId);
  return NextResponse.json({ success: true, hero });
}

export async function PUT(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    const siteId = await getEffectiveSiteId(user);

    if (!user || !siteId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const body = await request.json();
    const hero = await updateHeroDraft(siteId, body);
    return NextResponse.json({ success: true, hero });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Server Error" }, { status: 500 });
  }
}
