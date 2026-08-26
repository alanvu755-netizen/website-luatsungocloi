"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Save, CheckCircle, RefreshCw, AlertCircle, Check, RotateCcw } from "lucide-react";
import ArticleEditorToolbar from "@/components/admin/ArticleEditorToolbar";
import { ContentObjective } from "@/lib/ai/provider";

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

const OBJECTIVE_OPTIONS: { value: ContentObjective; label: string; desc: string }[] = [
  { value: "LEGAL_QNA", label: "🔎 Giải đáp vấn đề pháp lý", desc: "Ưu tiên trả lời trực tiếp, căn cứ pháp lý & ví dụ thực tế" },
  { value: "RISK_WARNING", label: "⚠️ Cảnh báo rủi ro", desc: "Ưu tiên nêu nhận diện nguy cơ, hậu quả & cách phòng tránh" },
  { value: "KNOWLEDGE_SHARING", label: "📚 Phổ biến kiến thức", desc: "Ưu tiên từ ngữ đơn giản, bình dân, giúp đọc giả dễ hiểu" },
  { value: "NEW_REGULATION_ANALYSIS", label: "📰 Phân tích quy định mới", desc: "Ưu tiên tóm tắt điểm mới, so sánh Trước vs Sau khi áp dụng" },
  { value: "SITUATION_GUIDE", label: "💡 Hướng dẫn xử lý tình huống", desc: "Ưu tiên hồ sơ cần chuẩn bị & checklist từng bước thực hiện" },
  { value: "CLIENT_ATTRACTION", label: "👤 Thu hút khách hàng tư vấn", desc: "Ưu tiên giải pháp giá trị thực tế, nhận diện bài toán cần Luật sư" },
  { value: "ENGAGEMENT_BOOST", label: "📣 Tăng tương tác & chia sẻ", desc: "Ưu tiên Hook hấp dẫn, tình huống dễ đồng cảm & góc nhìn thảo luận" },
];

export default function CreateArticlePage() {
  const router = useRouter();
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

  // AI Assistant V2 States
  const [contentObjective, setContentObjective] = useState<ContentObjective>("LEGAL_QNA");
  const [aiHighlights, setAiHighlights] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDraft, setAiDraft] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiUsed, setAiUsed] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch Menus for dropdown selection
    fetch("/api/admin/menus")
      .then((res) => res.json())
      .then((data) => {
        if (data.menus) {
          setMenus(data.menus);
          if (data.menus.length > 0) {
            setSelectedMenuId(data.menus[0].id);
          }
        }
      })
      .catch(() => {});

    // Fetch Practice Areas for N-N multi-selection
    fetch("/api/admin/practice-areas")
      .then((res) => res.json())
      .then((data) => {
        if (data.practiceAreas) {
          setPracticeAreas(data.practiceAreas);
        }
      })
      .catch(() => {});
  }, []);

  const togglePracticeArea = (id: string) => {
    setSelectedPracticeAreaIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Auto generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const generatedSlug = val
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    setSlug(generatedSlug);
  };

  // AI Content Generator Engine V2
  const handleGenerateAI = async (isRegenerate = false) => {
    if (!aiHighlights.trim()) return;
    setAiLoading(true);
    setAiError(null);

    const requestId = `art_req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    try {
      const res = await fetch("/api/admin/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptCode: "ARTICLE_GENERATE",
          promptText: aiHighlights,
          contentObjective,
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
        .replace(/^tư vấn pháp luật:\s*/i, "")
        .replace(/^bài viết tư vấn pháp lý:\s*/i, "")
        .replace(/^giải đáp pháp luật:\s*/i, "")
        .replace(/^cảnh báo rủi ro pháp lý:\s*/i, "")
        .replace(/^phổ biến kiến thức pháp luật:\s*/i, "")
        .replace(/^phân tích điểm mới pháp luật:\s*/i, "")
        .replace(/^hướng dẫn từng bước xử lý:\s*/i, "")
        .replace(/^giải pháp pháp lý chuyên sâu:\s*/i, "")
        .replace(/^góc nhìn pháp lý:\s*/i, "")
        .replace(/^\[biến thể mới\]\s*/i, "")
        .replace(/^[-#*:]+\s*/, "")
        .trim();
    }

    if (extractedTitle) {
      if (extractedTitle === extractedTitle.toUpperCase() && extractedTitle.length > 5) {
        extractedTitle = extractedTitle.charAt(0).toUpperCase() + extractedTitle.slice(1).toLowerCase();
      }
      handleTitleChange(extractedTitle);
    } else if (!title) {
      handleTitleChange("Tư vấn Pháp luật: " + (aiHighlights.slice(0, 40) || "Bài viết mới"));
    }

    setContent(aiDraft);
    setExcerpt(aiDraft.slice(0, 180) + "...");
    setSeoTitle(extractedTitle || title || "Tư vấn Pháp luật | Luật sư Lê Thị Ngọc Lợi");
    setMetaDescription(aiDraft.slice(0, 150));
    setAiUsed(true);
    setTimeout(() => setAiUsed(false), 3000);
  };

  // Submit Article (Save Draft or Publish)
  const handleSubmit = async (status: "DRAFT" | "PUBLISHED") => {
    if (!title || !content || !selectedMenuId) {
      setError("Vui lòng điền Tiêu đề, Nội dung bài viết và Chọn Menu.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/articles", {
        method: "POST",
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
        throw new Error(data.message || "Lỗi lưu bài viết");
      }

      router.push("/admin/articles");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Xảy ra lỗi trong quá trình xử lý");
    } finally {
      setSaving(false);
    }
  };

  const activeMenu = menus.find((m) => m.id === selectedMenuId);

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy font-serif">Tạo Bài viết Mới (AI V2)</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Soạn thảo bài viết mới và sử dụng Trợ lý AI V2 định hướng theo Mục tiêu bài viết.
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
            Xuất bản ra Public
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* AI Assistant V2 Banner Component */}
      <div className="bg-gradient-to-r from-navy via-slate-900 to-navy text-white rounded-xl p-5 shadow-md border border-navy-light/40 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-sm text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" />
            Trợ lý AI Sinh Bài viết & SEO V2
          </h2>
          <span className="text-[10px] text-slate-300 uppercase font-semibold">
            AI KHÔNG tự động lưu hay xuất bản
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Content Objective Selection */}
          <div className="md:col-span-4 space-y-1">
            <label className="block text-xs font-semibold text-gold uppercase">
              Mục tiêu bài viết (Bắt buộc)
            </label>
            <select
              value={contentObjective}
              onChange={(e) => setContentObjective(e.target.value as ContentObjective)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-xs text-white bg-slate-900 focus:outline-none focus:ring-2 focus:ring-gold"
            >
              {OBJECTIVE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-300 italic">
              {OBJECTIVE_OPTIONS.find((o) => o.value === contentObjective)?.desc}
            </p>
          </div>

          {/* User Source Input */}
          <div className="md:col-span-8 space-y-1">
            <label className="block text-xs font-semibold text-gold uppercase">
              Nội dung nguồn / Ý chính của bạn
            </label>
            <textarea
              rows={3}
              value={aiHighlights}
              onChange={(e) => setAiHighlights(e.target.value)}
              placeholder="Nhập ý chính của bài viết (Ví dụ: Quy định mới về thu hồi đất đai năm 2026, 3 lưu ý người dân cần nắm rõ, thủ tục bồi thường...)"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={() => handleGenerateAI(false)}
            disabled={aiLoading || !aiHighlights.trim()}
            className="px-5 py-2.5 bg-gold hover:bg-gold-dark text-navy font-bold text-xs rounded-lg shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {aiLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-navy" />
                Đang sinh bản nháp AI V2...
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

        {/* AI Draft Review Result Box */}
        {aiDraft && (
          <div className="pt-3 border-t border-white/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gold uppercase">Kết quả Bản Nháp AI (DRAFT):</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleGenerateAI(true)}
                  disabled={aiLoading}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all border border-white/20"
                  title="Tạo phiên bản khác với cấu trúc & cách mở bài mới"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Tạo phiên bản khác (Regenerate)</span>
                </button>

                <button
                  onClick={handleApplyAIDraft}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
                >
                  {aiUsed ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                  <span>{aiUsed ? "Đã áp dụng vào form!" : "Dùng nội dung này"}</span>
                </button>
              </div>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-lg max-h-48 overflow-y-auto text-xs font-mono text-slate-200 whitespace-pre-wrap">
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
                onChange={(e) => handleTitleChange(e.target.value)}
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

            <ArticleEditorToolbar
              textareaRef={textareaRef}
              content={content}
              onChange={setContent}
            />

            <textarea
              ref={textareaRef}
              rows={16}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung chi tiết bài viết (Hỗ trợ định dạng Markdown/HTML)..."
              className="w-full p-4 border border-slate-300 rounded-lg text-xs leading-relaxed font-sans focus:ring-2 focus:ring-navy focus:outline-none"
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
