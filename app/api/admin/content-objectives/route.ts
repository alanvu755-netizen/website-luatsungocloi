import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { DEFAULT_OBJECTIVES } from "@/prisma/seed-objectives";

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    const isSysAdmin = user?.role?.name === "SYSADMIN" || user?.roleId === "SYSADMIN";

    let objectives = await prisma.contentObjective.findMany({
      where: isSysAdmin ? {} : { status: true },
      orderBy: { displayOrder: "asc" },
    });

    // Auto-seed if database is empty
    if (objectives.length === 0) {
      for (const item of DEFAULT_OBJECTIVES) {
        await prisma.contentObjective.upsert({
          where: { code: item.code },
          update: {
            name: item.name,
            description: item.description,
            promptGuidance: item.promptGuidance,
            ctaGuidance: item.ctaGuidance,
            displayOrder: item.displayOrder,
            status: item.status,
          },
          create: item,
        });
      }
      objectives = await prisma.contentObjective.findMany({
        where: isSysAdmin ? {} : { status: true },
        orderBy: { displayOrder: "asc" },
      });
    }

    return NextResponse.json({ success: true, objectives });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Lỗi tải danh sách Mục tiêu bài viết" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    const isSysAdmin = user?.role?.name === "SYSADMIN" || user?.roleId === "SYSADMIN";
    if (!user || !isSysAdmin) {
      return NextResponse.json(
        { message: "Chỉ SYSADMIN mới có quyền tạo Mục tiêu bài viết AI" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { code, name, description, promptGuidance, ctaGuidance, displayOrder, status } = body;

    if (!code || !name || !promptGuidance) {
      return NextResponse.json(
        { message: "Mã (code), Tên hiển thị và Hướng dẫn chiến lược promptGuidance là bắt buộc" },
        { status: 400 }
      );
    }

    const formattedCode = code.trim().toUpperCase().replace(/[^A-Z0-9_]/g, "_");

    const newObjective = await prisma.contentObjective.create({
      data: {
        code: formattedCode,
        name,
        description: description || null,
        promptGuidance,
        ctaGuidance: ctaGuidance || null,
        displayOrder: parseInt(displayOrder || "0"),
        status: status ?? true,
      },
    });

    return NextResponse.json({ success: true, objective: newObjective });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Lỗi tạo Mục tiêu bài viết" },
      { status: 500 }
    );
  }
}
