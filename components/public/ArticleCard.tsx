import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight, FileText } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export interface ArticleCardProps {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  thumbnailUrl?: string | null;
  publishedAt?: Date | string | null;
  categoryName?: string;
  categorySlug?: string;
  submenuSlug?: string;
  className?: string;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  id,
  title,
  slug,
  excerpt,
  thumbnailUrl,
  publishedAt,
  categoryName = "Pháp luật",
  categorySlug = "thu-vien-phap-luat",
  submenuSlug = "tin-tuc",
  className = "",
}) => {
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "Mới cập nhật";

  const href = `/${categorySlug}/${submenuSlug}/${slug}`;

  return (
    <article
      className={`group bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden transform hover:-translate-y-1 ${className}`}
    >
      {/* Thumbnail Header */}
      <Link href={href} className="relative aspect-16/9 w-full bg-slate-100 overflow-hidden block">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-navy-dark to-navy p-6 text-white/80">
            <FileText className="w-10 h-10 text-gold mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-serif text-gold-warm">Luật sư Lê Thị Ngọc Lợi</span>
          </div>
        )}

        <div className="absolute top-3 left-3 z-10">
          <Badge variant="gold" size="sm">
            {categoryName}
          </Badge>
        </div>
      </Link>

      {/* Card Content Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Bar */}
          <div className="flex items-center text-xs text-slate-500 mb-2.5">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-gold-dark" />
            <span>{formattedDate}</span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg sm:text-xl font-bold text-navy-dark group-hover:text-gold-dark transition-colors duration-200 line-clamp-2 leading-snug">
            <Link href={href}>{title}</Link>
          </h3>

          {/* Excerpt */}
          {excerpt && (
            <p className="mt-2.5 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
              {excerpt}
            </p>
          )}
        </div>

        {/* Action Link Footer */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <Link
            href={href}
            className="inline-flex items-center text-xs sm:text-sm font-semibold text-navy group-hover:text-gold-dark transition-colors"
          >
            <span>Đọc tiếp</span>
            <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
