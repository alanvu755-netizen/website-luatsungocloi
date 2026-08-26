import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { getEffectiveSiteId } from "@/lib/services/site.service";

export async function GET() {
  const user = await getAuthenticatedUser();
  const siteId = await getEffectiveSiteId(user);

  if (!user || !siteId) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  const practiceAreas = await prisma.practiceArea.findMany({
    where: { siteId },
    orderBy: { displayOrder: "asc" },
  });

  return NextResponse.json({ success: true, practiceAreas });
}
