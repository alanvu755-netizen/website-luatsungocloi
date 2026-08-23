"use client";

import { useState, useEffect } from "react";
import { Settings, CheckCircle, Save, AlertCircle, Check } from "lucide-react";

export default function AdminSettingsPage() {
  const [phone, setPhone] = useState("0902 081 061");
  const [email, setEmail] = useState("luatsuloi@gmail.com");
  const [address, setAddress] = useState("Số 149, đường Lê Thị Riêng, phường Cao Lãnh, Đồng Tháp");
  const [floatingContactEnabled, setFloatingContactEnabled] = useState(true);

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setPhone(data.settings.phone || "0902 081 061");
          setEmail(data.settings.email || "luatsuloi@gmail.com");
          setAddress(data.settings.address || "Số 149, đường Lê Thị Riêng, phường Cao Lãnh, Đồng Tháp");
          setFloatingContactEnabled(data.settings.floatingContactEnabled ?? true);
        }
      })
      .catch(() => console.error("Error fetching admin settings"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          email,
          address,
          floatingContactEnabled,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Không thể cập nhật cài đặt.");

      setFeedback({
        type: "success",
        message: "✓ ĐÃ LƯU THÀNH CÔNG! Thông tin cài đặt chung đã được cập nhật ra Website Public.",
      });
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Lỗi cập nhật cài đặt." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      
      <div>
        <h1 className="text-xl font-bold text-navy font-serif">Cài đặt Chung & Thông tin Trụ sở</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Quản lý thông tin địa chỉ, số điện thoại hotline và bật/tắt thanh liên hệ nổi mobile.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center gap-3 border shadow-xs ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-medium"
              : "bg-red-50 border-red-300 text-red-700"
          }`}
        >
          {feedback.type === "success" ? (
            <Check className="w-5 h-5 flex-shrink-0 text-emerald-600 stroke-[3]" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
              Số điện thoại Hotline
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-navy focus:ring-2 focus:ring-navy focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
              Email Liên hệ
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
              Địa chỉ trụ sở
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 leading-relaxed focus:ring-2 focus:ring-navy focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100">
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={floatingContactEnabled}
                onChange={(e) => setFloatingContactEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-navy focus:ring-navy"
              />
              <div>
                <span className="text-xs font-bold text-navy block">
                  Bật Thanh Liên hệ Nổi (Floating Contact Bar) trên Mobile
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Khi bật, các nút gọi nhanh và kênh liên hệ đang ON sẽ xuất hiện ở góc màn hình mobile.
                </span>
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 bg-navy hover:bg-navy-dark text-white font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Đang lưu cài đặt..." : "Lưu cài đặt chung (Save Settings)"}</span>
          </button>
        </form>
      </div>

    </div>
  );
}
