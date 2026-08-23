import Link from "next/link";
import { Scale, ChevronDown } from "lucide-react";
import { prisma } from "@/lib/db/prisma";

export default async function Header() {
  const site = await prisma.site.findUnique({
    where: { slug: "le-thi-ngoc-loi" },
  });

  const menus = site
    ? await prisma.menu.findMany({
        where: {
          siteId: site.id,
          status: "VISIBLE",
        },
        include: {
          submenus: {
            where: { status: "VISIBLE" },
            orderBy: { displayOrder: "asc" },
          },
        },
        orderBy: { displayOrder: "asc" },
      })
    : [];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Subtle Logo & Title */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center text-gold shadow-xs group-hover:scale-105 transition-transform">
              <Scale className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-sm sm:text-base text-navy tracking-tight leading-tight group-hover:text-gold transition-colors">
                LUẬT SƯ LÊ THỊ NGỌC LỢI
              </span>
              <span className="text-[10px] text-slate-500 font-sans uppercase tracking-wider">
                Thạc sĩ Luật – Tư vấn & Tố tụng
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
            <Link href="/" className="hover:text-navy transition-colors">
              Trang chủ
            </Link>
            
            <a href="/#gioi-thieu" className="hover:text-navy transition-colors">
              Giới thiệu
            </a>
            
            <a href="/#kinh-nghiem" className="hover:text-navy transition-colors">
              Kinh nghiệm
            </a>
            
            <a href="/#linh-vuc" className="hover:text-navy transition-colors">
              Lĩnh vực
            </a>

            {/* Dynamic CMS Menus & Submenus */}
            {menus.map((menu) => (
              <div key={menu.id} className="relative group">
                <Link
                  href={`/${menu.slug}`}
                  className="inline-flex items-center gap-1 hover:text-navy transition-colors py-2"
                >
                  <span>{menu.title}</span>
                  {menu.submenus.length > 0 && <ChevronDown className="w-3.5 h-3.5 opacity-70" />}
                </Link>

                {menu.submenus.length > 0 && (
                  <div className="absolute left-0 top-full hidden group-hover:block w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-50">
                    {menu.submenus.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/${menu.slug}/${sub.slug}`}
                        className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-navy font-medium"
                      >
                        {sub.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <a href="/#lien-he" className="hover:text-navy transition-colors">
              Liên hệ
            </a>
          </nav>

          {/* Header Hotline Action */}
          <div className="flex items-center gap-3">
            <a
              href="tel:0902081061"
              className="inline-flex items-center gap-2 bg-navy hover:bg-navy-dark text-white px-4 py-2 rounded-full font-sans text-xs font-semibold shadow-xs transition-all hover:scale-105"
            >
              <span>Hotline: 0902 081 061</span>
            </a>
          </div>

        </div>
      </div>
    </header>
  );
}
