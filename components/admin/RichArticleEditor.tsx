"use client";

import { useState, useRef } from "react";
import { Upload, Bold, Italic, Heading2, Heading3, List, Check, Eye, Code, Trash2, Link as LinkIcon, Image as ImageIcon, AlertCircle } from "lucide-react";

interface RichArticleEditorProps {
  content: string;
  onChange: (newContent: string) => void;
}

export default function RichArticleEditor({ content, onChange }: RichArticleEditorProps) {
  const [activeTab, setActiveTab] = useState<"visual" | "code">("visual");
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Formatting helper at cursor position
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

  // Upload Image with Client Validation (AT-IMG-11, AT-IMG-12)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFeedback(null);

    // Client-side MIME validation
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setFeedback({
        type: "error",
        message: "❌ Định dạng tệp không hỗ trợ. Vui lòng chọn ảnh JPG, PNG, WEBP hoặc GIF.",
      });
      return;
    }

    // Client-side Size validation (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setFeedback({
        type: "error",
        message: "❌ Dung lượng ảnh quá lớn. Vui lòng chọn ảnh có dung lượng dưới 5MB.",
      });
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.message || "Tải ảnh lên máy chủ thất bại.");
      }

      // Ensure alt text is safe and properly escaped
      const cleanAltText = file.name.replace(/["']/g, "").slice(0, 100);
      const imageTag = `\n<p><img src="${data.url}" alt="${cleanAltText}" class="w-full h-auto rounded-xl my-4 shadow-sm" /></p>\n`;

      if (activeTab === "code" && textareaRef.current) {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const newContent = content.substring(0, start) + imageTag + content.substring(start);
        onChange(newContent);
      } else {
        onChange(content + imageTag);
      }

      setFeedback({
        type: "success",
        message: `✓ Đã chèn ảnh thành công: ${file.name}`,
      });

      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "Lỗi khi tải ảnh.",
      });
    } finally {
      setUploading(false);
      // Reset input value to allow re-uploading the same file if needed
      e.target.value = "";
    }
  };

  // Helper to insert hyperlink
  const handleInsertLink = () => {
    const url = prompt("Nhập địa chỉ đường dẫn (URL):", "https://");
    if (!url || url.trim() === "" || url === "https://") return;

    // Security check: Reject javascript: protocol
    if (url.trim().toLowerCase().startsWith("javascript:")) {
      alert("Đường dẫn không hợp lệ vì lý do bảo mật.");
      return;
    }

    insertTextAtCursor(`<a href="${url.trim()}" target="_blank" rel="noopener noreferrer">`, "</a>");
  };

  return (
    <div className="border border-slate-300 rounded-xl overflow-hidden shadow-xs bg-white space-y-0">
      {/* Top Toolbar */}
      <div className="bg-slate-100 border-b border-slate-300 p-2.5 flex flex-wrap items-center justify-between gap-2">
        
        {/* Left Section: Editor Mode Tabs & Formatting Tools */}
        <div className="flex items-center flex-wrap gap-1.5">
          
          {/* Mode Switcher */}
          <div className="bg-slate-200 p-0.5 rounded-lg flex items-center gap-0.5 border border-slate-300 mr-2">
            <button
              type="button"
              onClick={() => setActiveTab("visual")}
              className={`px-3 py-1 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all ${
                activeTab === "visual"
                  ? "bg-navy text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-300/50"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>👁️ Soạn thảo Trực quan</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("code")}
              className={`px-3 py-1 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all ${
                activeTab === "code"
                  ? "bg-navy text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-300/50"
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>💻 Mã HTML</span>
            </button>
          </div>

          {/* Quick Formatting Tools */}
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
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors font-bold text-xs"
            title="Tiêu đề H2"
          >
            <Heading2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => insertTextAtCursor("<h3>", "</h3>")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors font-bold text-xs"
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

          <button
            type="button"
            onClick={handleInsertLink}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            title="Chèn đường dẫn (Link)"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Right Section: Upload Action & Notification */}
        <div className="flex items-center gap-2">
          {feedback && (
            <span
              className={`text-[11px] font-semibold px-2 py-1 rounded border flex items-center gap-1 transition-all ${
                feedback.type === "success"
                  ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                  : "text-red-700 bg-red-50 border-red-200"
              }`}
            >
              {feedback.type === "success" ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
              {feedback.message}
            </span>
          )}

          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-navy hover:bg-navy-dark text-white font-bold text-xs rounded-lg shadow-xs transition-all">
            <Upload className="w-3.5 h-3.5 text-gold" />
            <span>{uploading ? "Đang tải ảnh..." : "📤 🖼️ Tải & Chèn ảnh từ máy tính"}</span>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              disabled={uploading}
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Editor Main Content Body */}
      {activeTab === "visual" ? (
        <div className="p-4 space-y-4 bg-white">
          {/* Visual WYSIWYG Live Preview Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase text-navy border-b border-slate-100 pb-1">
              <span>👁️ Hiển thị bài viết & Ảnh trực quan (WYSIWYG Live Preview):</span>
            </div>

            <div className="min-h-[220px] max-h-[420px] overflow-y-auto p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm leading-relaxed font-sans shadow-inner">
              {content ? (
                <div
                  className="prose max-w-none prose-headings:font-serif prose-headings:text-navy prose-h2:text-lg prose-h2:font-bold prose-h3:text-base prose-h3:font-semibold prose-p:my-2 prose-img:rounded-xl prose-img:shadow-sm prose-img:my-3 prose-a:text-navy prose-a:underline"
                  dangerouslySetInnerHTML={{
                    __html: content
                      .replace(/\n\n/g, "<br/><br/>")
                      .replace(/\n/g, "<br/>"),
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-slate-400 text-xs italic space-y-1">
                  <ImageIcon className="w-8 h-8 text-slate-300" />
                  <span>Nội dung bài viết và các hình ảnh được chèn sẽ tự động hiển thị trực quan tại đây...</span>
                </div>
              )}
            </div>
          </div>

          {/* Editable Text Area */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase text-slate-700">
              ✏️ Ô Nhập & Chỉnh sửa Văn bản bài viết:
            </label>
            <textarea
              ref={textareaRef}
              rows={12}
              value={content}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Nhập hoặc chỉnh sửa nội dung chi tiết bài viết tại đây..."
              className="w-full p-4 border border-slate-300 rounded-lg text-xs leading-relaxed font-sans focus:ring-2 focus:ring-navy focus:outline-none bg-white text-slate-900"
            />
          </div>
        </div>
      ) : (
        /* Source Code Tab */
        <div className="p-4 space-y-2 bg-slate-950">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase text-slate-400">
            <span>💻 Mã nguồn HTML bài viết:</span>
          </div>
          <textarea
            ref={textareaRef}
            rows={18}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Chỉnh sửa mã nguồn HTML..."
            className="w-full p-4 border border-slate-800 rounded-lg text-xs leading-relaxed font-mono focus:ring-2 focus:ring-gold focus:outline-none bg-slate-900 text-emerald-400"
          />
        </div>
      )}
    </div>
  );
}
