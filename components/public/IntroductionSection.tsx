import Image from "next/image";
import { Check, ArrowRight } from "lucide-react";

interface IntroductionProps {
  data?: {
    title?: string;
    content?: string;
    imageUrl?: string | null;
  } | null;
}

export default function IntroductionSection({ data }: IntroductionProps) {
  const content =
    data?.content ||
    "Luật sư – Thạc sĩ Lê Thị Ngọc Lợi với hơn 10 năm kinh nghiệm trong lĩnh vực tư vấn và tranh tụng, đã đồng hành và bảo vệ quyền lợi hợp pháp cho hàng trăm cá nhân, tổ chức.";
  const imageUrl = data?.imageUrl || "/NgocLoi-office.jpg";

  return (
    <section id="gioi-thieu" className="py-12 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* CỘT TRÁI: ẢNH LUẬT SƯ NGỒI BÀN LÀM VIỆC (PER SCREENSHOT) */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 w-full max-w-md lg:max-w-none">
              <Image
                src={imageUrl}
                alt="Về Luật sư Lê Thị Ngọc Lợi"
                width={550}
                height={400}
                className="w-full h-auto object-cover rounded-2xl"
              />
              <div className="absolute bottom-4 left-4 bg-amber-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-md text-xs font-serif font-extrabold uppercase shadow-md border border-amber-400/50">
                LUẬT SƯ – THẠC SĨ LÊ THỊ NGỌC LỢI
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: TIÊU ĐỀ, NỘI DUNG & 4 DÒNG CHECKMARK (PER SCREENSHOT) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-5">
            
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-navy uppercase tracking-wider">
              VỀ LUẬT SƯ LÊ THỊ NGỌC LỢI
            </h2>

            <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-light">
              {content}
            </p>

            {/* 4 Check-mark Checklist Points */}
            <div className="space-y-2.5 pt-1 w-full">
              <div className="flex items-center gap-2.5 text-slate-800 text-xs sm:text-sm font-semibold">
                <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center text-amber-700 flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-amber-700 stroke-[3]" />
                </div>
                <span>Tốt nghiệp Thạc sĩ Luật</span>
              </div>

              <div className="flex items-center gap-2.5 text-slate-800 text-xs sm:text-sm font-semibold">
                <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center text-amber-700 flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-amber-700 stroke-[3]" />
                </div>
                <span>Đoàn Luật sư tỉnh Đồng Tháp</span>
              </div>

              <div className="flex items-center gap-2.5 text-slate-800 text-xs sm:text-sm font-semibold">
                <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center text-amber-700 flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-amber-700 stroke-[3]" />
                </div>
                <span>Chuyên môn vững vàng – Kinh nghiệm thực tiễn</span>
              </div>

              <div className="flex items-center gap-2.5 text-slate-800 text-xs sm:text-sm font-semibold">
                <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center text-amber-700 flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-amber-700 stroke-[3]" />
                </div>
                <span>Phong cách làm việc tận tâm – Uy tín – Hiệu quả</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <a
                href="#lien-he"
                className="inline-flex items-center gap-2 bg-[#051C38] hover:bg-navy-dark text-white px-6 py-3 rounded-md font-sans text-xs font-bold uppercase tracking-wide transition-all shadow-sm hover:scale-105"
              >
                <span>XEM THÊM VỀ CHÚNG TÔI</span>
                <ArrowRight className="w-4 h-4 text-gold" />
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
