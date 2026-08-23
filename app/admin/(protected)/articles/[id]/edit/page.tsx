"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Save, CheckCircle, AlertCircle, Check } from "lucide-react";

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

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params?.id as string;

  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenuId, setSelectedMenuId] = useState<string>("");
  const [selectedSubmenuId, setSelectedSubmenuId] = useState<string>("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  const [loadingArticle, setLoadingArticle] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    // Fetch Menus and Article Details
    Promise.all([
      fetch("/api/admin/menus").then((r) => r.json()),
      fetch(`/api/admin/articles/${articleId}`).then((r) => r.json()),
    ])
      .then(([menusData, articleData]) => {
        if (menusData.menus) setMenus(menusData.menus);
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
        }
      })
      .catch(() => setFeedback({ type: "error", message: "Không thể tải thông tin bài viết" }))
      .finally(() => setLoadingArticle(false));
  }, [articleId]);

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
      setFeedback({ type: "error", message: err.message || "Không thể lưu nội dung. Vui lòng thử lại." });
    } finally {
      setSaving(false);
    }
  };

  const activeMenu = menus.find((m) => m.id === selectedMenuId);

  if (loadingArticle) {
    return <div className="p-8 text-center text-slate-500">Đang tải dữ liệu bài viết...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy font-serif">Chỉnh sửa Bài viết</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cập nhật nội dung bài viết, hình ảnh và tối ưu SEO.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSubmit("DRAFT")}
            disabled={saving}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-lg shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Đang lưu..." : "Lưu bản nháp"}
          </button>

          <button
            onClick={() => handleSubmit("PUBLISHED")}
            disabled={saving}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            {saving ? "Đang lưu..." : "Xuất bản ra Public"}
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-3 border ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {feedback.type === "success" ? (
            <Check className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Editor Form */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
              Thuộc Menu chính
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
              Chuyên mục con
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

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
            Tiêu đề bài viết
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-navy focus:ring-2 focus:ring-navy focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
            Đường dẫn Slug
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono text-slate-600 focus:ring-2 focus:ring-navy focus:outline-none"
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
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
            Nội dung chi tiết Bài viết
          </label>
          <textarea
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm leading-relaxed text-slate-800 focus:ring-2 focus:ring-navy focus:outline-none"
          />
        </div>

        {/* SEO Box */}
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
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-navy focus:outline-none"
            />
          </div>
        </div>

      </div>

    </div>
  );
}
