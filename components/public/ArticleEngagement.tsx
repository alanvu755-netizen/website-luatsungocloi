"use client";

import { useState, useEffect } from "react";
import { Eye, Share2, Copy, Check, Facebook } from "lucide-react";

interface ArticleEngagementProps {
  articleId: string;
  initialViewCount: number;
  initialShareCount: number;
  articleTitle: string;
}

export default function ArticleEngagement({
  articleId,
  initialViewCount = 0,
  initialShareCount = 0,
  articleTitle,
}: ArticleEngagementProps) {
  const [viewCount, setViewCount] = useState(initialViewCount);
  const [shareCount, setShareCount] = useState(initialShareCount);
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  // Non-blocking View Tracking on Mount (1 view per article per browser tab session via sessionStorage)
  useEffect(() => {
    if (!articleId) return;

    const storageKey = `viewed_art_${articleId}`;
    const alreadyViewed = sessionStorage.getItem(storageKey);

    if (!alreadyViewed) {
      sessionStorage.setItem(storageKey, "1");

      // Asynchronous non-blocking tracking call
      fetch(`/api/public/articles/${articleId}/view`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && typeof data.viewCount === "number") {
            setViewCount(data.viewCount);
          } else {
            setViewCount((prev) => prev + 1);
          }
        })
        .catch(() => {
          // Silent fallback
        });
    }
  }, [articleId]);

  // Non-blocking Share Action Tracking
  const handleShare = async (channel: "FACEBOOK" | "ZALO" | "COPY_LINK") => {
    if (sharing) return;
    setSharing(true);

    const currentUrl = typeof window !== "undefined" ? window.location.href : "";

    // 1. Client Action Execution
    if (channel === "COPY_LINK") {
      try {
        await navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        // Fallback
      }
    } else if (channel === "FACEBOOK") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
        "_blank",
        "noopener,noreferrer,width=600,height=400"
      );
    } else if (channel === "ZALO") {
      window.open(
        `https://sp.zalo.me/share_inline?url=${encodeURIComponent(currentUrl)}`,
        "_blank",
        "noopener,noreferrer,width=600,height=400"
      );
    }

    // 2. Asynchronous Non-blocking Share Tracking API Call
    fetch(`/api/public/articles/${articleId}/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && typeof data.shareCount === "number") {
          setShareCount(data.shareCount);
        } else {
          setShareCount((prev) => prev + 1);
        }
      })
      .catch(() => {})
      .finally(() => {
        setTimeout(() => setSharing(false), 3000); // 3s debounce
      });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4 px-5 bg-slate-50 border border-slate-200 rounded-xl my-6">
      
      {/* Counters Display */}
      <div className="flex items-center gap-5 text-xs text-slate-600 font-medium">
        <div className="flex items-center gap-1.5" title="Số lượt đọc bài viết">
          <Eye className="w-4 h-4 text-navy" />
          <span>Lượt đọc: <strong className="text-slate-900 font-bold">{viewCount}</strong></span>
        </div>

        <div className="flex items-center gap-1.5" title="Số lượt thực hiện hành động chia sẻ">
          <Share2 className="w-4 h-4 text-navy" />
          <span>Lượt chia sẻ: <strong className="text-slate-900 font-bold">{shareCount}</strong></span>
        </div>
      </div>

      {/* Social Share Buttons */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 mr-1">Chia sẻ:</span>

        <button
          onClick={() => handleShare("FACEBOOK")}
          title="Chia sẻ lên Facebook"
          className="px-3 py-1.5 bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1.5 transition-all"
        >
          <Facebook className="w-3.5 h-3.5" />
          <span>Facebook</span>
        </button>

        <button
          onClick={() => handleShare("ZALO")}
          title="Chia sẻ qua Zalo"
          className="px-3 py-1.5 bg-[#0068FF] hover:bg-[#0052CC] text-white text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1.5 transition-all"
        >
          <span className="font-extrabold text-[10px] tracking-tight">ZALO</span>
        </button>

        <button
          onClick={() => handleShare("COPY_LINK")}
          title="Sao chép đường dẫn bài viết"
          className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1.5 transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Đã chép link!" : "Copy Link"}</span>
        </button>
      </div>

    </div>
  );
}
