export interface GeminiGenerateOptions {
  model: string;
  prompt: string;
  systemInstruction?: string;
}

export interface GeminiGenerateResult {
  content: string;
  inputTokens: number;
  outputTokens: number;
  providerRequestId: string;
}

/**
 * Gemini Provider Integration (Server-Side Only)
 */
export async function generateWithGemini(
  options: GeminiGenerateOptions
): Promise<GeminiGenerateResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  const requestId = `gemini_req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // If GEMINI_API_KEY is not configured, generate realistic structured mock response for dev environment
  if (!apiKey || apiKey.trim() === "") {
    console.warn("⚠️ GEMINI_API_KEY not set. Operating in secure server-side development mode.");
    
    // Simulate generation delay
    await new Promise((res) => setTimeout(res, 800));

    return {
      content: `[BẢN NHÁP AI KẾT QUẢ]\n\n${options.prompt}\n\nNội dung bài viết được tối ưu chuẩn SEO và văn phong chuyên nghiệp cho Luật sư – Thạc sĩ Lê Thị Ngọc Lợi.\n\nChú ý: Các thông tin bằng cấp, vụ việc và số năm kinh nghiệm luôn tuân thủ Approved Facts. Nếu có chi tiết chưa xác minh, ghi chú: [CẦN XÁC NHẬN].`,
      inputTokens: Math.round(options.prompt.length / 4) + 50,
      outputTokens: 250,
      providerRequestId: requestId,
    };
  }

  // Real Gemini REST API Call
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${options.model}:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: `${options.systemInstruction || ""}\n\n${options.prompt}` }],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API call failed with status ${response.status}`);
  }

  const data = await response.json();
  const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const totalTokens = data.usageMetadata?.totalTokenCount || 300;

  return {
    content: generatedText,
    inputTokens: data.usageMetadata?.promptTokenCount || 50,
    outputTokens: data.usageMetadata?.candidatesTokenCount || 250,
    providerRequestId: requestId,
  };
}
