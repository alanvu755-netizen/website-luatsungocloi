import { describe, it, expect } from "vitest";
import { checkPermission } from "../../lib/auth/rbac";
import { prisma } from "../../lib/db/prisma";

describe("RBAC Permission Precedence & Tenant Isolation (Architecture Lock #9)", () => {
  it("should DENY access if user is disabled or does not exist", async () => {
    const result = await checkPermission("non_existent_id", "CONTENT_READ");
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("USER_NOT_FOUND_OR_DISABLED");
  });

  it("should DENY access if SITE_ADMIN attempts to access a different siteId", async () => {
    const siteAdmin = await prisma.adminUser.findUnique({
      where: { email: "luatsu.loi@gmail.com" },
    });
    expect(siteAdmin).not.toBeNull();

    if (siteAdmin) {
      const result = await checkPermission(
        siteAdmin.id,
        "CONTENT_READ",
        "wrong_site_id_123"
      );
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe("TENANT_SCOPE_MISMATCH");
    }
  });

  it("should ALLOW access when role possesses the required RolePermission", async () => {
    const siteAdmin = await prisma.adminUser.findUnique({
      where: { email: "luatsu.loi@gmail.com" },
    });
    expect(siteAdmin).not.toBeNull();

    if (siteAdmin) {
      const result = await checkPermission(
        siteAdmin.id,
        "CONTENT_READ",
        siteAdmin.siteId
      );
      expect(result.allowed).toBe(true);
      expect(result.reason).toBe("ALLOWED_BY_ROLE");
    }
  });

  it("should ALLOW access for SYSADMIN regardless of targetSiteId", async () => {
    const sysAdmin = await prisma.adminUser.findUnique({
      where: { email: "sysadmin@luatsuloi.vn" },
    });
    expect(sysAdmin).not.toBeNull();

    if (sysAdmin) {
      const result = await checkPermission(
        sysAdmin.id,
        "AI_KILL_SWITCH",
        "any_random_site"
      );
      expect(result.allowed).toBe(true);
    }
  });
});
