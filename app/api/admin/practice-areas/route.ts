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

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    const siteId = await getEffectiveSiteId(user);

    if (!user || !siteId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, icon, displayOrder, status } = body;

    if (!title || title.trim() === "") {
      return NextResponse.json({ message: "Tiêu đề lĩnh vực hoạt động là bắt buộc" }, { status: 400 });
    }

    const newArea = await prisma.practiceArea.create({
      data: {
        siteId,
        title: title.trim(),
        description: description ? description.trim() : null,
        icon: icon || "Home",
        displayOrder: Number(displayOrder) || 0,
        status: status || "PUBLISHED",
      },
    });

    return NextResponse.json({ success: true, practiceArea: newArea });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Lỗi tạo Lĩnh vực hoạt động" }, { status: 500 });
  }
}
