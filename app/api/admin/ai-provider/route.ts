import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user || user.role.name !== "SYSADMIN") {
    return NextResponse.json({ message: "SYSADMIN privilege required" }, { status: 403 });
  }

  const provider = await prisma.aIProvider.findUnique({
    where: { code: "GEMINI" },
  });

  return NextResponse.json({ success: true, provider });
}

export async function PUT(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.role.name !== "SYSADMIN") {
      return NextResponse.json({ message: "DENIED: SYSADMIN privilege required" }, { status: 403 });
    }

    const body = await req.json();
    const { name, defaultModel, apiKey, status } = body;

    const dataToUpdate: any = {
      name,
      defaultModel,
      status: Boolean(status),
    };

    if (apiKey && apiKey.trim() !== "" && !apiKey.includes("••••")) {
      dataToUpdate.credentialRef = `env:GEMINI_API_KEY`;
    }

    const provider = await prisma.aIProvider.update({
      where: { code: "GEMINI" },
      data: dataToUpdate,
    });

    await prisma.auditLog.create({
      data: {
        adminUserId: user.id,
        action: "AI_PROVIDER_UPDATE",
        entityType: "AIProvider",
        entityId: provider.id,
        metadata: JSON.stringify({ code: "GEMINI", status }),
      },
    });

    return NextResponse.json({ success: true, provider, message: "Lưu cấu hình AI Provider thành công!" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Lỗi lưu cấu hình AI Provider" }, { status: 500 });
  }
}
