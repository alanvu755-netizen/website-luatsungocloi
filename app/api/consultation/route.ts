import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { createConsultationLead } from "@/lib/services/consultation.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, phone, email, content, website_hp_field } = body;

    // Get primary siteId
    const site = await prisma.site.findUnique({ where: { slug: "le-thi-ngoc-loi" } });
    if (!site) {
      return NextResponse.json({ success: false, error: "Site không tồn tại." }, { status: 400 });
    }

    // Call ConsultationService with single object input
    const result = await createConsultationLead({
      siteId: site.id,
      fullName,
      phone,
      email,
      content,
      honeypot: website_hp_field,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error, errors: result.errors }, { status: 400 });
    }

    return NextResponse.json({ success: true, leadId: result.data?.id });
  } catch (error: any) {
    console.error("Consultation Submission Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gửi yêu cầu tư vấn thất bại." },
      { status: 400 }
    );
  }
}
