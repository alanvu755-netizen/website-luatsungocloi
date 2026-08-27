"use client";

import { useState } from "react";
import { ShieldCheck, Eye, EyeOff, Lock, CheckCircle, AlertCircle, KeyRound, Check } from "lucide-react";

export default function AdminChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    // Client-side quick validations
    if (!currentPassword) {
      setFeedback({ type: "error", message: "Vui lòng nhập mật khẩu hiện tại." });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setFeedback({ type: "error", message: "Mật khẩu mới phải có ít nhất 6 ký tự." });
      return;
    }
    if (newPassword === currentPassword) {
      setFeedback({ type: "error", message: "Mật khẩu mới phải khác mật khẩu hiện tại." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setFeedback({ type: "error", message: "Mật khẩu xác nhận không khớp." });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Đổi mật khẩu thất bại.");
      }

      setFeedback({ type: "success", message: "✓ Đổi mật khẩu thành công." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Lỗi xử lý đổi mật khẩu." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Page Title */}
      <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
        <div className="w-10 h-10 rounded-xl bg-navy text-gold flex items-center justify-center shadow-xs">
          <KeyRound className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-navy font-serif">Đổi mật khẩu của tài khoản đang đăng nhập</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cập nhật mật khẩu cá nhân để bảo vệ tài khoản Quản trị của bạn.
          </p>
        </div>
      </div>

      {/* Alert Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-3 border transition-all ${
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
          <span className="font-semibold">{feedback.message}</span>
        </div>
      )}

      {/* Password Form Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Field 1: Current Password */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              Mật khẩu hiện tại <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Nhập mật khẩu hiện tại..."
                required
                className="w-full pl-3 pr-10 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                title={showCurrentPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="h-px bg-slate-100 my-2" />

          {/* Field 2: New Password */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              Mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)..."
                required
                minLength={6}
                className="w-full pl-3 pr-10 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                title={showNewPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Field 3: Confirm New Password */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              Xác nhận mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới..."
                required
                minLength={6}
                className="w-full pl-3 pr-10 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                title={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-3 flex items-center justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-navy hover:bg-navy-dark text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4 text-gold" />
              <span>{loading ? "Đang cập nhật..." : "Đổi mật khẩu"}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
