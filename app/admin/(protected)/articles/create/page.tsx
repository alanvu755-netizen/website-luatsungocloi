"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Save, CheckCircle, RefreshCw, AlertCircle, Check } from "lucide-react";
import ArticleEditorToolbar from "@/components/admin/ArticleEditorToolbar";

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

  // AI Assistant States
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

  // AI Content Generator
  const handleGenerateAI = async () => {
    if (!aiHighlights.trim()) return;
    setAiLoading(true);
    setAiError(null);
    setAiDraft(null);

    const requestId = `art_req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    try {
      const res = await fetch("/api/admin/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptCode: "ARTICLE_GENERATE",
          promptText: `Hãy viết bài viết tư vấn pháp luật chuyên sâu dựa trên các ý chính sau:\n${aiHighlights}`,
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

  // Critical UX Rule: User clicks "Dùng nội dung này" to populate form
  const handleApplyAIDraft = () => {
    if (!aiDraft) return;

    const lines = aiDraft.split("\n").filter((l) => l.trim() !== "");
    let extractedTitle = "";
      extractedTitle = lines[0]
        .replace(/^tư vấn pháp luật:\s*/i, "")
        .replace(/^bài viết tư vấn pháp lý:\s*/i, "")
        .replace(/^[-#*:]+\s*/, "")
        .trim();

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
          <h1 className="text-xl font-bold text-navy font-serif">Tạo Bài viết Mới</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Soạn thảo bài viết mới và sử dụng Trợ lý AI để sinh nội dung & SEO.
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

      {/* AI Assistant Banner Component */}
      <div className="bg-gradient-to-r from-navy via-slate-900 to-navy text-white rounded-xl p-5 shadow-md border border-navy-light/40 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-sm text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" />
            Trợ lý AI Sinh Bài viết & SEO
          </h2>
          <span className="text-[10px] text-slate-300 uppercase font-semibold">
            AI KHÔNG tự động lưu hay xuất bản
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-8">
            <textarea
              rows={3}
              value={aiHighlights}
              onChange={(e) => setAiHighlights(e.target.value)}
              placeholder="Nhập ý chính của bài viết (Ví dụ: Quy định mới về thu hồi đất đai năm 2026, 3 lưu ý người dân cần nắm rõ, thủ tục bồi thường...)"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div className="md:col-span-4 flex flex-col gap-2">
            <button
              onClick={handleGenerateAI}
              disabled={aiLoading || !aiHighlights.trim()}
              className="w-full py-2.5 bg-gold hover:bg-gold-dark text-navy font-bold text-xs rounded-lg shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {aiLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-navy" />
                  Đang sinh bản nháp AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-navy" />
                  Tạo nội dung bằng AI
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Draft Review Result Box */}
        {aiDraft && (
          <div className="pt-3 border-t border-white/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gold uppercase">Kết quả Bản Nháp AI:</span>
              <button
                onClick={handleApplyAIDraft}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
              >
                {aiUsed ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                <span>{aiUsed ? "Đã áp dụng vào form!" : "Dùng nội dung này"}</span>
              </button>
            </div>

            <div className="bg-slate-950/80 border border-white/10 rounded-lg p-3 max-h-40 overflow-y-auto text-xs text-slate-200 leading-relaxed whitespace-pre-line">
              {aiDraft}
            </div>
          </div>
        )}

        {aiError && (
          <div className="text-xs text-red-300 bg-red-950/50 p-2 rounded border border-red-800">
            {aiError}
          </div>
        )}
      </div>

      {/* Main Article Editor Form */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
        
        {/* Menu & Submenu Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
              Thuộc Menu chính <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedMenuId}
              onChange={(e) => {
                setSelectedMenuId(e.target.value);
                setSelectedSubmenuId("");
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-navy focus:outline-none"
            >
              {menus.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
              Chuyên mục con (Không bắt buộc)
            </label>
            <select
              value={selectedSubmenuId}
              onChange={(e) => setSelectedSubmenuId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-navy focus:outline-none"
            >
              <option value="">-- Không chọn chuyên mục --</option>
              {activeMenu?.submenus.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Multi-Practice Area Checkbox Selection (N-N) */}
        {practiceAreas.length > 0 && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label className="block text-xs font-bold uppercase text-navy">
              Gán Lĩnh vực Hoạt động (N-N Multi-Selection)
            </label>
            <p className="text-[11px] text-slate-500">
              Một bài viết có thể thuộc nhiều Lĩnh vực Chuyên môn khác nhau:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {practiceAreas.map((pa) => {
                const checked = selectedPracticeAreaIds.includes(pa.id);
                return (
                  <label
                    key={pa.id}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                      checked
                        ? "bg-navy/5 border-navy text-navy font-bold shadow-2xs"
                        : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => togglePracticeArea(pa.id)}
                      className="rounded text-navy focus:ring-navy w-4 h-4"
                    />
                    <span>{pa.title}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Title & Slug */}
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
            Tiêu đề bài viết <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Ví dụ: Quy định mới nhất về thủ tục giải quyết tranh chấp đất đai"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-navy focus:ring-2 focus:ring-navy focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
            Đường dẫn Slug (Tự động từ tiêu đề)
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono text-slate-600 focus:ring-2 focus:ring-navy focus:outline-none"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
            Tóm tắt ngắn (Excerpt)
          </label>
          <textarea
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Tóm tắt ngắn 2-3 câu hiển thị ngoài danh sách bài viết..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none"
          />
        </div>

        {/* Full Content */}
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
            Nội dung chi tiết Bài viết <span className="text-red-500">*</span>
          </label>

          <ArticleEditorToolbar
            content={content}
            onChange={setContent}
            textareaRef={textareaRef}
          />

          <textarea
            ref={textareaRef}
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Nhập nội dung bài viết chi tiết hoặc bấm 'Dùng nội dung này' từ Trợ lý AI ở trên..."
            className="w-full px-3 py-2 border border-slate-300 rounded-b-xl text-sm leading-relaxed text-slate-800 focus:ring-2 focus:ring-navy focus:outline-none"
          />
        </div>

        {/* SEO Metadata Box */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 pt-4">
          <h3 className="text-xs font-bold uppercase text-navy">Tối ưu hóa SEO Bài viết</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Thẻ Title SEO
            </label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="Title hiển thị trên Google Search..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-navy focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Thẻ Meta Description
            </label>
            <textarea
              rows={2}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Mô tả 150 ký tự cho kết quả tìm kiếm..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-navy focus:outline-none"
            />
          </div>
        </div>

      </div>

    </div>
  );
}
