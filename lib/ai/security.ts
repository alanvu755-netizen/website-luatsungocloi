import { prisma } from "@/lib/db/prisma";
import { checkPermission } from "@/lib/auth/rbac";

export interface AIGateCheckResult {
  allowed: boolean;
  errorCode?: string;
  errorMessage?: string;
}

/**
 * Architecture Lock v2.3.1 — Full Server-Side AI Authorization Gate
 */
export async function validateAIGenerationGate(
  userId: string,
  siteId: string,
  requestedModel: string
): Promise<AIGateCheckResult> {
  // 1. Authentication & Active User check
  const user = await prisma.adminUser.findUnique({
    where: { id: userId, status: true },
    include: { role: true },
  });
  if (!user) {
    return { allowed: false, errorCode: "UNAUTHENTICATED", errorMessage: "Người dùng không hợp lệ" };
  }

  // 2. Tenant Scope Validation
  if (user.role?.name !== "SYSADMIN" && user.siteId !== siteId) {
    return { allowed: false, errorCode: "TENANT_SCOPE_MISMATCH", errorMessage: "Không có quyền truy cập website này" };
  }

  // 3. Permission Check (AI_CONTENT_GENERATE)
  const permResult = await checkPermission(userId, "AI_CONTENT_GENERATE", siteId);
  if (!permResult.allowed) {
    return { allowed: false, errorCode: "PERMISSION_DENIED", errorMessage: "Bạn không có quyền tạo nội dung AI" };
  }

  // 4. Global AI Kill Switch Check (GlobalAIConfig.enabled)
  const globalConfig = await prisma.globalAIConfig.findUnique({ where: { id: "global" } });
  if (!globalConfig || !globalConfig.enabled) {
    return { allowed: false, errorCode: "GLOBAL_AI_DISABLED", errorMessage: "Hệ thống AI đang tạm thời TẮT toàn nền tảng" };
  }

  // 5. Add-on Entitlement Check (AI_CONTENT_ENGINE === ACTIVE)
  const addOn = await prisma.addOn.findUnique({ where: { code: "AI_CONTENT_ENGINE" } });
  if (!addOn) {
    return { allowed: false, errorCode: "ADDON_INACTIVE", errorMessage: "Gói Add-on AI chưa được khởi tạo" };
  }

  const siteAddOn = await prisma.siteAddOn.findFirst({
    where: { siteId, addOnId: addOn.id, status: "ACTIVE" },
  });
  if (!siteAddOn) {
    return { allowed: false, errorCode: "ADDON_INACTIVE", errorMessage: "Gói Add-on AI Content Engine chưa được kích hoạt cho website này" };
  }

  // 6. Provider & Model Validation
  const provider = await prisma.aIProvider.findUnique({ where: { code: "GEMINI" } });
  if (!provider || !provider.status) {
    return { allowed: false, errorCode: "PROVIDER_UNAVAILABLE", errorMessage: "Nhà cung cấp Gemini AI đang bảo trì" };
  }

  const allowedModels: string[] = JSON.parse(provider.allowedModels || "[]");
  if (!allowedModels.includes(requestedModel)) {
    return { allowed: false, errorCode: "INVALID_INPUT", errorMessage: `Model ${requestedModel} không được phép sử dụng` };
  }

  // 7. Quota Check (AIUsage Single Source of Truth)
  const siteConfig = await prisma.aISiteConfig.findUnique({ where: { siteId } });
  const monthlyQuota = siteConfig?.monthlyQuota ?? 100;

  const now = new Date();
  const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const usage = await prisma.aIUsage.findUnique({
    where: { siteId_yearMonth: { siteId, yearMonth } },
  });

  if (usage && usage.requestCount >= monthlyQuota) {
    return { allowed: false, errorCode: "QUOTA_EXCEEDED", errorMessage: `Đã vượt quá hạn mức sử dụng AI (${monthlyQuota} lượt/tháng)` };
  }

  return { allowed: true };
}
