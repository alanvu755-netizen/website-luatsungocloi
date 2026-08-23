import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Create Default Site
  const site = await prisma.site.upsert({
    where: { slug: "le-thi-ngoc-loi" },
    update: {},
    create: {
      name: "Luật sư - Thạc sĩ Lê Thị Ngọc Lợi",
      slug: "le-thi-ngoc-loi",
      domain: "luatsuloilethingocloi.vn",
      status: true,
    },
  });
  console.log(`✅ Site created: ${site.name} (${site.id})`);

  // 2. Create Roles
  const sysAdminRole = await prisma.role.upsert({
    where: { name: "SYSADMIN" },
    update: {},
    create: { name: "SYSADMIN", description: "Global System Administrator" },
  });

  const siteAdminRole = await prisma.role.upsert({
    where: { name: "SITE_ADMIN" },
    update: {},
    create: { name: "SITE_ADMIN", description: "Site Administrator" },
  });

  const editorRole = await prisma.role.upsert({
    where: { name: "EDITOR" },
    update: {},
    create: { name: "EDITOR", description: "Content Editor" },
  });
  console.log("✅ Roles created: SYSADMIN, SITE_ADMIN, EDITOR");

  // 3. Create Permissions
  const permissionsList = [
    { code: "CONTENT_READ", description: "Xem nội dung CMS" },
    { code: "CONTENT_WRITE", description: "Tạo và sửa nội dung CMS" },
    { code: "CONTENT_PUBLISH", description: "Xuất bản nội dung CMS" },
    { code: "AI_CONTENT_USE", description: "Truy cập AI Content Studio" },
    { code: "AI_CONTENT_GENERATE", description: "Tạo nội dung bằng AI" },
    { code: "AI_CONTENT_REGENERATE", description: "Tạo lại nội dung bằng AI" },
    { code: "AI_SETTINGS_READ", description: "Xem cấu hình AI" },
    { code: "AI_SETTINGS_WRITE", description: "Chỉnh sửa cấu hình AI" },
    { code: "ADDON_MANAGE", description: "Quản lý Add-on hệ thống" },
    { code: "AI_PROVIDER_MANAGE", description: "Quản lý nhà cung cấp AI" },
    { code: "AI_POLICY_MANAGE", description: "Quản lý chính sách AI" },
    { code: "AI_KILL_SWITCH", description: "Bật/Tắt công tắc khẩn cấp AI" },
  ];

  for (const perm of permissionsList) {
    const createdPerm = await prisma.permission.upsert({
      where: { code: perm.code },
      update: {},
      create: perm,
    });

    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: siteAdminRole.id,
          permissionId: createdPerm.id,
        },
      },
      update: {},
      create: {
        roleId: siteAdminRole.id,
        permissionId: createdPerm.id,
      },
    });

    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: sysAdminRole.id,
          permissionId: createdPerm.id,
        },
      },
      update: {},
      create: {
        roleId: sysAdminRole.id,
        permissionId: createdPerm.id,
      },
    });
  }
  console.log("✅ Permissions & RolePermissions seeded");

  // 4. Create Users with requested Passwords
  const sysAdminPasswordHash = await bcrypt.hash("HEjc9e#1080", 10);
  const siteAdminPasswordHash = await bcrypt.hash("LuatsuLoi@2026", 10);

  const sysAdmin = await prisma.adminUser.upsert({
    where: { email: "sysadmin@luatsuloi.vn" },
    update: {
      passwordHash: sysAdminPasswordHash,
    },
    create: {
      name: "Quản trị Hệ thống",
      email: "sysadmin@luatsuloi.vn",
      passwordHash: sysAdminPasswordHash,
      roleId: sysAdminRole.id,
      siteId: null,
      status: true,
    },
  });

  const siteAdmin = await prisma.adminUser.upsert({
    where: { email: "luatsu.loi@gmail.com" },
    update: {
      passwordHash: siteAdminPasswordHash,
    },
    create: {
      name: "Lê Thị Ngọc Lợi",
      email: "luatsu.loi@gmail.com",
      passwordHash: siteAdminPasswordHash,
      roleId: siteAdminRole.id,
      siteId: site.id,
      status: true,
    },
  });
  console.log("✅ Users created & updated: sysadmin@luatsuloi.vn & luatsu.loi@gmail.com");

  // 5. Global AI Config (Kill Switch)
  await prisma.globalAIConfig.upsert({
    where: { id: "global" },
    update: {},
    create: {
      id: "global",
      enabled: true,
      updatedById: sysAdmin.id,
    },
  });

  // 6. Site Settings
  await prisma.siteSettings.upsert({
    where: { siteId: site.id },
    update: {
      siteName: "Luật sư - Thạc sĩ Lê Thị Ngọc Lợi",
      phone: "0902 081 061",
      email: "luatsuloi@gmail.com",
      address: "Số 149, đường Lê Thị Riêng, phường Cao Lãnh, Đồng Tháp",
      floatingContactEnabled: true,
      seoTitle: "Luật sư – Thạc sĩ Lê Thị Ngọc Lợi | Tư vấn pháp lý",
      seoDescription: "Luật sư – Thạc sĩ Lê Thị Ngọc Lợi với hơn 13 năm kinh nghiệm trong ngành Kiểm sát và Ban Nội chính Tỉnh ủy Đồng Tháp.",
    },
    create: {
      siteId: site.id,
      siteName: "Luật sư - Thạc sĩ Lê Thị Ngọc Lợi",
      phone: "0902 081 061",
      email: "luatsuloi@gmail.com",
      address: "Số 149, đường Lê Thị Riêng, phường Cao Lãnh, Đồng Tháp",
      googleMapsUrl: "https://maps.google.com",
      floatingContactEnabled: true,
      seoTitle: "Luật sư – Thạc sĩ Lê Thị Ngọc Lợi | Tư vấn pháp lý",
      seoDescription: "Luật sư – Thạc sĩ Lê Thị Ngọc Lợi với hơn 13 năm kinh nghiệm trong ngành Kiểm sát và Ban Nội chính Tỉnh ủy Đồng Tháp.",
    },
  });

  // 7. Hero Section
  await prisma.hero.upsert({
    where: { siteId: site.id },
    update: {
      draftSubtitle: "Luật sư - Thạc sĩ",
      draftName: "LÊ THỊ NGỌC LỢI",
      draftImageUrl: "/customer-reference.png",
      pubSubtitle: "Luật sư - Thạc sĩ",
      pubName: "LÊ THỊ NGỌC LỢI",
      pubImageUrl: "/customer-reference.png",
      status: "PUBLISHED",
    },
    create: {
      siteId: site.id,
      draftSubtitle: "Luật sư - Thạc sĩ",
      draftName: "LÊ THỊ NGỌC LỢI",
      draftImageUrl: "/customer-reference.png",
      pubSubtitle: "Luật sư - Thạc sĩ",
      pubName: "LÊ THỊ NGỌC LỢI",
      pubImageUrl: "/customer-reference.png",
      status: "PUBLISHED",
    },
  });

  // 8. Introduction Section
  await prisma.introduction.upsert({
    where: { siteId: site.id },
    update: {
      draftTitle: "GIỚI THIỆU",
      draftContent:
        "Luật sư – Thạc sĩ Lê Thị Ngọc Lợi với hơn 13 năm kinh nghiệm công tác trong ngành Kiểm sát và cơ quan Nội chính Tỉnh ủy, am hiểu sâu sắc pháp luật và thực tiễn áp dụng.\n\nTrên nền tảng kiến thức vững chắc cùng tinh thần trách nhiệm cao, Luật sư luôn tận tâm tư vấn, bảo vệ quyền và lợi ích hợp pháp của khách hàng, đồng hành mang đến giải pháp pháp lý hiệu quả, an toàn và bền vững.",
      pubTitle: "GIỚI THIỆU",
      pubContent:
        "Luật sư – Thạc sĩ Lê Thị Ngọc Lợi với hơn 13 năm kinh nghiệm công tác trong ngành Kiểm sát và cơ quan Nội chính Tỉnh ủy, am hiểu sâu sắc pháp luật và thực tiễn áp dụng.\n\nTrên nền tảng kiến thức vững chắc cùng tinh thần trách nhiệm cao, Luật sư luôn tận tâm tư vấn, bảo vệ quyền và lợi ích hợp pháp của khách hàng, đồng hành mang đến giải pháp pháp lý hiệu quả, an toàn và bền vững.",
      status: "PUBLISHED",
    },
    create: {
      siteId: site.id,
      draftTitle: "GIỚI THIỆU",
      draftContent:
        "Luật sư – Thạc sĩ Lê Thị Ngọc Lợi với hơn 13 năm kinh nghiệm công tác trong ngành Kiểm sát và cơ quan Nội chính Tỉnh ủy, am hiểu sâu sắc pháp luật và thực tiễn áp dụng.\n\nTrên nền tảng kiến thức vững chắc cùng tinh thần trách nhiệm cao, Luật sư luôn tận tâm tư vấn, bảo vệ quyền lợi hợp pháp của khách hàng, đồng hành mang đến giải pháp pháp lý hiệu quả, an toàn và bền vững.",
      pubTitle: "GIỚI THIỆU",
      pubContent:
        "Luật sư – Thạc sĩ Lê Thị Ngọc Lợi với hơn 13 năm kinh nghiệm công tác trong ngành Kiểm sát và cơ quan Nội chính Tỉnh ủy, am hiểu sâu sắc pháp luật và thực tiễn áp dụng.\n\nTrên nền tảng kiến thức vững chắc cùng tinh thần trách nhiệm cao, Luật sư luôn tận tâm tư vấn, bảo vệ quyền lợi hợp pháp của khách hàng, đồng hành mang đến giải pháp pháp lý hiệu quả, an toàn và bền vững.",
      status: "PUBLISHED",
    },
  });

  // 9. Dynamic Menu & Submenus (Chuyên mục) Seeding
  const legalMenu = await prisma.menu.upsert({
    where: { siteId_slug: { siteId: site.id, slug: "thu-vien-phap-luat" } },
    update: {},
    create: {
      siteId: site.id,
      title: "Thư viện pháp luật",
      slug: "thu-vien-phap-luat",
      displayOrder: 1,
      status: "VISIBLE",
    },
  });

  const sub1 = await prisma.submenu.upsert({
    where: { menuId_slug: { menuId: legalMenu.id, slug: "dat-dai" } },
    update: {},
    create: {
      siteId: site.id,
      menuId: legalMenu.id,
      title: "Đất đai – Nhà ở",
      slug: "dat-dai",
      displayOrder: 1,
      status: "VISIBLE",
    },
  });

  await prisma.submenu.upsert({
    where: { menuId_slug: { menuId: legalMenu.id, slug: "dan-su-hon-nhan" } },
    update: {},
    create: {
      siteId: site.id,
      menuId: legalMenu.id,
      title: "Dân sự – Hôn nhân",
      slug: "dan-su-hon-nhan",
      displayOrder: 2,
      status: "VISIBLE",
    },
  });

  await prisma.submenu.upsert({
    where: { menuId_slug: { menuId: legalMenu.id, slug: "doanh-nghiep" } },
    update: {},
    create: {
      siteId: site.id,
      menuId: legalMenu.id,
      title: "Doanh nghiệp",
      slug: "doanh-nghiep",
      displayOrder: 3,
      status: "VISIBLE",
    },
  });

  console.log("✅ Dynamic Menu & Submenus seeded");

  // 10. Sample Published Articles
  await prisma.article.upsert({
    where: { siteId_slug: { siteId: site.id, slug: "nhung-dieu-can-biet-khi-sang-ten-so-do" } },
    update: {},
    create: {
      siteId: site.id,
      createdById: siteAdmin.id,
      menuId: legalMenu.id,
      submenuId: sub1.id,
      title: "Những điều cần biết khi làm thủ tục sang tên Sổ đỏ năm 2026",
      slug: "nhung-dieu-can-biet-khi-sang-ten-so-do",
      excerpt: "Tổng hợp toàn bộ quy định pháp lý, hồ sơ giấy tờ và thủ tục thuế phí khi mua bán, tặng cho đất đai.",
      content:
        "Sang tên Sổ đỏ (đăng ký biến động đất đai) là thủ tục bắt buộc khi chuyển nhượng, tặng cho hoặc thừa kế quyền sử dụng đất.\n\n1. Điều kiện thực hiện sang tên:\n- Đất có Giấy chứng nhận (Sổ đỏ/Sổ hồng).\n- Đất không có tranh chấp.\n- Quyền sử dụng đất không bị kê biên để bảo đảm thi hành án.\n- Trong thời hạn sử dụng đất.\n\n2. Hồ sơ chuẩn bị:\n- Hợp đồng chuyển nhượng/tặng cho đã công chứng.\n- Đơn đăng ký biến động đất đai (Mẫu số 09/ĐK).\n- Bản gốc Giấy chứng nhận.\n- Căn cước công dân của hai bên.\n\nLuật sư Lê Thị Ngọc Lợi tư vấn và hỗ trợ trọn gói thủ tục sang tên nhà đất an toàn, nhanh chóng.",
      status: "PUBLISHED",
      publishedAt: new Date(),
      seoTitle: "Thủ tục Sang tên Sổ đỏ mới nhất | Luật sư Lê Thị Ngọc Lợi",
      metaDescription: "Tư vấn thủ tục sang tên sổ đỏ, thuế phí sang tên nhà đất chính xác theo Luật Đất đai mới nhất.",
    },
  });

  // 11. AI AddOn & AI Provider
  const addOn = await prisma.addOn.upsert({
    where: { code: "AI_CONTENT_ENGINE" },
    update: {},
    create: {
      code: "AI_CONTENT_ENGINE",
      name: "AI Content Engine",
      description: "Optional Paid Add-on for AI Content Generation",
    },
  });

  await prisma.siteAddOn.upsert({
    where: { id: "site_addon_default" },
    update: {},
    create: {
      id: "site_addon_default",
      siteId: site.id,
      addOnId: addOn.id,
      status: "ACTIVE",
    },
  });

  const aiProvider = await prisma.aIProvider.upsert({
    where: { code: "GEMINI" },
    update: {},
    create: {
      code: "GEMINI",
      name: "Google Gemini AI Provider",
      status: true,
      defaultModel: "gemini-1.5-flash",
      allowedModels: JSON.stringify(["gemini-1.5-flash", "gemini-1.5-pro"]),
    },
  });

  await prisma.aISiteConfig.upsert({
    where: { siteId: site.id },
    update: {},
    create: {
      siteId: site.id,
      providerId: aiProvider.id,
      monthlyQuota: 100,
      monthlyTokenLimit: 500000,
      rateLimitRpm: 10,
      brandTone: "Chuyên nghiệp, trang trọng, đồng cảm, đúng pháp luật",
      audience: "Cá nhân, doanh nghiệp cần tư vấn và hỗ trợ pháp lý",
    },
  });

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
