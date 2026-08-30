import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { updateIntroductionDraft } from "@/lib/services/introduction.service";
import { getEffectiveSiteId } from "@/lib/services/site.service";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    const siteId = await getEffectiveSiteId(user);

    if (!user || !siteId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const intro = await prisma.introduction.findUnique({
      where: { siteId },
    });

    return NextResponse.json({ intro });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    const siteId = await getEffectiveSiteId(user);

    if (!user || !siteId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { draftTitle, draftContent, draftImageUrl, draftHighlightsJson } = body;

    const updated = await updateIntroductionDraft(siteId, {
      draftTitle,
      draftContent,
      draftImageUrl: draftImageUrl || "/NgocLoi-office.jpg",
      draftHighlightsJson,
    });

    return NextResponse.json({ success: true, intro: updated });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
