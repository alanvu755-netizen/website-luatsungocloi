import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { z } from "zod";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
  newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
  confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp.",
  path: ["confirmPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "Mật khẩu mới phải khác mật khẩu hiện tại.",
  path: ["newPassword"],
});

export async function POST(request: Request) {
  try {
    // 1. Strictly obtain identity from server-side authenticated session
    const authenticatedUser = await getAuthenticatedUser();
    if (!authenticatedUser || !authenticatedUser.id) {
      return NextResponse.json(
        { message: "Bạn cần đăng nhập để thực hiện thao tác này" },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Server-side Zod validation
    const validationResult = changePasswordSchema.safeParse(body);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0]?.message || "Dữ liệu không hợp lệ";
      return NextResponse.json({ message: firstError }, { status: 400 });
    }

    const { currentPassword, newPassword } = validationResult.data;

    // 2. Fetch target user strictly by authenticated session user.id
    const dbUser = await prisma.adminUser.findUnique({
      where: { id: authenticatedUser.id },
      select: { id: true, email: true, passwordHash: true, status: true },
    });

    if (!dbUser || !dbUser.status) {
      return NextResponse.json(
        { message: "Tài khoản không tồn tại hoặc đã bị khóa" },
        { status: 404 }
      );
    }

    // 3. Verify current password hash with bcrypt
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, dbUser.passwordHash);
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { message: "Mật khẩu hiện tại không chính xác." },
        { status: 400 }
      );
    }

    // 4. Hash new password securely
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // 5. Update strictly the current user's passwordHash
    await prisma.adminUser.update({
      where: { id: dbUser.id },
      data: {
        passwordHash: newPasswordHash,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Đổi mật khẩu thành công.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Có lỗi xảy ra trong quá trình đổi mật khẩu. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
