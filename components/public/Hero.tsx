import { Scale } from "lucide-react";
import IntroductionSection from "@/components/public/IntroductionSection";

interface HeroProps {
  data: {
    subtitle: string;
    name: string;
    imageUrl?: string | null;
    imageId?: string | null;
    logoId?: string | null;
  } | null;
  introduction?: {
    title: string;
    content: string;
  } | null;
}

export default function Hero({ data, introduction }: HeroProps) {
  const subtitle = data?.subtitle || "Luật sư - Thạc sĩ";
  const name = data?.name || "LÊ THỊ NGỌC LỢI";
  const imageUrl = data?.imageUrl || "/customer-reference.png";

  return (
    <section className="relative bg-white pt-0 pb-4 lg:pb-6 overflow-hidden border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* CỘT TRÁI: THƯƠNG HIỆU CÁ NHÂN & CARD GIỚI THIỆU (FLUSH ALIGNED WITH LOWER CONTENT GRID) */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left z-10 pt-4 sm:pt-6 pb-2 lg:pb-4 justify-between">
            
            <div className="flex flex-col items-center lg:items-start w-full">
              {/* 1. Badge Icon Cán Cân Công Lý */}
              <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-full border-2 border-navy/20 p-1 flex items-center justify-center mb-3 bg-white shadow-sm flex-shrink-0">
                <div className="w-full h-full rounded-full border border-gold/40 flex items-center justify-center bg-navy text-gold">
                  <Scale className="w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 text-gold stroke-[1.5]" />
                </div>
              </div>

              {/* 2. Subtitle / Danh Xưng */}
              <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-medium text-navy tracking-wide mb-1">
                {subtitle}
              </h2>

              {/* 3. Main Name / Họ và Tên */}
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-navy tracking-tight uppercase leading-none mb-2">
                {name}
              </h1>

              {/* 4. Gold Diamond Accent Divider */}
              <div className="flex items-center gap-3 w-48 sm:w-56 my-2">
                <div className="h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent flex-1"></div>
                <div className="w-2.5 h-2.5 bg-gold rotate-45 transform shadow-xs"></div>
                <div className="h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent flex-1"></div>
              </div>
            </div>

            {/* 5. KHỐI GIỚI THIỆU (CARD) - KHOẢNG CÁCH THÍCH ỨNG (MOBILE: 24PX/32PX, DESKTOP: 64PX/MT-16) */}
            <div className="w-full mt-6 sm:mt-8 lg:mt-16">
              <IntroductionSection data={introduction ?? null} />
            </div>

          </div>

          {/* CỘT PHẢI: KHỐI NỀN NAVY & CHÂN DỤNG THÍCH ỨNG ĐA THIẾT BỊ (MOBILE: 380PX, TABLET: 480-520PX, DESKTOP: 600PX) */}
          <div className="lg:col-span-6 relative flex justify-center items-end w-full h-[380px] sm:h-[480px] md:h-[520px] lg:h-[600px] pt-0 mt-0">
            
            {/* 1. BACKGROUND GEOMETRY (SVG VÒM NAVY MỞ RỘNG XUỐNG CHÂN CĂN CHÍNH GIỮA) */}
            <div className="absolute inset-0 z-0 flex items-end justify-center pointer-events-none overflow-hidden">
              <svg
                className="w-full h-full"
                viewBox="0 0 500 600"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <defs>
                  {/* Navy Color Gradient Definition */}
                  <linearGradient id="heroNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#073B78" />
                    <stop offset="60%" stopColor="#052954" />
                    <stop offset="100%" stopColor="#02162E" />
                  </linearGradient>

                  {/* Gold Color Gradient Definition */}
                  <linearGradient id="heroGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E5BE6B" />
                    <stop offset="50%" stopColor="#D8A84E" />
                    <stop offset="100%" stopColor="#B38431" />
                  </linearGradient>
                </defs>

                {/* Main Navy Solid Backdrop Shape */}
                <path
                  d="M 80 0 C -20 180 -20 420 60 600 L 500 600 L 500 0 Z"
                  fill="url(#heroNavyGrad)"
                />

                {/* Primary Gold Accent Curve */}
                <path
                  d="M 80 0 C -20 180 -20 420 60 600"
                  stroke="url(#heroGoldGrad)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Secondary Parallel Gold Accent Stroke */}
                <path
                  d="M 92 0 C -8 180 -8 420 72 600"
                  stroke="url(#heroGoldGrad)"
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                  fill="none"
                />
              </svg>
            </div>

            {/* 2. PORTRAIT LAYER (CHÂN DỤNG TĂNG KÍCH THƯỚC TỶ LỆ HÀI HÒA CÂN XỨNG VỚI NỀN) */}
            <div className="relative z-10 w-full h-full flex items-end justify-center pt-2 pb-0">
              <img
                src={imageUrl}
                alt={`Chân dung ${name}`}
                className="max-h-[92%] sm:max-h-[95%] w-auto max-w-full object-contain object-bottom drop-shadow-xl hover:scale-[1.01] transition-transform duration-500"
              />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
