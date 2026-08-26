import { prisma } from "@/lib/db/prisma";
import { validateAIGenerationGate } from "./security";
import { generateWithGemini } from "./provider";

export interface AIGenerateParams {
  userId: string;
  siteId: string;
  promptCode: string;
  promptText: string;
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
    // 4. Build Context with Prompt Hierarchy & Verified Facts
    const siteConfig = await prisma.aISiteConfig.findUnique({ where: { siteId: params.siteId } });
    const verifiedKnowledge = await prisma.aIKnowledgeItem.findMany({
      where: { siteId: params.siteId, isVerified: true },
    });

    const verifiedFactsText = verifiedKnowledge.map((k) => `- ${k.topic}: ${k.content}`).join("\n");

    const systemInstruction = `
NGUYÊN TẮC AN TOÀN NỘI DUNG PHÁP LÝ & CONTENT MARKETING CHUYÊN SÂU:
1. Bạn là trợ lý sinh nội dung Content Marketing cao cấp cho Luật sư – Thạc sĩ Lê Thị Ngọc Lợi.
2. Tông giọng (Brand Tone): ${siteConfig?.brandTone || "Trang trọng, chuyên nghiệp, uy tín, đồng cảm"}.
3. THÔNG TIN ĐÃ XÁC MINH (VERIFIED FACTS):
${verifiedFactsText || "- Cử nhân Luật (Đại học Cần Thơ), Thạc sĩ Luật (Đại học Luật TP.HCM), hơn 13 năm kinh nghiệm trong ngành Kiểm sát và Ban Nội chính Tỉnh ủy Đồng Tháp."}
4. CẤU TRÚC BÀI VIẾT CONTENT MARKETING (CONVERSION-ORIENTED):
   - Tiêu đề hấp dẫn, chính xác chuyên môn, chứa từ khóa.
   - Mở bài nêu bật vấn đề/nỗi đau thực tế mà người dân/doanh nghiệp đang gặp phải.
   - Thân bài phân tích quy định pháp luật rõ ràng, dễ hiểu, chia nhỏ các mục heading (H2, H3) và bullet points.
   - Thể hiện năng lực & uy tín chuyên môn của Luật sư - Thạc sĩ Lê Thị Ngọc Lợi để tạo dựng niềm tin.
   - Kết bài đưa ra lời dẫn nhập tự nhiên, khuyến nghị người đọc tìm kiếm sự tư vấn chuyên sâu của Luật sư và định hướng tới hành động "ĐĂNG KÝ TƯ VẤN".
5. QUY TẮC AN TOÀN & CHUYỂN ĐỔI:
   - Tuyệt đối KHÔNG sử dụng tiêu đề giật gân (clickbait).
   - KHÔNG bịa đặt bằng cấp, giải thưởng, danh sách khách hàng, vụ án hay hứa hẹn cam kết thắng kiện 100%.
   - KHÔNG biến bài viết thành quảng cáo thương mại thô bạo. Lời gọi tư vấn phải diễn ra tự nhiên, đồng cảm.
6. Nội dung sinh ra CHỈ LÀ BẢN NHÁP (DRAFT) để con người xem xét và phê duyệt trước khi xuất bản.
    `.trim();

    // 5. Call Gemini Provider
    const result = await generateWithGemini({
      model,
      prompt: params.promptText,
      systemInstruction,
    });

    // 6. Transaction to Update AIGeneration & AIUsage (Idempotency Safe)
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
        update: {
          requestCount: { increment: 1 },
          totalTokens: { increment: result.inputTokens + result.outputTokens },
          totalCost: { increment: 0.001 },
        },
        create: {
          siteId: params.siteId,
          yearMonth,
          requestCount: 1,
          totalTokens: result.inputTokens + result.outputTokens,
          totalCost: 0.001,
        },
      }),

      // AuditLog
      prisma.auditLog.create({
        data: {
          siteId: params.siteId,
          adminUserId: params.userId,
          action: "AI_GENERATION",
          entityType: "AIGeneration",
          entityId: generation.id,
          metadata: JSON.stringify({
            promptCode: params.promptCode,
            model,
            tokens: result.inputTokens + result.outputTokens,
          }),
        },
      }),
    ]);

    return {
      success: true,
      resultDraft: updatedGen.resultDraft,
      generation: updatedGen,
    };
  } catch (error: any) {
    // 7. Handle Provider Failure -> Update Status FAILED
    const failedGen = await prisma.aIGeneration.update({
      where: { id: generation.id },
      data: {
        status: "FAILED",
        failedAt: new Date(),
        errorCode: "PROVIDER_UNAVAILABLE",
        riskFlags: JSON.stringify([error.message || "Provider call failed"]),
      },
    });

    return {
      success: false,
      errorCode: "PROVIDER_UNAVAILABLE",
      message: "Lỗi kết nối nhà cung cấp AI",
      generation: failedGen,
    };
  }
}
