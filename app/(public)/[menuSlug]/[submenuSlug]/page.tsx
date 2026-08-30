import { prisma } from "@/lib/db/prisma";
import { getPublicArticles, getPublicArticleBySlug } from "@/lib/services/article.service";
import { getSiteBySlug, getPublicHeaderMenus } from "@/lib/services/site.service";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Calendar, ArrowRight, PhoneCall, ShieldCheck } from "lucide-react";
import { getEnabledContactChannels } from "@/lib/services/contact-channel.service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateStaticParams() {
  const site = await getSiteBySlug("le-thi-ngoc-loi");
  if (!site) return [];
  const menus = await getPublicHeaderMenus(site.id);
  const params: { menuSlug: string; submenuSlug: string }[] = [];
  for (const menu of menus) {
    for (const sub of menu.submenus) {
      params.push({ menuSlug: menu.slug, submenuSlug: sub.slug });
    }
  }
  return params;
}

const DEFAULT_SETTINGS = {
  siteName: "Luật sư - Thạc sĩ Lê Thị Ngọc Lợi",
  phone: "0902 081 061",
  address: "Số 149, đường Lê Thị Riêng, phường Cao Lãnh, Đồng Tháp",
};

export default async function PublicSubmenuOrArticlePage({
  params,
  searchParams,
}: {
  params: { menuSlug: string; submenuSlug: string };
  searchParams?: { page?: string };
}) {
  const { menuSlug, submenuSlug } = params;
  const page = parseInt(searchParams?.page || "1");

  const site = await getSiteBySlug("le-thi-ngoc-loi");
  if (!site) notFound();

  const [headerMenus, enabledChannels] = await Promise.all([
    getPublicHeaderMenus(site.id),
    getEnabledContactChannels(site.id),
  ]);

  const currentMenu = headerMenus.find((m) => m.slug === menuSlug);
  const currentSubmenu = currentMenu?.submenus.find(
    (s) => s.slug === submenuSlug
  );

  // CASE 1: Render Submenu Article Listing
  if (currentSubmenu && currentMenu) {
    const articlesData = await getPublicArticles(site.id, {
      submenuId: currentSubmenu.id,
      page,
      pageSize: 10,
    });

    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />

        <div className="bg-navy text-white py-10 border-b-4 border-gold">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
              <Link href="/" className="hover:text-gold transition-colors">
                Trang chủ
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link href={`/${menuSlug}`} className="hover:text-gold transition-colors">
                {currentMenu.title}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-gold font-bold">{currentSubmenu.title}</span>
            </div>

            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-white">
              Chuyên mục: {currentSubmenu.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Tổng hợp bài viết chuyên sâu thuộc chủ đề {currentSubmenu.title}.
            </p>
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articlesData.articles.map((art) => (
              <article
                key={art.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-navy bg-navy/10 px-2.5 py-0.5 rounded-md">
                      {currentSubmenu.title}
                    </span>
                    {art.publishedAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(art.publishedAt).toLocaleDateString("vi-VN")}
                      </span>
                    )}
                  </div>

                  <h2 className="font-serif font-bold text-slate-900 text-lg hover:text-navy transition-colors line-clamp-2">
                    <Link href={`/${menuSlug}/${submenuSlug}/${art.slug}`}>
                      {art.title}
                    </Link>
                  </h2>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {art.excerpt || art.content.slice(0, 150) + "..."}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/${menuSlug}/${submenuSlug}/${art.slug}`}
                    className="text-xs font-bold text-navy hover:text-gold flex items-center gap-1 transition-colors"
                  >
                    <span>Đọc tiếp bài viết</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </main>

        <Footer settings={site.settings} channels={enabledChannels} />
      </div>
    );
  }

  // CASE 2: Render Direct Article Detail
  const article = await getPublicArticleBySlug(site.id, menuSlug, submenuSlug);
  if (!article) notFound();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-6">
          <Link href="/" className="hover:text-navy transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href={`/${menuSlug}`} className="hover:text-navy transition-colors">
            {article.menu.title}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold truncate max-w-xs">{article.title}</span>
        </div>

        {/* Article Header */}
        <div className="space-y-4 pb-6 border-b border-slate-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-navy/10 text-navy font-bold text-xs rounded-full">
            <span>{article.menu.title}</span>
          </div>

          <h1 className="font-serif font-bold text-2xl sm:text-4xl text-slate-900 leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            {article.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-navy" />
                Đăng ngày: {new Date(article.publishedAt).toLocaleDateString("vi-VN")}
              </span>
            )}
            <span>•</span>
            <span className="font-semibold text-slate-800">Tác giả: Luật sư Lê Thị Ngọc Lợi</span>
          </div>

          {article.excerpt && (
            <p className="font-sans italic text-slate-700 text-sm sm:text-base leading-relaxed p-4 bg-slate-50 border-l-4 border-gold rounded-r-lg">
              {article.excerpt}
            </p>
          )}
        </div>

        {/* Article Content Body */}
        <div className="py-8 prose max-w-none text-slate-800 text-base leading-relaxed whitespace-pre-line font-sans">
          {article.content}
        </div>

        {/* Consultation Call To Action Box */}
        <div className="my-10 p-6 sm:p-8 bg-gradient-to-r from-navy to-navy-dark text-white rounded-2xl shadow-lg border border-gold/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-serif font-bold text-lg sm:text-xl text-white flex items-center justify-center sm:justify-start gap-2">
              <ShieldCheck className="w-6 h-6 text-gold" />
              Bạn cần tư vấn pháp lý trực tiếp?
            </h3>
            <p className="text-xs sm:text-sm text-slate-200">
              Liên hệ ngay với Luật sư – Thạc sĩ Lê Thị Ngọc Lợi để nhận giải pháp pháp lý an toàn và tối ưu nhất.
            </p>
          </div>

          <a
            href={`tel:${site.settings?.phone.replace(/\s+/g, "") || "0902081061"}`}
            className="px-6 py-3 bg-gold hover:bg-gold-dark text-navy font-bold text-sm rounded-xl shadow-md transition-all hover:scale-105 flex items-center gap-2 flex-shrink-0"
          >
            <PhoneCall className="w-5 h-5" />
            <span>Gọi ngay: {site.settings?.phone || "0902 081 061"}</span>
          </a>
        </div>

      </main>

      <Footer settings={site.settings} channels={enabledChannels} />
    </div>
  );
}
