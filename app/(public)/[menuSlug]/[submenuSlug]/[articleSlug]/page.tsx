import { prisma } from "@/lib/db/prisma";
import { getPublicArticleBySlug } from "@/lib/services/article.service";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Calendar, PhoneCall, ShieldCheck } from "lucide-react";
import { getEnabledContactChannels } from "@/lib/services/contact-channel.service";

export const dynamic = "force-dynamic";

export default async function PublicSubmenuArticleDetailPage({
  params,
}: {
  params: { menuSlug: string; submenuSlug: string; articleSlug: string };
}) {
  const { menuSlug, submenuSlug, articleSlug } = params;

  const site = await prisma.site.findUnique({
    where: { slug: "le-thi-ngoc-loi" },
    include: { settings: true },
  });
  if (!site) notFound();

  const article = await getPublicArticleBySlug(site.id, menuSlug, articleSlug, submenuSlug);
  if (!article) notFound();

  const enabledChannels = await getEnabledContactChannels(site.id);

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
          {article.submenu && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link href={`/${menuSlug}/${article.submenu.slug}`} className="hover:text-navy transition-colors">
                {article.submenu.title}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold truncate max-w-xs">{article.title}</span>
        </div>

        {/* Article Header */}
        <div className="space-y-4 pb-6 border-b border-slate-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-navy/10 text-navy font-bold text-xs rounded-full">
            <span>{article.menu.title}</span>
            {article.submenu && <span>› {article.submenu.title}</span>}
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
              Bạn cần Tư vấn Pháp lý Trực tiếp?
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
