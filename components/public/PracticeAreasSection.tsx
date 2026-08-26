import Link from "next/link";
import { Home, Users, FileText, Scale, Building2, Shield, ArrowRight } from "lucide-react";

interface PracticeAreaItem {
  id: string;
  title: string;
  description?: string | null;
}

interface PracticeAreasSectionProps {
  items?: PracticeAreaItem[];
}

const DEFAULT_CATEGORIES = [
  {
    id: "cat1",
    title: "ĐẤT ĐAI – NHÀ Ở",
    description: "Tư vấn, tranh chấp, chuyển nhượng, thừa kế, tặng cho, hợp thức hóa...",
    icon: Home,
    href: "/thu-vien-phap-luat/dat-dai",
  },
  {
    id: "cat2",
    title: "HÔN NHÂN – GIA ĐÌNH",
    description: "Ly hôn, tranh chấp tài sản, quyền nuôi con, cấp dưỡng, kết hôn với người nước ngoài...",
    icon: Users,
    href: "/thu-vien-phap-luat/hon-nhan",
  },
  {
    id: "cat3",
    title: "DÂN SỰ – HỢP ĐỒNG",
    description: "Soạn thảo, rà soát hợp đồng, tranh chấp dân sự, bồi thường thiệt hại ngoài hợp đồng...",
    icon: FileText,
    href: "/thu-vien-phap-luat/dan-su",
  },
  {
    id: "cat4",
    title: "TRANH TỤNG TẠI TÒA",
    description: "Đại diện theo ủy quyền, bảo vệ quyền lợi tại Tòa án các cấp...",
    icon: Scale,
    href: "/thu-vien-phap-luat/dan-su",
  },
  {
    id: "cat5",
    title: "DOANH NGHIỆP",
    description: "Thành lập, thay đổi, giải thể, tư vấn pháp lý thường xuyên cho doanh nghiệp...",
    icon: Building2,
    href: "/thu-vien-phap-luat/doanh-nghiep",
  },
  {
    id: "cat6",
    title: "HÌNH SỰ – HÀNH CHÍNH",
    description: "Bào chữa, bảo vệ quyền lợi bị can, bị cáo, khiếu nại, tố cáo, xử phạt...",
    icon: Shield,
    href: "/thu-vien-phap-luat/hinh-su",
  },
];

export default function PracticeAreasSection({ items }: PracticeAreasSectionProps) {
  const displayCategories = DEFAULT_CATEGORIES.map((cat, idx) => {
    if (items && items[idx]) {
      return { ...cat, title: items[idx].title.toUpperCase() };
    }
    return cat;
  });

  return (
    <section id="linh-vuc" className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Section Header */}
        <div className="flex flex-col items-center mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-navy uppercase tracking-wider">
            LĨNH VỰC HOẠT ĐỘNG
          </h2>
          <div className="flex items-center gap-2 mt-2 text-gold">
            <div className="h-[2px] w-12 bg-gold/60"></div>
            <Scale className="w-4 h-4 text-gold" />
            <div className="h-[2px] w-12 bg-gold/60"></div>
          </div>
        </div>

        {/* 6 White Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {displayCategories.map((cat) => {
            const IconComp = cat.icon;
            return (
              <div
                key={cat.id}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center text-navy mb-4 group-hover:bg-navy group-hover:text-gold transition-colors">
                    <IconComp className="w-6 h-6 stroke-[1.75]" />
                  </div>
                  <h3 className="font-serif font-extrabold text-base sm:text-lg text-navy uppercase tracking-tight mb-2 group-hover:text-gold transition-colors">
                    <Link href={cat.href}>
                      {cat.title}
                    </Link>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed mb-4">
                    {cat.description}
                  </p>
                </div>

                <Link
                  href={cat.href}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-navy hover:text-gold transition-colors pt-2 border-t border-slate-100"
                >
                  <span>Xem chi tiết chuyên mục</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
