import { describe, it, expect } from "vitest";
import { validateAIGenerationGate } from "../../lib/ai/security";
import { runAIGeneration } from "../../lib/ai/service";
import { prisma } from "../../lib/db/prisma";

describe("AI Add-on Security, Global Kill Switch, Quota & Idempotency", () => {
  it("should DENY AI generation when Global AI Kill Switch is disabled", async () => {
    const siteAdmin = await prisma.adminUser.findUnique({
      where: { email: "luatsu.loi@gmail.com" },
    });
    expect(siteAdmin).not.toBeNull();
    if (!siteAdmin || !siteAdmin.siteId) return;

    // Turn Global AI OFF
    await prisma.globalAIConfig.update({
      where: { id: "global" },
      data: { enabled: false },
    });

    const gateResult = await validateAIGenerationGate(
      siteAdmin.id,
      siteAdmin.siteId,
      "gemini-1.5-flash"
    );

    expect(gateResult.allowed).toBe(false);
    expect(gateResult.errorCode).toBe("GLOBAL_AI_DISABLED");

    // Restore Global AI ON
    await prisma.globalAIConfig.update({
      where: { id: "global" },
      data: { enabled: true },
    });
  });

  it("should ALLOW AI generation when Global AI is ON and Add-on is ACTIVE", async () => {
    const siteAdmin = await prisma.adminUser.findUnique({
      where: { email: "luatsu.loi@gmail.com" },
    });
    expect(siteAdmin).not.toBeNull();
    if (!siteAdmin || !siteAdmin.siteId) return;

    const gateResult = await validateAIGenerationGate(
      siteAdmin.id,
      siteAdmin.siteId,
      "gemini-1.5-flash"
    );

    expect(gateResult.allowed).toBe(true);
  });

  it("should enforce Idempotency and prevent double counting on same requestId retry", async () => {
    const siteAdmin = await prisma.adminUser.findUnique({
      where: { email: "luatsu.loi@gmail.com" },
    });
    expect(siteAdmin).not.toBeNull();
    if (!siteAdmin || !siteAdmin.siteId) return;

    const testRequestId = `test_idempotency_${Date.now()}`;

    // Request #1
    const res1 = await runAIGeneration({
      userId: siteAdmin.id,
      siteId: siteAdmin.siteId,
      promptCode: "CTA_GENERATE",
      promptText: "Tạo CTA liên hệ tư vấn",
      model: "gemini-1.5-flash",
      requestId: testRequestId,
    });

    expect(res1.success).toBe(true);

    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    
    const usageAfterRes1 = await prisma.aIUsage.findUnique({
      where: { siteId_yearMonth: { siteId: siteAdmin.siteId, yearMonth } },
    });
    const countAfterRes1 = usageAfterRes1?.requestCount || 0;

    // Retry Request #2 with exact same requestId
    const res2 = await runAIGeneration({
      userId: siteAdmin.id,
      siteId: siteAdmin.siteId,
      promptCode: "CTA_GENERATE",
      promptText: "Tạo CTA liên hệ tư vấn",
      model: "gemini-1.5-flash",
      requestId: testRequestId,
    });

    expect(res2.success).toBe(true);
    expect(res2.message).toContain("Idempotent response");

    const usageAfterRes2 = await prisma.aIUsage.findUnique({
      where: { siteId_yearMonth: { siteId: siteAdmin.siteId, yearMonth } },
    });

    // Count MUST NOT double-count
    expect(usageAfterRes2?.requestCount).toBe(countAfterRes1);
  });
});
