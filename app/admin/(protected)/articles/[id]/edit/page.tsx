"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Sparkles, Save, CheckCircle, AlertCircle, Check, RefreshCw, RotateCcw, X } from "lucide-react";
import RichArticleEditor from "@/components/admin/RichArticleEditor";

interface Submenu {
  id: string;
  title: string;
  slug: string;
}

interface Menu {
  id: string;
  title: string;
  slug: string;
  submenus: Submenu[];
}

interface PracticeAreaOption {
  id: string;
  title: string;
}

interface DBContentObjective {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  displayOrder: number;
}

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params?.id as string;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [menus, setMenus] = useState<Menu[]>([]);
  const [practiceAreas, setPracticeAreas] = useState<PracticeAreaOption[]>([]);
  const [selectedMenuId, setSelectedMenuId] = useState<string>("");
  const [selectedSubmenuId, setSelectedSubmenuId] = useState<string>("");
  const [selectedPracticeAreaIds, setSelectedPracticeAreaIds] = useState<string[]>([]);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  // Dynamic Objectives from Database
  const [objectives, setObjectives] = useState<DBContentObjective[]>([]);
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string>("");

  // AI Assistant V2 States
  const [aiUserHighlight, setAiUserHighlight] = useState("");
  const [aiTopicInput, setAiTopicInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDraft, setAiDraft] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiUsed, setAiUsed] = useState(false);

  const [loadingArticle, setLoadingArticle] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    // Fetch Menus, Practice Areas, Objectives, and Article Details
    Promise.all([
      fetch("/api/admin/menus").then((r) => r.json()),
      fetch("/api/admin/practice-areas").then((r) => r.json()),
      fetch("/api/admin/content-objectives").then((r) => r.json()),
      fetch(`/api/admin/articles/${articleId}`).then((r) => r.json()),
    ])
      .then(([menusData, paData, objData, articleData]) => {
        if (menusData.menus) setMenus(menusData.menus);
        if (paData.practiceAreas) setPracticeAreas(paData.practiceAreas);
        if (objData.objectives && objData.objectives.length > 0) {
          setObjectives(objData.objectives);
          setSelectedObjectiveId(objData.objectives[0].id);
        }
        if (articleData.article) {
          const art = articleData.article;
          setTitle(art.title);
          setSlug(art.slug);
          setExcerpt(art.excerpt || "");
          setContent(art.content);
          setSeoTitle(art.seoTitle || "");
          setMetaDescription(art.metaDescription || "");
          setSelectedMenuId(art.menuId);
          setSelectedSubmenuId(art.submenuId || "");
          if (art.articlePracticeAreas) {
            setSelectedPracticeAreaIds(
              art.articlePracticeAreas.map((apa: any) => apa.practiceAreaId)
            );
          }
        }
      })
      .catch(() => setFeedback({ type: "error", message: "Không thể tải thông tin bài viết" }))
      .finally(() => setLoadingArticle(false));
  }, [articleId]);

  const togglePracticeArea = (id: string) => {
    setSelectedPracticeAreaIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // AI Content Generator Engine V2
  const handleGenerateAI = async (isRegenerate = false) => {
    if (!aiUserHighlight.trim()) return;
    setAiLoading(true);
    setAiError(null);

    const requestId = `art_req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    try {
      const res = await fetch("/api/admin/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptCode: "ARTICLE_GENERATE",
          userHighlight: aiUserHighlight,
          topic: aiTopicInput || title,
          existingArticleContext: content ? content.slice(0, 500) : "",
          objectiveId: selectedObjectiveId,
          isRegenerate,
          model: "gemini-1.5-flash",
          requestId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Tạo nội dung AI không thành công");
      }

      setAiDraft(data.resultDraft);
    } catch (err: any) {
      setAiError(err.message || "Không thể kết nối dịch vụ AI");
    } finally {
      setAiLoading(false);
    }
  };

  // Critical UX Safeguard Rule: Confirm before replacing existing editor content
  const handleApplyAIDraft = () => {
    if (!aiDraft) return;

    if (content.trim() !== "") {
      const confirmReplace = confirm(
        "⚠️ XÁC NHẬN THAY THẾ NỘI DUNG:\n\nBạn đang có nội dung trong bài viết. Bạn có chắc chắn muốn THAY THẾ bằng bản nháp AI mới này không?"
      );
      if (!confirmReplace) return;
    }

    const lines = aiDraft.split("\n").filter((l) => l.trim() !== "");
    let extractedTitle = "";
    if (lines.length > 0) {
      extractedTitle = lines[0]
        .replace(/^#+\s*/, "")
        .replace(/^\[.*?\]\s*/, "")
        .replace(/^tư vấn pháp luật:\s*/i, "")
        .replace(/^bài viết tư vấn pháp lý:\s*/i, "")
        .replace(/^giải đáp pháp luật:\s*/i, "")
        .replace(/^cảnh báo rủi ro pháp lý:\s*/i, "")
        .replace(/^phổ biến kiến thức pháp luật:\s*/i, "")
        .replace(/^phân tích điểm mới pháp luật:\s*/i, "")
        .replace(/^hướng dẫn từng bước xử lý:\s*/i, "")
        .replace(/^giải pháp pháp lý chuyên sâu:\s*/i, "")
        .replace(/^tiêu đề:\s*/i, "")
        .replace(/^[-*:]+\s*/, "")
        .trim();
    }

    if (aiTopicInput && aiTopicInput.trim() !== "") {
      setTitle(aiTopicInput.trim());
    } else if (extractedTitle && extractedTitle.length > 5 && !title) {
      setTitle(extractedTitle);
    }

    setContent(aiDraft);
    if (!excerpt) setExcerpt(aiDraft.slice(0, 180) + "...");
    if (!seoTitle) setSeoTitle(title || "Tư vấn Pháp luật | Luật sư Lê Thị Ngọc Lợi");
    if (!metaDescription) setMetaDescription(aiDraft.slice(0, 150));
    setAiUsed(true);
    setTimeout(() => setAiUsed(false), 3000);
  };

  const handleSubmit = async (status: "DRAFT" | "PUBLISHED") => {
    if (!title || !content || !selectedMenuId) {
      setFeedback({ type: "error", message: "Vui lòng kiểm tra lại các thông tin bắt buộc (Tiêu đề, Nội dung, Menu)." });
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/articles/${articleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menuId: selectedMenuId,
          submenuId: selectedSubmenuId || null,
          practiceAreaIds: selectedPracticeAreaIds,
          title,
          slug,
          excerpt,
          content,
          seoTitle,
          metaDescription,
          status,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Không thể lưu nội dung. Vui lòng thử lại.");
      }

      setFeedback({
        type: "success",
        message: status === "PUBLISHED" ? "✓ Bài viết đã được xuất bản thành công." : "✓ Bài viết đã được lưu thành bản nháp.",
      });

      setTimeout(() => {
        router.push("/admin/articles");
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Lỗi lưu bài viết" });
    } finally {
      setSaving(false);
    }
  };

  if (loadingArticle) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-navy" />
        Đang tải thông tin bài viết...
      </div>
    );
  }

  const activeMenu = menus.find((m) => m.id === selectedMenuId);
  const activeObjDesc = objectives.find((o) => o.id === selectedObjectiveId)?.description;

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy font-serif">Chỉnh sửa Bài viết</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cập nhật nội dung bài viết và nâng cấp bằng Trợ lý AI Content Strategist V2.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSubmit("DRAFT")}
            disabled={saving}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-lg shadow-xs transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            Lưu bản nháp
          </button>

          <button
            onClick={() => handleSubmit("PUBLISHED")}
            disabled={saving}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4" />
            Cập nhật & Xuất bản
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-3 border shadow-xs ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold"
              : "bg-red-50 border-red-300 text-red-700"
          }`}
        >
          {feedback.type === "success" ? (
            <Check className="w-5 h-5 flex-shrink-0 text-emerald-600 stroke-[3]" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* AI Assistant V2 Dynamic Objective Banner */}
      <div className="bg-gradient-to-r from-navy via-slate-900 to-navy text-white rounded-xl p-5 shadow-md border border-navy-light/40 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-sm text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" />
            Trợ lý AI Nâng cấp Bài viết V2 (Content Strategist)
          </h2>
          <span className="text-[10px] text-slate-300 uppercase font-semibold">
            AI KHÔNG tự động lưu hay xuất bản
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* A. Content Objective Selection */}
          <div className="md:col-span-4 space-y-1">
            <label className="block text-xs font-semibold text-gold uppercase">
              Mục tiêu nội dung (Database Load)
            </label>
            <select
              value={selectedObjectiveId}
              onChange={(e) => setSelectedObjectiveId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-white/20 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-gold"
            >
              {objectives.map((obj) => (
                <option key={obj.id} value={obj.id} className="bg-slate-900 text-white">
                  {obj.name}
                </option>
              ))}
            </select>
            {activeObjDesc && (
              <p className="text-[11px] text-slate-300 italic line-clamp-2 mt-1">
                {activeObjDesc}
              </p>
            )}
          </div>

          {/* B & C. User Highlights & Topic */}
          <div className="md:col-span-8 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gold uppercase mb-1">
                Thông tin / Highlight muốn AI khai thác <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={3}
                value={aiUserHighlight}
                onChange={(e) => setAiUserHighlight(e.target.value)}
                placeholder="Nhập ý chính cần AI viết lại hoặc bổ sung..."
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Chủ đề hoặc tiêu đề dự kiến (Tùy chọn)
              </label>
              <input
                type="text"
                value={aiTopicInput}
                onChange={(e) => setAiTopicInput(e.target.value)}
                placeholder="Để trống nếu giữ nguyên tiêu đề bài viết hiện tại..."
                className="w-full px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
          </div>

        </div>

        <div className="flex justify-end gap-3 pt-1">
          <button
            onClick={() => handleGenerateAI(false)}
            disabled={aiLoading || !aiUserHighlight.trim()}
            className="px-5 py-2.5 bg-gold hover:bg-gold-dark text-navy font-bold text-xs rounded-lg shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {aiLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-navy" />
                Đang phân tích & sinh bài viết...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-navy" />
                Tạo nội dung bằng AI
              </>
            )}
          </button>
        </div>

        {aiError && (
          <div className="p-3 bg-red-900/60 border border-red-500/50 rounded-lg text-xs text-red-200">
            {aiError}
          </div>
        )}

        {/* AI Draft Review Result Box (Preview Workflow) */}
        {aiDraft && (
          <div className="pt-3 border-t border-white/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gold uppercase">Kết quả Bản Nháp AI (DRAFT):</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">
                  DRAFT MODE
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleGenerateAI(true)}
                  disabled={aiLoading}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all border border-white/20"
                  title="Tạo phiên bản khác với cấu trúc & cách mở bài mới"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Tạo lại (Regenerate)</span>
                </button>

                <button
                  onClick={() => setAiDraft(null)}
                  className="px-2.5 py-1.5 bg-white/10 hover:bg-red-500/30 text-slate-300 hover:text-white text-xs font-semibold rounded-lg transition-all border border-white/20 flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Hủy</span>
                </button>

                <button
                  onClick={handleApplyAIDraft}
                  className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
                >
                  {aiUsed ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                  <span>{aiUsed ? "Đã đưa vào bài viết!" : "Đưa vào bài viết"}</span>
                </button>
              </div>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-lg max-h-56 overflow-y-auto text-xs font-mono text-slate-200 whitespace-pre-wrap">
              {aiDraft}
            </div>
          </div>
        )}
      </div>

      {/* Main Form Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Title, Excerpt, Content */}
        <div className="md:col-span-8 space-y-5">
          
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-navy mb-1">
                Tiêu đề Bài viết <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề bài viết tư vấn..."
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Đường dẫn tĩnh (Slug)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="duong-dan-tinh-bai-viet"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-navy mb-1">
                Tóm tắt ngắn (Excerpt)
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Đoạn tóm tắt ngắn hiển thị ở danh sách bài viết..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>
          </div>

          {/* Article Rich Content Area */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <label className="block text-xs font-bold uppercase text-navy">
                Nội dung chi tiết bài viết <span className="text-red-500">*</span>
              </label>
            </div>

            <RichArticleEditor
              content={content}
              onChange={setContent}
            />
          </div>

          {/* SEO Metadata Box */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase text-navy border-b border-slate-100 pb-2">
              Tối ưu SEO Search Engine
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">SEO Title</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Tiêu đề hiển thị trên kết quả tìm kiếm Google..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Meta Description</label>
              <textarea
                rows={2}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Mô tả SEO hiển thị dưới tiêu đề Google..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>
          </div>

        </div>

        {/* Right Sidebar: Categories & Practice Areas */}
        <div className="md:col-span-4 space-y-5">
          
          {/* Menu & Submenu Category Picker */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase text-navy border-b border-slate-100 pb-2">
              Phân loại Danh mục <span className="text-red-500">*</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Menu chính</label>
              <select
                value={selectedMenuId}
                onChange={(e) => {
                  setSelectedMenuId(e.target.value);
                  setSelectedSubmenuId("");
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:ring-2 focus:ring-navy focus:outline-none"
              >
                {menus.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>

            {activeMenu && activeMenu.submenus.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Submenu con</label>
                <select
                  value={selectedSubmenuId}
                  onChange={(e) => setSelectedSubmenuId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:ring-2 focus:ring-navy focus:outline-none"
                >
                  <option value="">-- Không chọn (Bài viết thuộc Menu chính) --</option>
                  {activeMenu.submenus.map((sm) => (
                    <option key={sm.id} value={sm.id}>
                      {sm.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Practice Areas Multi-Selection */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase text-navy border-b border-slate-100 pb-2">
              Lĩnh vực Hoạt động liên quan
            </h3>

            <div className="space-y-2 max-h-48 overflow-y-auto pt-1">
              {practiceAreas.length === 0 ? (
                <p className="text-xs text-slate-400">Đang tải lĩnh vực...</p>
              ) : (
                practiceAreas.map((pa) => (
                  <label key={pa.id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1.5 rounded">
                    <input
                      type="checkbox"
                      checked={selectedPracticeAreaIds.includes(pa.id)}
                      onChange={() => togglePracticeArea(pa.id)}
                      className="rounded border-slate-300 text-navy focus:ring-navy w-3.5 h-3.5"
                    />
                    <span className="text-xs font-medium text-slate-700">{pa.title}</span>
                  </label>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
