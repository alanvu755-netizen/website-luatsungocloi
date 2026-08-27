"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Bold, Italic, Heading2, Heading3, List, Check, Eye, Code, Link as LinkIcon, AlertCircle, ImageIcon } from "lucide-react";

interface RichArticleEditorProps {
  content: string;
  onChange: (newContent: string) => void;
}

export default function RichArticleEditor({ content, onChange }: RichArticleEditorProps) {
  const [activeTab, setActiveTab] = useState<"visual" | "code">("visual");
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  
  const visualEditorRef = useRef<HTMLDivElement>(null);
  const codeTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Keep Visual contentEditable container in sync with props when switching tabs
  useEffect(() => {
    if (activeTab === "visual" && visualEditorRef.current) {
      if (visualEditorRef.current.innerHTML !== content) {
        visualEditorRef.current.innerHTML = content || "";
      }
    }
  }, [activeTab, content]);

  // Execute formatting command in Visual Mode
  const execCommand = (command: string, value: string | undefined = undefined) => {
    if (activeTab === "visual" && visualEditorRef.current) {
      visualEditorRef.current.focus();
      document.execCommand(command, false, value);
      onChange(visualEditorRef.current.innerHTML);
    } else if (activeTab === "code" && codeTextareaRef.current) {
      const textarea = codeTextareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = content.substring(start, end) || "Nội dung";
      let replacement = selected;

      if (command === "bold") replacement = `<b>${selected}</b>`;
      if (command === "italic") replacement = `<i>${selected}</i>`;
      if (command === "formatBlock" && value === "h2") replacement = `<h2>${selected}</h2>`;
      if (command === "formatBlock" && value === "h3") replacement = `<h3>${selected}</h3>`;
      if (command === "insertUnorderedList") replacement = `\n- ${selected}\n`;

      const updated = content.substring(0, start) + replacement + content.substring(end);
      onChange(updated);
    }
  };

  // Upload Image Handler
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

      const cleanAlt = file.name.replace(/["']/g, "").slice(0, 100);
      const imgHtml = `<p><img src="${data.url}" alt="${cleanAlt}" class="w-full h-auto rounded-xl my-4 shadow-sm" /></p>`;

      if (activeTab === "visual" && visualEditorRef.current) {
        visualEditorRef.current.focus();
        document.execCommand("insertHTML", false, imgHtml);
        onChange(visualEditorRef.current.innerHTML);
      } else {
        onChange(content + `\n${imgHtml}\n`);
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
      e.target.value = "";
    }
  };

  const handleInsertLink = () => {
    const url = prompt("Nhập địa chỉ đường dẫn (URL):", "https://");
    if (!url || url.trim() === "" || url === "https://") return;

    if (url.trim().toLowerCase().startsWith("javascript:")) {
      alert("Đường dẫn không hợp lệ vì lý do bảo mật.");
      return;
    }

    execCommand("createLink", url.trim());
  };

  return (
    <div className="border border-slate-300 rounded-xl overflow-hidden shadow-xs bg-white space-y-0">
      {/* Top Toolbar */}
      <div className="bg-slate-100 border-b border-slate-300 p-2.5 flex flex-wrap items-center justify-between gap-2">
        
        {/* Left: Mode Switcher & Formatting Tools */}
        <div className="flex items-center flex-wrap gap-1.5">
          {/* Tab Switcher: Only 1 Mode Selected at a Time */}
          <div className="bg-slate-200 p-0.5 rounded-lg flex items-center gap-0.5 border border-slate-300 mr-2">
            <button
              type="button"
              onClick={() => {
                if (visualEditorRef.current) {
                  onChange(visualEditorRef.current.innerHTML);
                }
                setActiveTab("visual");
              }}
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
              onClick={() => {
                if (visualEditorRef.current) {
                  onChange(visualEditorRef.current.innerHTML);
                }
                setActiveTab("code");
              }}
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

          {/* Formatting Buttons */}
          <button
            type="button"
            onClick={() => execCommand("bold")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            title="In đậm (Bold)"
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => execCommand("italic")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            title="In nghiêng (Italic)"
          >
            <Italic className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-300 mx-1" />

          <button
            type="button"
            onClick={() => execCommand("formatBlock", "h2")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors font-bold text-xs"
            title="Tiêu đề H2"
          >
            <Heading2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => execCommand("formatBlock", "h3")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors font-bold text-xs"
            title="Tiêu đề H3"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-300 mx-1" />

          <button
            type="button"
            onClick={() => execCommand("insertUnorderedList")}
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

        {/* Right: Upload Image Action */}
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

      {/* SINGLE CONTAINER DISPLAYED AT ANY ONE TIME */}
      {activeTab === "visual" ? (
        /* MODE A: VISUAL RICH EDITOR CONTAINER ONLY */
        <div className="p-4 bg-white">
          <div
            ref={visualEditorRef}
            contentEditable
            onInput={() => {
              if (visualEditorRef.current) {
                onChange(visualEditorRef.current.innerHTML);
              }
            }}
            onBlur={() => {
              if (visualEditorRef.current) {
                onChange(visualEditorRef.current.innerHTML);
              }
            }}
            className="min-h-[350px] p-4 border border-slate-300 rounded-lg text-slate-900 text-sm leading-relaxed font-sans focus:ring-2 focus:ring-navy focus:outline-none prose max-w-none prose-headings:font-serif prose-headings:text-navy prose-h2:text-lg prose-h2:font-bold prose-h3:text-base prose-h3:font-semibold prose-p:my-2 prose-img:rounded-xl prose-img:shadow-sm prose-img:my-3 prose-a:text-navy prose-a:underline"
            suppressContentEditableWarning
          />
        </div>
      ) : (
        /* MODE B: SOURCE CODE CONTAINER ONLY */
        <div className="p-4 bg-slate-950">
          <textarea
            ref={codeTextareaRef}
            rows={16}
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
