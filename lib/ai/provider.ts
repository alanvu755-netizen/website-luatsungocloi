export interface DynamicObjectiveConfig {
  code: string;
  name: string;
  description?: string | null;
  promptGuidance: string;
  ctaGuidance?: string | null;
}

export interface GeminiGenerateOptions {
  model: string;
  prompt: string;
  objectiveConfig?: DynamicObjectiveConfig;
  userHighlight?: string;
  topic?: string;
  existingArticleContext?: string;
  systemInstruction?: string;
  isRegenerate?: boolean;
}

export interface GeminiGenerateResult {
  content: string;
  inputTokens: number;
  outputTokens: number;
  providerRequestId: string;
}

/**
 * Dynamic Prompt Assembly Engine: Assembles runtime system instruction from DB objective guidance & rules
 */
export function buildDynamicPromptInstruction(
  objectiveConfig?: DynamicObjectiveConfig,
  isRegenerate?: boolean
): string {
  const brandVoice = `
Bạn là Trợ lý AI Cố vấn & Sáng tạo Nội dung Cấp cao cho Luật sư – Thạc sĩ Lê Thị Ngọc Lợi (Hơn 13 năm kinh nghiệm trong ngành Kiểm sát và Ban Nội chính Tỉnh ủy Đồng Tháp).
PHONG CÁCH VĂN PHONG: Trang trọng, chuyên nghiệp, có chuyên môn pháp lý sâu sắc, điềm tĩnh, dễ hiểu, đáng tin cậy và tận tâm.

============================================================
NGUYÊN TẮC BẢO TOÀN DỮ LIỆU CỐT LÕI (FACT PRESERVATION):
============================================================
1. BẢO TOÀN SỰ THẬT 100%: Giữ nguyên tất cả dữ liệu sự thật (Facts, số liệu, tên người, tên cơ quan, địa danh, ngày tháng, điểm mấu chốt) do người dùng cung cấp trong phần USER HIGHLIGHT.
2. KHÔNG TỰ BỊA ĐẶT THÔNG TIN PHÁP LÝ: Tuyệt đối KHÔNG tự sáng tác số điều luật, số văn bản quy phạm pháp luật, thời hạn, mức phạt hoặc án lệ không có cơ sở. Nếu dữ liệu đầu vào không đủ để xác minh, hãy đánh dấu [CẦN KIỂM TRA] sau thông tin đó.
3. KHÔNG BẢN NHAU / PARAPHRASE MÁY MÓC: Phải tái cấu trúc bài viết, thay đổi góc tiếp cận, viết Mở bài (Hook) mới, tiêu đề phụ mới phù hợp với Mục tiêu bài viết.
4. KHÔNG CAM KẾT KẾT QUẢ PHÁP LÝ: Không hứa hẹn 100% thắng kiện hay cam kết kết quả tố tụng.
`;

  const objectiveName = objectiveConfig?.name || "🔎 Giải đáp vấn đề pháp lý";
  const promptGuidance = objectiveConfig?.promptGuidance || `1. Xác định trực tiếp vấn đề chính.\n2. Phân tích căn cứ pháp lý.\n3. Kết luận rõ ràng.`;
  const ctaGuidance = objectiveConfig?.ctaGuidance || "Liên hệ ngay Hotline Luật sư 0902 081 061 để được hỗ trợ.";

  const regenNote = isRegenerate
    ? `\n\nYÊU CẦU BIẾN THỂ MỚI (REGENERATE VARIATION):\n- Tạo một bản viết hoàn toàn khác biệt về góc mở bài (Hook), các tiêu đề phụ và thứ tự trình bày so với bản trước, giữ nguyên dữ liệu gốc.`
    : "";

  return `${brandVoice}

============================================================
MỤC TIÊU NỘI DUNG VÀ CHIẾN LƯỢC BÀI VIẾT:
============================================================
MỤC TIÊU: ${objectiveName}
${objectiveConfig?.description ? `MÔ TẢ: ${objectiveConfig.description}` : ""}

HƯỚNG DẪN CẤU TRÚC VÀ PHƯƠNG PHÁP DIỄN ĐẠT:
${promptGuidance}

CHIẾN LƯỢC CALL-TO-ACTION (CTA):
${ctaGuidance}
${regenNote}`;
}

/**
 * Fallback Draft Generator that adheres to Dynamic Objective Config & User Highlights
 */
export function generateObjectiveFallbackDraft(
  userHighlight: string,
  topic?: string,
  objectiveConfig?: DynamicObjectiveConfig,
  isRegenerate?: boolean
): string {
  const cleanHighlights = userHighlight
    .split("\n")
    .map((l) => l.replace(/^[-*•\d.\s]+/, "").trim())
    .filter((l) => l !== "");

  const mainTopic = (topic && topic.trim() !== "") ? topic.trim() : (cleanHighlights[0] || "Tư vấn pháp lý và bảo vệ quyền lợi hợp pháp");
  const formattedTitle = mainTopic.charAt(0).toUpperCase() + mainTopic.slice(1);
  const bulletPoints = cleanHighlights.map((h) => `• ${h}`).join("\n");

  const objectiveCode = objectiveConfig?.code || "LEGAL_QNA";
  const objectiveName = objectiveConfig?.name || "Giải đáp Pháp luật";
  const cta = objectiveConfig?.ctaGuidance || "📞 Liên hệ Hotline Luật sư 0902 081 061 để được thẩm định hồ sơ trực tiếp.";

  const prefix = isRegenerate ? `[Biến thể Mới] ` : "";

  return `${prefix}${objectiveName}: ${formattedTitle}

1. MỞ BÀI & GÓC NHÌN CHỦ ĐỀ
Trong bối cảnh pháp luật hiện hành áp dụng ngày càng chặt chẽ, chủ đề "${formattedTitle}" đóng vai trò vô cùng quan trọng đối với quyền và lợi ích hợp pháp của người dân và doanh nghiệp.

2. CÁC NỘI DUNG VÀ Ý CHÍNH CẦN KHÁM PHÁ
Dựa trên thông tin phân tích thực tế, Quý khách hàng cần đặc biệt nắm rõ các điểm trọng tâm sau:
${bulletPoints || "• Căn cứ pháp lý áp dụng chuyên ngành hiện hành.\n• Trình tự thủ tục và chứng cứ chuẩn bị."}

3. LỜI KHUYÊN & GIẢI PHÁP TỪ LUẬT SƯ – THẠC SĨ LÊ THỊ NGỌC LỢI
Với hơn 13 năm kinh nghiệm công tác trong ngành Kiểm sát và Tố tụng, Luật sư – Thạc sĩ Lê Thị Ngọc Lợi sẵn sàng đồng hành thẩm định và bảo vệ tối đa quyền lợi của Quý khách hàng.

${cta}`;
}

/**
 * Gemini Provider Integration with Dynamic Objective Support
 */
export async function generateWithGemini(
  options: GeminiGenerateOptions
): Promise<GeminiGenerateResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  const requestId = `gemini_req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const systemInstruction =
    options.systemInstruction || buildDynamicPromptInstruction(options.objectiveConfig, options.isRegenerate);

  const fullUserPrompt = `
[NỘI DUNG HIGHLIGHT / DỮ LIỆU NGUỒN CỦA NGUỜI DÙNG]:
${options.userHighlight || options.prompt}

${options.topic ? `[CHỦ ĐỀ HOẶC TIÊU ĐỀ DỰ KIẾN]:\n${options.topic}` : ""}
${options.existingArticleContext ? `[NGỮ CẢNH BÀI VIẾT ĐANG CÓ]:\n${options.existingArticleContext}` : ""}
`.trim();

  // Fallback mode if API key is unconfigured or placeholder
  if (!apiKey || apiKey.trim() === "" || apiKey.includes("••••")) {
    console.warn("⚠️ GEMINI_API_KEY not set. Using Dynamic Objective Fallback Engine.");

    await new Promise((res) => setTimeout(res, 800));

    const content = generateObjectiveFallbackDraft(
      options.userHighlight || options.prompt,
      options.topic,
      options.objectiveConfig,
      options.isRegenerate
    );

    return {
      content,
      inputTokens: Math.round(fullUserPrompt.length / 4) + 150,
      outputTokens: 750,
      providerRequestId: requestId,
    };
  }

  // Real Gemini REST API Call
  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${options.model}:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `${systemInstruction}\n\n${fullUserPrompt}` }],
          },
        ],
      }),
    });

    if (!response.ok) {
      console.warn(`Gemini API returned status ${response.status}. Using Objective Fallback generator.`);
      return {
        content: generateObjectiveFallbackDraft(
          options.userHighlight || options.prompt,
          options.topic,
          options.objectiveConfig,
          options.isRegenerate
        ),
        inputTokens: 150,
        outputTokens: 750,
        providerRequestId: requestId,
      };
    }

    const data = await response.json();
    const generatedText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      generateObjectiveFallbackDraft(
        options.userHighlight || options.prompt,
        options.topic,
        options.objectiveConfig,
        options.isRegenerate
      );

    return {
      content: generatedText,
      inputTokens: data.usageMetadata?.promptTokenCount || 150,
      outputTokens: data.usageMetadata?.candidatesTokenCount || 500,
      providerRequestId: requestId,
    };
  } catch (err) {
    console.error("Gemini API call failed, using Objective Fallback engine:", err);
    return {
      content: generateObjectiveFallbackDraft(
        options.userHighlight || options.prompt,
        options.topic,
        options.objectiveConfig,
        options.isRegenerate
      ),
      inputTokens: 150,
      outputTokens: 750,
      providerRequestId: requestId,
    };
  }
}
