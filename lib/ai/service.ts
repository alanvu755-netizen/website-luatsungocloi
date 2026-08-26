import { prisma } from "@/lib/db/prisma";
import { validateAIGenerationGate } from "./security";
import { generateWithGemini, ContentObjective, buildObjectiveSystemInstruction } from "./provider";

export interface AIGenerateParams {
  userId: string;
  siteId: string;
  promptCode: string;
  promptText: string;
  contentObjective?: ContentObjective;
  isRegenerate?: boolean;
  model?: string;
  requestId: string;
}

export async function runAIGeneration(params: AIGenerateParams) {
  const model = params.model || "gemini-1.5-flash";
  const now = new Date();
  const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  // 1. Idempotency Check: Same requestId must never double-count
  const existingGen = await prisma.aIGeneration.findUnique({
    where: { requestId: params.requestId },
  });
  if (existingGen) {
    return {
      success: existingGen.status === "COMPLETED",
      generation: existingGen,
      resultDraft: existingGen.resultDraft,
      message: "Yêu cầu đã được xử lý trước đó (Idempotent response)",
    };
  }

  // 2. Full Server-Side Security Authorization Gate Check
  const gateResult = await validateAIGenerationGate(params.userId, params.siteId, model);
  if (!gateResult.allowed) {
    // Record BLOCKED lifecycle status
    const blockedGen = await prisma.aIGeneration.create({
      data: {
        requestId: params.requestId,
        siteId: params.siteId,
        userId: params.userId,
        status: "BLOCKED",
        promptType: params.promptCode,
        model,
        errorCode: gateResult.errorCode || "POLICY_BLOCKED",
        riskFlags: JSON.stringify([gateResult.errorMessage || "Blocked by AI Gate"]),
      },
    });

    return {
      success: false,
      errorCode: gateResult.errorCode,
      message: gateResult.errorMessage,
      generation: blockedGen,
    };
  }

  // 3. Create AIGeneration Record (Status: REQUESTED -> GENERATING)
  const generation = await prisma.aIGeneration.create({
    data: {
      requestId: params.requestId,
      siteId: params.siteId,
      userId: params.userId,
      status: "GENERATING",
      promptType: params.promptCode,
      model,
    },
  });

  try {
    // 4. Build System Instruction for Content Objective
    const systemInstruction = buildObjectiveSystemInstruction(params.contentObjective, params.isRegenerate);

    // 5. Call Gemini Provider
    const result = await generateWithGemini({
      model,
      prompt: params.promptText,
      contentObjective: params.contentObjective,
      isRegenerate: params.isRegenerate,
      systemInstruction,
    });

    // 6. Transaction to Update AIGeneration & AIUsage
    const [updatedGen] = await prisma.$transaction([
      prisma.aIGeneration.update({
        where: { id: generation.id },
        data: {
          status: "COMPLETED",
          providerRequestId: result.providerRequestId,
          inputTokens: result.inputTokens,
          outputTokens: result.outputTokens,
          estimatedCost: 0.001, // Estimated cost per request
          resultDraft: result.content,
          completedAt: new Date(),
        },
      }),

      // Update AIUsage Single Source of Truth
      prisma.aIUsage.upsert({
        where: { siteId_yearMonth: { siteId: params.siteId, yearMonth } },
        create: {
          siteId: params.siteId,
          yearMonth,
          requestCount: 1,
          totalTokens: result.inputTokens + result.outputTokens,
          totalCost: 0.001,
        },
        update: {
          requestCount: { increment: 1 },
          totalTokens: { increment: result.inputTokens + result.outputTokens },
          totalCost: { increment: 0.001 },
        },
      }),
    ]);

    return {
      success: true,
      resultDraft: result.content,
      generation: updatedGen,
    };
  } catch (error: any) {
    // Failure handling: Record FAILED status in AIGeneration lifecycle
    await prisma.aIGeneration.update({
      where: { id: generation.id },
      data: {
        status: "FAILED",
        errorCode: "PROVIDER_ERROR",
        riskFlags: JSON.stringify([error.message || "Execution Error"]),
      },
    });

    return {
      success: false,
      errorCode: "PROVIDER_ERROR",
      message: error.message || "Tạo nội dung AI gặp sự cố",
    };
  }
}
