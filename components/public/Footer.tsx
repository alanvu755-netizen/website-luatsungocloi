"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Globe, Send, CheckCircle, AlertCircle, ChevronRight } from "lucide-react";

interface FooterProps {
  settings?: {
    address?: string | null;
    phone?: string | null;
    siteName?: string | null;
    footerDisclaimer?: string | null;
  } | null;
  channels?: any[];
}

export default function Footer({ settings }: FooterProps) {
  const address = settings?.address || "Phường Cao Lãnh, Đồng Tháp";
  const phone = settings?.phone || "0902 081 061";
  const footerDisclaimer =
    settings?.footerDisclaimer ||
    "© 2026 Bản quyền thuộc về Luật sư – Thạc sĩ Lê Thị Ngọc Lợi. Tất cả các quyền được bảo hộ.";

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    content: "Đăng ký tư vấn nhanh từ Footer",
    website_hp_field: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccess(false);

    if (!formData.fullName.trim()) {
      setErrorMessage("Vui lòng nhập Họ và tên.");
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage("Vui lòng nhập Số điện thoại.");
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
        throw new Error(result.error || "Gửi thất bại.");
      }

      setSuccess(true);
      setFormData({
        fullName: "",
        phone: "",
        content: "Đăng ký tư vấn nhanh từ Footer",
        website_hp_field: "",
      });
    } catch (err: any) {
      setErrorMessage(err.message || "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer id="lien-he" className="bg-[#030f1e] text-white pt-12 pb-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 3-Column Footer Grid (Matching Screenshot) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-slate-800/80">
          
          {/* COL 1: THÔNG TIN LIÊN HỆ */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="font-serif font-extrabold text-sm sm:text-base text-gold uppercase tracking-wider">
              THÔNG TIN LIÊN HỆ
            </h3>
            
            <div className="space-y-3 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>Luật sư – Thạc sĩ Lê Thị Ngọc Lợi</span>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:text-gold font-semibold transition-colors">
                  {phone}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <a href="mailto:luatsungocloi@gmail.com" className="hover:text-gold transition-colors">
                  luatsungocloi@gmail.com
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-gold flex-shrink-0" />
                <a href="https://luatsungocloi.vn" className="hover:text-gold transition-colors">
                  luatsungocloi.vn
                </a>
              </div>
            </div>
          </div>

          {/* COL 2: LĨNH VỰC HOẠT ĐỘNG (QUICK LINKS) */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="font-serif font-extrabold text-sm sm:text-base text-gold uppercase tracking-wider">
              LĨNH VỰC HOẠT ĐỘNG
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-300">
              <Link href="/thu-vien-phap-luat/dat-dai" className="flex items-center gap-1 hover:text-gold transition-colors">
                <ChevronRight className="w-3.5 h-3.5 text-gold" />
                <span>Đất đai – Nhà ở</span>
              </Link>
              <Link href="/thu-vien-phap-luat/hon-nhan-gia-dinh" className="flex items-center gap-1 hover:text-gold transition-colors">
                <ChevronRight className="w-3.5 h-3.5 text-gold" />
                <span>Hôn nhân – Gia đình</span>
              </Link>
              <Link href="/thu-vien-phap-luat/dan-su-hop-dong" className="flex items-center gap-1 hover:text-gold transition-colors">
                <ChevronRight className="w-3.5 h-3.5 text-gold" />
                <span>Dân sự – Hợp đồng</span>
              </Link>
              <Link href="/thu-vien-phap-luat/tranh-tung" className="flex items-center gap-1 hover:text-gold transition-colors">
                <ChevronRight className="w-3.5 h-3.5 text-gold" />
                <span>Tranh tụng tại Tòa</span>
              </Link>
              <Link href="/thu-vien-phap-luat/doanh-nghiep" className="flex items-center gap-1 hover:text-gold transition-colors">
                <ChevronRight className="w-3.5 h-3.5 text-gold" />
                <span>Doanh nghiệp</span>
              </Link>
              <Link href="/thu-vien-phap-luat/hinh-su-hanh-chinh" className="flex items-center gap-1 hover:text-gold transition-colors">
                <ChevronRight className="w-3.5 h-3.5 text-gold" />
                <span>Hình sự – Hành chính</span>
              </Link>
            </div>
          </div>

          {/* COL 3: ĐĂNG KÝ TƯ VẤN (QUICK CONSULTATION FORM) */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="font-serif font-extrabold text-sm sm:text-base text-gold uppercase tracking-wider">
              ĐĂNG KÝ TƯ VẤN
            </h3>
            
            <p className="text-xs text-slate-300 font-light">
              Để lại thông tin, chúng tôi sẽ liên hệ tư vấn cho bạn sớm nhất!
            </p>

            {success && (
              <div className="p-2.5 bg-emerald-950/80 border border-emerald-500 rounded text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Gửi thông tin thành công!</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-2.5 bg-rose-950/80 border border-rose-500 rounded text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-2.5">
              <input
                type="text"
                name="website_hp_field"
                value={formData.website_hp_field}
                onChange={(e) => setFormData({ ...formData, website_hp_field: e.target.value })}
                className="hidden"
                tabIndex={-1}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Họ và tên"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded text-xs text-white placeholder-slate-400 focus:outline-none focus:border-gold"
                />

                <input
                  type="tel"
                  required
                  placeholder="Số điện thoại"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded text-xs text-white placeholder-slate-400 focus:outline-none focus:border-gold"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-gold hover:bg-gold-dark text-navy font-extrabold text-xs uppercase tracking-wider rounded transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-navy" />
                <span>GỬI YÊU CẦU</span>
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <p>{footerDisclaimer}</p>
          <span className="font-serif font-extrabold text-gold tracking-wider">
            VỮNG PHÁP LÝ – TRỌN NIỀM TIN
          </span>
        </div>

      </div>
    </footer>
  );
}
