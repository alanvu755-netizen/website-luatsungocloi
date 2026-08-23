import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { publishHero } from "@/lib/services/hero.service";

export async function POST() {
  try {
    const user = await getAuthenticatedUser();
    if (!user || !user.siteId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const hero = await publishHero(user.siteId, user.id);
    return NextResponse.json({ success: true, hero });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Server Error" }, { status: 500 });
  }
}
