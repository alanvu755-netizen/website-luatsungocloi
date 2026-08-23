import { prisma } from "@/lib/db/prisma";
import { getPublicArticles } from "@/lib/services/article.service";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Calendar, ArrowRight, FileText } from "lucide-react";
import { getEnabledContactChannels } from "@/lib/services/contact-channel.service";

export const revalidate = 60; // ISR 60s

export default async function PublicMenuListingPage({
  params,
  searchParams,
}: {
  params: { menuSlug: string };
  searchParams?: { page?: string };
}) {
  const { menuSlug } = params;
  const page = parseInt(searchParams?.page || "1");

  const site = await prisma.site.findUnique({
    where: { slug: "le-thi-ngoc-loi" },
    include: { settings: true },
  });
  if (!site) notFound();

  const menu = await prisma.menu.findFirst({
    where: {
      siteId: site.id,
      slug: menuSlug,
      status: "VISIBLE",
    },
    include: {
      submenus: {
        where: { status: "VISIBLE" },
        orderBy: { displayOrder: "asc" },
      },
    },
  });

  if (!menu) notFound();

  const [articlesData, enabledChannels] = await Promise.all([
    getPublicArticles(site.id, {
      menuSlug,
      page,
      pageSize: 10,
    }),
    getEnabledContactChannels(site.id),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      {/* Hero Header Banner */}
      <div className="bg-navy text-white py-10 border-b-4 border-gold">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
            <Link href="/" className="hover:text-gold transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-gold font-bold">{menu.title}</span>
          </div>

          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-white">
            {menu.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Tổng hợp các bài viết tư vấn pháp luật và tin tức chính thống từ Luật sư Lê Thị Ngọc Lợi.
          </p>

          {/* Submenu Chuyên mục Tabs */}
          {menu.submenus.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-3">
              <Link
                href={`/${menu.slug}`}
                className="px-3.5 py-1.5 rounded-full bg-gold text-navy font-bold text-xs shadow-xs"
              >
                Tất cả ({articlesData.totalCount})
              </Link>
              {menu.submenus.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/${menu.slug}/${sub.slug}`}
                  className="px-3.5 py-1.5 rounded-full bg-navy-dark hover:bg-navy-light text-slate-200 hover:text-white font-medium text-xs border border-white/20 transition-all"
                >
                  {sub.title}
                </Link>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Main Content Articles Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow">
        {articlesData.articles.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500 my-8">
            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <h3 className="font-bold text-base text-slate-800">Chưa có bài viết nào</h3>
            <p className="text-xs text-slate-400 mt-1">
              Các bài viết tư vấn pháp luật mới sẽ được xuất bản liên tục. Vui lòng quay lại sau.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articlesData.articles.map((art) => (
                <article
                  key={art.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-navy bg-navy/10 px-2.5 py-0.5 rounded-md">
                        {art.menu.title} {art.submenu && `› ${art.submenu.title}`}
                      </span>
                      {art.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(art.publishedAt).toLocaleDateString("vi-VN")}
                        </span>
                      )}
                    </div>

                    <h2 className="font-serif font-bold text-slate-900 text-lg hover:text-navy transition-colors line-clamp-2">
                      <Link href={`/${menu.slug}/${art.submenu ? `${art.submenu.slug}/` : ""}${art.slug}`}>
                        {art.title}
                      </Link>
                    </h2>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {art.excerpt || art.content.slice(0, 150) + "..."}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/${menu.slug}/${art.submenu ? `${art.submenu.slug}/` : ""}${art.slug}`}
                      className="text-xs font-bold text-navy hover:text-gold flex items-center gap-1 transition-colors"
                    >
                      <span>Đọc tiếp bài viết</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination Bar */}
            {articlesData.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-8">
                {articlesData.currentPage > 1 && (
                  <Link
                    href={`/${menu.slug}?page=${articlesData.currentPage - 1}`}
                    className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs"
                  >
                    ← Trang trước
                  </Link>
                )}

                <span className="text-xs text-slate-500 font-medium">
                  Trang {articlesData.currentPage} / {articlesData.totalPages}
                </span>

                {articlesData.currentPage < articlesData.totalPages && (
                  <Link
                    href={`/${menu.slug}?page=${articlesData.currentPage + 1}`}
                    className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs"
                  >
                    Trang sau →
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer settings={site.settings} channels={enabledChannels} />
    </div>
  );
}
