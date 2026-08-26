import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { getEffectiveSiteId } from "@/lib/services/site.service";
import { runAIGeneration } from "@/lib/ai/service";

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
    const {
      promptCode,
      promptText,
      userHighlight,
      topic,
      existingArticleContext,
      objectiveId,
      contentObjectiveCode,
      isRegenerate,
      model,
      requestId,
    } = body;

    const highlightText = userHighlight || promptText;

    if (!highlightText || highlightText.trim() === "") {
      return NextResponse.json(
        { message: "Thông tin / Highlight (userHighlight) là bắt buộc để AI tập trung khai thác" },
        { status: 400 }
      );
    }

    if (!requestId) {
      return NextResponse.json(
        { message: "requestId là bắt buộc" },
        { status: 400 }
      );
    }

    if (!objectiveId && !contentObjectiveCode) {
      return NextResponse.json(
        { message: "Vui lòng chọn Mục tiêu nội dung (objectiveId) trước khi tạo bài viết bằng AI" },
        { status: 400 }
      );
    }

    const result = await runAIGeneration({
      userId: user.id,
      siteId: targetSiteId,
      promptCode: promptCode || "ARTICLE_GENERATE",
      promptText: highlightText,
      userHighlight: highlightText,
      topic,
      existingArticleContext,
      objectiveId,
      contentObjectiveCode,
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
