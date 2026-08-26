import { describe, it, expect, beforeEach } from "vitest";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import { validateAIGenerationGate } from "@/lib/ai/security";
import { runAIGeneration } from "@/lib/ai/service";
import { checkPermission } from "@/lib/auth/rbac";

describe("Production Acceptance Test Suite (E2E)", () => {
  let siteId: string;
  let siteAdminId: string;
  let sysAdminId: string;

  beforeEach(async () => {
    // 1. Fetch default Site
    const site = await prisma.site.findUnique({ where: { slug: "le-thi-ngoc-loi" } });
    expect(site).not.toBeNull();
    siteId = site!.id;

    // 2. Fetch Users
    const siteAdmin = await prisma.adminUser.findUnique({ where: { email: "luatsu.loi@gmail.com" } });
    expect(siteAdmin).not.toBeNull();
    siteAdminId = siteAdmin!.id;

    const sysAdmin = await prisma.adminUser.findUnique({ where: { email: "sysadmin@luatsuloi.vn" } });
    expect(sysAdmin).not.toBeNull();
    sysAdminId = sysAdmin!.id;

    // Restore Global AI ON & Delete test UserPermissions
    await prisma.globalAIConfig.upsert({
      where: { id: "global" },
      update: { enabled: true },
      create: { id: "global", enabled: true },
    });

    await prisma.userPermission.deleteMany({
      where: { userId: siteAdminId },
    });
  });

  // 1. Auth & Password Hash Verification
  it("E2E #1: Auth & Login Password Verification", async () => {
    const user = await prisma.adminUser.findUnique({ where: { email: "luatsu.loi@gmail.com" } });
    expect(user).not.toBeNull();
    const isValid = await bcrypt.compare("LuatsuLoi@2026", user!.passwordHash);
    expect(isValid).toBe(true);
  });

  // 2. RBAC & Precedence Verification
  it("E2E #2: RBAC Precedence (UserPermission Override > RolePermission > DENY)", async () => {
    const perm = await prisma.permission.findUnique({ where: { code: "AI_KILL_SWITCH" } });
    expect(perm).not.toBeNull();

    // UserPermission Override (Explicit Grant)
    await prisma.userPermission.upsert({
      where: { userId_permissionId: { userId: siteAdminId, permissionId: perm!.id } },
      update: { granted: true },
      create: { userId: siteAdminId, permissionId: perm!.id, granted: true },
    });

    const grantResult = await checkPermission(siteAdminId, "AI_KILL_SWITCH", siteId);
    expect(grantResult.allowed).toBe(true);

    // UserPermission Override (Explicit Deny)
    await prisma.userPermission.update({
      where: { userId_permissionId: { userId: siteAdminId, permissionId: perm!.id } },
      data: { granted: false },
    });

    const denyResult = await checkPermission(siteAdminId, "AI_KILL_SWITCH", siteId);
    expect(denyResult.allowed).toBe(false);
    expect(denyResult.reason).toContain("DENIED");
  });

  // 3. AI Security Pipeline E2E
  it("E2E #3: Full AI Gate Pipeline (Auth -> Scope -> Perm -> Addon -> Global -> Quota -> RateLimit -> Policy)", async () => {
    await prisma.aIUsage.deleteMany({ where: { siteId } });

    const gateResult = await validateAIGenerationGate(
      siteAdminId,
      siteId,
      "gemini-1.5-flash"
    );

    expect(gateResult.allowed).toBe(true);
  });

  // 4. AI Global Kill Switch E2E
  it("E2E #4: Global AI Kill Switch Disables All Requests Immediately", async () => {
    // Turn Global AI OFF
    await prisma.globalAIConfig.update({
      where: { id: "global" },
      data: { enabled: false },
    });

    const offResult = await validateAIGenerationGate(
      siteAdminId,
      siteId,
      "gemini-1.5-flash"
    );

    expect(offResult.allowed).toBe(false);
    expect(offResult.errorCode).toBe("GLOBAL_AI_DISABLED");

    // Restore Global AI ON
    await prisma.globalAIConfig.update({
      where: { id: "global" },
      data: { enabled: true },
    });
  });

  // 5. AI Request Idempotency E2E
  it("E2E #5: AI Request Idempotency (Same requestId retry)", async () => {
    await prisma.aIUsage.deleteMany({ where: { siteId } });

    const requestId = `req_idempotent_test_${Date.now()}`;
    const promptInput = "Tóm tắt tư vấn pháp luật đất đai";

    const res1 = await runAIGeneration({
      userId: siteAdminId,
      siteId,
      promptCode: "ARTICLE_GENERATE",
      promptText: promptInput,
      model: "gemini-1.5-flash",
      requestId,
    });

    expect(res1.success).toBe(true);

    // Retry with SAME requestId -> must return cached result without double counting usage
    const res2 = await runAIGeneration({
      userId: siteAdminId,
      siteId,
      promptCode: "ARTICLE_GENERATE",
      promptText: promptInput,
      model: "gemini-1.5-flash",
      requestId,
    });

    expect(res2.success).toBe(true);
    expect(res2.message).toContain("Idempotent response");
  });

  // 6. Tenant Scope Isolation E2E
  it("E2E #6: Tenant Scope Isolation Enforcement", async () => {
    const fakeSiteId = "site_other_999";
    const permResult = await checkPermission(siteAdminId, "CONTENT_READ", fakeSiteId);
    expect(permResult.allowed).toBe(false);
    expect(permResult.reason).toBe("TENANT_SCOPE_MISMATCH");
  });

  // 7. SEO Site Settings E2E
  it("E2E #7: SEO Title & Meta Description Settings", async () => {
    const settings = await prisma.siteSettings.findUnique({ where: { siteId } });
    expect(settings).not.toBeNull();
    expect(settings?.seoTitle).toContain("Luật sư");
    expect(settings?.phone).toContain("0902 081 061");
  });
});
