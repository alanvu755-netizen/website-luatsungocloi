"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Upload, Save, AlertCircle, Check } from "lucide-react";
import Image from "next/image";

export default function AdminIntroductionPage() {
  const [draftTitle, setDraftTitle] = useState("VỀ LUẬT SƯ LÊ THỊ NGỌC LỢI");
  const [draftContent, setDraftContent] = useState("");
  const [draftImageUrl, setDraftImageUrl] = useState("/NgocLoi-office.jpg");
  const [draftHighlights, setDraftHighlights] = useState<string[]>([
    "Tốt nghiệp Thạc sĩ Luật",
    "Đoàn Luật sư tỉnh Đồng Tháp",
    "Chuyên môn vững vàng – Kinh nghiệm thực tiễn",
    "Phong cách làm việc tận tâm – Uy tín – Hiệu quả",
  ]);

  const [pubTitle, setPubTitle] = useState("VỀ LUẬT SƯ LÊ THỊ NGỌC LỢI");
  const [pubContent, setPubContent] = useState("");
  const [pubImageUrl, setPubImageUrl] = useState("/NgocLoi-office.jpg");
  const [pubHighlights, setPubHighlights] = useState<string[]>([]);

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

          if (data.intro.draftHighlightsJson) {
            try {
              const parsed = JSON.parse(data.intro.draftHighlightsJson);
              if (Array.isArray(parsed) && parsed.length > 0) setDraftHighlights(parsed);
            } catch (e) {}
          }

          if (data.intro.pubHighlightsJson) {
            try {
              const parsed = JSON.parse(data.intro.pubHighlightsJson);
              if (Array.isArray(parsed) && parsed.length > 0) setPubHighlights(parsed);
            } catch (e) {}
          }
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
          draftHighlightsJson: JSON.stringify(draftHighlights),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lỗi lưu bản nháp.");

      setFeedback({ type: "success", message: "✓ Đã lưu Bản nháp trang Giới thiệu & Lĩnh vực hoạt động thành công." });
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
      setPubHighlights([...draftHighlights]);
      setFeedback({ type: "success", message: "✓ Đã xuất bản trang Giới thiệu & Lĩnh vực hoạt động ra Public thành công." });
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
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header & Global Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-navy uppercase font-serif tracking-tight">
            Quản lý Trang Giới thiệu & Lĩnh vực Hoạt động
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Chỉnh sửa nội dung bài viết Giới thiệu, Ảnh đại diện văn phòng và 4 điểm nổi bật Lĩnh vực hoạt động.
          </p>
        </div>
        
        <button
          onClick={handlePublish}
          disabled={publishing}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          <span>{publishing ? "Đang xuất bản..." : "Xuất bản ra Trang Chủ (Publish Live)"}</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {feedback.type === "success" ? (
            <Check className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Grid: 2 Columns - Left: Published Live, Right: Draft Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* COL 1: PUBLIC LIVE CURRENT CONTENT */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Nội dung đang hiển thị ngoài Public
            </span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
              LIVE
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">Tiêu đề:</span>
              <h2 className="text-sm font-serif font-extrabold text-navy">{pubTitle}</h2>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">Ảnh văn phòng Live:</span>
              <div className="relative w-full h-40 rounded-lg overflow-hidden border border-slate-200 bg-white mt-1">
                <Image src={pubImageUrl || "/NgocLoi-office.jpg"} alt="Ảnh văn phòng Live" fill className="object-cover" />
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 block uppercase mb-1">
                LĨNH VỰC HOẠT ĐỘNG (4 Dòng Nổi bật Live):
              </span>
              <div className="space-y-1.5 bg-white p-3 rounded-lg border border-slate-200 text-xs">
                {(pubHighlights.length > 0 ? pubHighlights : draftHighlights).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-700 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0"></span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">Nội dung văn bản:</span>
              <p className="text-xs text-slate-700 leading-relaxed font-light mt-1 whitespace-pre-line bg-white p-3 rounded-lg border border-slate-200">
                {pubContent || "Chưa có nội dung xuất bản."}
              </p>
            </div>
          </div>
        </div>

        {/* COL 2: EDIT DRAFT FORM */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-navy">
              Chỉnh sửa Bản nháp (Draft Editor)
            </h2>
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

            {/* NHÓM CÀI ĐẶT: LĨNH VỰC HOẠT ĐỘNG (4 DÒNG CHECKMARK) */}
            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-3">
              <div className="border-b border-amber-200/80 pb-2 flex items-center justify-between">
                <h3 className="text-xs font-extrabold uppercase text-amber-900 tracking-wider">
                  LĨNH VỰC HOẠT ĐỘNG (4 Dòng Nổi bật & Danh hiệu)
                </h3>
                <span className="text-[10px] font-semibold text-amber-700">Checkmark Bullet Points</span>
              </div>
              
              <div className="space-y-2.5">
                {draftHighlights.map((item, idx) => (
                  <div key={idx}>
                    <label className="block text-[11px] font-bold text-amber-950 mb-1">
                      Dòng nổi bật {idx + 1}:
                    </label>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newHighlights = [...draftHighlights];
                        newHighlights[idx] = e.target.value;
                        setDraftHighlights(newHighlights);
                      }}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 bg-white focus:ring-2 focus:ring-navy focus:outline-none"
                    />
                  </div>
                ))}
              </div>
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
