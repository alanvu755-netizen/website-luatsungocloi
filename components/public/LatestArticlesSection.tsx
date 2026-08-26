import React from "react";
import Link from "next/link";
import { Scale, ArrowRight } from "lucide-react";
import { ArticleCard } from "./ArticleCard";

export interface ArticleItemData {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  thumbnailUrl?: string | null;
  publishedAt?: Date | string | null;
  menu?: { id?: string; title?: string; name?: string; slug: string } | null;
  submenu?: { id?: string; title?: string; name?: string; slug: string } | null;
}

interface LatestArticlesSectionProps {
  articles: ArticleItemData[];
  className?: string;
}

export const LatestArticlesSection: React.FC<LatestArticlesSectionProps> = ({
  articles,
  className = "",
}) => {
  if (!articles || articles.length === 0) {
    return null;
  }

  // Display up to 4 articles per screenshot layout
  const displayArticles = articles.slice(0, 4);

  return (
    <section id="tin-tuc" className={`py-12 sm:py-16 bg-white border-b border-slate-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
          <div className="flex flex-col items-start">
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-navy uppercase tracking-wider">
              TIN TỨC PHÁP LUẬT
            </h2>
            <div className="flex items-center gap-2 mt-1 text-gold">
              <div className="h-[2px] w-10 bg-gold/60"></div>
              <Scale className="w-3.5 h-3.5 text-gold" />
              <div className="h-[2px] w-10 bg-gold/60"></div>
            </div>
          </div>

          <Link
            href="/tin-tuc"
            className="inline-flex items-center gap-1.5 border border-slate-300 hover:border-gold px-3.5 py-1.5 rounded-md text-xs font-bold text-slate-700 hover:text-navy transition-all uppercase"
          >
            <span>XEM TẤT CẢ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4-Column Article Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayArticles.map((article) => (
            <ArticleCard
              key={article.id}
              id={article.id}
              title={article.title}
              slug={article.slug}
              excerpt={article.excerpt}
              thumbnailUrl={article.thumbnailUrl}
              publishedAt={article.publishedAt}
              categoryName={article.menu?.title || article.menu?.name || "Pháp luật"}
              categorySlug={article.menu?.slug || "phap-luat"}
              submenuSlug={article.submenu?.slug || "tin-tuc"}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default LatestArticlesSection;
