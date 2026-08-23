import { prisma } from "@/lib/db/prisma";

export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Architecture Lock #9 — Permission Precedence Enforcement
 *
 * Rules:
 * IF UserPermission exists:
 *     granted = true  => ALLOW
 *     granted = false => DENY
 * ELSE IF RolePermission exists:
 *     => ALLOW
 * ELSE:
 *     => DENY
 *
 * Default is DENY.
 */
export async function checkPermission(
  userId: string,
  permissionCode: string,
  targetSiteId?: string | null
): Promise<PermissionCheckResult> {
  // 1. Fetch User with Role, RolePermissions, UserPermissions, and Site Scope
  const user = await prisma.adminUser.findUnique({
    where: { id: userId, status: true },
    include: {
      role: {
        include: {
          rolePermissions: {
            include: { permission: true },
          },
        },
      },
      userPermissions: {
        include: { permission: true },
      },
    },
  });

  if (!user) {
    return { allowed: false, reason: "USER_NOT_FOUND_OR_DISABLED" };
  }

  // 2. Tenant Scope Validation
  // SYSADMIN (siteId === null) can access all sites.
  // SITE_ADMIN and EDITOR must match targetSiteId.
  if (user.role.name !== "SYSADMIN" && targetSiteId && user.siteId !== targetSiteId) {
    return { allowed: false, reason: "TENANT_SCOPE_MISMATCH" };
  }

  // 3. UserPermission Override Check
  const userOverride = user.userPermissions.find(
    (up) => up.permission.code === permissionCode
  );

  if (userOverride) {
    return {
      allowed: userOverride.granted,
      reason: userOverride.granted
        ? "ALLOWED_BY_USER_OVERRIDE"
        : "DENIED_BY_USER_OVERRIDE",
    };
  }

  // 4. RolePermission Check
  const roleHasPermission = user.role.rolePermissions.some(
    (rp) => rp.permission.code === permissionCode
  );

  if (roleHasPermission) {
    return { allowed: true, reason: "ALLOWED_BY_ROLE" };
  }

  // 5. Default DENY
  return { allowed: false, reason: "DENIED_BY_DEFAULT" };
}
