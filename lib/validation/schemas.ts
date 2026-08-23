import { z } from "zod";

// Contact Channel Schema
export const contactChannelSchema = z.object({
  platform: z.enum(["ZALO", "TELEGRAM", "FACEBOOK", "LINKEDIN", "YOUTUBE", "WHATSAPP", "OTHER"]),
  label: z.string().min(1, "Vui lòng nhập tên nhãn"),
  value: z.string().optional(),
  url: z.string().url("URL không đúng định dạng. Ví dụ: https://zalo.me/0902081061"),
  displayOrder: z.number().int().default(0),
  status: z.boolean().default(false),
  openInNewTab: z.boolean().default(true),
}).refine((data) => {
  if (data.status && (!data.url || data.url.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Khi bật (ON) kênh liên hệ, bắt buộc phải nhập URL hợp lệ",
  path: ["url"],
});

// Hero Schema
export const heroSchema = z.object({
  draftSubtitle: z.string().min(1, "Vui lòng nhập danh xưng / subtitle"),
  draftName: z.string().min(1, "Vui lòng nhập họ và tên luật sư"),
  draftImageId: z.string().optional().nullable(),
  draftLogoId: z.string().optional().nullable(),
});

// Introduction Schema
export const introductionSchema = z.object({
  draftTitle: z.string().min(1, "Vui lòng nhập tiêu đề"),
  draftContent: z.string().min(10, "Nội dung giới thiệu phải từ 10 ký tự trở lên"),
});

// Education Item Schema
export const educationSchema = z.object({
  degree: z.string().min(1, "Vui lòng nhập bằng cấp"),
  institution: z.string().min(1, "Vui lòng nhập tên trường / đơn vị đào tạo"),
  description: z.string().optional().nullable(),
  startYear: z.number().int().optional().nullable(),
  endYear: z.number().int().optional().nullable(),
  displayOrder: z.number().int().default(0),
  status: z.enum(["DRAFT", "PUBLISHED", "HIDDEN"]).default("PUBLISHED"),
});

// Experience Item Schema
export const experienceSchema = z.object({
  startYear: z.number().int({ message: "Năm bắt đầu bắt buộc nhập" }),
  endYear: z.number().int().optional().nullable(),
  position: z.string().min(1, "Vui lòng nhập vị trí / chức vụ"),
  organization: z.string().min(1, "Vui lòng nhập tên cơ quan / đơn vị công tác"),
  description: z.string().optional().nullable(),
  displayOrder: z.number().int().default(0),
  status: z.enum(["DRAFT", "PUBLISHED", "HIDDEN"]).default("PUBLISHED"),
  highlights: z.array(z.string()).default([]),
});

// Practice Area Schema
export const practiceAreaSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tên lĩnh vực hoạt động"),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  displayOrder: z.number().int().default(0),
  status: z.enum(["DRAFT", "PUBLISHED", "HIDDEN"]).default("PUBLISHED"),
});

// Commitment Schema
export const commitmentSchema = z.object({
  draftHeading: z.string().min(1, "Vui lòng nhập tiêu đề cam kết"),
  draftContent: z.string().min(5, "Vui lòng nhập nội dung thông điệp"),
});

// Site Settings Schema
export const siteSettingsSchema = z.object({
  siteName: z.string().min(1, "Vui lòng nhập tên website"),
  phone: z.string().min(1, "Vui lòng nhập số điện thoại"),
  email: z.string().email("Email không hợp lệ").optional().nullable(),
  address: z.string().min(1, "Vui lòng nhập địa chỉ trụ sở"),
  googleMapsUrl: z.string().url("URL Google Maps không hợp lệ").optional().or(z.literal("")),
  floatingContactEnabled: z.boolean().default(true),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

// Login Schema
export const loginSchema = z.object({
  email: z.string().email("Email không đúng định dạng"),
  password: z.string().min(6, "Mật khẩu phải từ 6 ký tự trở lên"),
});
