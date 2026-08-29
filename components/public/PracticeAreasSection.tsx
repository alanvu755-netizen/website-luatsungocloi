import Link from "next/link";
import { Home, Users, FileText, Scale, Building2, Shield, ArrowRight } from "lucide-react";

interface PracticeAreaItem {
  id: string;
  title: string;
  description?: string | null;
  icon?: string | null;
}

interface PracticeAreasSectionProps {
  items?: PracticeAreaItem[];
}

function getHrefForTitle(title: string): string {
  const upper = title.toUpperCase();
  if (upper.includes("HÔN NHÂN") || upper.includes("GIA ĐÌNH")) {
    return "/thu-vien-phap-luat/hon-nhan-gia-dinh";
  }
  if (upper.includes("DÂN SỰ") || upper.includes("HỢP ĐỒNG")) {
    return "/thu-vien-phap-luat/dan-su-hop-dong";
  }
  if (upper.includes("TRANH TỤNG") || upper.includes("TÒA")) {
    return "/thu-vien-phap-luat/tranh-tung";
  }
  if (upper.includes("DOANH NGHIỆP")) {
    return "/thu-vien-phap-luat/doanh-nghiep";
  }
  if (upper.includes("HÌNH SỰ") || upper.includes("HÀNH CHÍNH")) {
    return "/thu-vien-phap-luat/hinh-su-hanh-chinh";
  }
  return "/thu-vien-phap-luat/dat-dai";
}

function getIconForTitle(title: string, iconStr?: string | null) {
  if (iconStr === "Users") return Users;
  if (iconStr === "FileText") return FileText;
  if (iconStr === "Scale") return Scale;
  if (iconStr === "Building2") return Building2;
  if (iconStr === "Shield") return Shield;
  if (iconStr === "Home") return Home;

  const upper = title.toUpperCase();
  if (upper.includes("HÔN NHÂN")) return Users;
  if (upper.includes("DÂN SỰ")) return FileText;
  if (upper.includes("TRANH TỤNG")) return Scale;
  if (upper.includes("DOANH NGHIỆP")) return Building2;
  if (upper.includes("HÌNH SỰ")) return Shield;
  return Home;
}

const DEFAULT_CATEGORIES = [
  {
    id: "cat1",
    title: "ĐẤT ĐAI – NHÀ Ở",
    description: "Tư vấn thủ tục sang tên, tranh chấp tài sản đất đai, tách thửa, cấp sổ đỏ lần đầu.",
    icon: Home,
    href: "/thu-vien-phap-luat/dat-dai",
  },
  {
    id: "cat2",
    title: "HÔN NHÂN – GIA ĐÌNH",
    description: "Tư vấn thuận tình/đơn phương ly hôn, chia tài sản chung, quyền nuôi con.",
    icon: Users,
    href: "/thu-vien-phap-luat/hon-nhan-gia-dinh",
  },
  {
    id: "cat3",
    title: "DÂN SỰ – HỢP ĐỒNG",
    description: "Tư vấn soạn thảo, rà soát hợp đồng dân sự, giải quyết tranh chấp hợp đồng vay mượn.",
    icon: FileText,
    href: "/thu-vien-phap-luat/dan-su-hop-dong",
  },
  {
    id: "cat4",
    title: "TRANH TỤNG TẠI TÒA",
    description: "Đại diện tham gia tranh tụng bảo vệ quyền và lợi ích hợp pháp tại các cấp Tòa án.",
    icon: Scale,
    href: "/thu-vien-phap-luat/tranh-tung",
  },
  {
    id: "cat5",
    title: "DOANH NGHIỆP",
    description: "Tư vấn pháp lý thường xuyên cho doanh nghiệp, thành lập, giải thể và tranh chấp nội bộ.",
    icon: Building2,
    href: "/thu-vien-phap-luat/doanh-nghiep",
  },
  {
    id: "cat6",
    title: "HÌNH SỰ – HÀNH CHÍNH",
    description: "Bào chữa cho bị cáo, bảo vệ quyền lợi người bị hại trong các vụ án hình sự, khiếu kiện hành chính.",
    icon: Shield,
    href: "/thu-vien-phap-luat/dat-dai",
  },
];

export default function PracticeAreasSection({ items }: PracticeAreasSectionProps) {
  let displayCategories = DEFAULT_CATEGORIES;

  if (items && items.length > 0) {
    displayCategories = items.map((item, idx) => ({
      id: item.id || `db_cat_${idx}`,
      title: item.title.toUpperCase(),
      description: item.description || DEFAULT_CATEGORIES[idx % DEFAULT_CATEGORIES.length].description,
      icon: getIconForTitle(item.title, item.icon),
      href: getHrefForTitle(item.title),
    }));
  }

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
