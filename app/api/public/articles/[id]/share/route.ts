import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

const ALLOWED_CHANNELS = ["FACEBOOK", "ZALO", "COPY_LINK"];

// Rate limiting per IP for share tracking (60 requests/minute)
const shareRateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = shareRateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    shareRateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 60;
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const articleId = params.id;
  if (!articleId) {
    return NextResponse.json({ message: "Thiếu Article ID" }, { status: 400 });
  }

  // 1. Rate Limiting Check
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
  if (isRateLimited(ip)) {
    return NextResponse.json({ message: "Quá nhiều yêu cầu chia sẻ" }, { status: 429 });
  }

  // 2. Validate Channel Identifier
  let body: any = {};
  try {
    body = await request.json();
  } catch {
    // Empty body fallback
  }

  const channel = (body.channel || "").toUpperCase();
  if (!channel || !ALLOWED_CHANNELS.includes(channel)) {
    return NextResponse.json(
      { message: "Kênh chia sẻ không hợp lệ. Hợp lệ: FACEBOOK, ZALO, COPY_LINK" },
      { status: 400 }
    );
  }

  try {
    // 3. Verify Article Exists and is PUBLISHED
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { id: true, status: true },
    });

    if (!article || article.status !== "PUBLISHED") {
      return NextResponse.json({ message: "Bài viết không tồn tại hoặc chưa xuất bản" }, { status: 404 });
    }

    // 4. Server-Enforced Fixed Atomic Increment (+1 ONLY)
    // Server ignores any client-supplied increment value.
    const updated = await prisma.article.update({
      where: { id: articleId },
      data: { shareCount: { increment: 1 } },
      select: { id: true, shareCount: true },
    });

    return NextResponse.json({
      success: true,
      channel,
      shareCount: updated.shareCount,
    });
  } catch (error: any) {
    return NextResponse.json({ message: "Không thể ghi nhận lượt chia sẻ" }, { status: 500 });
  }
}
