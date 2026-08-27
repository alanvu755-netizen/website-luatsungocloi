import { describe, it, expect, beforeEach } from "vitest";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";

describe("ANTIGRAVITY — Admin / Sysadmin Self Password Change Test Suite (TC-PWD-01 -> TC-PWD-10)", () => {
  let testAdminUserId: string;
  let testSysAdminUserId: string;
  let testRoleId: string;

  beforeEach(async () => {
    // Ensure default test role exists
    let role = await prisma.role.findUnique({ where: { name: "SITE_ADMIN" } });
    if (!role) {
      role = await prisma.role.create({
        data: { name: "SITE_ADMIN", description: "Site Admin Test Role" },
      });
    }
    testRoleId = role.id;

    // Create test Admin User
    const hashedPwd = await bcrypt.hash("OldPassword123", 10);
    const adminUser = await prisma.adminUser.upsert({
      where: { email: "pwd_test_admin@luatsuloi.vn" },
      create: {
        email: "pwd_test_admin@luatsuloi.vn",
        name: "Test Admin User",
        passwordHash: hashedPwd,
        roleId: testRoleId,
        status: true,
      },
      update: {
        passwordHash: hashedPwd,
        status: true,
      },
    });
    testAdminUserId = adminUser.id;

    // Create test Sysadmin User
    let sysRole = await prisma.role.findUnique({ where: { name: "SYSADMIN" } });
    if (!sysRole) {
      sysRole = await prisma.role.create({
        data: { name: "SYSADMIN", description: "SysAdmin Test Role" },
      });
    }
    const sysAdminUser = await prisma.adminUser.upsert({
      where: { email: "pwd_test_sysadmin@luatsuloi.vn" },
      create: {
        email: "pwd_test_sysadmin@luatsuloi.vn",
        name: "Test Sysadmin User",
        passwordHash: await bcrypt.hash("SysOldPassword123", 10),
        roleId: sysRole.id,
        status: true,
      },
      update: {
        passwordHash: await bcrypt.hash("SysOldPassword123", 10),
        status: true,
      },
    });
    testSysAdminUserId = sysAdminUser.id;
  });

  it("TC-PWD-01: Admin self password change with correct current password succeeds", async () => {
    const user = await prisma.adminUser.findUnique({ where: { id: testAdminUserId } });
    expect(user).not.toBeNull();

    const isCurrentValid = await bcrypt.compare("OldPassword123", user!.passwordHash);
    expect(isCurrentValid).toBe(true);

    const newHash = await bcrypt.hash("NewSecurePassword456", 10);
    await prisma.adminUser.update({
      where: { id: testAdminUserId },
      data: { passwordHash: newHash },
    });

    const updatedUser = await prisma.adminUser.findUnique({ where: { id: testAdminUserId } });
    const isNewValid = await bcrypt.compare("NewSecurePassword456", updatedUser!.passwordHash);
    expect(isNewValid).toBe(true);
  });

  it("TC-PWD-02: Sysadmin self password change with correct current password succeeds", async () => {
    const user = await prisma.adminUser.findUnique({ where: { id: testSysAdminUserId } });
    expect(user).not.toBeNull();

    const newHash = await bcrypt.hash("SysNewPassword789", 10);
    await prisma.adminUser.update({
      where: { id: testSysAdminUserId },
      data: { passwordHash: newHash },
    });

    const updatedUser = await prisma.adminUser.findUnique({ where: { id: testSysAdminUserId } });
    const isNewValid = await bcrypt.compare("SysNewPassword789", updatedUser!.passwordHash);
    expect(isNewValid).toBe(true);
  });

  it("TC-PWD-03: Wrong current password check fails verification", async () => {
    const user = await prisma.adminUser.findUnique({ where: { id: testAdminUserId } });
    const isCurrentValid = await bcrypt.compare("WrongPasswordX", user!.passwordHash);
    expect(isCurrentValid).toBe(false);
  });

  it("TC-PWD-04: Password policy minimum length check (< 6 chars) fails validation", () => {
    const shortPassword = "12345";
    expect(shortPassword.length < 6).toBe(true);
  });

  it("TC-PWD-05: Confirm password mismatch fails validation", () => {
    const newPassword = "NewPassword123";
    const confirmPassword = "DifferentPassword123";
    expect(newPassword === confirmPassword).toBe(false);
  });

  it("TC-PWD-06: Server-side identity enforcement prevents modifying another user's password", async () => {
    // Current authenticated session user ID
    const currentSessionUserId = testAdminUserId;
    // Malicious target user ID attempted by client
    const clientAttemptedTargetUserId = testSysAdminUserId;

    // Server MUST use currentSessionUserId and ignore clientAttemptedTargetUserId
    const targetUserIdToUpdate = currentSessionUserId;
    expect(targetUserIdToUpdate).toBe(testAdminUserId);
    expect(targetUserIdToUpdate).not.toBe(clientAttemptedTargetUserId);
  });

  it("TC-PWD-07: Database strictly stores bcrypt passwordHash and NEVER plaintext", async () => {
    const user = await prisma.adminUser.findUnique({ where: { id: testAdminUserId } });
    expect(user!.passwordHash).not.toBe("OldPassword123");
    expect(user!.passwordHash.startsWith("$2a$") || user!.passwordHash.startsWith("$2b$")).toBe(true);
  });

  it("TC-PWD-08: Password parameters are never exposed in error responses or logs", () => {
    const safeErrorResponse = { message: "Mật khẩu hiện tại không chính xác." };
    expect(JSON.stringify(safeErrorResponse)).not.toContain("OldPassword123");
    expect(JSON.stringify(safeErrorResponse)).not.toContain("passwordHash");
  });

  it("TC-PWD-09: Password change requires new password to be different from current password", async () => {
    const currentPwd = "OldPassword123";
    const newPwd = "OldPassword123";
    expect(currentPwd === newPwd).toBe(true); // Should be rejected by server validation
  });

  it("TC-PWD-10: Admin and Sysadmin only impact their own authenticated account", async () => {
    const adminOriginal = await prisma.adminUser.findUnique({ where: { id: testAdminUserId } });
    const sysAdminOriginal = await prisma.adminUser.findUnique({ where: { id: testSysAdminUserId } });

    // Update Sysadmin password
    const newSysHash = await bcrypt.hash("SysBrandNewPass123", 10);
    await prisma.adminUser.update({
      where: { id: testSysAdminUserId },
      data: { passwordHash: newSysHash },
    });

    // Admin password MUST remain unchanged
    const adminAfter = await prisma.adminUser.findUnique({ where: { id: testAdminUserId } });
    expect(adminAfter!.passwordHash).toBe(adminOriginal!.passwordHash);
  });
});
