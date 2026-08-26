import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const DEFAULT_OBJECTIVES = [
  {
    code: "LEGAL_QNA",
    name: "🔎 Giải đáp vấn đề pháp lý",
    description: "Ưu tiên trả lời trực tiếp câu hỏi/vấn đề chính, căn cứ pháp lý, phân tích trường hợp áp dụng & ví dụ thực tế.",
    promptGuidance: `STRATEGY & STRUCTURE:
1. Xác định trực tiếp vấn đề pháp lý chính.
2. Trả lời ngắn gọn, trực diện ngay phần mở bài.
3. Phân tích căn cứ pháp lý & quy định chuyên ngành liên quan.
4. Phân tích các điều kiện áp dụng & ngoại lệ.
5. Đưa ra ví dụ thực tế minh họa tình huống.
6. Kết luận rõ ràng và đưa ra định hướng xử lý.`,
    ctaGuidance: "Bạn đang gặp tình huống tương tự? Hãy liên hệ Luật sư Lê Thị Ngọc Lợi (Hotline: 0902 081 061) để được xem xét trực tiếp trên cơ sở hồ sơ thực tế.",
    displayOrder: 1,
    status: true,
  },
  {
    code: "RISK_WARNING",
    name: "⚠️ Cảnh báo rủi ro",
    description: "Ưu tiên nêu tình huống có rủi ro, chỉ ra hậu quả pháp lý, sai lầm phổ biến, dấu hiệu cảnh báo & cách phòng tránh.",
    promptGuidance: `STRATEGY & STRUCTURE:
1. Nêu rõ tình huống chứa đựng rủi ro pháp lý lớn.
2. Chỉ ra các sai lầm phổ biến mà người dân/doanh nghiệp thường mắc phải.
3. Phân tích hậu quả thiệt hại có thể xảy ra (hợp đồng vô hiệu, mất quyền khởi kiện, phạt hành chính...).
4. Đưa ra các dấu hiệu nhận biết sớm cần lưu ý.
5. Hướng dẫn giải pháp phòng tránh an toàn.`,
    ctaGuidance: "Nếu bạn đang ở trong tình huống này, việc thẩm định hồ sơ sớm có thể giúp hạn chế tối đa rủi ro phát sinh. Hotline khẩn cấp: 0902 081 061.",
    displayOrder: 2,
    status: true,
  },
  {
    code: "KNOWLEDGE_SHARING",
    name: "📚 Phổ biến kiến thức",
    description: "Ưu tiên ngôn ngữ đơn giản, bình dân, giải thích kiến thức nền tảng, giúp người không chuyên dễ hiểu.",
    promptGuidance: `STRATEGY & STRUCTURE:
1. Chuyển ngữ các thuật ngữ pháp lý phức tạp thành ngôn ngữ bình dân, dễ hiểu.
2. Giải thích bản chất nền tảng của vấn đề pháp lý.
3. Phân biệt các khái niệm hoặc trường hợp dễ bị nhầm lẫn.
4. Đưa ra ví dụ đời sống gần gũi.
5. Tổng kết các điểm đắt giá đọc giả cần nhớ.`,
    ctaGuidance: "Nắm rõ kiến thức pháp luật giúp bạn tự tin bảo vệ quyền lợi của mình. Bạn cần trao đổi thêm? Hotline tư vấn: 0902 081 061.",
    displayOrder: 3,
    status: true,
  },
  {
    code: "NEW_REGULATION_ANALYSIS",
    name: "📰 Phân tích quy định mới",
    description: "Ưu tiên tóm tắt điểm mới, so sánh Trước vs Sau khi áp dụng, đối tượng chịu tác động & hành động cần cân nhắc.",
    promptGuidance: `STRATEGY & STRUCTURE:
1. Nêu rõ quy định/văn bản pháp luật mới ban hành.
2. Tóm tắt các điểm thay đổi quan trọng (So sánh Trước vs Sau khi áp dụng).
3. Phân tích đối tượng bị ảnh hưởng trực tiếp và tác động thực tế.
4. Đưa ra khuyến nghị các hành động người đọc nên chuẩn bị.
5. Đánh dấu [CẦN KIỂM TRA] nếu thông tin nguồn chưa đủ để xác minh hiệu lực chính thức.`,
    ctaGuidance: "Doanh nghiệp và cá nhân cần rà soát lại hồ sơ hợp đồng để thích ứng quy định mới. Liên hệ tư vấn chuyên sâu: 0902 081 061.",
    displayOrder: 4,
    status: true,
  },
  {
    code: "SITUATION_GUIDE",
    name: "💡 Hướng dẫn xử lý tình huống",
    description: "Ưu tiên mô tả tình huống, các bước thực hiện từng bước (Step-by-step), danh mục giấy tờ cần chuẩn bị & lỗi cần tránh.",
    promptGuidance: `STRATEGY & STRUCTURE:
1. Mô tả tình huống pháp lý cụ thể.
2. Lập danh mục giấy tờ, hồ sơ thông tin cần chuẩn bị (Checklist).
3. Hướng dẫn thứ tự các bước thực hiện trình tự thủ tục (Step-by-step).
4. Liệt kê những lỗi sai nghiêm trọng cần tuyệt đối tránh.
5. Nêu rõ khi nào tình huống trở nên phức tạp cần tìm tư vấn chuyên môn.`,
    ctaGuidance: "Nếu chưa chắc trường hợp của mình thuộc tình huống nào hoặc thủ tục bị kéo dài, bạn có thể liên hệ Hotline: 0902 081 061 để được hỗ trợ.",
    displayOrder: 5,
    status: true,
  },
  {
    code: "CLIENT_ATTRACTION",
    name: "👤 Thu hút khách hàng tư vấn",
    description: "Chiến lược Value First: Bắt đầu từ vấn đề thực tế, nỗi đau/rủi ro, cung cấp giá trị trước & tạo CTA tư vấn tự nhiên.",
    promptGuidance: `STRATEGY & STRUCTURE:
1. Mở đầu bằng một vấn đề/nỗi đau thực tế người đọc đang phải đối mặt.
2. Phân tích rõ rủi ro và tổn thất nếu tự xử lý không đúng trình tự.
3. Cung cấp giải pháp định hướng có giá trị thực tế trước (Value First).
4. Giúp người đọc tự nhận ra khi nào vấn đề của họ cần đến sự can thiệp của Luật sư chuyên môn.
5. Tạo cảm giác đồng cảm, tin tưởng, tuyệt đối KHÔNG hù dọa hay cam kết kết quả thắng kiện.`,
    ctaGuidance: "Nếu vấn đề trên đang xảy ra với bạn hoặc doanh nghiệp, hãy liên hệ Luật sư – Thạc sĩ Lê Thị Ngọc Lợi (Hotline: 0902 081 061) để được xem xét giải pháp tối ưu.",
    displayOrder: 6,
    status: true,
  },
  {
    code: "ENGAGEMENT_BOOST",
    name: "📣 Tăng tương tác & chia sẻ",
    description: "Ưu tiên Mở bài Hook mạnh mẽ đúng sự thật, tình huống dễ đồng cảm, góc nhìn thảo luận & câu hỏi gợi mở.",
    promptGuidance: `STRATEGY & STRUCTURE:
1. Mở bài (Hook) ấn tượng, kích thích sự tò mò dựa trên đúng sự thật khách quan.
2. Nêu tình huống đời sống dễ tạo sự đồng cảm và góc nhìn thảo luận sắc bén.
3. Trình bày thông tin hữu ích có giá trị đắt giá để người đọc muốn lưu lại hoặc chia sẻ cho người thân.
4. Kết thúc bằng câu hỏi gợi mở suy nghĩ để khuyến khích thảo luận văn minh.`,
    ctaGuidance: "Bạn đánh giá thế nào về quy định này? Hãy lưu lại hoặc chia sẻ bài viết nếu thấy hữu ích. Hotline tư vấn trực tiếp: 0902 081 061.",
    displayOrder: 7,
    status: true,
  },
];

export async function seedContentObjectives() {
  console.log("🌱 Seeding Content Objectives into database...");
  for (const item of DEFAULT_OBJECTIVES) {
    await prisma.contentObjective.upsert({
      where: { code: item.code },
      update: {
        name: item.name,
        description: item.description,
        promptGuidance: item.promptGuidance,
        ctaGuidance: item.ctaGuidance,
        displayOrder: item.displayOrder,
        status: item.status,
      },
      create: item,
    });
  }
  console.log("✅ Content Objectives seeded successfully!");
}

if (require.main === module) {
  seedContentObjectives()
    .catch((e) => {
      console.error("Error seeding Content Objectives:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
