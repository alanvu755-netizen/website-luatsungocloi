import { Metadata } from "next";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import PracticeAreasSection from "@/components/public/PracticeAreasSection";
import ConsultationSection from "@/components/public/ConsultationSection";
import { getSiteBySlug } from "@/lib/services/site.service";
import { getEnabledContactChannels } from "@/lib/services/contact-channel.service";
import { getPublishedPracticeAreas } from "@/lib/services/practice-area.service";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Lĩnh vực hoạt động | Luật sư Lê Thị Ngọc Lợi",
  description: "Các lĩnh vực tư vấn pháp lý chuyên sâu: Đất đai, Hôn nhân gia đình, Dân sự, Doanh nghiệp, Hình sự, Tranh tụng tại Tòa án.",
};

export default async function LinhVucHoatDongPage() {
  const site = await getSiteBySlug("le-thi-ngoc-loi");
  const enabledChannels = site ? await getEnabledContactChannels(site.id) : [];
  const practiceAreas = site ? await getPublishedPracticeAreas(site.id) : [];

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
            <span className="text-gold font-bold">Lĩnh vực hoạt động</span>
          </div>

          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-white">
            LĨNH VỰC HOẠT ĐỘNG PHÁP LÝ CHUYÊN SÂU
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Dịch vụ pháp lý toàn diện, tận tâm và chuyên nghiệp từ Luật sư Lê Thị Ngọc Lợi.
          </p>
        </div>
      </div>

      <main className="flex-grow">
        <PracticeAreasSection items={practiceAreas} />
        <ConsultationSection />
      </main>

      <Footer settings={site?.settings} channels={enabledChannels} />
    </div>
  );
}
