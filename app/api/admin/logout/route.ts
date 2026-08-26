import { NextRequest, NextResponse } from "next/server";
import { destroySession } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  await destroySession();
  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export async function POST(request: NextRequest) {
  await destroySession();
  const acceptHeader = request.headers.get("accept") || "";
  if (acceptHeader.includes("text/html")) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.json({ success: true, redirectTo: "/admin/login" });
}
