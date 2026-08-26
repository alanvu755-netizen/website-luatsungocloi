import { Metadata } from "next";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import IntroductionSection from "@/components/public/IntroductionSection";
import StatisticsSection from "@/components/public/StatisticsSection";
import { getSiteBySlug } from "@/lib/services/site.service";
import { getEnabledContactChannels } from "@/lib/services/contact-channel.service";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Giới thiệu Luật sư Lê Thị Ngọc Lợi | Vững Pháp Lý – Trọn Niềm Tin",
  description: "Thông tin chi tiết về Luật sư – Thạc sĩ Lê Thị Ngọc Lợi. Hơn 10 năm kinh nghiệm tư vấn pháp lý, tranh tụng tại Đồng Tháp và trên toàn quốc.",
};

export default async function GioiThieuPage() {
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
            <span className="text-gold font-bold">Giới thiệu</span>
          </div>

          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-white">
            GIỚI THIỆU LUẬT SƯ – THẠC SĨ LÊ THỊ NGỌC LỢI
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Vững pháp lý – Trọn niềm tin. Đồng hành cùng quý khách hàng trên mọi chặng đường pháp lý.
          </p>
        </div>
      </div>

      <main className="flex-grow">
        <IntroductionSection />
        <StatisticsSection />
      </main>

      <Footer settings={site?.settings} channels={enabledChannels} />
    </div>
  );
}
