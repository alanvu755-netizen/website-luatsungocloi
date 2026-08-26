import { prisma } from "@/lib/db/prisma";
import { sendConsultationNotificationEmail } from "./email.service";

export interface CreateConsultationLeadInput {
  siteId: string;
  fullName: string;
  phone: string;
  email?: string | null;
  content: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  honeypot?: string | null; // Anti-spam honeypot
}

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string>;
}

export interface ConsultationLeadResultData {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  createdAt: Date;
}

/**
 * Server-side Phone Number Validator (Vietnamese Phone Standard)
 * Supports formats: 0912345678, +84912345678, 03xxxxxxxx, etc.
 */
export function isValidPhone(phone: string): boolean {
  if (!phone) return false;
  const cleanPhone = phone.trim().replace(/[\s.-]/g, "");
  const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
  return phoneRegex.test(cleanPhone);
}

/**
 * Server-side Email Format Validator
 */
export function isValidEmail(email: string): boolean {
  if (!email) return true; // Optional field
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Create Consultation Lead with strict validation, Honeypot anti-spam, and async email notification.
 */
export async function createConsultationLead(
  input: CreateConsultationLeadInput
): Promise<ServiceResult<ConsultationLeadResultData>> {
  // 1. Anti-spam Honeypot Check: If bot fills hidden honeypot, reject silently with success response
  if (input.honeypot && input.honeypot.trim() !== "") {
    console.warn("[ConsultationService] Honeypot triggered. Bot submission silently ignored.");
    return {
      success: true,
      data: {
        id: "honeypot-ignored",
        fullName: input.fullName || "Bot",
        phone: input.phone || "0000000000",
        email: null,
        createdAt: new Date(),
      },
    };
  }

  const errors: Record<string, string> = {};

  // 2. Full Name Validation
  const fullName = input.fullName ? input.fullName.trim() : "";
  if (!fullName) {
    errors.fullName = "Vui lòng nhập Họ và tên";
  }

  // 3. Phone Number Validation (REQUIRED)
  const phone = input.phone ? input.phone.trim() : "";
  if (!phone) {
    errors.phone = "Vui lòng nhập Số điện thoại liên hệ";
  } else if (!isValidPhone(phone)) {
    errors.phone = "Số điện thoại không hợp lệ (Ví dụ: 0912345678)";
  }

  // 4. Email Validation (OPTIONAL)
  const rawEmail = input.email ? input.email.trim() : "";
  const email = rawEmail.length > 0 ? rawEmail : null;
  if (email && !isValidEmail(email)) {
    errors.email = "Địa chỉ email không đúng định dạng";
  }

  // 5. Content Validation (REQUIRED)
  const content = input.content ? input.content.trim() : "";
  if (!content) {
    errors.content = "Vui lòng nhập Nội dung cần tư vấn";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      error: "Dữ liệu đăng ký tư vấn không hợp lệ",
      errors,
    };
  }

  try {
    // 6. Persist Consultation Lead in PostgreSQL Database
    const lead = await prisma.consultationLead.create({
      data: {
        siteId: input.siteId,
        fullName,
        phone,
        email,
        content,
        ipAddress: input.ipAddress || null,
        userAgent: input.userAgent || null,
        status: "NEW",
      },
    });

    // 7. ASYNCHRONOUS NON-BLOCKING EMAIL NOTIFICATION
    // Trigger email sending in background. DO NOT await or let email error fail the request!
    sendConsultationNotificationEmail({
      siteId: input.siteId,
      fullName: lead.fullName,
      phone: lead.phone,
      email: lead.email,
      content: lead.content,
      createdAt: lead.createdAt,
    }).catch((emailErr) => {
      console.error("[ConsultationService] Background notification email error (Lead preserved):", emailErr);
    });

    return {
      success: true,
      data: {
        id: lead.id,
        fullName: lead.fullName,
        phone: lead.phone,
        email: lead.email,
        createdAt: lead.createdAt,
      },
    };
  } catch (error: any) {
    console.error("[ConsultationService] Database error creating ConsultationLead:", error);
    return {
      success: false,
      error: "Không thể lưu thông tin tư vấn. Vui lòng thử lại sau.",
    };
  }
}
