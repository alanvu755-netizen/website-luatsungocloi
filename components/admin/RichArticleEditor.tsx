"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Bold, Italic, Underline, Strikethrough, Heading2, Heading3, List, ListOrdered, Quote, Minus, Eye, Code, Link as LinkIcon, Check, AlertCircle, AlignLeft, AlignCenter, AlignRight, AlignJustify, Trash2, Maximize2, Sparkles, Wand2 } from "lucide-react";

interface RichArticleEditorProps {
  content: string;
  onChange: (newContent: string) => void;
  placeholder?: string;
}

export default function RichArticleEditor({ content, onChange, placeholder }: RichArticleEditorProps) {
  const [activeTab, setActiveTab] = useState<"visual" | "code">("visual");
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [dragOverActive, setDragOverActive] = useState(false);

  const visualEditorRef = useRef<HTMLDivElement>(null);
  const codeTextareaRef = useRef<HTMLTextAreaElement>(null);
  const savedRangeRef = useRef<Range | null>(null);

  // Save active flashing cursor position/selection in Visual Editor
  const saveCursorSelection = () => {
    if (typeof window !== "undefined") {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        if (visualEditorRef.current && visualEditorRef.current.contains(range.commonAncestorContainer)) {
          savedRangeRef.current = range.cloneRange();
        }
      }
    }
  };

  // Restore active flashing cursor position/selection
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

  const draggedImgRef = useRef<HTMLImageElement | null>(null);

  // Setup HTML5 Drag & Drop for reordering images and dropping files into editor
  useEffect(() => {
    const editor = visualEditorRef.current;
    if (!editor) return;

    // Make all images draggable and attach dragstart listeners
    const updateImagesDraggable = () => {
      const imgs = editor.querySelectorAll("img");
      imgs.forEach((img) => {
        img.setAttribute("draggable", "true");
      });
    };
    updateImagesDraggable();

    // Dragstart handler for existing images inside editor
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.tagName === "IMG" && editor.contains(target)) {
        draggedImgRef.current = target as HTMLImageElement;
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", (target as HTMLImageElement).src);
        }
      }
    };

    // Image click handler
    const handleEditorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.tagName === "IMG" && editor.contains(target)) {
        setSelectedImage(target as HTMLImageElement);
      } else {
        setSelectedImage(null);
      }
    };

    // Dragover handler to calculate caret drop position
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = "move";
      }
      setDragOverActive(true);

      // Get caret position from mouse coordinates
      if (document.caretRangeFromPoint) {
        const range = document.caretRangeFromPoint(e.clientX, e.clientY);
        if (range && editor.contains(range.commonAncestorContainer)) {
          const sel = window.getSelection();
          if (sel) {
            sel.removeAllRanges();
            sel.addRange(range);
            savedRangeRef.current = range.cloneRange();
          }
        }
      }
    };

    const handleDragLeave = () => {
      setDragOverActive(false);
    };

    // Drop handler
    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      setDragOverActive(false);

      // Case 1: Reordering existing image inside editor
      if (draggedImgRef.current && editor.contains(draggedImgRef.current)) {
        const draggedImg = draggedImgRef.current;
        draggedImgRef.current = null;

        let targetRange = savedRangeRef.current;
        if (document.caretRangeFromPoint) {
          const range = document.caretRangeFromPoint(e.clientX, e.clientY);
          if (range && editor.contains(range.commonAncestorContainer)) {
            targetRange = range;
          }
        }

        if (targetRange) {
          // Remove old parent paragraph if it only contained this image
          const oldParent = draggedImg.closest("p");

          // Build clean center paragraph wrapper for target location
          const pWrapper = document.createElement("p");
          pWrapper.className = "text-center my-4";
          pWrapper.appendChild(draggedImg);

          targetRange.insertNode(pWrapper);

          if (oldParent && oldParent !== pWrapper && oldParent.innerHTML.trim() === "") {
            oldParent.remove();
          }

          onChange(editor.innerHTML);
          setFeedback({ type: "success", message: "✓ Đã di chuyển ảnh đến vị trí dòng chữ mới thành công!" });
          setTimeout(() => setFeedback(null), 3000);
          return;
        }
      }

      // Case 2: Dropped image files from desktop
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith("image/")) {
          const formData = new FormData();
          formData.append("file", file);
          setUploading(true);

          try {
            const res = await fetch("/api/admin/upload", {
              method: "POST",
              body: formData,
            });
            const data = await res.json();
            if (data.url && editor) {
              const cleanAlt = file.name.replace(/["']/g, "").slice(0, 100);
              const imgHtml = `<p class="text-center my-4"><img src="${data.url}" alt="${cleanAlt}" style="width: 80%; max-width: 100%; height: auto; resize: both; cursor: pointer;" class="rounded-xl mx-auto shadow-md border border-slate-200" draggable="true" /></p>`;
              restoreCursorSelection();
              document.execCommand("insertHTML", false, imgHtml);
              onChange(editor.innerHTML);
              setFeedback({ type: "success", message: `✓ Đã chèn ảnh thả thành công: ${file.name}` });
            }
          } catch (err: any) {
            setFeedback({ type: "error", message: "Lỗi khi thả ảnh." });
          } finally {
            setUploading(false);
          }
        }
      }
    };

    editor.addEventListener("dragstart", handleDragStart);
    editor.addEventListener("click", handleEditorClick);
    editor.addEventListener("dragover", handleDragOver);
    editor.addEventListener("dragleave", handleDragLeave);
    editor.addEventListener("drop", handleDrop);

    return () => {
      editor.removeEventListener("dragstart", handleDragStart);
      editor.removeEventListener("click", handleEditorClick);
      editor.removeEventListener("dragover", handleDragOver);
      editor.removeEventListener("dragleave", handleDragLeave);
      editor.removeEventListener("drop", handleDrop);
    };
  }, [activeTab, content]);

  // Format unformatted raw text into proper HTML paragraph blocks (<p>)
  const formatRawToHtmlParagraphs = (raw: string) => {
    if (!raw) return "";
    const trimmed = raw.trim();
    if (trimmed.includes("<p>") || trimmed.includes("<h2>") || trimmed.includes("<h3>") || trimmed.includes("<blockquote")) {
      return trimmed;
    }

    const blocks = trimmed.split(/\n\s*\n|\n/);
    const htmlParts: string[] = [];

    for (const block of blocks) {
      const text = block.trim();
      if (!text) continue;

      if (/^(3 Tình Huống|1\. |2\. |3\. |4\. |5\. |\d+\. ĐẶT VẤN ĐỀ|\d+\. CÁC TÌNH HUỐNG|Phân Tích Pháp Lý|Những Rủi Ro|Phân Tích Những Điểm Mới|Hướng Dẫn Quy Trình)/i.test(text) && text.length < 120) {
        htmlParts.push(`<h2>${text}</h2>`);
      } else if (/^(•|-[ ]*Nguy cơ|- Vai trò|- Căn cứ|Tình huống \d+:|Bước \d+:|Danh mục hồ sơ)/i.test(text)) {
        htmlParts.push(`<h3>${text}</h3>`);
      } else if (/^(Lời khuyên|Đồng hành|Tư vấn chuyên sâu|📞 Liên hệ)/i.test(text)) {
        htmlParts.push(`<blockquote class="border-l-4 border-gold bg-amber-50/50 p-4 italic my-4 text-slate-800 rounded-r-lg"><strong>⚖️ Lời khuyên từ Luật sư – Thạc sĩ Lê Thị Ngọc Lợi:</strong><br/>${text}</blockquote>`);
      } else {
        htmlParts.push(`<p class="my-4 text-justify leading-relaxed">${text}</p>`);
      }
    }

    return htmlParts.join("\n");
  };

  // Auto-format HTML trigger button
  const handleAutoFormatArticle = () => {
    const formatted = formatRawToHtmlParagraphs(content);
    if (visualEditorRef.current) {
      visualEditorRef.current.innerHTML = formatted;
    }
    onChange(formatted);
    setFeedback({ type: "success", message: "✨ Đã tự động chuẩn hóa định dạng & giãn khoảng cách đoạn văn bài viết!" });
    setTimeout(() => setFeedback(null), 4000);
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

  // Resize Selected Image Helper
  const resizeSelectedImage = (widthPercent: string) => {
    if (selectedImage && visualEditorRef.current) {
      selectedImage.style.width = widthPercent;
      selectedImage.style.maxWidth = "100%";
      selectedImage.style.height = "auto";
      onChange(visualEditorRef.current.innerHTML);
    }
  };

  // Align Selected Image Helper
  const alignSelectedImage = (align: "left" | "center" | "right") => {
    if (selectedImage && visualEditorRef.current) {
      const parentPara = selectedImage.closest("p");
      if (parentPara) {
        if (align === "center") {
          parentPara.style.textAlign = "center";
          selectedImage.style.display = "inline-block";
          selectedImage.style.float = "none";
        } else if (align === "left") {
          parentPara.style.textAlign = "left";
          selectedImage.style.float = "left";
          selectedImage.style.marginRight = "1rem";
          selectedImage.style.marginBottom = "0.5rem";
        } else if (align === "right") {
          parentPara.style.textAlign = "right";
          selectedImage.style.float = "right";
          selectedImage.style.marginLeft = "1rem";
          selectedImage.style.marginBottom = "0.5rem";
        }
      }
      onChange(visualEditorRef.current.innerHTML);
    }
  };

  // Delete Selected Image
  const deleteSelectedImage = () => {
    if (selectedImage && visualEditorRef.current) {
      const parentPara = selectedImage.closest("p");
      selectedImage.remove();
      if (parentPara && parentPara.innerHTML.trim() === "") {
        parentPara.remove();
      }
      setSelectedImage(null);
      onChange(visualEditorRef.current.innerHTML);
    }
  };

  // Upload Image Handler with Exact Flashing Cursor Position Restoration
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
      const imgHtml = `<p class="text-center my-4"><img src="${data.url}" alt="${cleanAlt}" style="width: 80%; max-width: 100%; height: auto; resize: both; cursor: pointer;" class="rounded-xl mx-auto shadow-md border border-slate-200" draggable="true" /></p>`;

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
    <div className="border border-slate-300 rounded-xl overflow-hidden shadow-xs bg-white space-y-0 relative">
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

          {/* Auto Format Helper Button */}
          <button
            type="button"
            onClick={handleAutoFormatArticle}
            className="px-2.5 py-1 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-lg flex items-center gap-1 shadow-xs transition-all mr-1"
            title="Tự động chuẩn hóa định dạng & giãn khoảng cách đoạn văn bài viết"
          >
            <Wand2 className="w-3.5 h-3.5 text-white" />
            <span>✨ Chuẩn hóa Định dạng</span>
          </button>

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
            onMouseDown={saveCursorSelection}
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

      {/* Floating Image Resize & Alignment Control Toolbar */}
      {selectedImage && activeTab === "visual" && (
        <div className="sticky top-2 z-20 mx-4 my-2 p-2 bg-slate-900 text-white rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-2 border border-gold/40 text-xs animate-fadeIn">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-gold flex items-center gap-1 mr-1">
              <Maximize2 className="w-3.5 h-3.5" /> Co giãn ảnh:
            </span>
            <button
              type="button"
              onClick={() => resizeSelectedImage("25%")}
              className="px-2 py-0.5 bg-slate-800 hover:bg-navy-dark rounded text-[11px] font-bold border border-slate-700"
            >
              25% (Nhỏ)
            </button>
            <button
              type="button"
              onClick={() => resizeSelectedImage("50%")}
              className="px-2 py-0.5 bg-slate-800 hover:bg-navy-dark rounded text-[11px] font-bold border border-slate-700"
            >
              50% (Vừa)
            </button>
            <button
              type="button"
              onClick={() => resizeSelectedImage("75%")}
              className="px-2 py-0.5 bg-slate-800 hover:bg-navy-dark rounded text-[11px] font-bold border border-slate-700"
            >
              75% (Lớn)
            </button>
            <button
              type="button"
              onClick={() => resizeSelectedImage("100%")}
              className="px-2 py-0.5 bg-slate-800 hover:bg-navy-dark rounded text-[11px] font-bold border border-slate-700"
            >
              100% (Đầy khung)
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-300 mr-1">Vị trí:</span>
            <button
              type="button"
              onClick={() => alignSelectedImage("left")}
              className="p-1 bg-slate-800 hover:bg-navy-dark rounded border border-slate-700"
              title="Căn trái (Chữ bao quanh)"
            >
              <AlignLeft className="w-3.5 h-3.5 text-white" />
            </button>
            <button
              type="button"
              onClick={() => alignSelectedImage("center")}
              className="p-1 bg-slate-800 hover:bg-navy-dark rounded border border-slate-700"
              title="Căn giữa"
            >
              <AlignCenter className="w-3.5 h-3.5 text-white" />
            </button>
            <button
              type="button"
              onClick={() => alignSelectedImage("right")}
              className="p-1 bg-slate-800 hover:bg-navy-dark rounded border border-slate-700"
              title="Căn phải"
            >
              <AlignRight className="w-3.5 h-3.5 text-white" />
            </button>
            
            <div className="h-4 w-px bg-slate-700 mx-1" />

            <button
              type="button"
              onClick={deleteSelectedImage}
              className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-bold flex items-center gap-1"
              title="Xóa ảnh khỏi bài viết"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa ảnh</span>
            </button>
          </div>
        </div>
      )}

      {/* SINGLE CONTAINER DISPLAYED AT ANY ONE TIME */}
      {activeTab === "visual" ? (
        /* MODE A: VISUAL RICH EDITOR CONTAINER ONLY */
        <div className={`p-4 bg-white transition-all ${dragOverActive ? "bg-amber-50/40 border-2 border-dashed border-gold" : ""}`}>
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
            className="min-h-[450px] p-5 border border-slate-300 rounded-lg text-slate-900 text-sm leading-relaxed font-sans focus:ring-2 focus:ring-navy focus:outline-none prose max-w-none prose-headings:font-serif prose-headings:text-navy prose-h2:text-xl prose-h2:font-bold prose-h2:mt-6 prose-h2:mb-3 prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-4 prose-h3:mb-2 prose-p:my-4 prose-p:leading-relaxed prose-p:text-justify prose-blockquote:border-l-4 prose-blockquote:border-gold prose-blockquote:bg-amber-50/50 prose-blockquote:p-4 prose-blockquote:italic prose-img:rounded-xl prose-img:shadow-md prose-img:my-4 prose-img:cursor-pointer prose-a:text-navy prose-a:underline text-justify space-y-4"
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
