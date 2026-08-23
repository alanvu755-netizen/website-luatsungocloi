import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { createSession } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    const user = await prisma.adminUser.findUnique({
      where: { email: validatedData.email, status: true },
      include: { role: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Email hoặc mật khẩu không chính xác" },
        { status: 401 }
      );
    }

    const passwordValid = await bcrypt.compare(validatedData.password, user.passwordHash);
    if (!passwordValid) {
      return NextResponse.json(
        { message: "Email hoặc mật khẩu không chính xác" },
        { status: 401 }
      );
    }

    // Update lastLoginAt
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Create HttpOnly Session Cookie
    await createSession(user.id, user.email, user.role.name, user.siteId);

    // Record AuditLog
    await prisma.auditLog.create({
      data: {
        siteId: user.siteId,
        adminUserId: user.id,
        action: "LOGIN",
        entityType: "AdminUser",
        entityId: user.id,
        metadata: JSON.stringify({ email: user.email, role: user.role.name }),
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { message: error.errors[0]?.message || "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Lỗi máy chủ nội bộ trong quá trình xử lý" },
      { status: 500 }
    );
  }
}
