import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { memoize } from "@/lib/utils/cache";

const SECRET_KEY = new TextEncoder().encode(
  process.env.SESSION_SECRET || "default_super_secret_session_key_32_bytes_min!"
);
const COOKIE_NAME = "auth_session";

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  siteId: string | null;
  expiresAt: number;
}

export async function createSession(userId: string, email: string, role: string, siteId: string | null) {
  const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 7 days
  const token = await new SignJWT({ userId, email, role, siteId, expiresAt })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(SECRET_KEY);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt * 1000),
  });

  return token;
}

export async function verifySession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export const getAuthenticatedUser = memoize(async () => {
  const session = await verifySession();
  if (!session) return null;

  // Instant 0ms auth check directly from verified JWT payload (No DB query overhead on navigation)
  return {
    id: session.userId,
    email: session.email,
    name: session.email === "luatsu.loi@gmail.com" ? "Lê Thị Ngọc Lợi" : "Quản trị Hệ thống",
    status: true,
    roleId: session.role,
    role: { id: session.role, name: session.role },
    siteId: session.siteId,
    site: session.siteId ? { id: session.siteId, name: "Luật sư - Thạc sĩ Lê Thị Ngọc Lợi" } : null,
  };
});
