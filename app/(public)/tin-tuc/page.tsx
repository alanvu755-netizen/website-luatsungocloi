import { Metadata } from "next";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import LatestArticlesSection from "@/components/public/LatestArticlesSection";
import { getSiteBySlug } from "@/lib/services/site.service";
import { getEnabledContactChannels } from "@/lib/services/contact-channel.service";
import { getPublicArticles } from "@/lib/services/article.service";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tin tức pháp luật | Luật sư Lê Thị Ngọc Lợi",
  description: "Tổng hợp tin tức pháp luật mới nhất, văn bản pháp luật hiện hành và các bài viết phân tích từ Luật sư Lê Thị Ngọc Lợi.",
};

export default async function TinTucPage() {
  const site = await getSiteBySlug("le-thi-ngoc-loi");
  const enabledChannels = site ? await getEnabledContactChannels(site.id) : [];
  const articlesResult = site ? await getPublicArticles(site.id, { pageSize: 12 }) : { articles: [] };

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
            <span className="text-gold font-bold">Tin tức</span>
          </div>

          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-white">
            TIN TỨC PHÁP LUẬT & SỰ KIỆN NỔI BẬT
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Cập nhật những thông tin, văn bản chỉ đạo và phân tích pháp lý mới nhất.
          </p>
        </div>
      </div>

      <main className="flex-grow">
        <LatestArticlesSection articles={articlesResult.articles} />
      </main>

      <Footer settings={site?.settings} channels={enabledChannels} />
    </div>
  );
}
