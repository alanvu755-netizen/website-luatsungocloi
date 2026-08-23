import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";

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

export async function getAuthenticatedUser() {
  const session = await verifySession();
  if (!session) return null;

  const user = await prisma.adminUser.findUnique({
    where: { id: session.userId, status: true },
    include: {
      role: true,
      site: true,
    },
  });

  return user;
}
