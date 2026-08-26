import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { publishIntroduction } from "@/lib/services/introduction.service";
import { getEffectiveSiteId } from "@/lib/services/site.service";

export async function POST() {
  try {
    const user = await getAuthenticatedUser();
    const siteId = await getEffectiveSiteId(user);

    if (!user || !siteId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const published = await publishIntroduction(siteId, user.id);
    return NextResponse.json({ success: true, intro: published });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
