"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Save, CheckCircle, RefreshCw, AlertCircle, Check, RotateCcw, X, Newspaper } from "lucide-react";
import RichArticleEditor from "@/components/admin/RichArticleEditor";
import { stripHtmlTags } from "@/lib/utils/string";

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

export default function CreateNewsPage() {
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

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // AI Generator Drawer State
  const [aiDrawerOpen, AiDrawerOpenState] = useState(false);
  const [aiHighlightInput, setAiHighlightInput] = useState("");
  const [objectives, setObjectives] = useState<DBContentObjective[]>([]);
  const [selectedObjectiveCode, setSelectedObjectiveCode] = useState("NEW_REGULATION_ANALYSIS");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiDraftOutput, setAiDraftOutput] = useState<{
    content: string;
    suggestedTitle?: string;
    suggestedExcerpt?: string;
    suggestedSeoTitle?: string;
    suggestedMetaDescription?: string;
  } | null>(null);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/menus").then((r) => r.json()),
      fetch("/api/admin/practice-areas").then((r) => r.json()),
      fetch("/api/admin/content-objectives").then((r) => r.json()),
    ])
      .then(([menuData, paData, objData]) => {
        if (menuData.menus) {
          setMenus(menuData.menus);
          const newsMenu = menuData.menus.find(
            (m: Menu) => m.slug.toLowerCase() === "tin-tuc" || m.title.toLowerCase().includes("tin tức")
          );
          if (newsMenu) {
            setSelectedMenuId(newsMenu.id);
            if (newsMenu.submenus && newsMenu.submenus.length > 0) {
              setSelectedSubmenuId(newsMenu.submenus[0].id);
            }
          } else if (menuData.menus.length > 0) {
            setSelectedMenuId(menuData.menus[0].id);
          }
        }
        if (paData.practiceAreas) {
          setPracticeAreas(paData.practiceAreas);
        }
        if (objData.objectives) {
          setObjectives(objData.objectives);
          if (objData.objectives.length > 0) {
            setSelectedObjectiveCode(objData.objectives[0].code);
          }
        }
      })
      .catch(() => {});
  }, []);

  const selectedMenu = menus.find((m) => m.id === selectedMenuId);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug || slug.trim() === "") {
      const generatedSlug = val
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setSlug(generatedSlug);
    }
  };

  const handleTogglePracticeArea = (paId: string) => {
    if (selectedPracticeAreaIds.includes(paId)) {
      setSelectedPracticeAreaIds(selectedPracticeAreaIds.filter((id) => id !== paId));
    } else {
      setSelectedPracticeAreaIds([...selectedPracticeAreaIds, paId]);
    }
  };

  const handleGenerateAIDraft = async () => {
    if (!aiHighlightInput.trim()) {
      setAiFeedback("Vui lòng nhập tóm tắt sự kiện/tin tức để AI tạo nội dung.");
      return;
    }

    setAiGenerating(true);
    setAiFeedback(null);

    try {
      const res = await fetch("/api/admin/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptCode: selectedObjectiveCode,
          userHighlight: aiHighlightInput,
          topic: title || aiHighlightInput.slice(0, 60),
          existingArticleContext: content ? content.slice(0, 300) : undefined,
          siteId: "current",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Lỗi tạo nội dung từ AI.");
      }

      const generatedDraft = data.data?.content || data.content;
      setAiDraftOutput({
        content: generatedDraft,
        suggestedTitle: data.data?.suggestedTitle,
        suggestedExcerpt: data.data?.suggestedExcerpt,
        suggestedSeoTitle: data.data?.suggestedSeoTitle,
        suggestedMetaDescription: data.data?.suggestedMetaDescription,
      });

      setAiFeedback("✓ Đã sinh bản nháp Tin tức AI thành công!");
    } catch (err: any) {
      setAiFeedback(err.message || "Đã xảy ra lỗi khi tạo bài viết AI.");
    } finally {
      setAiGenerating(false);
    }
  };

  const handleApplyAIDraft = () => {
    if (!aiDraftOutput) return;

    if (aiDraftOutput.content) setContent(aiDraftOutput.content);
    if (aiDraftOutput.suggestedTitle) {
      const cleanTitle = stripHtmlTags(aiDraftOutput.suggestedTitle);
      setTitle(cleanTitle);
      handleTitleChange(cleanTitle);
    }
    if (aiDraftOutput.suggestedExcerpt) setExcerpt(stripHtmlTags(aiDraftOutput.suggestedExcerpt));
    if (aiDraftOutput.suggestedSeoTitle) setSeoTitle(stripHtmlTags(aiDraftOutput.suggestedSeoTitle));
    if (aiDraftOutput.suggestedMetaDescription) setMetaDescription(stripHtmlTags(aiDraftOutput.suggestedMetaDescription));

    AiDrawerOpenState(false);
  };

  const handleSaveNews = async (status: "DRAFT" | "PUBLISHED") => {
    if (!title.trim() || !content.trim() || !selectedMenuId) {
      setError("Vui lòng điền đầy đủ Tiêu đề, Nội dung và Chọn Menu Tin tức.");
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
          status,
          seoTitle,
          metaDescription,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lỗi tạo bài viết tin tức.");

      router.push("/admin/news");
    } catch (err: any) {
      setError(err.message || "Lỗi tạo bài viết tin tức.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-navy font-serif flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-gold" />
            Tạo Bài viết Tin tức mới (Legal News)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Soạn thảo bài viết tin tức thời sự pháp luật, thông cáo báo chí và bài viết truyền thông.
          </p>
        </div>

        <button
          type="button"
          onClick={() => AiDrawerOpenState(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>AI Writer Studio (Tạo Tin tức)</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-5">
          {/* Title & Slug */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Tiêu đề Bài viết Tin tức <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="VD: Cập nhật quy định mới về thời hiệu khởi kiện tranh chấp đất đai 2026"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Đường dẫn tĩnh (Slug SEO)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono bg-slate-50 focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Tóm tắt ngắn (Excerpt)
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Tóm tắt nội dung chính của tin tức..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>
          </div>

          {/* Content Editor */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <label className="block text-xs font-semibold uppercase text-slate-700">
              Nội dung Bài viết Tin tức <span className="text-red-500">*</span>
            </label>
            <RichArticleEditor content={content} onChange={setContent} placeholder="Nhập nội dung tin tức..." />
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-5">
          {/* Action Buttons */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase text-navy border-b border-slate-100 pb-2">
              Xuất bản & Lưu trữ
            </h3>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleSaveNews("DRAFT")}
                disabled={saving}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-all"
              >
                Lưu Nháp
              </button>
              <button
                type="button"
                onClick={() => handleSaveNews("PUBLISHED")}
                disabled={saving}
                className="flex-1 py-2 bg-navy hover:bg-navy-dark text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1 transition-all"
              >
                <Save className="w-4 h-4 text-gold" />
                Xuất Bản
              </button>
            </div>
          </div>

          {/* Menu Selection */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase text-navy border-b border-slate-100 pb-2">
              Chuyên mục Bài viết
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Menu chính</label>
              <select
                value={selectedMenuId}
                onChange={(e) => {
                  setSelectedMenuId(e.target.value);
                  setSelectedSubmenuId("");
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 font-semibold focus:ring-2 focus:ring-navy focus:outline-none"
              >
                {menus.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>

            {selectedMenu && selectedMenu.submenus && selectedMenu.submenus.length > 0 && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Chuyên mục con (Submenu)</label>
                <select
                  value={selectedSubmenuId}
                  onChange={(e) => setSelectedSubmenuId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:ring-2 focus:ring-navy focus:outline-none"
                >
                  <option value="">-- Chọn chuyên mục con --</option>
                  {selectedMenu.submenus.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Practice Area Tags */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase text-navy border-b border-slate-100 pb-2">
              Lĩnh vực Pháp lý liên quan
            </h3>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {practiceAreas.map((pa) => (
                <label key={pa.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPracticeAreaIds.includes(pa.id)}
                    onChange={() => handleTogglePracticeArea(pa.id)}
                    className="rounded border-slate-300 text-navy focus:ring-navy"
                  />
                  <span>{pa.title}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Writer Drawer Modal */}
      {aiDrawerOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex justify-end">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h2 className="font-bold text-sm text-navy uppercase">Trợ lý AI Writer (Tạo Bản tin Pháp luật)</h2>
                </div>
                <button type="button" onClick={() => AiDrawerOpenState(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {aiFeedback && (
                <div
                  className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                    aiFeedback.startsWith("✓") ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"
                  }`}
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{aiFeedback}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Mục tiêu bài viết AI</label>
                <select
                  value={selectedObjectiveCode}
                  onChange={(e) => setSelectedObjectiveCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 font-semibold"
                >
                  {objectives.map((obj) => (
                    <option key={obj.id} value={obj.code}>
                      {obj.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                  Nhập Tóm tắt / Sự kiện Tin tức nguồn
                </label>
                <textarea
                  rows={4}
                  value={aiHighlightInput}
                  onChange={(e) => setAiHighlightInput(e.target.value)}
                  placeholder="Nhập ý chính, vụ việc thời sự hoặc nghị định mới cần phân tích..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleGenerateAIDraft}
                disabled={aiGenerating}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2"
              >
                {aiGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                <span>{aiGenerating ? "AI đang sinh bản nháp Tin tức..." : "Sinh Bản nháp Tin tức với Gemini AI"}</span>
              </button>

              {aiDraftOutput && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 mt-4">
                  <h4 className="font-bold text-xs text-navy uppercase">Bản nháp sinh bởi AI:</h4>
                  {aiDraftOutput.suggestedTitle && (
                    <div className="text-xs font-bold text-slate-800">
                      Tiêu đề gợi ý: {stripHtmlTags(aiDraftOutput.suggestedTitle)}
                    </div>
                  )}
                  <div className="text-xs text-slate-600 max-h-40 overflow-y-auto p-2 bg-white rounded border border-slate-200 font-mono">
                    {aiDraftOutput.content}
                  </div>
                </div>
              )}
            </div>

            {aiDraftOutput && (
              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={handleApplyAIDraft}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-sm"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Áp dụng Bản nháp AI vào Bài viết Tin tức</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
