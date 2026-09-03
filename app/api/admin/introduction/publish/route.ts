import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { publishIntroduction } from "@/lib/services/introduction.service";
import { getEffectiveSiteId } from "@/lib/services/site.service";

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    const siteId = await getEffectiveSiteId(user);

    if (!user || !siteId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    let bodyData: any = undefined;
    try {
      bodyData = await req.json();
    } catch (e) {}

    const published = await publishIntroduction(siteId, user.id, bodyData);
    return NextResponse.json({ success: true, intro: published });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
