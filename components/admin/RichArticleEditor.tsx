"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Bold, Italic, Underline, Strikethrough, Heading2, Heading3, List, ListOrdered, Quote, Minus, Eye, Code, Link as LinkIcon, Check, AlertCircle, AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";

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
  const savedRangeRef = useRef<Range | null>(null);

  // Save active cursor position/selection in Visual Editor
  const saveCursorSelection = () => {
    if (typeof window !== "undefined") {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        // Ensure range is within visual editor container
        if (visualEditorRef.current && visualEditorRef.current.contains(range.commonAncestorContainer)) {
          savedRangeRef.current = range;
        }
      }
    }
  };

  // Restore cursor position/selection
  const restoreCursorSelection = () => {
    if (typeof window !== "undefined" && visualEditorRef.current) {
      visualEditorRef.current.focus();
      if (savedRangeRef.current) {
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(savedRangeRef.current);
        }
      }
    }
  };

  // Format unformatted raw text into proper HTML paragraph blocks (<p>)
  const formatRawToHtmlParagraphs = (raw: string) => {
    if (!raw) return "";
    if (raw.trim().startsWith("<p>") || raw.trim().startsWith("<h2>") || raw.trim().startsWith("<h3>") || raw.trim().startsWith("<div")) {
      return raw;
    }
    return raw
      .split(/\n\s*\n/)
      .map((para) => `<p>${para.replace(/\n/g, "<br/>")}</p>`)
      .join("");
  };

  // Sync content with Visual contentEditable container when switching tabs or updating prop
  useEffect(() => {
    if (activeTab === "visual" && visualEditorRef.current) {
      const formatted = formatRawToHtmlParagraphs(content);
      if (visualEditorRef.current.innerHTML !== formatted) {
        visualEditorRef.current.innerHTML = formatted;
      }
    }
  }, [activeTab, content]);

  // Execute formatting command in Visual Mode
  const execCommand = (command: string, value: string | undefined = undefined) => {
    if (activeTab === "visual" && visualEditorRef.current) {
      restoreCursorSelection();
      document.execCommand(command, false, value);
      saveCursorSelection();
      onChange(visualEditorRef.current.innerHTML);
    } else if (activeTab === "code" && codeTextareaRef.current) {
      const textarea = codeTextareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = content.substring(start, end) || "Nội dung";
      let replacement = selected;

      if (command === "bold") replacement = `<b>${selected}</b>`;
      if (command === "italic") replacement = `<i>${selected}</i>`;
      if (command === "underline") replacement = `<u>${selected}</u>`;
      if (command === "strikeThrough") replacement = `<s>${selected}</s>`;
      if (command === "justifyLeft") replacement = `<p style="text-align: left">${selected}</p>`;
      if (command === "justifyCenter") replacement = `<p style="text-align: center">${selected}</p>`;
      if (command === "justifyRight") replacement = `<p style="text-align: right">${selected}</p>`;
      if (command === "justifyFull") replacement = `<p style="text-align: justify">${selected}</p>`;
      if (command === "formatBlock" && value === "h2") replacement = `<h2>${selected}</h2>`;
      if (command === "formatBlock" && value === "h3") replacement = `<h3>${selected}</h3>`;
      if (command === "formatBlock" && value === "p") replacement = `<p>${selected}</p>`;
      if (command === "formatBlock" && value === "blockquote") replacement = `<blockquote class="border-l-4 border-gold bg-amber-50/50 p-3 italic my-3 text-slate-800">${selected}</blockquote>`;
      if (command === "insertUnorderedList") replacement = `<ul><li>${selected}</li></ul>`;
      if (command === "insertOrderedList") replacement = `<ol><li>${selected}</li></ol>`;

      const updated = content.substring(0, start) + replacement + content.substring(end);
      onChange(updated);
    }
  };

  // Upload Image Handler with Exact Cursor Position Restoration
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
      const imgHtml = `<p class="text-center my-4"><img src="${data.url}" alt="${cleanAlt}" class="max-w-full h-auto rounded-xl mx-auto shadow-md border border-slate-200" /></p>`;

      if (activeTab === "visual" && visualEditorRef.current) {
        restoreCursorSelection();
        document.execCommand("insertHTML", false, imgHtml);
        saveCursorSelection();
        onChange(visualEditorRef.current.innerHTML);
      } else {
        onChange(content + `\n${imgHtml}\n`);
      }

      setFeedback({
        type: "success",
        message: `✓ Đã chèn ảnh thành công tại vị trí con trỏ: ${file.name}`,
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
      {/* Professional Formatting Toolbar */}
      <div className="bg-slate-100 border-b border-slate-300 p-2.5 flex flex-wrap items-center justify-between gap-2">
        
        {/* Left Section: Mode Tabs & Full Formatting Toolbar */}
        <div className="flex items-center flex-wrap gap-1">
          
          {/* Mode Switcher: ONLY 1 MODE VISIBLE AT A TIME */}
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

          {/* Typography Selector */}
          <select
            onChange={(e) => {
              const val = e.target.value;
              if (val) {
                execCommand("formatBlock", val);
                e.target.value = "";
              }
            }}
            className="px-2 py-1 text-xs font-semibold bg-white border border-slate-300 rounded hover:border-slate-400 focus:outline-none text-slate-700 mr-1"
            defaultValue=""
          >
            <option value="" disabled>Kiểu đoạn văn</option>
            <option value="p">Đoạn văn tiêu chuẩn (p)</option>
            <option value="h2">Tiêu đề chính H2</option>
            <option value="h3">Tiêu đề phụ H3</option>
            <option value="blockquote">Trích dẫn Pháp lý</option>
          </select>

          <div className="h-4 w-px bg-slate-300 mx-1" />

          {/* Text Formatting */}
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

          <button
            type="button"
            onClick={() => execCommand("underline")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            title="Gạch chân (Underline)"
          >
            <Underline className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => execCommand("strikeThrough")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            title="Gạch ngang chữ (Strikethrough)"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-300 mx-1" />

          {/* Alignment Tools (Căn lề chuẩn Pháp lý) */}
          <button
            type="button"
            onClick={() => execCommand("justifyFull")}
            className="p-1.5 rounded hover:bg-slate-200 text-navy font-bold transition-colors bg-slate-200/60"
            title="≡ Căn đều 2 bên (Justify - Chuẩn Luật sư)"
          >
            <AlignJustify className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => execCommand("justifyLeft")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            title="⇐ Căn trái (Align Left)"
          >
            <AlignLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => execCommand("justifyCenter")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            title="⇔ Căn giữa (Align Center)"
          >
            <AlignCenter className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => execCommand("justifyRight")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            title="⇒ Căn phải (Align Right)"
          >
            <AlignRight className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-300 mx-1" />

          {/* Headers & Blockquotes */}
          <button
            type="button"
            onClick={() => execCommand("formatBlock", "h2")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 font-bold text-xs"
            title="Tiêu đề H2"
          >
            <Heading2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => execCommand("formatBlock", "h3")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 font-bold text-xs"
            title="Tiêu đề H3"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => execCommand("formatBlock", "blockquote")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            title="Trích dẫn Pháp lý"
          >
            <Quote className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-300 mx-1" />

          {/* Lists & Divider */}
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
            onClick={() => execCommand("insertOrderedList")}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors"
            title="Danh sách đánh số (1, 2, 3)"
          >
            <ListOrdered className="w-4 h-4" />
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

        {/* Right Section: Image Upload Button with Cursor Save */}
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

          <label
            onClick={saveCursorSelection}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-navy hover:bg-navy-dark text-white font-bold text-xs rounded-lg shadow-xs transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-gold" />
            <span>{uploading ? "Đang tải ảnh..." : "📤 🖼️ Tải & Chèn ảnh từ máy tính"}</span>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              disabled={uploading}
              onFocus={saveCursorSelection}
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
            onMouseUp={saveCursorSelection}
            onKeyUp={saveCursorSelection}
            onFocus={saveCursorSelection}
            onInput={() => {
              saveCursorSelection();
              if (visualEditorRef.current) {
                onChange(visualEditorRef.current.innerHTML);
              }
            }}
            onBlur={() => {
              if (visualEditorRef.current) {
                onChange(visualEditorRef.current.innerHTML);
              }
            }}
            className="min-h-[420px] p-5 border border-slate-300 rounded-lg text-slate-900 text-sm leading-relaxed font-sans focus:ring-2 focus:ring-navy focus:outline-none prose max-w-none prose-headings:font-serif prose-headings:text-navy prose-h2:text-xl prose-h2:font-bold prose-h2:mt-5 prose-h2:mb-3 prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-4 prose-h3:mb-2 prose-p:my-3 prose-p:leading-relaxed prose-p:text-justify prose-blockquote:border-l-4 prose-blockquote:border-gold prose-blockquote:bg-amber-50/50 prose-blockquote:p-3 prose-blockquote:italic prose-img:rounded-xl prose-img:shadow-md prose-img:my-4 prose-a:text-navy prose-a:underline text-justify"
            suppressContentEditableWarning
          />
        </div>
      ) : (
        /* MODE B: SOURCE CODE CONTAINER ONLY */
        <div className="p-4 bg-slate-950">
          <textarea
            ref={codeTextareaRef}
            rows={18}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Chỉnh sửa mã nguồn HTML..."
            className="w-full p-4 border border-slate-800 rounded-lg text-xs leading-relaxed font-mono focus:ring-2 focus:ring-gold focus:outline-none bg-slate-900 text-emerald-400 text-left"
          />
        </div>
      )}
    </div>
  );
}
