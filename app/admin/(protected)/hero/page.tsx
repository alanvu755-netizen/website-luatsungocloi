"use client";

import { useState, useEffect } from "react";
import { Scale, CheckCircle, Save, AlertCircle, Check, Upload } from "lucide-react";
import Image from "next/image";

export default function AdminHeroPage() {
  const [draftSubtitle, setDraftSubtitle] = useState("Luật sư - Thạc sĩ");
  const [draftName, setDraftName] = useState("LÊ THỊ NGỌC LỢI");
  const [draftImageUrl, setDraftImageUrl] = useState("/customer-reference.png");
  const [draftTitle1, setDraftTitle1] = useState("ĐỒNG HÀNH PHÁP LÝ");
  const [draftTitle2, setDraftTitle2] = useState("BẢO VỆ QUYỀN & LỢI ÍCH HỢP PHÁP");
  const [draftDescription, setDraftDescription] = useState("Luật sư Lê Thị Ngọc Lợi và cộng sự cam kết mang đến giải pháp pháp lý hiệu quả – tận tâm – bảo mật – chuyên nghiệp.");
  const [draftCtaPrimaryText, setDraftCtaPrimaryText] = useState("TƯ VẤN NGAY");
  const [draftCtaSecondaryText, setDraftCtaSecondaryText] = useState("XEM LĨNH VỰC HOẠT ĐỘNG");

  const [pubSubtitle, setPubSubtitle] = useState("Luật sư - Thạc sĩ");
  const [pubName, setPubName] = useState("LÊ THỊ NGỌC LỢI");
  const [pubImageUrl, setPubImageUrl] = useState("/customer-reference.png");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/hero")
      .then((r) => r.json())
      .then((data) => {
        if (data.hero) {
          setDraftSubtitle(data.hero.draftSubtitle || "Luật sư - Thạc sĩ");
          setDraftName(data.hero.draftName || "LÊ THỊ NGỌC LỢI");
          setDraftImageUrl(data.hero.draftImageUrl || "/customer-reference.png");
          setDraftTitle1(data.hero.draftTitle1 || "ĐỒNG HÀNH PHÁP LÝ");
          setDraftTitle2(data.hero.draftTitle2 || "BẢO VỆ QUYỀN & LỢI ÍCH HỢP PHÁP");
          setDraftDescription(data.hero.draftDescription || "Luật sư Lê Thị Ngọc Lợi và cộng sự cam kết mang đến giải pháp pháp lý hiệu quả – tận tâm – bảo mật – chuyên nghiệp.");
          setDraftCtaPrimaryText(data.hero.draftCtaPrimaryText || "TƯ VẤN NGAY");
          setDraftCtaSecondaryText(data.hero.draftCtaSecondaryText || "XEM LĨNH VỰC HOẠT ĐỘNG");

          setPubSubtitle(data.hero.pubSubtitle || "Luật sư - Thạc sĩ");
          setPubName(data.hero.pubName || "LÊ THỊ NGỌC LỢI");
          setPubImageUrl(data.hero.pubImageUrl || "/customer-reference.png");
        }
      })
      .catch(() => setFeedback({ type: "error", message: "Không thể tải dữ liệu Chân dung Trang chủ." }))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftSubtitle,
          draftName,
          draftImageUrl,
          draftTitle1,
          draftTitle2,
          draftDescription,
          draftCtaPrimaryText,
          draftCtaSecondaryText,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Không thể lưu nội dung bản nháp.");

      setFeedback({ type: "success", message: "✓ Đã lưu Bản nháp Banner. Vui lòng bấm 'Xuất bản ra Website Public' (nút màu xanh) để áp dụng ngay lên Trang chủ." });
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
      const res = await fetch("/api/admin/hero/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftSubtitle,
          draftName,
          draftImageUrl,
          draftTitle1,
          draftTitle2,
          draftDescription,
          draftCtaPrimaryText,
          draftCtaSecondaryText,
        }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Không thể xuất bản.");

      setPubSubtitle(draftSubtitle);
      setPubName(draftName);
      setPubImageUrl(draftImageUrl);
      setFeedback({ type: "success", message: "✓ Đã xuất bản Banner Trang chủ (Đồng Hành Pháp Lý) ra Trang chủ thành công!" });
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Lỗi xuất bản." });
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Đang tải dữ liệu Banner Trang chủ...</div>;
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
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
      setFeedback({ type: "success", message: `✓ Đã tải ảnh lên thành công: ${data.fileName}` });
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Lỗi khi tải ảnh lên." });
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy font-serif">Quản lý Nội dung Ảnh & Banner (Hero Section)</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý Tiêu đề lớn, Mô tả, Nút bấm và Tải ảnh Chân dung đứng hiển thị trên Banner Trang chủ.
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

      {/* Main Form */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        <form onSubmit={handleSaveDraft} className="space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Tiêu đề 1 (Vàng / Nổi bật)
              </label>
              <input
                type="text"
                value={draftTitle1}
                onChange={(e) => setDraftTitle1(e.target.value)}
                placeholder="ĐỒNG HÀNH PHÁP LÝ"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-amber-600 focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Tiêu đề 2 (Trắng / Chính)
              </label>
              <input
                type="text"
                value={draftTitle2}
                onChange={(e) => setDraftTitle2(e.target.value)}
                placeholder="BẢO VỆ QUYỀN & LỢI ÍCH HỢP PHÁP"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-extrabold text-navy focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
              Đoạn văn mô tả Banner
            </label>
            <textarea
              value={draftDescription}
              onChange={(e) => setDraftDescription(e.target.value)}
              rows={3}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm leading-relaxed text-slate-800 focus:ring-2 focus:ring-navy focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Danh xưng / Subtitle
              </label>
              <input
                type="text"
                value={draftSubtitle}
                onChange={(e) => setDraftSubtitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Họ và tên Luật sư
              </label>
              <input
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-navy focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Tên nút bấm chính (Primary CTA)
              </label>
              <input
                type="text"
                value={draftCtaPrimaryText}
                onChange={(e) => setDraftCtaPrimaryText(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-navy focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Tên nút bấm phụ (Secondary CTA)
              </label>
              <input
                type="text"
                value={draftCtaSecondaryText}
                onChange={(e) => setDraftCtaSecondaryText(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-3">
            <label className="block text-xs font-semibold uppercase text-slate-700">
              Tải ảnh Chân dung đứng từ máy tính (Hero Portrait Image)
            </label>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 rounded-lg text-xs font-bold transition-all shadow-xs">
                <Upload className="w-4 h-4 text-navy" />
                <span>{uploadingImage ? "Đang tải ảnh lên..." : "📁 Chọn tệp ảnh từ máy tính"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>

              <span className="text-xs text-slate-400 text-center sm:text-left">hoặc nhập URL:</span>

              <input
                type="text"
                value={draftImageUrl.startsWith("data:image/") ? `[🖼️ Tệp ảnh đã tải lên - ${draftImageUrl.slice(0, 30)}...]` : draftImageUrl}
                onChange={(e) => setDraftImageUrl(e.target.value)}
                placeholder="https://... hoặc /image.png"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-navy focus:outline-none truncate text-slate-700 bg-slate-50"
              />
            </div>

            <div className="relative w-36 aspect-[3/4] rounded-lg overflow-hidden border border-slate-300 bg-slate-100">
              <Image src={draftImageUrl || "/customer-reference.png"} alt="Xem trước Ảnh Banner" fill className="object-cover" />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-navy hover:bg-navy-dark text-white font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Đang lưu..." : "Lưu Bản nháp (Save Draft)"}</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
