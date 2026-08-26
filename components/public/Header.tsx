import Link from "next/link";
import { Scale, ChevronDown, Phone, Mail, MapPin, Globe, Facebook } from "lucide-react";
import { getSiteBySlug, getPublicHeaderMenus } from "@/lib/services/site.service";

export default async function Header() {
  const site = await getSiteBySlug("le-thi-ngoc-loi");
  const menus = site ? await getPublicHeaderMenus(site.id) : [];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-xs">
      
      {/* 1. TOP BAR (Black/Navy background matching customer screenshot) */}
      <div className="bg-[#030f1e] text-white text-[11px] sm:text-xs py-1.5 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Left info: Website & Email */}
          <div className="flex items-center gap-4 sm:gap-6 text-slate-300">
            <a href="https://luatsungocloi.vn" className="flex items-center gap-1.5 hover:text-gold transition-colors">
              <Globe className="w-3.5 h-3.5 text-gold" />
              <span>luatsungocloi.vn</span>
            </a>
            <a href="mailto:luatsungocloi@gmail.com" className="flex items-center gap-1.5 hover:text-gold transition-colors">
              <Mail className="w-3.5 h-3.5 text-gold" />
              <span>luatsungocloi@gmail.com</span>
            </a>
          </div>

          {/* Right info: Address & Social Icons */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden md:flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-gold" />
              <span>Phường Cao Lãnh, Đồng Tháp</span>
            </div>

            <div className="flex items-center gap-2.5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                title="Facebook"
              >
                <Facebook className="w-3 h-3" />
              </a>

              <a
                href="https://zalo.me/0902081061"
                target="_blank"
                rel="noopener noreferrer"
                className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[9px] font-bold hover:opacity-80 transition-opacity"
                title="Zalo Chat"
              >
                Z
              </a>

              <a
                href="#"
                className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-white text-[9px] font-bold hover:opacity-80 transition-opacity"
                title="TikTok"
              >
                ♪
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* 2. MAIN HEADER NAVBAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group min-w-0">
            <div className="w-12 h-12 rounded-full border-2 border-gold/40 p-0.5 flex items-center justify-center bg-navy text-gold shadow-xs group-hover:scale-105 transition-transform flex-shrink-0">
              <div className="w-full h-full rounded-full border border-gold flex items-center justify-center bg-[#072448]">
                <Scale className="w-6 h-6 text-gold stroke-[1.75]" />
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] sm:text-xs text-gold font-sans font-bold uppercase tracking-wider">
                LUẬT SƯ – THẠC SĨ
              </span>
              <span className="font-serif font-extrabold text-base sm:text-xl text-navy tracking-tight leading-tight uppercase group-hover:text-gold transition-colors whitespace-nowrap truncate">
                LÊ THỊ NGỌC LỢI
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 font-sans uppercase tracking-widest font-medium">
                VỮNG PHÁP LÝ – TRỌN NIỀM TIN
              </span>
            </div>
          </Link>

          {/* Main Navigation (100% Dynamic CMS Menus) */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-slate-800">
            {menus.length > 0 ? (
              menus.map((menu) => {
                const targetHref = menu.slug ? `/${menu.slug}` : "/";
                return (
                  <div key={menu.id} className="relative group">
                    <Link
                      href={targetHref}
                      className="inline-flex items-center gap-1 hover:text-gold transition-colors py-2"
                    >
                      <span>{menu.title}</span>
                      {menu.submenus && menu.submenus.length > 0 && (
                        <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                      )}
                    </Link>

                    {menu.submenus && menu.submenus.length > 0 && (
                      <div className="absolute left-0 top-full hidden group-hover:block w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-50">
                        {menu.submenus.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/${menu.slug}/${sub.slug}`}
                            className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-navy font-semibold uppercase"
                          >
                            {sub.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <>
                <Link href="/" className="hover:text-gold transition-colors">TRANG CHỦ</Link>
                <Link href="/gioi-thieu" className="hover:text-gold transition-colors">GIỚI THIỆU</Link>
                <Link href="/linh-vuc-hoat-dong" className="hover:text-gold transition-colors">LĨNH VỰC HOẠT ĐỘNG</Link>
                <Link href="/thu-vien-phap-luat" className="hover:text-gold transition-colors">THƯ VIỆN PHÁP LUẬT</Link>
                <Link href="/tin-tuc" className="hover:text-gold transition-colors">TIN TỨC</Link>
                <Link href="/lien-he" className="hover:text-gold transition-colors">LIÊN HỆ</Link>
              </>
            )}
          </nav>

          {/* Hotline Box (Bordered Gold Box per screenshot) */}
          <div className="flex items-center flex-shrink-0">
            <a
              href="tel:0902081061"
              className="flex items-center gap-3 border-2 border-gold/80 bg-amber-50/50 hover:bg-amber-100/60 px-4 py-2 rounded-lg transition-all shadow-xs"
            >
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-navy flex-shrink-0">
                <Phone className="w-4 h-4 text-gold stroke-[2]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-sans font-extrabold text-sm sm:text-base text-gold leading-tight">
                  0902 081 061
                </span>
                <span className="text-[10px] text-slate-600 font-medium whitespace-nowrap">
                  Tư vấn pháp lý 24/7
                </span>
              </div>
            </a>
          </div>

        </div>
      </div>
    </header>
  );
}
