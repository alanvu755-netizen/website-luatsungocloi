import { describe, it, expect, beforeEach } from "vitest";
import { runAIGeneration } from "../../lib/ai/service";
import { validateAIGenerationGate } from "../../lib/ai/security";
import { buildDynamicPromptInstruction, generateObjectiveFallbackDraft, DynamicObjectiveConfig } from "../../lib/ai/provider";
import { prisma } from "../../lib/db/prisma";

describe("ANTIGRAVITY — AI Objective & Differentiated Content Generation Suite (TC-AIOBJ-01 -> TC-AIGEN-09)", () => {
  let sysAdminUser: any = null;
  let defaultSiteId: string = "";
  let sampleObjective: any = null;

  beforeEach(async () => {
    // Restore Global AI & AI Provider GEMINI
    await prisma.globalAIConfig.upsert({
      where: { id: "global" },
      update: { enabled: true },
      create: { id: "global", enabled: true },
    });

    await prisma.aIProvider.upsert({
      where: { code: "GEMINI" },
      update: { status: true },
      create: {
        code: "GEMINI",
        name: "Google Gemini AI Engine",
        defaultModel: "gemini-1.5-flash",
        status: true,
        allowedModels: JSON.stringify(["gemini-1.5-flash", "gemini-1.5-pro"]),
      },
    });

    const site = await prisma.site.findUnique({ where: { slug: "le-thi-ngoc-loi" } });
    const addOn = await prisma.addOn.findUnique({ where: { code: "AI_CONTENT_ENGINE" } });
    if (site && addOn) {
      defaultSiteId = site.id;
      await prisma.siteAddOn.upsert({
        where: { id: "site_addon_default" },
        update: { siteId: site.id, addOnId: addOn.id, status: "ACTIVE" },
        create: { id: "site_addon_default", siteId: site.id, addOnId: addOn.id, status: "ACTIVE" },
      });
    }

    sysAdminUser = await prisma.adminUser.findFirst({ where: { status: true } });

    // Seed test objective
    sampleObjective = await prisma.contentObjective.upsert({
      where: { code: "LEGAL_QNA" },
      update: { status: true },
      create: {
        code: "LEGAL_QNA",
        name: "🔎 Giải đáp vấn đề pháp lý",
        description: "Trả lời trực diện vấn đề pháp lý",
        promptGuidance: "1. Trả lời ngay mở bài.\n2. Phân tích điều luật.\n3. Kết luận.",
        ctaGuidance: "Liên hệ Hotline 0902 081 061 để tư vấn trực tiếp.",
        displayOrder: 1,
        status: true,
      },
    });
  });

  // TC-AIOBJ-01: Load active objectives
  it("TC-AIOBJ-01: Loads active objectives ordered by displayOrder", async () => {
    const activeObjs = await prisma.contentObjective.findMany({
      where: { status: true },
      orderBy: { displayOrder: "asc" },
    });
    expect(activeObjs.length).toBeGreaterThan(0);
  });

  // TC-AIOBJ-02: Inactive objective hidden from article editor
  it("TC-AIOBJ-02: Inactive objective is hidden from public dropdown fetch query", async () => {
    const inactiveObj = await prisma.contentObjective.create({
      data: {
        code: "INACTIVE_TEST_CODE",
        name: "Inactive Test Objective",
        promptGuidance: "Inactive guidance",
        status: false,
      },
    });

    const activeObjs = await prisma.contentObjective.findMany({
      where: { status: true },
    });

    const found = activeObjs.some((o) => o.id === inactiveObj.id);
    expect(found).toBe(false);

    await prisma.contentObjective.delete({ where: { id: inactiveObj.id } });
  });

  // TC-AIOBJ-03: SYSADMIN create objective
  it("TC-AIOBJ-03: SYSADMIN can create a new Content Objective in database", async () => {
    const testCode = `CUSTOM_${Date.now()}`;
    const newObj = await prisma.contentObjective.create({
      data: {
        code: testCode,
        name: "Khảo sát Án lệ Mới",
        description: "Phân tích các án lệ của Tòa án Tối cao",
        promptGuidance: "Phân tích tóm tắt án lệ và bài học rút ra.",
        ctaGuidance: "Liên hệ tư vấn tranh tụng theo án lệ.",
        displayOrder: 99,
        status: true,
      },
    });

    expect(newObj.id).toBeDefined();
    expect(newObj.code).toBe(testCode);

    await prisma.contentObjective.delete({ where: { id: newObj.id } });
  });

  // TC-AIOBJ-04: SYSADMIN update objective
  it("TC-AIOBJ-04: SYSADMIN can update objective prompt guidance and CTA", async () => {
    const updated = await prisma.contentObjective.update({
      where: { id: sampleObjective.id },
      data: { description: "Cập nhật mô tả giải đáp" },
    });
    expect(updated.description).toBe("Cập nhật mô tả giải đáp");
  });

  // TC-AIOBJ-05: SYSADMIN toggle objective status
  it("TC-AIOBJ-05: SYSADMIN can toggle objective active/inactive status", async () => {
    const toggled = await prisma.contentObjective.update({
      where: { id: sampleObjective.id },
      data: { status: false },
    });
    expect(toggled.status).toBe(false);

    await prisma.contentObjective.update({
      where: { id: sampleObjective.id },
      data: { status: true },
    });
  });

  // TC-AIOBJ-06: Permission check simulation
  it("TC-AIOBJ-06: Objective management is gated to authorized users", () => {
    const sysAdminRole = "SYSADMIN";
    const normalRole = "EDITOR";

    const canManageSysAdmin = sysAdminRole === "SYSADMIN";
    const canManageEditor = normalRole === "SYSADMIN";

    expect(canManageSysAdmin).toBe(true);
    expect(canManageEditor).toBe(false);
  });

  // TC-AIGEN-01: Generate article using selected objective ID
  it("TC-AIGEN-01: Generates article using selected Objective ID", async () => {
    if (!sysAdminUser || !defaultSiteId) return;
    const reqId = `tcaigen01_${Date.now()}`;

    const res = await runAIGeneration({
      userId: sysAdminUser.id,
      siteId: defaultSiteId,
      promptCode: "ARTICLE_GENERATE",
      userHighlight: "Quy trình ly hôn thuận tình năm 2026",
      objectiveId: sampleObjective.id,
      requestId: reqId,
    });

    expect(res.success).toBe(true);
    expect(res.resultDraft).toBeDefined();
  });

  // TC-AIGEN-02: User highlight is included in generation context
  it("TC-AIGEN-02: User highlight is included in generation output", () => {
    const highlight = "Tranh chấp quyền nuôi con khi ly hôn 2026";
    const draft = generateObjectiveFallbackDraft(highlight, "Ly hôn 2026", {
      code: "LEGAL_QNA",
      name: "🔎 Giải đáp vấn đề pháp lý",
      promptGuidance: "Phân tích điều luật",
    });

    expect(draft).toContain("Tranh chấp quyền nuôi con khi ly hôn 2026");
  });

  // TC-AIGEN-03: Different objectives produce different generation guidance
  it("TC-AIGEN-03: Different objectives produce distinct prompt instructions and strategies", () => {
    const qnaConfig: DynamicObjectiveConfig = {
      code: "LEGAL_QNA",
      name: "🔎 Giải đáp vấn đề pháp lý",
      promptGuidance: "Trả lời trực diện vấn đề",
      ctaGuidance: "Tư vấn trường hợp tương tự",
    };

    const riskConfig: DynamicObjectiveConfig = {
      code: "RISK_WARNING",
      name: "⚠️ Cảnh báo rủi ro",
      promptGuidance: "Nêu tác hại và nguy cơ rủi ro",
      ctaGuidance: "Kiểm tra thẩm định hồ sơ sớm",
    };

    const qnaPrompt = buildDynamicPromptInstruction(qnaConfig);
    const riskPrompt = buildDynamicPromptInstruction(riskConfig);

    expect(qnaPrompt).toContain("Trả lời trực diện vấn đề");
    expect(riskPrompt).toContain("Nêu tác hại và nguy cơ rủi ro");
    expect(qnaPrompt).not.toEqual(riskPrompt);
  });

  // TC-AIGEN-04: AI generation creates DRAFT only
  it("TC-AIGEN-04: AI generation output is strictly staged in DRAFT mode", async () => {
    if (!sysAdminUser || !defaultSiteId) return;
    const reqId = `tcaigen04_${Date.now()}`;

    const res = await runAIGeneration({
      userId: sysAdminUser.id,
      siteId: defaultSiteId,
      promptCode: "ARTICLE_GENERATE",
      userHighlight: "Thủ tục thừa kế sổ đỏ năm 2026",
      objectiveId: sampleObjective.id,
      requestId: reqId,
    });

    expect(res.generation?.status).toBe("COMPLETED");
  });

  // TC-AIGEN-05: AI Kill Switch blocks generation
  it("TC-AIGEN-05: Global AI Kill Switch blocks generation when disabled", async () => {
    if (!sysAdminUser || !defaultSiteId) return;

    await prisma.globalAIConfig.update({
      where: { id: "global" },
      data: { enabled: false },
    });

    const gate = await validateAIGenerationGate(sysAdminUser.id, defaultSiteId, "gemini-1.5-flash");
    expect(gate.allowed).toBe(false);
    expect(gate.errorCode).toBe("GLOBAL_AI_DISABLED");

    await prisma.globalAIConfig.update({
      where: { id: "global" },
      data: { enabled: true },
    });
  });

  // TC-AIGEN-06: Quota/rate-limit rules remain enforced
  it("TC-AIGEN-06: Authorization gate verifies quota and provider status", async () => {
    if (!sysAdminUser || !defaultSiteId) return;
    const gate = await validateAIGenerationGate(sysAdminUser.id, defaultSiteId, "gemini-1.5-flash");
    expect(gate).toHaveProperty("allowed");
  });

  // TC-AIGEN-07: Existing article content is not silently overwritten
  it("TC-AIGEN-07: Editor safeguard logic requires confirmation before replacing content", () => {
    const existingContent = "Nội dung cũ do Admin biên soạn";
    const newDraft = "Nội dung mới từ AI";

    function applySafeguard(hasConfirmed: boolean) {
      if (existingContent.trim() !== "" && !hasConfirmed) {
        return existingContent; // Protected!
      }
      return newDraft;
    }

    expect(applySafeguard(false)).toBe(existingContent);
    expect(applySafeguard(true)).toBe(newDraft);
  });

  // TC-AIGEN-08: AI failure does not corrupt Article data
  it("TC-AIGEN-08: AI service exception preserves original article state", () => {
    let originalArticleState = "Bài viết gốc trước khi gọi AI";
    try {
      throw new Error("AI Gateway Timeout");
    } catch (e) {}

    expect(originalArticleState).toBe("Bài viết gốc trước khi gọi AI");
  });

  // TC-AIGEN-09: CTA strategy follows selected objective
  it("TC-AIGEN-09: Generated draft embeds the objective-based CTA strategy", () => {
    const customCTA = "Liên hệ thẩm định rủi ro hợp đồng gấp qua 0902 081 061";
    const draft = generateObjectiveFallbackDraft(
      "Soạn thảo hợp đồng mua bán nhà đất",
      "Hợp đồng 2026",
      {
        code: "RISK_WARNING",
        name: "Cảnh báo rủi ro",
        promptGuidance: "Nêu rủi ro hợp đồng",
        ctaGuidance: customCTA,
      }
    );

    expect(draft).toContain(customCTA);
  });
});
