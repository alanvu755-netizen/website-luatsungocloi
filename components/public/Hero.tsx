import Image from "next/image";
import { Heart, ShieldCheck, Zap, Lock, ArrowRight } from "lucide-react";

interface HeroProps {
  data?: {
    subtitle?: string;
    name?: string;
    imageUrl?: string | null;
    title1?: string | null;
    title2?: string | null;
    description?: string | null;
    badgesJson?: string | null;
    ctaPrimaryText?: string | null;
    ctaSecondaryText?: string | null;
  } | null;
}

export default function Hero({ data }: HeroProps) {
  const imageUrl = data?.imageUrl || "/customer-reference.png";
  const title1 = data?.title1 || "ĐỒNG HÀNH PHÁP LÝ";
  const title2 = data?.title2 || "BẢO VỆ QUYỀN & LỢI ÍCH HỢP PHÁP";
  const description =
    data?.description ||
    "Luật sư Lê Thị Ngọc Lợi và cộng sự cam kết mang đến giải pháp pháp lý hiệu quả – tận tâm – bảo mật – chuyên nghiệp.";
  const ctaPrimaryText = data?.ctaPrimaryText || "TƯ VẤN NGAY";
  const ctaSecondaryText = data?.ctaSecondaryText || "XEM LĨNH VỰC HOẠT ĐỘNG";

  let badges = [
    { title: "Tận tâm", subtext: "Luôn đặt quyền lợi khách hàng lên hàng đầu", icon: Heart },
    { title: "Chuyên nghiệp", subtext: "Kiến thức vững vàng kinh nghiệm thực tiễn", icon: ShieldCheck },
    { title: "Hiệu quả", subtext: "Giải pháp tối ưu tiết kiệm thời gian", icon: Zap },
    { title: "Bảo mật", subtext: "Cam kết bảo mật thông tin tuyệt đối", icon: Lock },
  ];

  if (data?.badgesJson) {
    try {
      const parsed = JSON.parse(data.badgesJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const iconMap: Record<string, any> = { Heart, ShieldCheck, Zap, Lock };
        badges = parsed.map((b: any) => ({
          title: b.title || "Tiêu chí",
          subtext: b.subtext || "",
          icon: iconMap[b.icon] || Heart,
        }));
      }
    } catch (e) {
      // Fallback
    }
  }

  return (
    <section className="relative bg-[#051C38] text-white overflow-hidden py-10 lg:py-16 border-b border-navy-light/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* CỘT TRÁI: CHÂN DỤNG LUẬT SƯ ĐỨNG (PER SCREENSHOT) */}
          <div className="lg:col-span-5 relative flex justify-center items-end min-h-[380px] sm:min-h-[460px] lg:min-h-[520px]">
            <div className="relative z-10 w-full h-full flex items-end justify-center">
              <Image
                src={imageUrl}
                alt="Luật sư Lê Thị Ngọc Lợi"
                width={500}
                height={620}
                priority={true}
                className="max-h-[480px] lg:max-h-[540px] w-auto object-contain object-bottom drop-shadow-2xl"
              />
            </div>
          </div>

          {/* CỘT PHẢI: TIÊU ĐỀ LỚN, 4 CAM KẾT & NÚT BẤM (PER SCREENSHOT) */}
          <div className="lg:col-span-7 flex flex-col text-center lg:text-left items-center lg:items-start z-10 space-y-6">
            
            {/* Main Headline */}
            <div className="space-y-2">
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gold tracking-tight uppercase leading-tight">
                {title1}
              </h2>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight uppercase leading-tight">
                {title2}
              </h1>
            </div>

            {/* Subtitle Description */}
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl font-light leading-relaxed">
              {description}
            </p>

            {/* 4 Feature Badges (2x2 Grid per customer screenshot) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-2">
              {badges.map((badge, idx) => {
                const IconComp = badge.icon;
                return (
                  <div key={idx} className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-1">
                    <div className="w-10 h-10 rounded-lg bg-navy-light/60 border border-gold/40 flex items-center justify-center text-gold mb-1">
                      <IconComp className="w-5 h-5 text-gold" />
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-gold">{badge.title}</h3>
                    <p className="text-[11px] text-slate-300 leading-tight">
                      {badge.subtext}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* 2 CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 w-full">
              <a
                href="#lien-he"
                className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-navy px-6 py-3 rounded-md font-sans text-xs sm:text-sm font-extrabold uppercase tracking-wide transition-all shadow-md hover:scale-105"
              >
                <span>{ctaPrimaryText}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#linh-vuc-hoat-dong"
                className="inline-flex items-center justify-center gap-2 border border-slate-400/80 hover:border-gold hover:text-gold text-white px-6 py-3 rounded-md font-sans text-xs sm:text-sm font-extrabold uppercase tracking-wide transition-all bg-navy/40 hover:bg-navy/80"
              >
                <span>{ctaSecondaryText}</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
