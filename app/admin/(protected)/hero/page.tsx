"use client";

import { useState, useEffect } from "react";
import { Scale, CheckCircle, Upload, Save, AlertCircle, Check } from "lucide-react";
import Image from "next/image";

export default function AdminHeroPage() {
  const [draftSubtitle, setDraftSubtitle] = useState("Luật sư - Thạc sĩ");
  const [draftName, setDraftName] = useState("LÊ THỊ NGỌC LỢI");
  const [draftImageUrl, setDraftImageUrl] = useState("/docs/design/customer-reference.png");

  const [pubSubtitle, setPubSubtitle] = useState("Luật sư - Thạc sĩ");
  const [pubName, setPubName] = useState("LÊ THỊ NGỌC LỢI");
  const [pubImageUrl, setPubImageUrl] = useState("/docs/design/customer-reference.png");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/hero")
      .then((r) => r.json())
      .then((data) => {
        if (data.hero) {
          setDraftSubtitle(data.hero.draftSubtitle || "Luật sư - Thạc sĩ");
          setDraftName(data.hero.draftName || "LÊ THỊ NGỌC LỢI");
          setDraftImageUrl(data.hero.draftImageUrl || "/docs/design/customer-reference.png");
          setPubSubtitle(data.hero.pubSubtitle || "Luật sư - Thạc sĩ");
          setPubName(data.hero.pubName || "LÊ THỊ NGỌC LỢI");
          setPubImageUrl(data.hero.pubImageUrl || "/docs/design/customer-reference.png");
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
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Không thể lưu nội dung bản nháp.");

      setFeedback({ type: "success", message: "✓ Bản nháp Chân dung Trang chủ đã được lưu thành công." });
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
      const res = await fetch("/api/admin/hero/publish", { method: "POST" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Không thể xuất bản.");

      setPubSubtitle(draftSubtitle);
      setPubName(draftName);
      setPubImageUrl(draftImageUrl);
      setFeedback({ type: "success", message: "✓ Đã xuất bản Chân dung Trang chủ ra Public thành công." });
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Lỗi xuất bản." });
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Đang tải dữ liệu Trang chủ...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy font-serif">Quản lý Ảnh & Chân dung Trang chủ</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý Danh xưng, Họ tên và Hình ảnh Chân dung Luật sư hiển thị trên trang chủ.
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
        
        {/* Published Version Card */}
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-emerald-800 tracking-wider">
              Nội dung ĐANG XUẤT BẢN (Public)
            </span>
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-600 text-white rounded-full">
              PUBLISHED
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-xs text-slate-500 font-medium">Danh xưng:</span>
              <p className="font-serif text-slate-800 font-semibold">{pubSubtitle}</p>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Họ và tên:</span>
              <p className="font-serif text-navy font-bold text-lg">{pubName}</p>
            </div>

            <div>
              <span className="text-xs text-slate-500 font-medium">Ảnh Chân dung Public:</span>
              <div className="mt-2 relative w-32 aspect-[3/4] rounded-lg overflow-hidden border border-emerald-300 bg-slate-200">
                <Image src={pubImageUrl} alt="Chân dung Public" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* Edit Draft Form Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-navy tracking-wider">
              Chỉnh sửa BẢN NHÁP (Draft)
            </span>
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-500 text-white rounded-full">
              DRAFT
            </span>
          </div>

          <form onSubmit={handleSaveDraft} className="space-y-4">
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

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Đường dẫn Ảnh Chân dung (URL)
              </label>
              <input
                type="text"
                value={draftImageUrl}
                onChange={(e) => setDraftImageUrl(e.target.value)}
                required
                placeholder="/docs/design/customer-reference.png"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-navy focus:outline-none"
              />
              <div className="mt-2 relative w-32 aspect-[3/4] rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                <Image src={draftImageUrl} alt="Xem trước Bản nháp" fill className="object-cover" />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-navy hover:bg-navy-dark text-white font-semibold text-xs rounded-lg shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
