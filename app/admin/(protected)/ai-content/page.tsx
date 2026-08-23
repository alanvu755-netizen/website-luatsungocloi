"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, RefreshCw, AlertCircle, ShieldAlert } from "lucide-react";

export default function AIContentStudioPage() {
  const [promptCode, setPromptCode] = useState("ARTICLE_GENERATE");
  const [promptText, setPromptText] = useState("");
  const [model, setModel] = useState("gemini-1.5-flash");
  const [loading, setLoading] = useState(false);
  const [resultDraft, setResultDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const promptOptions = [
    { code: "ARTICLE_GENERATE", label: "Tạo bài viết SEO Marketing" },
    { code: "ARTICLE_REWRITE", label: "Viết lại & Tối ưu nội dung" },
    { code: "SEO_GENERATE", label: "Tạo Meta Title & Description" },
    { code: "CTA_GENERATE", label: "Tạo Lời kêu gọi hành động (CTA)" },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    setLoading(true);
    setError(null);
    setResultDraft(null);

    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    try {
      const res = await fetch("/api/admin/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptCode,
          promptText,
          model,
          requestId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Tạo nội dung AI không thành công");
      }

      setResultDraft(data.resultDraft);
    } catch (err: any) {
      setError(err.message || "Xảy ra lỗi trong quá trình kết nối với AI Studio");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!resultDraft) return;
    navigator.clipboard.writeText(resultDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-navy font-serif flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold" />
          AI Content Studio (Gemini Integration)
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Trợ lý AI tạo, viết lại và tối ưu nội dung Marketing cho Luật sư. Tất cả kết quả AI sinh ra đều là Bản Nháp (DRAFT).
        </p>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold block">Quy tắc An toàn Nội dung Pháp lý & AI Policy:</strong>
          <span>
            AI chỉ phục vụ sinh nội dung Marketing & Profile. AI tuyệt đối KHÔNG tự động Xuất bản (Auto-Publish) và KHÔNG tự suy diễn bằng cấp, vụ việc hoặc cam kết thắng kiện chưa được xác minh.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form Panel */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <form onSubmit={handleGenerate} className="space-y-4">
            
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Loại tác vụ AI (Prompt Template)
              </label>
              <select
                value={promptCode}
                onChange={(e) => setPromptCode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-navy focus:outline-none"
              >
                {promptOptions.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Lựa chọn Model Gemini
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-navy focus:outline-none"
              >
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Tốc độ cao, tối ưu marketing)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Lý luận sâu, bài viết dài)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Nội dung Yêu cầu / Chủ đề
              </label>
              <textarea
                rows={5}
                required
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Ví dụ: Viết bài tư vấn về những điều cần biết khi khởi kiện tranh chấp đất đai tại Đồng Tháp..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-navy hover:bg-navy-dark text-white font-semibold text-xs rounded-lg shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-gold" />
                  Đang sinh nội dung bằng Gemini...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-gold" />
                  Tạo Bản Nháp AI (Generate Draft)
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-navy">
                Kết quả Bản Nháp AI (AI Generated Draft)
              </span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-500 text-white rounded-full">
                ALWAYS DRAFT
              </span>
            </div>

            {resultDraft && (
              <button
                onClick={handleCopy}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Đã sao chép" : "Sao chép"}</span>
              </button>
            )}
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3 mb-4">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex-1 bg-slate-50/70 border border-slate-200/70 rounded-xl p-4 overflow-y-auto font-sans text-slate-800 text-sm leading-relaxed whitespace-pre-line min-h-[250px]">
            {resultDraft ? (
              resultDraft
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center py-12">
                <Sparkles className="w-10 h-10 mb-2 opacity-30 text-navy" />
                <p className="text-xs font-medium">Nhập chủ đề và bấm nút để AI tạo bản nháp nội dung.</p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
