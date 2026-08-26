import { prisma } from "@/lib/db/prisma";

export interface SendConsultationEmailParams {
  siteId: string;
  fullName: string;
  phone: string;
  email?: string | null;
  content: string;
  createdAt?: Date;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send admin notification email asynchronously when a new consultation lead is created.
 *
 * CRITICAL INVARIANT:
 * Email failure MUST NOT throw an exception or cause database rollback of ConsultationLead!
 */
export async function sendConsultationNotificationEmail(
  params: SendConsultationEmailParams
): Promise<EmailSendResult> {
  try {
    // 1. Fetch admin recipient email from SiteSettings
    const settings = await prisma.siteSettings.findUnique({
      where: { siteId: params.siteId },
      select: { consultationNotificationEmail: true },
    });

    const recipientEmail =
      settings?.consultationNotificationEmail || "luatsungocloi@gmail.com";

    // 2. Check Resend API Key from environment
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn(
        "[EmailService] RESEND_API_KEY not set. Operating in dev mode. Email notification skipped silently."
      );
      return {
        success: false,
        error: "RESEND_API_KEY_NOT_CONFIGURED",
      };
    }

    // 3. Prepare email content
    const dateFormatted = new Date(params.createdAt || Date.now()).toLocaleString(
      "vi-VN",
      { timeZone: "Asia/Ho_Chi_Minh" }
    );

    const emailSubject = `[TƯ VẤN MỚI] Yêu cầu tư vấn từ ${params.fullName} - ${params.phone}`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #073b78; border-bottom: 2px solid #d8a84e; padding-bottom: 10px;">
          ⚖️ YÊU CẦU TƯ VẤN PHÁP LUẬT MỚI
        </h2>
        <p style="font-size: 14px; color: #475569;">Có một yêu cầu đăng ký tư vấn mới từ website:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 140px; color: #1e293b;">Họ và tên:</td>
            <td style="padding: 8px; color: #0f172a;">${params.fullName}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 8px; font-weight: bold; color: #1e293b;">Số điện thoại:</td>
            <td style="padding: 8px; color: #073b78; font-weight: bold;">${params.phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #1e293b;">Email:</td>
            <td style="padding: 8px; color: #0f172a;">${params.email || "(Không cung cấp)"}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 8px; font-weight: bold; color: #1e293b;">Thời gian:</td>
            <td style="padding: 8px; color: #0f172a;">${dateFormatted}</td>
          </tr>
        </table>

        <div style="margin-top: 20px; padding: 15px; bg-color: #f1f5f9; border-left: 4px solid #073b78; border-radius: 4px;">
          <h4 style="margin: 0 0 10px 0; color: #073b78;">Nội dung tư vấn:</h4>
          <p style="margin: 0; white-space: pre-wrap; color: #334155; line-height: 1.6;">${params.content}</p>
        </div>

        <p style="font-size: 12px; color: #94a3b8; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 10px; text-align: center;">
          Email thông báo tự động từ Hệ thống Website Luật sư Lê Thị Ngọc Lợi.
        </p>
      </div>
    `;

    // 4. Send email via Resend HTTP REST API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Website Luật sư Lê Thị Ngọc Lợi <no-reply@luatsungocloi.vn>",
        to: [recipientEmail],
        subject: emailSubject,
        html: htmlBody,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "[EmailService] Resend API error response:",
        response.status,
        errorText
      );
      return {
        success: false,
        error: `RESEND_API_ERROR_${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      messageId: data.id,
    };
  } catch (error: any) {
    // SILENT FAIL CATCH - DO NOT THROW TO CALLER
    console.error(
      "[EmailService] Unexpected error sending consultation notification email:",
      error?.message || error
    );
    return {
      success: false,
      error: error?.message || "UNEXPECTED_EMAIL_ERROR",
    };
  }
}
