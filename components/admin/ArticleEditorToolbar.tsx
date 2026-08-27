"use client";

import { useState } from "react";
import { Upload, Bold, Italic, Heading2, Heading3, List, Image as ImageIcon, Link as LinkIcon, Check } from "lucide-react";

interface ArticleEditorToolbarProps {
  content: string;
  onChange: (newContent: string) => void;
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
}

export default function ArticleEditorToolbar({ content, onChange, textareaRef }: ArticleEditorToolbarProps) {
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const insertTextAtCursor = (before: string, after: string = "") => {
    const textarea = textareaRef?.current;
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
      
      const textarea = textareaRef?.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const newContent = content.substring(0, start) + imageTag + content.substring(start);
        onChange(newContent);
      } else {
        onChange(content + imageTag);
      }

      setFeedback(`✓ Đã tải và chèn ảnh: ${file.name}`);
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      alert(err.message || "Lỗi khi tải ảnh.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-slate-100 border border-slate-300 rounded-t-xl p-2 flex flex-wrap items-center justify-between gap-2 border-b-0">
      
      <div className="flex items-center flex-wrap gap-1">
        {/* Bold */}
        <button
          type="button"
          onClick={() => insertTextAtCursor("<b>", "</b>")}
          className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
          title="In đậm (Bold)"
        >
          <Bold className="w-4 h-4" />
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => insertTextAtCursor("<i>", "</i>")}
          className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
          title="In nghiêng (Italic)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-300 mx-1" />

        {/* H2 */}
        <button
          type="button"
          onClick={() => insertTextAtCursor("<h2>", "</h2>")}
          className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
          title="Tiêu đề H2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        {/* H3 */}
        <button
          type="button"
          onClick={() => insertTextAtCursor("<h3>", "</h3>")}
          className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
          title="Tiêu đề H3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-300 mx-1" />

        {/* List */}
        <button
          type="button"
          onClick={() => insertTextAtCursor("\n- ", "")}
          className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
          title="Danh sách gạch đầu dòng"
        >
          <List className="w-4 h-4" />
        </button>

        {/* Clean Base64 Helper Button */}
        {content.includes("data:image/") || /gCwB1AI|iVBORw0KGgo/i.test(content) ? (
          <button
            type="button"
            onClick={() => {
              const cleaned = content
                .replace(/<img[^>]*src=["']data:image\/[^"']+["'][^>]*>/gi, "")
                .replace(/data:image\/[a-zA-Z]+;base64,[a-zA-Z0-9+/=]+/gi, "")
                .replace(/(?:[A-Za-z0-9+/]{100,}=*)/g, "");
              onChange(cleaned.trim());
              setFeedback("✓ Đã quét dọn và làm sạch toàn bộ chuỗi mã hóa ảnh cũ!");
              setTimeout(() => setFeedback(null), 4000);
            }}
            className="px-2.5 py-1 bg-amber-100 text-amber-800 hover:bg-amber-200 text-xs font-semibold rounded flex items-center gap-1 border border-amber-300 transition-all"
            title="Xóa nhanh chuỗi mã hóa ảnh Base64 cũ khỏi trình soạn thảo"
          >
            <span>🧹 Xóa mã ảnh cũ</span>
          </button>
        ) : null}
      </div>

      {/* Upload Image Action */}
      <div className="flex items-center gap-2">
        {feedback && (
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 flex items-center gap-1">
            <Check className="w-3 h-3" />
            {feedback}
          </span>
        )}

        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy hover:bg-navy-dark text-white rounded-lg text-xs font-bold transition-all shadow-xs">
          <Upload className="w-3.5 h-3.5 text-gold" />
          <span>{uploading ? "Đang tải ảnh..." : "📷 Tải & Chèn ảnh từ máy tính"}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

    </div>
  );
}
