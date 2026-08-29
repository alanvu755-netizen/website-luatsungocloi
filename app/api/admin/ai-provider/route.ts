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

  if (!provider) {
    return NextResponse.json({ success: true, provider: null });
  }

  // Mask sensitive API Key for GET UI display
  let maskedKey = "";
  if (provider.credentialRef) {
    if (provider.credentialRef.startsWith("env:")) {
      const envKey = process.env.GEMINI_API_KEY;
      if (envKey && envKey.length > 8) {
        maskedKey = `${envKey.slice(0, 4)}••••••••${envKey.slice(-4)}`;
      } else {
        maskedKey = "env:GEMINI_API_KEY";
      }
    } else if (provider.credentialRef.length > 8) {
      maskedKey = `${provider.credentialRef.slice(0, 4)}••••••••${provider.credentialRef.slice(-4)}`;
    } else {
      maskedKey = "••••••••••••••••••••••••••••";
    }
  }

  return NextResponse.json({
    success: true,
    provider: {
      ...provider,
      credentialRef: maskedKey,
      hasSavedKey: Boolean(provider.credentialRef && provider.credentialRef !== "env:GEMINI_API_KEY"),
    },
  });
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

    // Save actual API key when Sysadmin enters a valid unmasked key
    if (apiKey && apiKey.trim() !== "" && !apiKey.includes("••••")) {
      dataToUpdate.credentialRef = apiKey.trim();
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
