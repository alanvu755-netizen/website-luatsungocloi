"use client";

import { useState, useEffect } from "react";
import { Image as ImageIcon, Upload, Copy, Check, Trash2, AlertCircle } from "lucide-react";
import Image from "next/image";

interface MediaItem {
  id: string;
  url: string;
  name: string;
}

export default function AdminMediaPage() {
  const [images, setImages] = useState<MediaItem[]>([
    { id: "1", url: "/customer-reference.png", name: "customer-reference.png (Chân dung Banner)" },
    { id: "2", url: "/NgocLoi-office.jpg", name: "NgocLoi-office.jpg (Ảnh Văn phòng)" },
  ]);

  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

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

      const newImage: MediaItem = {
        id: Date.now().toString(),
        url: data.url,
        name: data.fileName || file.name,
      };

      setImages((prev) => [newImage, ...prev]);
      setFeedback({ type: "success", message: `✓ Đã tải ảnh mới lên Thư viện thành công: ${file.name}` });
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Lỗi tải ảnh." });
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy font-serif">Thư viện Ảnh (Media Library)</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Nơi tập trung lưu trữ và quản lý toàn bộ hình ảnh phục vụ cho Banner, Giới thiệu và Bài viết.
          </p>
        </div>

        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-navy hover:bg-navy-dark text-white font-semibold text-xs rounded-lg shadow-sm transition-all">
          <Upload className="w-4 h-4 text-gold" />
          <span>{uploading ? "Đang tải ảnh lên..." : "📁 Tải ảnh mới lên Thư viện"}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
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

      {/* Grid view */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-bold uppercase text-navy">
            Tất cả hình ảnh ({images.length})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((item) => (
            <div key={item.id} className="border border-slate-200 rounded-xl overflow-hidden group bg-slate-50 flex flex-col justify-between">
              <div className="aspect-square relative bg-slate-200">
                <Image src={item.url} alt={item.name} fill className="object-cover" />
              </div>
              <div className="p-3 space-y-2 bg-white border-t border-slate-100">
                <p className="text-xs font-medium text-slate-800 truncate" title={item.name}>
                  {item.name}
                </p>
                <button
                  onClick={() => copyToClipboard(item.url)}
                  className="w-full py-1.5 px-2 bg-slate-100 hover:bg-navy hover:text-white text-slate-700 rounded-md text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5"
                >
                  {copiedUrl === item.url ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Đã chép URL!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép URL ảnh</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
