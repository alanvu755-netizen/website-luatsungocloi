import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser();
    const isSysAdmin = user?.role?.name === "SYSADMIN" || user?.roleId === "SYSADMIN";
    if (!user || !isSysAdmin) {
      return NextResponse.json(
        { message: "Chỉ SYSADMIN mới có quyền cập nhật Mục tiêu bài viết AI" },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { name, description, promptGuidance, ctaGuidance, displayOrder, status } = body;

    const updatedObjective = await prisma.contentObjective.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(promptGuidance !== undefined && { promptGuidance }),
        ...(ctaGuidance !== undefined && { ctaGuidance }),
        ...(displayOrder !== undefined && { displayOrder: parseInt(displayOrder) }),
        ...(status !== undefined && { status: Boolean(status) }),
      },
    });

    return NextResponse.json({ success: true, objective: updatedObjective });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Lỗi cập nhật Mục tiêu bài viết" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser();
    const isSysAdmin = user?.role?.name === "SYSADMIN" || user?.roleId === "SYSADMIN";
    if (!user || !isSysAdmin) {
      return NextResponse.json(
        { message: "Chỉ SYSADMIN mới có quyền xóa Mục tiêu bài viết AI" },
        { status: 403 }
      );
    }

    const { id } = params;
    await prisma.contentObjective.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Đã xóa Mục tiêu bài viết" });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Lỗi xóa Mục tiêu bài viết" },
      { status: 500 }
    );
  }
}
