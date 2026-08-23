import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { runAIGeneration } from "@/lib/ai/service";

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || !user.siteId) {
      return NextResponse.json(
        { message: "Bạn cần đăng nhập để thực hiện thao tác này" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { promptCode, promptText, model, requestId } = body;

    if (!promptText || !requestId) {
      return NextResponse.json(
        { message: "Nội dung yêu cầu (promptText) và requestId là bắt buộc" },
        { status: 400 }
      );
    }

    const result = await runAIGeneration({
      userId: user.id,
      siteId: user.siteId,
      promptCode: promptCode || "ARTICLE_GENERATE",
      promptText,
      model: model || "gemini-1.5-flash",
      requestId,
    });

    if (!result.success) {
      return NextResponse.json(
        { message: result.message || "Tạo nội dung AI không thành công", errorCode: result.errorCode },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      resultDraft: result.resultDraft,
      generationId: result.generation?.id,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}
