import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { getEffectiveSiteId } from "@/lib/services/site.service";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser();
    const siteId = await getEffectiveSiteId(user);

    if (!user || !siteId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, icon, displayOrder, status } = body;

    const dataToUpdate: any = {};
    if (title !== undefined) dataToUpdate.title = title.trim();
    if (description !== undefined) dataToUpdate.description = description ? description.trim() : null;
    if (icon !== undefined) dataToUpdate.icon = icon;
    if (displayOrder !== undefined) dataToUpdate.displayOrder = Number(displayOrder);
    if (status !== undefined) dataToUpdate.status = status;

    const updatedArea = await prisma.practiceArea.update({
      where: { id: params.id, siteId },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, practiceArea: updatedArea });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Lỗi cập nhật Lĩnh vực hoạt động" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser();
    const siteId = await getEffectiveSiteId(user);

    if (!user || !siteId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    await prisma.practiceArea.delete({
      where: { id: params.id, siteId },
    });

    return NextResponse.json({ success: true, message: "Đã xóa Lĩnh vực hoạt động thành công" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Lỗi xóa Lĩnh vực hoạt động" }, { status: 500 });
  }
}
