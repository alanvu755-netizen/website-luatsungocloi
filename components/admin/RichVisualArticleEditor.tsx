"use client";

import { useState, useRef } from "react";
import { Upload, Bold, Italic, Heading2, Heading3, List, Check, Eye, Code, Trash2, Image as ImageIcon } from "lucide-react";

interface RichVisualArticleEditorProps {
  content: string;
  onChange: (newContent: string) => void;
}

export default function RichVisualArticleEditor({ content, onChange }: RichVisualArticleEditorProps) {
  const [editorMode, setEditorMode] = useState<"visual" | "code">("visual");
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertTextAtCursor = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(content + `${before}Nội dung${after}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || "Nội dung";
    const replacement = `${before}${selectedText}${after}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    onChange(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 50);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFeedback(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.message || "Tải ảnh thất bại.");

      const imageTag = `\n<img src="${data.url}" alt="${file.name}" class="w-full h-auto rounded-xl my-4 shadow-sm" />\n`;

      if (editorMode === "code" && textareaRef.current) {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const newContent = content.substring(0, start) + imageTag + content.substring(start);
        onChange(newContent);
      } else {
        onChange(content + imageTag);
      }

      setFeedback(`✓ Đã chèn ảnh: ${file.name}`);
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      alert(err.message || "Lỗi khi tải ảnh.");
    } finally {
      setUploading(false);
    }
  };

  // Helper to remove a specific image URL from content
  const removeImageFromContent = (imgUrl: string) => {
    const regex = new RegExp(`<img[^>]*src=["']${imgUrl.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")}["'][^>]*>`, "gi");
    const updated = content.replace(regex, "");
    onChange(updated.trim());
    setFeedback("✓ Đã xóa ảnh khỏi bài viết!");
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="border border-slate-300 rounded-xl overflow-hidden shadow-xs bg-white">
      {/* Top Bar: Mode Switcher & Formatting Controls */}
      <div className="bg-slate-100 border-b border-slate-300 p-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center flex-wrap gap-1">
          {/* Mode Switch Tabs */}
          <div className="bg-slate-200 p-0.5 rounded-lg flex items-center gap-0.5 border border-slate-300 mr-2">
            <button
              type="button"
              onClick={() => setEditorMode("visual")}
              className={`px-3 py-1 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all ${
                editorMode === "visual"
                  ? "bg-navy text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-300/50"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>👁️ Xem Ảnh Trực Quan</span>
            </button>
            <button
              type="button"
              onClick={() => setEditorMode("code")}
              className={`px-3 py-1 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all ${
                editorMode === "code"
                  ? "bg-navy text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-300/50"
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>💻 Mã nguồn</span>
            </button>
          </div>

          {/* Quick Formatting Buttons */}
          <button
            type="button"
            onClick={() => insertTextAtCursor("<b>", "</b>")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            title="In đậm (Bold)"
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => insertTextAtCursor("<i>", "</i>")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            title="In nghiêng (Italic)"
          >
            <Italic className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-300 mx-1" />

          <button
            type="button"
            onClick={() => insertTextAtCursor("<h2>", "</h2>")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            title="Tiêu đề H2"
          >
            <Heading2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => insertTextAtCursor("<h3>", "</h3>")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            title="Tiêu đề H3"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-300 mx-1" />

          <button
            type="button"
            onClick={() => insertTextAtCursor("\n- ", "")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            title="Danh sách gạch đầu dòng"
          >
            <List className="w-4 h-4" />
          </button>

          {/* Clean Base64 Helper Button */}
          {(content.includes("data:image/") || /gCwB1AI|iVBORw0KGgo/i.test(content)) && (
            <button
              type="button"
              onClick={() => {
                const cleaned = content
                  .replace(/<img[^>]*src=["']data:image\/[^"']+["'][^>]*>/gi, "")
                  .replace(/data:image\/[a-zA-Z]+;base64,[a-zA-Z0-9+/=]+/gi, "")
                  .replace(/(?:[A-Za-z0-9+/]{100,}=*)/g, "");
                onChange(cleaned.trim());
                setFeedback("✓ Đã xóa sạch các chuỗi mã hóa ảnh cũ!");
                setTimeout(() => setFeedback(null), 3000);
              }}
              className="px-2.5 py-1 bg-amber-100 text-amber-800 hover:bg-amber-200 text-xs font-semibold rounded flex items-center gap-1 border border-amber-300 transition-all ml-1"
              title="Xóa mã Base64 cũ"
            >
              <span>🧹 Xóa mã ảnh cũ</span>
            </button>
          )}
        </div>

        {/* Upload Image Button */}
        <div className="flex items-center gap-2">
          {feedback && (
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 flex items-center gap-1">
              <Check className="w-3 h-3" />
              {feedback}
            </span>
          )}

          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy hover:bg-navy-dark text-white font-bold text-xs rounded-lg shadow-xs transition-all">
            <Upload className="w-3.5 h-3.5 text-gold" />
            <span>{uploading ? "Đang tải ảnh..." : "📸 Tải & Chèn ảnh từ máy tính"}</span>
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Editor Content Box */}
      {editorMode === "visual" ? (
        <div className="p-4 space-y-4">
          {/* Instructions banner */}
          <div className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 p-2 rounded-lg flex items-center justify-between">
            <span>
              💡 <b>Giao diện Trực quan:</b> Ảnh đã chèn được hiển thị dạng hình ảnh trực tiếp. Bạn có thể chỉnh sửa nội dung bên dưới hoặc chuyển sang tab <b>💻 Mã nguồn</b> nếu cần.
            </span>
          </div>

          {/* Rendered Live Rich Content with Real Images */}
          <div className="min-h-[300px] p-4 bg-slate-50/50 border border-slate-200 rounded-lg text-slate-900 text-sm leading-relaxed font-sans space-y-4">
            <div
              className="prose max-w-none prose-headings:font-serif prose-headings:text-navy prose-h2:text-lg prose-h3:text-base prose-p:my-2 prose-img:rounded-xl prose-img:shadow-sm"
              dangerouslySetInnerHTML={{
                __html: content
                  ? content
                      .replace(/\n\n/g, "<br/><br/>")
                      .replace(/\n/g, "<br/>")
                  : "<p class='text-slate-400 italic'>Chưa có nội dung bài viết. Hãy dùng AI hoặc nhập nội dung...</p>",
              }}
            />
          </div>

          {/* Editable Text Box (Pure Text without raw img tags) */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold uppercase text-slate-600">
              ✏️ Ô Chỉnh sửa Văn bản bài viết:
            </label>
            <textarea
              ref={textareaRef}
              rows={12}
              value={content}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Nhập hoặc chỉnh sửa nội dung bài viết tại đây..."
              className="w-full p-4 border border-slate-300 rounded-lg text-xs leading-relaxed font-sans focus:ring-2 focus:ring-navy focus:outline-none"
            />
          </div>
        </div>
      ) : (
        /* Source Code Mode */
        <div className="p-4 space-y-2">
          <label className="block text-[11px] font-bold uppercase text-slate-600">
            💻 Khung Soạn thảo Mã Nguồn (Source HTML/Markdown):
          </label>
          <textarea
            ref={textareaRef}
            rows={18}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Nhập mã HTML / Markdown..."
            className="w-full p-4 border border-slate-300 rounded-lg text-xs leading-relaxed font-mono focus:ring-2 focus:ring-navy focus:outline-none bg-slate-900 text-emerald-400"
          />
        </div>
      )}
    </div>
  );
}
