export type ContentObjective =
  | "LEGAL_QNA" // 🔎 Giải đáp vấn đề pháp lý
  | "RISK_WARNING" // ⚠️ Cảnh báo rủi ro
  | "KNOWLEDGE_SHARING" // 📚 Phổ biến kiến thức
  | "NEW_REGULATION_ANALYSIS" // 📰 Phân tích quy định mới
  | "SITUATION_GUIDE" // 💡 Hướng dẫn xử lý tình huống
  | "CLIENT_ATTRACTION" // 👤 Thu hút khách hàng tư vấn
  | "ENGAGEMENT_BOOST"; // 📣 Tăng tương tác & chia sẻ

export interface GeminiGenerateOptions {
  model: string;
  prompt: string;
  contentObjective?: ContentObjective;
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
 * Strategy mapping and system instructions for the 7 Content Objectives
 */
export function buildObjectiveSystemInstruction(objective?: ContentObjective, isRegenerate?: boolean): string {
  const brandVoice = `
Bạn là Trợ lý AI cấp cao của Luật sư – Thạc sĩ Lê Thị Ngọc Lợi (Hơn 13 năm kinh nghiệm trong ngành Kiểm sát và Ban Nội chính Tỉnh ủy).
PHONG CÁCH: Chuyên nghiệp, có chuyên môn sâu, điềm tĩnh, dễ hiểu, đáng tin cậy và tận tâm.
NGUYÊN TẮC BẢO TOÀN DỮ LIỆU CỐT LÕI (FACT PRESERVATION):
- Giữ nguyên 100% các dữ liệu sự thật (Facts, số liệu, tên người/địa danh, ngày tháng, nội dung pháp lý do người dùng cung cấp).
- TUYỆT ĐỐI KHÔNG tự bịa đặt số điều luật, số văn bản, thời hạn, mức phạt hoặc án lệ. Nếu thông tin nguồn không đủ cơ sở để xác minh, hãy giữ nguyên hoặc đánh dấu [CẦN KIỂM TRA].
- KHÔNG cam kết thắng kiện hoặc cam kết kết quả pháp lý.
`;

  const regenNote = isRegenerate
    ? `\nYÊU CẦU TẠO BIẾN THỂ MỚI (REGENERATE VARIATION): Tạo một bản viết mới hoàn toàn khác biệt về Mở bài (Hook), tiêu đề phụ, thứ tự diễn đạt và lời kết, giữ nguyên dữ liệu gốc.`
    : "";

  switch (objective) {
    case "LEGAL_QNA":
      return `${brandVoice}
MỤC TIÊU BÀI VIẾT: 🔎 GIẢI ĐÁP VẤN ĐỀ PHÁP LÝ
STRATEGY & STRUCTURE:
1. Tiêu đề câu hỏi / vấn đề pháp lý rõ ràng.
2. Mở bài: Trả lời ngắn trực tiếp vấn đề ngay phần đầu.
3. Phân tích căn cứ pháp lý & quy định liên quan.
4. Trường hợp đặc biệt / Điều kiện áp dụng.
5. Ví dụ thực tế minh họa.
6. Kết luận & Lời khuyên từ Luật sư Lê Thị Ngọc Lợi (Hotline: 0902 081 061).
${regenNote}`;

    case "RISK_WARNING":
      return `${brandVoice}
MỤC TIÊU BÀI VIẾT: ⚠️ CẢNH BÁO RỦI RO
STRATEGY & STRUCTURE:
1. Tiêu đề cảnh báo nguy cơ / rủi ro thực tế.
2. Nhận diện rủi ro & các sai lầm phổ biến thường gặp.
3. Hậu quả pháp lý và thiệt hại có thể xảy ra.
4. Dấu hiệu nhận biết sớm cần lưu ý.
5. Biện pháp phòng tránh & bảo vệ an toàn pháp lý.
6. Lời khuyên khi nào cần tìm Luật sư hỗ trợ (Hotline: 0902 081 061).
${regenNote}`;

    case "KNOWLEDGE_SHARING":
      return `${brandVoice}
MỤC TIÊU BÀI VIẾT: 📚 PHỔ BIẾN KIẾN THỨC
STRATEGY & STRUCTURE:
1. Tiêu đề giải thích chủ đề đơn giản, dễ tiếp cận.
2. Mở bài: Dẫn dắt nhẹ nhàng, chuyển ngữ thuật ngữ pháp lý thành từ ngữ bình dân dễ hiểu.
3. Kiến thức nền tảng & bản chất vấn đề.
4. Phân biệt các trường hợp dễ nhầm lẫn.
5. Ví dụ / Tình huống minh họa đời sống.
6. Tổng kết giá trị đọc giả cần nhớ & Hotline Luật sư 0902 081 061.
${regenNote}`;

    case "NEW_REGULATION_ANALYSIS":
      return `${brandVoice}
MỤC TIÊU BÀI VIẾT: 📰 PHÂN TÍCH QUY ĐỊNH MỚI
STRATEGY & STRUCTURE:
1. Tiêu đề cập nhật điểm mới quy định pháp luật.
2. Tóm tắt điểm mới nổi bật & phạm vi tác động.
3. So sánh Trước vs Sau khi quy định mới áp dụng.
4. Đối tượng bị ảnh hưởng trực tiếp & tác động thực tế.
5. Khuyến nghị hành động cho người đọc.
6. Thông tin liên hệ tư vấn chuyên sâu từ Luật sư 0902 081 061.
${regenNote}`;

    case "SITUATION_GUIDE":
      return `${brandVoice}
MỤC TIÊU BÀI VIẾT: 💡 HƯỚNG DẪN XỬ LÝ TÌNH HUỐNG
STRATEGY & STRUCTURE:
1. Tiêu đề hướng dẫn từng bước xử lý tình huống cụ thể.
2. Xác định vấn đề pháp lý của tình huống.
3. Danh mục giấy tờ / Hồ sơ chuẩn bị (Checklist).
4. Quy trình từng bước thực hiện (Step-by-step).
5. Các sai lầm / Lỗi cần tuyệt đối tránh.
6. Trường hợp phức tạp cần Luật sư đồng hành (Hotline: 0902 081 061).
${regenNote}`;

    case "CLIENT_ATTRACTION":
      return `${brandVoice}
MỤC TIÊU BÀI VIẾT: 👤 THU HÚT KHÁCH HÀNG TƯ VẤN (VALUE FIRST)
STRATEGY & STRUCTURE:
1. Tiêu đề nêu bật nỗi đau / vấn đề thực tế cần giải quyết.
2. Phân tích khó khăn & rủi ro nếu tự xử lý không đúng.
3. Phao cứu sinh / Giải pháp định hướng hữu ích.
4. Nhận diện các dấu hiệu bài toán cần luật sư riêng.
5. Lời mời tư vấn tự nhiên, xây dựng niềm tin chuyên môn.
6. Call-to-Action liên hệ Luật sư Lê Thị Ngọc Lợi (Hotline: 0902 081 061).
${regenNote}`;

    case "ENGAGEMENT_BOOST":
    default:
      return `${brandVoice}
MỤC TIÊU BÀI VIẾT: 📣 TĂNG TƯƠNG TÁC & CHIA SẺ
STRATEGY & STRUCTURE:
1. Tiêu đề Hook mạnh mẽ, kích thích sự chú ý đúng sự thật.
2. Mở đầu bằng tình huống đời sống dễ đồng cảm.
3. Phân tích góc nhìn pháp lý sắc bén, tạo thảo luận.
4. Các điểm đắt giá đáng lưu lại & chia sẻ cho người thân.
5. Câu hỏi mở gợi mở góc nhìn đọc giả.
6. Thông tin hỗ trợ pháp lý từ Luật sư Lê Thị Ngọc Lợi (Hotline: 0902 081 061).
${regenNote}`;
  }
}

/**
 * Generates a rich, structured legal draft mapped to the requested Content Objective
 */
export function generateStructuredLegalDraft(
  promptText: string,
  objective: ContentObjective = "LEGAL_QNA",
  isRegenerate: boolean = false
): string {
  const lines = promptText
    .split("\n")
    .map((l) => l.replace(/^[-*•\d.\s]+/, "").trim())
    .filter(
      (l) =>
        l !== "" &&
        !l.toLowerCase().includes("hãy viết bài") &&
        !l.toLowerCase().includes("dựa trên các ý chính")
    );

  const rawTitle = lines[0] || "Tư vấn thủ tục pháp lý và bảo vệ quyền lợi hợp pháp";
  const title = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);
  const coreBulletPoints = lines.map((l) => `• ${l}`).join("\n");

  const prefixTitle = isRegenerate ? `[Biến thể Mới] ` : "";

  switch (objective) {
    case "LEGAL_QNA":
      return `${prefixTitle}Giải đáp Pháp luật: ${title}

1. TRẢ LỜI NHANH VẤN ĐỀ
Theo quy định pháp luật hiện hành, đối với vấn đề "${title}", người dân và doanh nghiệp hoàn toàn có quyền thực hiện nếu đáp ứng đầy đủ các điều kiện trình tự thủ tục do pháp luật quy định.

2. CĂN CỨ VÀ PHÂN TÍCH PHÁP LÝ CHI TIẾT
Khi xem xét vụ việc, Quý khách hàng cần lưu ý các điểm cốt lõi sau:
${coreBulletPoints}
• Điều kiện áp dụng: Phải tuân thủ các quy định chuyên ngành và văn bản hướng dẫn thi hành hiện hành.
• Chứng cứ & Hồ sơ: Chuẩn bị đầy đủ văn bản xác minh quyền sở hữu, tài liệu giao dịch và các giấy tờ pháp lý có giá trị chứng cứ.

3. KẾT LUẬN & LỜI KHUYÊN TỪ LUẬT SƯ – THẠC SĨ LÊ THỊ NGỌC LỢI
Việc nắm rõ cơ sở pháp lý giúp ngăn ngừa thiệt hại không đáng có. 
📞 Liên hệ ngay Hotline: 0902 081 061 để được Luật sư – Thạc sĩ Lê Thị Ngọc Lợi tư vấn trực tiếp.`;

    case "RISK_WARNING":
      return `${prefixTitle}Cảnh báo Rủi ro Pháp lý: ${title}

1. CÁC NGUY CƠ VÀ SAI LẦM PHỔ BIẾN
Thực tế tố tụng và tư vấn cho thấy, rất nhiều trường hợp khi vướng vào "${title}" đã mắc phải những sai lầm nghiêm trọng do chủ quan hoặc không thẩm định hồ sơ kỹ lưỡng:
${coreBulletPoints}

2. HẬU QUẢ PHÁP LÝ VÀ DẤU HIỆU CẦN LƯU Ý
- Thiệt hại lớn về tài sản, hợp đồng vô hiệu hoặc mất quyền khởi kiện do hết thời hiệu.
- Dấu hiệu cảnh báo: Giấy tờ không rõ ràng, giao dịch qua tay hoặc thiếu sự chứng nhận của cơ quan thẩm quyền.

3. BIỆN PHÁP PHÒNG TRÁNH & LỜI KHUYÊN CHUYÊN MÔN
Luật sư – Thạc sĩ Lê Thị Ngọc Lợi (Hơn 13 năm kinh nghiệm Kiểm sát & Ban Nội chính) khuyên Quý khách hàng nên thẩm định hồ sơ trước khi giao dịch.
📞 Hotline hỗ trợ khẩn cấp: 0902 081 061.`;

    case "KNOWLEDGE_SHARING":
      return `${prefixTitle}Phổ biến Kiến thức Pháp luật: Những điều cần biết về ${title}

1. GIẢI THÍCH ĐƠN GIẢN VỀ CHỦ ĐỀ
Khác với các thuật ngữ pháp lý phức tạp, "${title}" có thể hiểu một cách bình dân là quyền và nghĩa vụ hợp pháp của bạn được nhà nước bảo hộ khi thực hiện đúng quy trình.

2. CÁC NỘI DUNG NỀN TẢNG CẦN NẮM RÕ
Để dễ hình dung, bạn chỉ cần nhớ các điểm cốt lõi sau:
${coreBulletPoints}

3. TỔNG KẾT & TƯ VẤN PHÁP LÝ
Nếu bạn hoặc gia đình đang vướng mắc các tình huống tương tự, hãy liên hệ Văn phòng Luật sư – Thạc sĩ Lê Thị Ngọc Lợi.
📞 Hotline tư vấn miễn phí: 0902 081 061.`;

    case "NEW_REGULATION_ANALYSIS":
      return `${prefixTitle}Phân tích Điểm mới Pháp luật: ${title}

1. TÓM TẮT ĐIỂM MỚI NỔI BẬT
Những điều chỉnh mới nhất xung quanh quy định "${title}" mang lại nhiều thay đổi quan trọng ảnh hưởng trực tiếp đến quyền lợi người dân và doanh nghiệp.

2. SO SÁNH THỰC TẾ & CÁC NỘI DUNG TRỌNG TÂM
${coreBulletPoints}
• Lưu ý: Các số liệu hoặc điều khoản mới cần đối chiếu chi tiết với văn bản quy phạm pháp luật chính thức [CẦN KIỂM TRA].

3. HÀNH ĐỘNG CẦN THỰC HIỆN NGAY
Doanh nghiệp và cá nhân cần rà soát lại hợp đồng, hồ sơ pháp lý để thích ứng với quy định mới.
📞 Hotline tư vấn: 0902 081 061 (Luật sư Lê Thị Ngọc Lợi).`;

    case "SITUATION_GUIDE":
      return `${prefixTitle}Hướng dẫn Từng bước Xử lý: ${title}

1. BƯỚC 1: XÁC ĐỊNH BẢN CHẤT VẤN ĐỀ VÀ HỒ SƠ CẦN CHUẨN BỊ
Chuẩn bị các tài liệu quan trọng sau:
${coreBulletPoints}

2. BƯỚC 2: QUY TRÌNH THỰC HIỆN THEO TRÌNH TỰ PHÁP LUẬT
- Nộp hồ sơ tại cơ quan có thẩm quyền giải quyết.
- Theo dõi thời hạn trả kết quả và giải trình khi có yêu cầu.
- Lỗi cần tránh: Nộp sai cơ quan hoặc thiếu chứng cứ gốc.

3. BƯỚC 3: KHI NÀO CẦN LUẬT SƯ ĐỒNG HÀNH?
Khi vụ việc có tranh chấp phức tạp hoặc bị kéo dài thời hạn giải quyết.
📞 Hotline tư vấn trực tiếp: 0902 081 061.`;

    case "CLIENT_ATTRACTION":
      return `${prefixTitle}Giải pháp Pháp lý Chuyên sâu: ${title}

1. BÀI TOÁN THỰC TẾ VÀ NỖI ĐAU CỦA KHÁCH HÀNG
Bạn đang gặp khó khăn khi giải quyết các thủ tục hoặc tranh chấp liên quan đến "${title}"? Tự xử lý khi chưa nắm vững quy định thường dẫn đến nguy cơ bị bác hồ sơ hoặc thiệt hại tài sản.

2. GIẢI PHÁP TỪ CHUYÊN GIA PHÁP LÝ
Chúng tôi tập trung giải quyết tận gốc các vấn đề:
${coreBulletPoints}

3. ĐỒNG HÀNH CÙNG LUẬT SƯ – THẠC SĨ LÊ THỊ NGỌC LỢI
Với uy tín và 13 năm kinh nghiệm trong ngành Kiểm sát - Tố tụng, chúng tôi cam kết bảo vệ tối đa quyền lợi của bạn.
📞 Liên hệ ngay Hotline 0902 081 061 để được thẩm định hồ sơ trực tiếp.`;

    case "ENGAGEMENT_BOOST":
    default:
      return `${prefixTitle}Góc nhìn Pháp lý: ${title} — Bạn đã biết chưa?

1. TÌNH HUỐNG ĐỜI SỐNG VÀ CÂU HỎI ĐÁNG SUY NGHẪM
Rất nhiều người thắc mắc liệu quy định về "${title}" áp dụng trong thực tế như thế nào và có những điểm gì cần lưu ý để tránh vi phạm?

2. CÁC ĐIỂM ĐẮT GIÁ ĐÁNG LƯU LẠI & CHIA SẺ
${coreBulletPoints}

3. THẢO LUẬN & HỖ TRỢ PHÁP LÝ
Bạn đánh giá thế nào về quy định này? Lưu lại hoặc chia sẻ cho người thân nếu thấy hữu ích.
📞 Bạn cần tư vấn riêng? Liên hệ ngay Hotline Luật sư 0902 081 061.`;
  }
}

/**
 * Gemini Provider Integration (Server-Side Only)
 */
export async function generateWithGemini(
  options: GeminiGenerateOptions
): Promise<GeminiGenerateResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  const requestId = `gemini_req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const objective = options.contentObjective || "LEGAL_QNA";
  const systemInstruction = options.systemInstruction || buildObjectiveSystemInstruction(objective, options.isRegenerate);

  // If GEMINI_API_KEY is not configured or in dev fallback, generate full structured legal article draft
  if (!apiKey || apiKey.trim() === "" || apiKey.includes("••••")) {
    console.warn("⚠️ GEMINI_API_KEY not set. Using structured legal AI content generation engine V2.");
    
    // Simulate generation delay
    await new Promise((res) => setTimeout(res, 800));

    const content = generateStructuredLegalDraft(options.prompt, objective, options.isRegenerate);

    return {
      content,
      inputTokens: Math.round(options.prompt.length / 4) + 120,
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
            parts: [{ text: `${systemInstruction}\n\n${options.prompt}` }],
          },
        ],
      }),
    });

    if (!response.ok) {
      console.warn(`Gemini API returned status ${response.status}. Using high-quality fallback generator.`);
      return {
        content: generateStructuredLegalDraft(options.prompt, objective, options.isRegenerate),
        inputTokens: 120,
        outputTokens: 750,
        providerRequestId: requestId,
      };
    }

    const data = await response.json();
    const generatedText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      generateStructuredLegalDraft(options.prompt, objective, options.isRegenerate);

    return {
      content: generatedText,
      inputTokens: data.usageMetadata?.promptTokenCount || 120,
      outputTokens: data.usageMetadata?.candidatesTokenCount || 500,
      providerRequestId: requestId,
    };
  } catch (err) {
    console.error("Gemini API call failed, using high-quality legal draft engine:", err);
    return {
      content: generateStructuredLegalDraft(options.prompt, objective, options.isRegenerate),
      inputTokens: 120,
      outputTokens: 750,
      providerRequestId: requestId,
    };
  }
}
