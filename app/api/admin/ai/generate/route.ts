import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { getEffectiveSiteId } from "@/lib/services/site.service";
import { runAIGeneration } from "@/lib/ai/service";
import { ContentObjective } from "@/lib/ai/provider";

const VALID_OBJECTIVES: ContentObjective[] = [
  "LEGAL_QNA",
  "RISK_WARNING",
  "KNOWLEDGE_SHARING",
  "NEW_REGULATION_ANALYSIS",
  "SITUATION_GUIDE",
  "CLIENT_ATTRACTION",
  "ENGAGEMENT_BOOST",
];

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    const targetSiteId = await getEffectiveSiteId(user);
    if (!user || !targetSiteId) {
      return NextResponse.json(
        { message: "Bạn cần đăng nhập để thực hiện thao tác này" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { promptCode, promptText, contentObjective, isRegenerate, model, requestId } = body;

    if (!promptText || !requestId) {
      return NextResponse.json(
        { message: "Nội dung yêu cầu (promptText) và requestId là bắt buộc" },
        { status: 400 }
      );
    }

    if (!contentObjective) {
      return NextResponse.json(
        { message: "Vui lòng chọn Mục tiêu bài viết trước khi tạo nội dung bằng AI" },
        { status: 400 }
      );
    }

    if (!VALID_OBJECTIVES.includes(contentObjective as ContentObjective)) {
      return NextResponse.json(
        { message: "Mục tiêu bài viết không hợp lệ" },
        { status: 400 }
      );
    }

    const result = await runAIGeneration({
      userId: user.id,
      siteId: targetSiteId,
      promptCode: promptCode || "ARTICLE_GENERATE",
      promptText,
      contentObjective: contentObjective as ContentObjective,
      isRegenerate: Boolean(isRegenerate),
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
