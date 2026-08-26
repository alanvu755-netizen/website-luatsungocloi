import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

// Simple in-memory rate limiting per IP for tracking (60 requests/minute)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 60;
}

// Bot / Crawler User-Agent filter helper
function isBotUserAgent(ua: string | null): boolean {
  if (!ua) return false;
  const botPattern = /bot|googlebot|crawler|spider|robot|crawling|facebookexternalhit|slurp|bingbot|lighthouse/i;
  return botPattern.test(ua);
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
    return NextResponse.json({ message: "Quá nhiều yêu cầu tracking" }, { status: 429 });
  }

  // 2. Bot / Crawler Check
  const userAgent = request.headers.get("user-agent");
  if (isBotUserAgent(userAgent)) {
    return NextResponse.json({ message: "Bỏ qua bot/crawler" }, { status: 200 });
  }

  // 3. Exclude Admin Preview Session (if cookie/header indicates admin preview)
  const isAdminPreview = request.headers.get("x-admin-preview") === "true";
  if (isAdminPreview) {
    return NextResponse.json({ message: "Bỏ qua admin preview session" }, { status: 200 });
  }

  try {
    // 4. Verify Article Exists and is PUBLISHED
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { id: true, status: true },
    });

    if (!article || article.status !== "PUBLISHED") {
      return NextResponse.json({ message: "Bài viết không tồn tại hoặc chưa xuất bản" }, { status: 404 });
    }

    // 5. Server-Enforced Fixed Atomic Increment (+1 ONLY)
    // Client CANNOT pass arbitrary increment value.
    const updated = await prisma.article.update({
      where: { id: articleId },
      data: { viewCount: { increment: 1 } },
      select: { id: true, viewCount: true },
    });

    return NextResponse.json({
      success: true,
      viewCount: updated.viewCount,
    });
  } catch (error: any) {
    // Safe error response (no internal DB error leaks)
    return NextResponse.json({ message: "Không thể ghi nhận lượt xem" }, { status: 500 });
  }
}
