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
  apiKey?: string;
}

export interface GeminiGenerateResult {
  content: string;
  inputTokens: number;
  outputTokens: number;
  providerRequestId: string;
}

/**
 * Output Sanitizer: Cleans any residual AI meta-labels, prefixes, or commentary
 * Ensures the output is strictly a publishable article draft.
 */
export function sanitizeArticleDraft(rawText: string): string {
  if (!rawText) return "";

  let cleaned = rawText
    // Remove AI meta prefixes and tags
    .replace(/^\[(Biến thể mới|AI Generated|Bản nháp AI|Draft)\]\s*/i, "")
    .replace(/^(Mục tiêu nội dung|Content Objective|Strategy):\s*.*?\n/i, "")
    .replace(/^👤\s*Thu hút khách hàng tư vấn:\s*/i, "")
    .replace(/^🔎\s*Giải đáp vấn đề pháp lý:\s*/i, "")
    .replace(/^⚠️\s*Cảnh báo rủi ro:\s*/i, "")
    .replace(/^📚\s*Phổ biến kiến thức:\s*/i, "")
    .replace(/^📰\s*Phân tích quy định mới:\s*/i, "")
    .replace(/^💡\s*Hướng dẫn xử lý tình huống:\s*/i, "")
    .replace(/^📣\s*Tăng tương tác & chia sẻ:\s*/i, "")
    .replace(/^Tiêu đề bài viết đề xuất:\s*/i, "")
    .replace(/^Tiêu đề đề xuất:\s*/i, "")
    // Remove meta outline headers if AI inadvertently outputs them
    .replace(/^1\.\s*MỞ BÀI\s*&\s*GÓC NHÌN CHỦ ĐỀ\s*\n/im, "")
    .replace(/^2\.\s*CÁC NỘI DUNG VÀ Ý CHÍNH CẦN KHÁM PHÁ\s*\n/im, "")
    .replace(/^3\.\s*LỜI KHUYÊN\s*&\s*GIẢI PHÁP.*?\n/im, "")
    .trim();

  return cleaned;
}

/**
 * Dynamic Prompt Assembly Engine for Real Publishable Article Generation
 */
export function buildDynamicPromptInstruction(
  objectiveConfig?: DynamicObjectiveConfig,
  isRegenerate?: boolean
): string {
  const brandVoice = `
Bạn là Trợ lý AI Cố vấn & Sáng tạo Nội dung Cấp cao cho Luật sư – Thạc sĩ Lê Thị Ngọc Lợi (Hơn 13 năm kinh nghiệm trong ngành Kiểm sát và Ban Nội chính Tỉnh ủy Đồng Tháp).
PHONG CÁCH VĂN PHONG: Trang trọng, chuyên nghiệp, chuyên môn pháp lý sâu sắc, điềm tĩnh, dễ hiểu, đáng tin cậy, thấu hiểu nỗi đau thực tế của khách hàng.

============================================================
QUY TẮC BẮT BỘC VỀ SẢN PHẨM ĐẦU RA (OUTPUT CONTRACT - REAL ARTICLE):
============================================================
1. SẢN PHẨM ĐẦU RA PHẢI LÀ MỘT BÀI VIẾT THỰC TẾ (REAL PUBLISHABLE ARTICLE DRAFT):
   - Bạn PHẢI tạo ra một bài viết hoàn chỉnh (gồm Tiêu đề H1, Mở bài Hook, Nội dung chính phân tích với các Tiêu đề phụ H2/H3, Căn cứ pháp lý/Tình huống, Lời khuyên chuyên môn và Đoạn Kêu gọi Hành động CTA).
   - Dùng được TRỰC TIẾP trong CMS bài viết mà người dùng KHÔNG cần phải tự viết lại từ outline.

2. TUYỆT ĐỐI KHÔNG TRẢ VỀ OUTLINE HOẶC META-COMMENTARY:
   - KHÔNG xuất ra tiêu đề dạng outline như "1. Mở bài", "2. Các nội dung cần khám phá", "3. Lời khuyên".
   - KHÔNG xuất ra câu tự giải thích kiểu "Dựa trên phân tích...", "AI đề xuất...", "Trong bài viết này tôi sẽ...".
   - KHÔNG chứa các nhãn prefix như "[Biến thể mới]", "Mục tiêu nội dung: ...", "Content Strategy: ...".

3. BẢO TOÀN DỮ LIỆU SỰ THẬT (FACT PRESERVATION 100%):
   - Giữ nguyên tất cả dữ liệu sự thật (Facts, số liệu, tên người, tên cơ quan, địa danh, ngày tháng, điểm mấu chốt) do người dùng cung cấp trong phần USER HIGHLIGHT.

4. AN TOÀN PHÁP LÝ & ĐÁNH DẤU CẦN KIỂM TRA:
   - KHÔNG tự bịa đặt số điều luật, mức phạt hay án lệ không có cơ sở. Nếu đưa ra điều luật chưa đủ căn cứ xác minh, hãy thêm [CẦN KIỂM TRA] phía sau.
   - KHÔNG cam kết hứa hẹn thắng kiện 100%.

5. PHONG CÁCH CTA TỰ NHIÊN, KHÔNG QUẢNG CÁO THÔ BẠO:
   - Xây dựng CTA chân thành, dựa trên nỗi đau thực tế của bài viết, khuyến khích rà soát hồ sơ pháp lý thận trọng.
`;

  const objectiveName = objectiveConfig?.name || "🔎 Giải đáp vấn đề pháp lý";
  const promptGuidance = objectiveConfig?.promptGuidance || `Triển khai bài viết phân tích sâu sắc, đi từ vấn đề thực tế -> căn cứ pháp lý -> các tình huống rủi ro -> hướng xử lý an toàn.`;
  const ctaGuidance = objectiveConfig?.ctaGuidance || "Nếu bạn đang ở trong tình huống trên, việc rà soát hồ sơ pháp lý sớm sẽ giúp hạn chế tối đa rủi ro. Liên hệ Hotline Luật sư 0902 081 061.";

  const regenNote = isRegenerate
    ? `\n\nYÊU CẦU REGENERATE (TẠO BIẾN THỂ MỚI):\n- Giữ nguyên các dữ liệu cốt lõi nhưng viết lại hoàn toàn Tiêu đề mới, Mở bài (Hook) mới và cấu trúc các góc nhìn phân tích mới khác biệt.`
    : "";

  return `${brandVoice}

============================================================
MỤC TIÊU NỘI DUNG VÀ CHIẾN LƯỢC BÀI VIẾT (STRATEGY):
============================================================
MỤC TIÊU CHIẾN LƯỢC: ${objectiveName}
${objectiveConfig?.description ? `ĐỊNH HƯỚNG: ${objectiveConfig.description}` : ""}

HƯỚNG DẪN TRIỂN KHAI NỘI DUNG:
${promptGuidance}

ĐỊNH HƯỚNG KẾT BÀI VÀ CTA:
${ctaGuidance}
${regenNote}`;
}

export const generateStructuredLegalDraft = (
  userHighlight: string,
  objectiveCode?: string,
  isRegenerate?: boolean
) => {
  const code = objectiveCode || "LEGAL_QNA";
  const prefix = isRegenerate ? "[Biến thể Mới] " : "";
  if (code === "LEGAL_QNA") {
    return `${prefix}TRẢ LỜI NHANH VẤN ĐỀ PHÁP LÝ
Đối với thông tin "${userHighlight}", quy định pháp luật hiện hành quy định rõ ràng.

CĂN CỨ PHÁP LÝ ÁP DỤNG:
- Tuân thủ quy định Bộ luật Dân sự và các văn bản hướng dẫn thi hành [CẦN KIỂM TRA].

ĐỊNH HƯỚNG GIẢI PHÁP TỪ LUẬT SƯ – THẠC SĨ LÊ THỊ NGỌC LỢI:
Liên hệ ngay Hotline 0902 081 061 để được hỗ trợ thẩm định hồ sơ trực tiếp.`;
  }

  if (code === "RISK_WARNING") {
    return `${prefix}CÁC NGUY CƠ VÀ SAI LẦM PHỔ BIẾN KHI XỬ LÝ
Đối với thông tin "${userHighlight}", việc tự thương lượng không có tư vấn pháp lý dẫn đến rủi ro thua kiện.

CÁC ĐIỂM CẦN LƯU Ý:
- Rủi ro giao dịch bằng giấy tay.
- Rủi ro quá thời hiệu khởi kiện.

Lời khuyên từ Luật sư – Thạc sĩ Lê Thị Ngọc Lợi (Hotline 0902 081 061).`;
  }

  return generateObjectiveFallbackDraft(userHighlight, undefined, { code, name: "Tư vấn Pháp luật", promptGuidance: "Hướng dẫn" }, isRegenerate);
};
export function generateObjectiveFallbackDraft(
  userHighlight: string,
  topic?: string,
  objectiveConfig?: DynamicObjectiveConfig,
  isRegenerate?: boolean
): string {
  const cleanInput = userHighlight.trim();
  const lowerInput = cleanInput.toLowerCase();
  const objectiveCode = objectiveConfig?.code || "CLIENT_ATTRACTION";

  const isLandDispute = lowerInput.includes("đất") || lowerInput.includes("sổ đỏ") || lowerInput.includes("ranh giới") || lowerInput.includes("thừa kế đất") || lowerInput.includes("tranh chấp");
  const isDivorce = lowerInput.includes("ly hôn") || lowerInput.includes("kết hôn") || lowerInput.includes("hôn nhân") || lowerInput.includes("quyền nuôi con");
  const isNewReg = lowerInput.includes("quy định mới") || lowerInput.includes("luật mới") || lowerInput.includes("nghị định") || lowerInput.includes("thông tư") || objectiveCode === "NEW_REGULATION_ANALYSIS";
  const isRisk = lowerInput.includes("rủi ro") || lowerInput.includes("cảnh báo") || lowerInput.includes("sai lầm") || objectiveCode === "RISK_WARNING";

  const objectiveName = objectiveConfig?.name || "Tư vấn Pháp luật Chuyên sâu";
  const cta = objectiveConfig?.ctaGuidance || "📞 Liên hệ ngay Hotline Luật sư – Thạc sĩ Lê Thị Ngọc Lợi: 0902 081 061 để được hỗ trợ thẩm định hồ sơ trực tiếp.";

  // OBJECTIVE 1: CLIENT_ATTRACTION / THU HÚT KHÁCH HÀNG TƯ VẤN
  if (objectiveCode === "CLIENT_ATTRACTION" || (!isDivorce && !isNewReg && !isRisk)) {
    if (isLandDispute) {
      return `<h2>3 Tình Huống Tranh Chấp Đất Đai Phức Tạp Bạn Nên Tìm Kiếm Sự Hỗ Trợ Từ Luật Sư Ngay</h2>

<p>Tranh chấp đất đai luôn là một trong những dạng tranh chấp pháp lý kéo dài, phức tạp và gây thiệt hại tài chính lớn nhất cho các bên liên quan. Trên thực tế, đối với vấn đề "<b>${cleanInput}</b>", nhiều hộ gia đình và cá nhân vì tự mình thương lượng hoặc tự thực hiện thủ tục hòa giải không đúng quy định mà dẫn đến việc mất quyền khởi kiện, bị lấn chiếm đất vĩnh viễn hoặc bị bác đơn tại Tòa án.</p>

<p>Dưới đây là 3 tình huống tranh chấp đất đai điển hình mà Quý khách hàng nhất định nên tìm kiếm sự tư vấn và đồng hành pháp lý từ Luật sư chuyên môn ngay từ giai đoạn đầu:</p>

<h3>1. Tranh chấp ranh giới, diện tích đất bị lấn chiếm hoặc chồng ranh Sổ đỏ</h3>
<p>Đây là trường hợp rất phổ biến khi đo đạc lại đất để cấp đổi Giấy chứng nhận (Sổ đỏ) hoặc khi hàng xóm xây dựng công trình lấn sang ranh giới. Nếu không thu thập chứng cứ sơ đồ thửa đất qua các thời kỳ, mốc giới thực địa và trích đo địa chính kịp thời, bạn rất dễ bị mất phần diện tích đất bị lấn chiếm. Luật sư sẽ hỗ trợ thu thập hồ sơ địa chính lịch sử, trích đo hiện trạng, tham gia buổi hòa giải tại UBND cấp xã và xây dựng phương án bảo vệ mốc giới hợp pháp.</p>

<h3>2. Tranh chấp thừa kế quyền sử dụng đất giữa các thành viên gia đình</h3>
<p>Tranh chấp tài sản thừa kế là đất đai thường vướng mắc về di chúc không rõ ràng, di sản chưa sang tên qua nhiều thế hệ hoặc sự bất đồng giữa các hàng thừa kế. Vấn đề thời hiệu khởi kiện thừa kế (30 năm đối với bất động sản) và rủi ro hợp đồng tặng cho/chuyển nhượng bị vô hiệu đòi hỏi phải có sự hỗ trợ chuyên sâu. Luật sư đóng vai trò cầu nối hòa giải giữ gìn tình cảm gia đình, rà soát tính pháp lý của di chúc và đại diện tố tụng tại Tòa án khi không thể thương lượng.</p>

<h3>3. Tranh chấp hợp đồng chuyển nhượng, đặt cọc mua bán đất (Đất viết tay / Chưa có Sổ đỏ)</h3>
<p>Giao dịch mua bán đất bằng giấy viết tay hoặc vi bằng khi giá đất biến động thường phát sinh tranh chấp bồi thường cọc hoặc yêu cầu hủy hợp đồng. Hợp đồng có nguy cơ bị Tòa án tuyên vô hiệu, bên mua đối mặt với nguy cơ không lấy lại được tiền cọc hoặc bên bán bị phong tỏa tài sản. Luật sư sẽ hỗ trợ đánh giá hiệu lực hợp đồng, chứng minh lỗi của bên vi phạm và yêu cầu bồi thường thiệt hại tối đa theo quy định pháp luật.</p>

<h3>Danh mục hồ sơ và chứng cứ cần chuẩn bị</h3>
<p>Để bảo vệ tối đa quyền lợi của mình, Quý khách hàng cần rà soát và chuẩn bị các giấy tờ cốt lõi:</p>
<ul>
  <li>Giấy chứng nhận quyền sử dụng đất (Sổ đỏ/Sổ hồng) hoặc giấy tờ về quyền sử dụng đất trước ngày 15/10/1993 [CẦN KIỂM TRA].</li>
  <li>Trích đo địa chính, bản đồ thửa đất qua các thời kỳ.</li>
  <li>Biên bản hòa giải không thành tại UBND cấp xã (Điều kiện bắt buộc trước khi khởi kiện tại Tòa án).</li>
  <li>Các hợp đồng, biên nhận tiền cọc, tin nhắn/văn bản giao dịch giữa các bên.</li>
</ul>

<blockquote class="border-l-4 border-gold bg-amber-50/50 p-4 italic my-4 text-slate-800 rounded-r-lg">
  <strong>Lời khuyên từ Luật sư – Thạc sĩ Lê Thị Ngọc Lợi:</strong><br/>
  "Với hơn 13 năm kinh nghiệm trong ngành Kiểm sát và Tố tụng, Luật sư – Thạc sĩ Lê Thị Ngọc Lợi thấu hiểu sâu sắc rằng: Mỗi mảnh đất là tài sản tích lũy cả đời của người dân. Việc tiếp cận giải pháp pháp lý đúng đắn ngay từ ban đầu sẽ giúp tiết kiệm thời gian, chi phí và tránh rủi ro thua kiện không đáng có."
</blockquote>

<p class="font-bold text-navy my-4">${cta}</p>`;
    }
  }

  // OBJECTIVE 2: RISK_WARNING / CẢNH BÁO RỦI RO
  if (objectiveCode === "RISK_WARNING" || isRisk) {
    return `<h2>Những Rủi Ro Pháp Lý Nghiêm Trọng Cần Lưu Ý Khi Xử Lý: ${topic || cleanInput}</h2>

<p>Trong quá trình thực hiện các giao dịch hoặc giải quyết vụ việc liên quan đến "<b>${cleanInput}</b>", không ít cá nhân và doanh nghiệp đã phải gánh chịu thiệt hại tài chính nặng nề chỉ vì thiếu thận trọng hoặc mắc phải những sai lầm pháp lý phổ biến.</p>

<h3>Những sai lầm pháp lý thường gặp</h3>
<ul>
  <li><b>Tự thỏa thuận hoặc giao dịch bằng giấy tay không qua công chứng:</b> Dẫn đến hợp đồng bị tuyên vô hiệu theo quy định Bộ luật Dân sự [CẦN KIỂM TRA].</li>
  <li><b>Quá hạn thời hiệu khởi kiện hoặc không thu thập chứng cứ kịp thời:</b> Làm mất quyền yêu cầu Tòa án bảo vệ quyền lợi hợp pháp.</li>
  <li><b>Bỏ qua các bước hòa giải cơ sở bắt buộc:</b> Dẫn đến đơn khởi kiện bị Tòa án trả lại, làm kéo dài thời gian xử lý.</li>
</ul>

<h3>Hậu quả và giải pháp phòng tránh an toàn</h3>
<p>Việc bị tuyên vô hiệu hợp đồng hoặc thua kiện không chỉ làm mất tài sản mà còn phát sinh chi phí tố tụng kéo dài. Để bảo vệ an toàn pháp lý, người dân và doanh nghiệp cần:</p>
<ol>
  <li>Rà soát kỹ lưỡng tư cách pháp lý của các bên tham gia giao dịch.</li>
  <li>Thiết lập hợp đồng bằng văn bản có công chứng, chứng thực rõ ràng các điều khoản phạt vi phạm và bồi thường.</li>
  <li>Tham vấn ý kiến Luật sư chuyên môn trước khi ký kết hoặc nộp đơn khởi kiện.</li>
</ol>

<blockquote class="border-l-4 border-gold bg-amber-50/50 p-4 italic my-4 text-slate-800 rounded-r-lg">
  <strong>Lời khuyên từ Luật sư – Thạc sĩ Lê Thị Ngọc Lợi:</strong><br/>
  "Kiểm tra tình trạng pháp lý và rà soát hồ sơ sớm là chìa khóa tốt nhất để phòng ngừa rủi ro."
</blockquote>

<p class="font-bold text-navy my-4">${cta}</p>`;
  }

  // OBJECTIVE 3: NEW_REGULATION_ANALYSIS
  if (objectiveCode === "NEW_REGULATION_ANALYSIS" || isNewReg) {
    return `<h2>Phân Tích Những Điểm Mới Quan Trọng Liên Quan Đến: ${topic || cleanInput}</h2>

<p>Việc cập nhật các quy định pháp luật mới ban hành liên quan đến "<b>${cleanInput}</b>" đóng vai trò trực tiếp đối với hoạt động đầu tư, giao dịch và quyền lợi của người dân cũng như doanh nghiệp.</p>

<h3>Những thay đổi trọng tâm cần lưu ý</h3>
<ul>
  <li><b>Thay đổi về điều kiện và trình tự thủ tục hành chính:</b> Siết chặt quy định về hồ sơ, giấy tờ chứng minh và thẩm quyền giải quyết.</li>
  <li><b>So sánh trước và sau khi áp dụng quy định mới:</b> Mở rộng quyền lợi cho các bên tuân thủ đúng pháp luật nhưng tăng mức xử phạt đối với các hành vi vi phạm [CẦN KIỂM TRA].</li>
  <li><b>Đối tượng chịu tác động trực tiếp:</b> Cá nhân, hộ gia đình và doanh nghiệp đang có các giao dịch hoặc tranh chấp chưa giải quyết dứt điểm.</li>
</ul>

<h3>Hành động người đọc nên chuẩn bị</h3>
<ol>
  <li>Chủ động rà soát lại toàn bộ hợp đồng, hồ sơ pháp lý hiện có để điều chỉnh phù hợp với quy định mới.</li>
  <li>Thực hiện đầy đủ các bước đăng ký, kê khai theo đúng thời hạn luật định.</li>
  <li>Trao đổi với Luật sư chuyên môn để xây dựng phương án thích ứng an toàn.</li>
</ol>

<blockquote class="border-l-4 border-gold bg-amber-50/50 p-4 italic my-4 text-slate-800 rounded-r-lg">
  <strong>Đồng hành pháp lý cùng Luật sư – Thạc sĩ Lê Thị Ngọc Lợi:</strong><br/>
  ${cta}
</blockquote>`;
  }

  // OBJECTIVE 4: SITUATION_GUIDE
  if (objectiveCode === "SITUATION_GUIDE") {
    return `<h2>Hướng Dẫn Quy Trình Các Bước Xử Lý An Toàn Tình Huống: ${topic || cleanInput}</h2>

<p>Khi đối mặt với tình huống pháp lý phức tạp về "<b>${cleanInput}</b>", việc thực hiện đúng trình tự các bước theo quy định pháp luật sẽ giúp bạn bảo vệ tối đa quyền lợi và tiết kiệm thời gian.</p>

<h3>Quy trình 3 bước xử lý chuẩn pháp lý</h3>
<p><b>Bước 1: Thu thập và hệ thống hóa toàn bộ hồ sơ chứng cứ</b><br/>
Tập hợp đầy đủ các giấy tờ chứng minh quyền sở hữu, hợp đồng giao dịch, biên nhận thanh toán, trích đo hiện trạng và các văn bản trao đổi giữa các bên.</p>

<p><b>Bước 2: Thực hiện thủ tục thương lượng hoặc hòa giải cơ sở</b><br/>
Đối với các tranh chấp có quy định bắt buộc phải hòa giải (như tranh chấp đất đai tại UBND xã), bạn cần gửi đơn yêu cầu hòa giải đúng thẩm quyền để lấy biên bản làm căn cứ pháp lý tiếp theo.</p>

<p><b>Bước 3: Khởi kiện hoặc yêu cầu cơ quan có thẩm quyền giải quyết</b><br/>
Trường hợp hòa giải không thành, chuẩn bị đơn khởi kiện kèm theo danh mục chứng cứ nộp Tòa án nhân dân có thẩm quyền.</p>

<h3>Những lỗi sai nghiêm trọng cần tuyệt đối tránh</h3>
<ul>
  <li>Tự ý hủy bỏ mốc giới hoặc tự gây xung đột vũ lực.</li>
  <li>Nộp đơn không đúng Tòa án có thẩm quyền dẫn đến bị trả lại đơn.</li>
</ul>

<blockquote class="border-l-4 border-gold bg-amber-50/50 p-4 italic my-4 text-slate-800 rounded-r-lg">
  <strong>Tư vấn chuyên sâu từ Luật sư – Thạc sĩ Lê Thị Ngọc Lợi:</strong><br/>
  ${cta}
</blockquote>`;
  }

  // GENERAL HIGH-VALUE ARTICLE FALLBACK
  const titleTopic = topic || cleanInput || "Tư vấn Pháp luật Chuyên sâu";
  return `<h2>Phân Tích Pháp Lý Chi Tiết Về: ${titleTopic}</h2>

<p>Trong thực tiễn áp dụng pháp luật Việt Nam hiện nay, chủ đề "<b>${cleanInput}</b>" là một trong những nội dung nhận được sự quan tâm rất lớn từ người dân và cộng đồng doanh nghiệp.</p>

<h3>Căn cứ pháp lý và phân tích chuyên sâu</h3>
<p>Theo quy định pháp luật chuyên ngành hiện hành, việc xác định đúng quyền và nghĩa vụ của các bên đòi hỏi phải rà soát kỹ lưỡng các điều kiện áp dụng và hồ sơ chứng cứ liên quan:</p>
<ul>
  <li><b>Căn cứ pháp lý áp dụng:</b> Tuân thủ nghiêm ngặt quy định văn bản luật và hướng dẫn thi hành hiện hành [CẦN KIỂM TRA].</li>
  <li><b>Các điều kiện và trường hợp ngoại lệ:</b> Cần đánh giá tính hợp pháp của tài sản, năng lực hành vi của các bên và thời hiệu thực hiện quyền.</li>
  <li><b>Thực tiễn giải quyết vụ việc:</b> Việc chuẩn bị chứng cứ rõ ràng ngay từ đầu giúp rút ngắn đáng kể thời gian giải quyết tại cơ quan nhà nước.</li>
</ul>

<blockquote class="border-l-4 border-gold bg-amber-50/50 p-4 italic my-4 text-slate-800 rounded-r-lg">
  <strong>Lời khuyên giải pháp từ Luật sư – Thạc sĩ Lê Thị Ngọc Lợi:</strong><br/>
  "With hơn 13 năm kinh nghiệm trong ngành Kiểm sát và Tố tụng, Luật sư – Thạc sĩ Lê Thị Ngọc Lợi khuyên Quý khách hàng nên tiếp cận vấn đề một cách thận trọng, rà soát văn bản hợp đồng kỹ lưỡng trước khi đưa ra các quyết định pháp lý quan trọng."
</blockquote>

<p class="font-bold text-navy my-4">${cta}</p>`;
}

/**
 * Gemini Provider Integration with Dynamic Objective & REST API Support
 */
export async function generateWithGemini(
  options: GeminiGenerateOptions
): Promise<GeminiGenerateResult> {
  const apiKey = options.apiKey || process.env.GEMINI_API_KEY;
  const requestId = `gemini_req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const systemInstruction =
    options.systemInstruction || buildDynamicPromptInstruction(options.objectiveConfig, options.isRegenerate);

  const fullUserPrompt = `
[NỘI DUNG HIGHLIGHT / DỮ LIỆU NGUỒN CỦA NGUỜI DÙNG]:
${options.userHighlight || options.prompt}

${options.topic ? `[CHỦ ĐỀ HOẶC TIÊU ĐỀ DỰ KIẾN]:\n${options.topic}` : ""}
${options.existingArticleContext ? `[NGỮ CẢNH BÀI VIẾT ĐANG CÓ]:\n${options.existingArticleContext}` : ""}

YÊU CẦU ĐẶC BIỆT: Bạn phải viết thành một BÀI VIẾT HOÀN CHỈNH THỰC TẾ (REAL PUBLISHABLE ARTICLE DRAFT). KHÔNG xuất ra outline, KHÔNG ghi nhãn prefix như "[Biến thể mới]" hay "Mục tiêu:", KHÔNG ghi "1. Mở bài...", KHÔNG ghi meta-commentary.
`.trim();

  // Fallback mode if API key is unconfigured or placeholder
  if (!apiKey || apiKey.trim() === "" || apiKey.includes("••••")) {
    console.warn("⚠️ GEMINI_API_KEY not set. Using Dynamic Objective High-Value Generator Engine.");

    await new Promise((res) => setTimeout(res, 500));

    const rawContent = generateObjectiveFallbackDraft(
      options.userHighlight || options.prompt,
      options.topic,
      options.objectiveConfig,
      options.isRegenerate
    );

    const content = sanitizeArticleDraft(rawContent);

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
      console.warn(`Gemini API returned status ${response.status}. Using High-Value Fallback generator.`);
      const rawContent = generateObjectiveFallbackDraft(
        options.userHighlight || options.prompt,
        options.topic,
        options.objectiveConfig,
        options.isRegenerate
      );
      return {
        content: sanitizeArticleDraft(rawContent),
        inputTokens: 150,
        outputTokens: 750,
        providerRequestId: requestId,
      };
    }

    const data = await response.json();
    const rawGeneratedText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      generateObjectiveFallbackDraft(
        options.userHighlight || options.prompt,
        options.topic,
        options.objectiveConfig,
        options.isRegenerate
      );

    const content = sanitizeArticleDraft(rawGeneratedText);

    return {
      content,
      inputTokens: data.usageMetadata?.promptTokenCount || 150,
      outputTokens: data.usageMetadata?.candidatesTokenCount || 500,
      providerRequestId: requestId,
    };
  } catch (err) {
    console.error("Gemini API call failed, using High-Value Fallback engine:", err);
    const rawContent = generateObjectiveFallbackDraft(
      options.userHighlight || options.prompt,
      options.topic,
      options.objectiveConfig,
      options.isRegenerate
    );
    return {
      content: sanitizeArticleDraft(rawContent),
      inputTokens: 150,
      outputTokens: 750,
      providerRequestId: requestId,
    };
  }
}
