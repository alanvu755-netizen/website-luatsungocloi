import { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { getPublicArticleBySlug } from "@/lib/services/article.service";
import { getSiteBySlug } from "@/lib/services/site.service";
import { getRelatedArticles } from "@/lib/services/related-article.service";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Calendar, PhoneCall, ShieldCheck, Tag, ArrowRight } from "lucide-react";
import { getEnabledContactChannels } from "@/lib/services/contact-channel.service";
import ArticleEngagement from "@/components/public/ArticleEngagement";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Helper function to convert raw text / unformatted text into publication-ready HTML
function formatArticleContentToHtml(rawContent: string): string {
  if (!rawContent) return "";
  const trimmed = rawContent.trim();
  
  // If already contains structured HTML paragraph/header tags, return as is
  if (trimmed.includes("<p>") || trimmed.includes("<h2>") || trimmed.includes("<h3>") || trimmed.includes("<blockquote")) {
    return trimmed;
  }

  // Split by double newlines or single newlines
  const blocks = trimmed.split(/\n\s*\n|\n/);
  const htmlParts: string[] = [];

  for (const block of blocks) {
    const text = block.trim();
    if (!text) continue;

    // Check for Main Title / Section 1, 2, 3
    if (/^(3 Tình Huống|1\. |2\. |3\. |4\. |5\. |\d+\. ĐẶT VẤN ĐỀ|\d+\. CÁC TÌNH HUỐNG|Phân Tích Pháp Lý|Những Rủi Ro|Phân Tích Những Điểm Mới|Hướng Dẫn Quy Trình)/i.test(text) && text.length < 120) {
      htmlParts.push(`<h2 class="text-xl font-serif font-bold text-navy mt-6 mb-3 border-b border-slate-200 pb-2">${text}</h2>`);
    }
    // Check for Subsection / Bullet subheadings (• Tình huống 1, - Nguy cơ, - Vai trò Luật sư)
    else if (/^(•|-[ ]*Nguy cơ|- Vai trò|- Căn cứ|Tình huống \d+:|Bước \d+:|Danh mục hồ sơ)/i.test(text)) {
      if (text.startsWith("•") || text.startsWith("-")) {
        const cleanText = text.replace(/^[•-]\s*/, "");
        htmlParts.push(`<h3 class="text-lg font-serif font-semibold text-slate-900 mt-4 mb-2">▪ ${cleanText}</h3>`);
      } else {
        htmlParts.push(`<h3 class="text-lg font-serif font-semibold text-slate-900 mt-4 mb-2">${text}</h3>`);
      }
    }
    // Check for Lawyer Advice / Quote block
    else if (/^(Lời khuyên|Đồng hành|Tư vấn chuyên sâu|📞 Liên hệ)/i.test(text)) {
      htmlParts.push(`
        <blockquote class="border-l-4 border-gold bg-amber-50/60 p-4 my-6 italic text-slate-800 rounded-r-xl shadow-xs">
          <strong class="text-navy not-italic block mb-1 font-serif">⚖️ Lời khuyên từ Luật sư – Thạc sĩ Lê Thị Ngọc Lợi:</strong>
          ${text}
        </blockquote>
      `);
    }
    // Standard Paragraph
    else {
      htmlParts.push(`<p class="my-4 text-justify leading-relaxed text-slate-800">${text}</p>`);
    }
  }

  return htmlParts.join("\n");
}

export async function generateStaticParams() {
  const site = await getSiteBySlug("le-thi-ngoc-loi");
  if (!site) return [];
  const articles = await prisma.article.findMany({
    where: { siteId: site.id, status: "PUBLISHED" },
    include: { menu: true, submenu: true },
  });
  return articles
    .filter((a) => a.menu && a.submenu)
    .map((a) => ({
      menuSlug: a.menu.slug,
      submenuSlug: a.submenu!.slug,
      articleSlug: a.slug,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: { menuSlug: string; submenuSlug: string; articleSlug: string };
}): Promise<Metadata> {
  const site = await getSiteBySlug("le-thi-ngoc-loi");
  if (!site) return {};

  const article = await getPublicArticleBySlug(site.id, params.menuSlug, params.articleSlug, params.submenuSlug);
  if (!article || article.status !== "PUBLISHED") return {};

  return {
    title: `${article.title} | Luật sư Lê Thị Ngọc Lợi`,
    description: article.excerpt || article.content.slice(0, 155),
  };
}

export default async function PublicSubmenuArticleDetailPage({
  params,
}: {
  params: { menuSlug: string; submenuSlug: string; articleSlug: string };
}) {
  const { menuSlug, submenuSlug, articleSlug } = params;

  const site = await getSiteBySlug("le-thi-ngoc-loi");
  if (!site) notFound();

  const article = await getPublicArticleBySlug(site.id, menuSlug, articleSlug, submenuSlug);
  if (!article || article.status !== "PUBLISHED") notFound();

  const formattedHtml = formatArticleContentToHtml(article.content);

  const [enabledChannels, articlePracticeAreas, relatedArticles] = await Promise.all([
    getEnabledContactChannels(site.id),
    prisma.articlePracticeArea.findMany({
      where: { articleId: article.id },
      include: { practiceArea: true },
    }),
    getRelatedArticles({
      siteId: site.id,
      currentArticleId: article.id,
      submenuId: article.submenuId,
      menuId: article.menuId,
      limit: 3,
    }),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500 font-medium mb-6">
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

        {/* View Count & Share Action Tracking Component */}
        <ArticleEngagement
          articleId={article.id}
          initialViewCount={article.viewCount || 0}
          initialShareCount={article.shareCount || 0}
          articleTitle={article.title}
        />

        {/* Article Content Body */}
        <div
          className="py-8 prose max-w-none text-slate-800 text-base leading-relaxed font-sans prose-headings:font-serif prose-headings:text-navy prose-h2:text-xl prose-h2:font-bold prose-h2:mt-6 prose-h2:mb-3 prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-5 prose-h3:mb-2 prose-p:my-4 prose-p:leading-relaxed prose-p:text-justify prose-blockquote:border-l-4 prose-blockquote:border-gold prose-blockquote:bg-amber-50/50 prose-blockquote:p-4 prose-blockquote:italic prose-img:rounded-xl prose-img:shadow-md prose-img:my-4 prose-a:text-navy prose-a:underline text-justify space-y-4"
          dangerouslySetInnerHTML={{ __html: formattedHtml || article.content || "" }}
        />

        {/* Multi-Practice Area Tags (N-N Junction Display) */}
        {articlePracticeAreas.length > 0 && (
          <div className="pt-6 border-t border-slate-200 my-6">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-3">
              <Tag className="w-4 h-4 text-gold" />
              <span>Lĩnh vực Pháp luật liên quan:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {articlePracticeAreas.map((apa) => (
                <span
                  key={apa.id}
                  className="px-3 py-1 bg-slate-100 text-slate-700 font-medium text-xs rounded-lg border border-slate-200 hover:bg-navy/10 hover:text-navy transition-colors"
                >
                  {apa.practiceArea.title}
                </span>
              ))}
            </div>
          </div>
        )}

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

        {/* Related Articles Widget */}
        {relatedArticles.length > 0 && (
          <div className="pt-10 border-t border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-xl text-slate-900">
                Bài viết Liên quan
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <div
                  key={rel.id}
                  className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between hover:shadow-xs transition-shadow"
                >
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-navy bg-navy/10 px-2 py-0.5 rounded">
                      {rel.menu?.title || "Pháp luật"}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-slate-900 hover:text-navy line-clamp-2">
                      <Link href={`/${menuSlug}/${submenuSlug}/${rel.slug}`}>
                        {rel.title}
                      </Link>
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {rel.excerpt || "Đọc bài viết tư vấn pháp luật chi tiết từ Luật sư Lê Thị Ngọc Lợi..."}
                    </p>
                  </div>

                  <Link
                    href={`/${menuSlug}/${submenuSlug}/${rel.slug}`}
                    className="pt-3 mt-3 border-t border-slate-200 text-xs font-bold text-navy hover:text-gold flex items-center gap-1 transition-colors"
                  >
                    <span>Xem chi tiết</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer settings={site.settings} channels={enabledChannels} />
    </div>
  );
}
