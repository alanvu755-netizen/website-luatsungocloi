"use client";

import React, { useState } from "react";
import { Send, CheckCircle, AlertCircle, Phone, Mail, Clock, Shield } from "lucide-react";

interface ConsultationSectionProps {
  phoneDisplay?: string;
  className?: string;
}

export const ConsultationSection: React.FC<ConsultationSectionProps> = ({
  phoneDisplay = "0902 081 061",
  className = "",
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    content: "",
    website_hp_field: "", // Honeypot field
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccess(false);

    // Front-end validation
    if (!formData.fullName.trim()) {
      setErrorMessage("Vui lòng nhập Họ và tên.");
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage("Vui lòng nhập Số điện thoại.");
      return;
    }
    if (!formData.content.trim()) {
      setErrorMessage("Vui lòng nhập Nội dung tư vấn.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Gửi yêu cầu thất bại. Vui lòng thử lại sau.");
      }

      setSuccess(true);
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        content: "",
        website_hp_field: "",
      });
    } catch (err: any) {
      setErrorMessage(err.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="dang-ky-tu-van" className={`py-14 bg-gradient-to-br from-navy-dark via-navy to-navy-dark text-white relative overflow-hidden ${className}`}>
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Call to Action Details */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="inline-block px-3 py-1 bg-gold/20 text-gold-warm text-xs font-semibold rounded-full uppercase tracking-wider mb-2">
                Liên hệ trực tiếp
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Đăng ký Tư vấn Pháp lý Trực tiếp
              </h2>
              <div className="w-20 h-1 bg-gold mt-3 rounded-full" />
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Luật sư – Thạc sĩ Lê Thị Ngọc Lợi lắng nghe, phân tích kỹ lưỡng và đưa ra giải pháp pháp lý toàn diện, an toàn và bảo mật tuyệt đối cho quý khách hàng.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-3.5 text-slate-200 text-sm">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-gold">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Hotline tư vấn nhanh:</div>
                  <a href={`tel:${phoneDisplay.replace(/\s+/g, "")}`} className="font-bold text-white hover:text-gold transition-colors text-base">
                    {phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3.5 text-slate-200 text-sm">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-gold">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Email phản hồi:</div>
                  <div className="font-semibold text-white">luatsungocloi@gmail.com</div>
                </div>
              </div>

              <div className="flex items-center space-x-3.5 text-slate-200 text-sm">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-gold">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Cam kết nghiệp vụ:</div>
                  <div className="font-semibold text-white">Bảo mật thông tin 100%</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Form */}
          <div className="lg:col-span-7 bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-100">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-navy-dark mb-1">
              Gửi thông tin tư vấn
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              Vui lòng điền thông tin bên dưới, Luật sư sẽ liên hệ lại trong thời gian sớm nhất.
            </p>

            {/* Success Alert */}
            {success && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-3 text-emerald-900">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <span className="font-bold block">Gửi yêu cầu tư vấn thành công!</span>
                  Cảm ơn quý khách. Luật sư Lê Thị Ngọc Lợi sẽ chủ động liên hệ qua số điện thoại để hỗ trợ quý khách.
                </div>
              </div>
            )}

            {/* Error Alert */}
            {errorMessage && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-3 text-rose-900">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-sm">{errorMessage}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot hidden input */}
              <input
                type="text"
                name="website_hp_field"
                value={formData.website_hp_field}
                onChange={(e) => setFormData({ ...formData, website_hp_field: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Họ và tên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy text-sm transition-all"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Số điện thoại <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0912 345 678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy text-sm transition-all"
                  />
                </div>
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Email <span className="text-slate-400 font-normal">(Không bắt buộc)</span>
                </label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy text-sm transition-all"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Nội dung tư vấn <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Vui lòng tóm tắt câu hỏi hoặc vụ việc pháp lý cần tư vấn..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy text-sm transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-6 rounded-xl bg-gold hover:bg-gold-dark text-navy-dark font-bold text-sm sm:text-base transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-navy-dark border-t-transparent rounded-full animate-spin mr-2" />
                    <span>Đang gửi thông tin...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Gửi yêu cầu tư vấn</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ConsultationSection;
