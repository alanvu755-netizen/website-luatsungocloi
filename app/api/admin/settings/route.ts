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

  const settings = await prisma.siteSettings.findUnique({
    where: { siteId },
  });

  return NextResponse.json({ settings });
}

export async function PUT(req: Request) {
  const user = await getAuthenticatedUser();
  const siteId = await getEffectiveSiteId(user);

  if (!user || !siteId) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { phone, email, consultationNotificationEmail, address, floatingContactEnabled, footerDisclaimer } = body;

    const settings = await prisma.siteSettings.upsert({
      where: { siteId },
      update: {
        phone,
        email,
        consultationNotificationEmail: consultationNotificationEmail || "luatsungocloi@gmail.com",
        address,
        floatingContactEnabled,
        footerDisclaimer,
      },
      create: {
        siteId,
        phone: phone || "0902 081 061",
        email: email || "luatsungocloi@gmail.com",
        consultationNotificationEmail: consultationNotificationEmail || "luatsungocloi@gmail.com",
        address: address || "Số 149, đường Lê Thị Riêng, phường Cao Lãnh, Đồng Tháp",
        floatingContactEnabled: floatingContactEnabled ?? true,
        footerDisclaimer: footerDisclaimer || "",
      },
    });

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
