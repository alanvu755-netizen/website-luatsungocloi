"use client";

import { useState, useEffect } from "react";
import { Cpu, Key, CheckCircle, AlertCircle, Save, Check } from "lucide-react";

export default function SYSADMINAIProviderPage() {
  const [name, setName] = useState("Google Gemini AI Engine");
  const [defaultModel, setDefaultModel] = useState("gemini-1.5-flash");
  const [apiKey, setApiKey] = useState("••••••••••••••••••••••••••••");
  const [status, setStatus] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/ai-provider")
      .then((res) => res.json())
      .then((data) => {
        if (data.provider) {
          setName(data.provider.name || "Google Gemini AI Engine");
          setDefaultModel(data.provider.defaultModel || "gemini-1.5-flash");
          setStatus(data.provider.status ?? true);
        }
      })
      .catch(() => setFeedback({ type: "error", message: "Không thể tải cấu hình AI Provider." }))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/ai-provider", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, defaultModel, apiKey, status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lỗi cập nhật AI Provider.");

      setFeedback({ type: "success", message: "✓ Cập nhật & Lưu cấu hình AI Provider thành công!" });
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Lỗi lưu cấu hình." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Đang tải cấu hình AI Provider...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] uppercase font-extrabold bg-purple-600 text-white rounded-full">
              SYSADMIN ONLY
            </span>
            <h1 className="text-xl font-bold text-navy font-serif">Quản lý Nhà cung cấp AI (AI Provider)</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Cấu hình cấp nền tảng cho Google Gemini AI Engine. Chỉ tài khoản Quản trị Hệ thống (SYSADMIN) mới có quyền truy cập.
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-3 border ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Provider Details Box */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-navy text-gold flex items-center justify-center font-bold">
              <Cpu className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{name}</h3>
              <p className="text-xs text-slate-400 font-mono">Mã provider: GEMINI</p>
            </div>
          </div>

          <span
            className={`px-3 py-1 text-xs font-bold rounded-full ${
              status ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
            }`}
          >
            ● {status ? "Hoạt động (Active)" : "Tạm ngưng (Disabled)"}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
              Tên Nhà cung cấp
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
              API Credential Key (Bảo mật tuyệt đối - Masked)
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Nhập API Key mới nếu muốn thay đổi..."
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Khóa API bí mật được lưu trữ qua biến môi trường bảo mật server. Không bao giờ xuất hiện ở mã client.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Model Mặc định
              </label>
              <input
                type="text"
                value={defaultModel}
                onChange={(e) => setDefaultModel(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Trạng thái Provider
              </label>
              <select
                value={String(status)}
                onChange={(e) => setStatus(e.target.value === "true")}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-navy focus:outline-none"
              >
                <option value="true">Bật (Active)</option>
                <option value="false">Tắt (Disabled)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 bg-navy hover:bg-navy-dark text-white font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <span>Đang lưu cấu hình AI Provider...</span>
            ) : (
              <>
                <Save className="w-4 h-4 text-gold" />
                <span>Lưu Cấu hình Platform AI Provider</span>
              </>
            )}
          </button>
        </form>

      </div>

    </div>
  );
}
