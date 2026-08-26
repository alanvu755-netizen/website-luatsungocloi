import { Metadata } from "next";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import ConsultationSection from "@/components/public/ConsultationSection";
import { getSiteBySlug } from "@/lib/services/site.service";
import { getEnabledContactChannels } from "@/lib/services/contact-channel.service";
import Link from "next/link";
import { ChevronRight, MapPin, Phone, Mail, Clock, ShieldCheck } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Liên hệ tư vấn trực tiếp | Luật sư Lê Thị Ngọc Lợi",
  description: "Thông tin liên hệ, hotline tư vấn pháp lý 24/7 và địa chỉ văn phòng Luật sư – Thạc sĩ Lê Thị Ngọc Lợi tại Cao Lãnh, Đồng Tháp.",
};

export default async function LienHePage() {
  const site = await getSiteBySlug("le-thi-ngoc-loi");
  const enabledChannels = site ? await getEnabledContactChannels(site.id) : [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      {/* Hero Banner */}
      <div className="bg-navy text-white py-10 border-b-4 border-gold">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
            <Link href="/" className="hover:text-gold transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-gold font-bold">Liên hệ</span>
          </div>

          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-white">
            THÔNG TIN LIÊN HỆ & TƯ VẤN PHÁP LÝ
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Sẵn sàng lắng nghe, tư vấn và đồng hành cùng quý khách hàng.
          </p>
        </div>
      </div>

      <main className="flex-grow py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 w-full">
        
        {/* Office Contact Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold">
              <MapPin className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="font-serif font-bold text-navy text-lg">Địa Chỉ Văn Phòng</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Số 149, đường Lê Thị Riêng, phường Cao Lãnh, tỉnh Đồng Tháp
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold">
              <Phone className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="font-serif font-bold text-navy text-lg">Hotline Tư Vấn 24/7</h3>
            <p className="text-sm font-extrabold text-gold">0902 081 061</p>
            <p className="text-xs text-slate-500">Hỗ trợ tư vấn khẩn cấp mọi lúc</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold">
              <Mail className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="font-serif font-bold text-navy text-lg">Email & Zalo</h3>
            <p className="text-xs text-slate-600 font-semibold">luatsungocloi@gmail.com</p>
            <p className="text-xs text-slate-500">Zalo: 0902 081 061</p>
          </div>

        </div>

        {/* Consultation Form Component */}
        <ConsultationSection />

      </main>

      <Footer settings={site?.settings} channels={enabledChannels} />
    </div>
  );
}
