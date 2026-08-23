import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user?.siteId) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  const settings = await prisma.siteSettings.findUnique({
    where: { siteId: user.siteId },
  });

  return NextResponse.json({ settings });
}

export async function PUT(req: Request) {
  const user = await getAuthenticatedUser();
  if (!user?.siteId) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { phone, email, address, floatingContactEnabled } = body;

    const settings = await prisma.siteSettings.upsert({
      where: { siteId: user.siteId },
      update: {
        phone,
        email,
        address,
        floatingContactEnabled,
      },
      create: {
        siteId: user.siteId,
        phone: phone || "0902 081 061",
        email: email || "luatsuloi@gmail.com",
        address: address || "Số 149, đường Lê Thị Riêng, phường Cao Lãnh, Đồng Tháp",
        floatingContactEnabled: floatingContactEnabled ?? true,
      },
    });

    return NextResponse.json({ settings, message: "✓ Cập nhật cài đặt chung thành công!" });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Lỗi cập nhật cài đặt." },
      { status: 500 }
    );
  }
}
