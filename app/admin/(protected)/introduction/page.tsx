"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Upload, Save, AlertCircle, Check } from "lucide-react";
import Image from "next/image";

export default function AdminIntroductionPage() {
  const [draftTitle, setDraftTitle] = useState("VỀ LUẬT SƯ LÊ THỊ NGỌC LỢI");
  const [draftContent, setDraftContent] = useState("");
  const [draftImageUrl, setDraftImageUrl] = useState("/NgocLoi-office.jpg");

  const [pubTitle, setPubTitle] = useState("VỀ LUẬT SƯ LÊ THỊ NGỌC LỢI");
  const [pubContent, setPubContent] = useState("");
  const [pubImageUrl, setPubImageUrl] = useState("/NgocLoi-office.jpg");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/introduction")
      .then((r) => r.json())
      .then((data) => {
        if (data.intro) {
          setDraftTitle(data.intro.draftTitle || "VỀ LUẬT SƯ LÊ THỊ NGỌC LỢI");
          setDraftContent(data.intro.draftContent || "");
          setDraftImageUrl(data.intro.draftImageUrl || "/NgocLoi-office.jpg");

          setPubTitle(data.intro.pubTitle || "VỀ LUẬT SƯ LÊ THỊ NGỌC LỢI");
          setPubContent(data.intro.pubContent || "");
          setPubImageUrl(data.intro.pubImageUrl || "/NgocLoi-office.jpg");
        }
      })
      .catch(() => setFeedback({ type: "error", message: "Không thể tải dữ liệu Giới thiệu." }))
      .finally(() => setLoading(false));
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      setDraftImageUrl(data.url);
      setFeedback({ type: "success", message: `✓ Đã tải ảnh văn phòng lên thành công: ${data.fileName}` });
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Lỗi khi tải ảnh lên." });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/introduction", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftTitle,
          draftContent,
          draftImageUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lỗi lưu bản nháp.");

      setFeedback({ type: "success", message: "✓ Đã lưu Bản nháp trang Giới thiệu & Ảnh văn phòng thành công." });
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Lỗi lưu bản nháp." });
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/introduction/publish", { method: "POST" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Lỗi xuất bản.");

      setPubTitle(draftTitle);
      setPubContent(draftContent);
      setPubImageUrl(draftImageUrl);
      setFeedback({ type: "success", message: "✓ Đã xuất bản trang Giới thiệu & Ảnh văn phòng ra Public thành công." });
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Lỗi xuất bản." });
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Đang tải dữ liệu trang Giới thiệu...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy font-serif">Quản lý Phần Giới thiệu & Ảnh Văn phòng</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Chỉnh sửa đoạn văn giới thiệu và Tải ảnh Luật sư làm việc tại văn phòng (`NgocLoi-office.jpg`).
          </p>
        </div>
        
        <button
          onClick={handlePublish}
          disabled={publishing}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <CheckCircle className="w-4 h-4" />
          {publishing ? "Đang xuất bản..." : "Xuất bản ra Website Public"}
        </button>
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

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Published Version */}
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-emerald-800 tracking-wider">
              ĐANG XUẤT BẢN (Public)
            </span>
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-600 text-white rounded-full">
              PUBLISHED
            </span>
          </div>
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-navy text-base">{pubTitle}</h3>
            
            <div>
              <span className="text-xs text-slate-500 font-medium">Ảnh văn phòng Public:</span>
              <div className="mt-1.5 relative w-full h-44 rounded-lg overflow-hidden border border-emerald-300 bg-slate-100">
                <Image src={pubImageUrl} alt="Ảnh văn phòng Public" fill className="object-cover" />
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-500 font-medium">Nội dung Public:</span>
              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line mt-1 bg-white p-3 rounded-lg border border-slate-200">
                {pubContent}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Draft Form */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-navy tracking-wider">
              BẢN NHÁP (Draft)
            </span>
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-500 text-white rounded-full">
              DRAFT
            </span>
          </div>

          <form onSubmit={handleSaveDraft} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Tiêu đề phần Giới thiệu
              </label>
              <input
                type="text"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-navy focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase text-slate-700">
                Tải ảnh Văn phòng từ máy tính (Office Photo)
              </label>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 rounded-lg text-xs font-bold transition-all shadow-xs">
                  <Upload className="w-4 h-4 text-navy" />
                  <span>{uploading ? "Đang tải ảnh lên..." : "📁 Chọn tệp ảnh từ máy tính"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>

                <span className="text-xs text-slate-400 text-center sm:text-left">hoặc URL:</span>

                <input
                  type="text"
                  value={draftImageUrl}
                  onChange={(e) => setDraftImageUrl(e.target.value)}
                  required
                  placeholder="/NgocLoi-office.jpg"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-700 focus:ring-2 focus:ring-navy focus:outline-none"
                />
              </div>

              <div className="relative w-full h-36 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 mt-2">
                <Image src={draftImageUrl || "/NgocLoi-office.jpg"} alt="Xem trước Ảnh văn phòng Draft" fill className="object-cover" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Nội dung Giới thiệu (Tách các đoạn bằng 2 lần xuống dòng)
              </label>
              <textarea
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                rows={6}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 leading-relaxed focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-navy hover:bg-navy-dark text-white font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Đang lưu..." : "Lưu bản nháp (Save Draft)"}</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
