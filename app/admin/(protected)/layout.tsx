import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthenticatedUser } from "@/lib/auth/session";
import {
  LayoutDashboard,
  User,
  Scale,
  PhoneCall,
  Image as ImageIcon,
  Search,
  Settings,
  FolderTree,
  FileText,
  Cpu,
  LogOut,
  Shield,
  BarChart3,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthenticatedUser();

  // If unauthenticated, redirect to login page
  if (!user) {
    redirect("/admin/login");
  }

  const isSysAdmin = user.role.name === "SYSADMIN";

  const navGroups = [
    {
      title: "TỔNG QUAN & TƯ VẤN",
      items: [
        { label: "Bảng điều khiển", href: "/admin/dashboard", icon: LayoutDashboard },
        { label: "Khách hàng đăng ký tư vấn", href: "/admin/consultations", icon: MessageSquare },
      ],
    },
    {
      title: "NỘI DUNG CONTENT CMS",
      items: [
        { label: "Tất cả bài viết", href: "/admin/articles", icon: FileText },
        { label: "Chuyên mục Thư viện Pháp luật", href: "/admin/menus", icon: FolderTree },
        { label: "Chuyên khoa / Lĩnh vực tư vấn", href: "/admin/practice-areas", icon: Scale },
        { label: "AI Content Studio (Trợ lý AI)", href: "/admin/ai-content", icon: Sparkles },
        { label: "Chỉ số nổi bật (Stats)", href: "/admin/statistics", icon: BarChart3 },
      ],
    },
    {
      title: "PROFILE & TRANG CHỦ",
      items: [
        { label: "Ảnh & Banner 'Đồng Hành Pháp Lý'", href: "/admin/hero", icon: Scale },
        { label: "Giới thiệu & Ảnh văn phòng", href: "/admin/introduction", icon: User },
        { label: "Kênh liên hệ (Zalo/FB/Hotline)", href: "/admin/contact", icon: PhoneCall },
      ],
    },
    {
      title: "CẤU HÌNH & TRUYỀN THÔNG",
      items: [
        { label: "Thư viện ảnh", href: "/admin/media", icon: ImageIcon },
        { label: "Cấu hình SEO", href: "/admin/seo", icon: Search },
        { label: "Cài đặt chung & Email thông báo", href: "/admin/settings", icon: Settings },
        ...(isSysAdmin
          ? [{ label: "AI Provider (SYSADMIN)", href: "/admin/ai-provider", icon: Cpu }]
          : []),
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-navy text-white flex flex-col border-r border-navy-dark shadow-lg flex-shrink-0">
        
        {/* Brand Title */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-navy-dark/80 bg-navy-dark">
          <div className="w-8 h-8 rounded-full bg-gold text-navy font-bold flex items-center justify-center">
            <Scale className="w-5 h-5 stroke-[2]" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-sm text-white leading-tight">
              ADMIN CMS
            </span>
            <span className="text-[10px] text-slate-300 uppercase tracking-wider">
              Luật sư Lê Thị Ngọc Lợi
            </span>
          </div>
        </div>

        {/* Nav Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {navGroups.map((group, idx) => (
            <div key={idx}>
              <h3 className="px-3 text-[10px] font-bold text-gold/80 uppercase tracking-wider mb-2">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-navy-light/50 rounded-lg transition-colors"
                    >
                      <Icon className="w-4 h-4 text-gold/90" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Footer Profile */}
        <div className="p-4 border-t border-navy-dark/80 bg-navy-dark/50 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-navy-light flex items-center justify-center text-xs font-bold text-gold border border-gold/30 flex-shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-white truncate">{user.name}</span>
              <span className="text-[10px] text-gold uppercase tracking-wider font-bold">
                {user.role.name}
              </span>
            </div>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="p-1.5 rounded-md hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-colors"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <Shield className="w-4 h-4 text-navy" />
            <span className="font-semibold text-slate-800">
              Trang web: {user.site?.name || "Luật sư Lê Thị Ngọc Lợi"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-navy hover:text-gold bg-navy/5 hover:bg-navy/10 px-3 py-1.5 rounded-md transition-colors"
            >
              Xem Public Website ↗
            </a>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>

      </div>
    </div>
  );
}
