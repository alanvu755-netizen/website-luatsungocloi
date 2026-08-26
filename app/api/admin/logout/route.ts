import { NextRequest, NextResponse } from "next/server";
import { destroySession } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  await destroySession();
  return NextResponse.redirect(new URL("/admin/login", request.url), 303);
}

export async function POST(request: NextRequest) {
  await destroySession();
  return NextResponse.redirect(new URL("/admin/login", request.url), 303);
}
