import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import {
  User,
  GraduationCap,
  Briefcase,
  Scale,
  PhoneCall,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const user = await getAuthenticatedUser();
  const siteId = user?.siteId;

  if (!siteId) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <h1 className="text-xl font-bold text-navy mb-2">Quản trị Hệ thống (SYSADMIN)</h1>
        <p className="text-sm text-slate-600">Bạn đang ở quyền quản trị cao nhất hệ thống.</p>
      </div>
    );
  }

  const [
    hero,
    educations,
    experiences,
    practiceAreas,
    channels,
    siteAddOn,
  ] = await Promise.all([
    prisma.hero.findUnique({ where: { siteId } }),
    prisma.education.count({ where: { siteId } }),
    prisma.experience.count({ where: { siteId } }),
    prisma.practiceArea.count({ where: { siteId } }),
    prisma.contactChannel.findMany({ where: { siteId } }),
    prisma.siteAddOn.findFirst({
      where: { siteId },
      include: { addOn: true },
    }),
  ]);

  const activeChannelsCount = channels.filter((c) => c.status === true).length;

  return (
    <div className="space-y-6">
      
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-navy to-navy-dark text-white rounded-2xl p-6 shadow-md border border-navy-light/30">
        <h1 className="font-serif text-2xl font-bold mb-1">
          Xin chào, {user.name}!
        </h1>
        <p className="text-slate-200 text-sm">
          Chào mừng bạn đến với hệ thống quản trị nội dung website Luật sư – Thạc sĩ Lê Thị Ngọc Lợi.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Hero Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase">Trạng thái Hero</span>
            <div className="flex items-center gap-2 mt-1">
              <h3 className="text-lg font-bold text-slate-900">
                {hero?.status === "PUBLISHED" ? "Đã Xuất Bản" : "Bản Nháp"}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">{hero?.pubName}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-navy/10 text-navy flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
        </div>

        {/* Education & Experience Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase">Học vấn & Kinh nghiệm</span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              {educations} Học vấn | {experiences} Kinh nghiệm
            </h3>
            <p className="text-xs text-slate-400 mt-1">Đã được cập nhật vào CSDL</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-navy/10 text-navy flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>

        {/* Practice Areas Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase">Lĩnh vực hoạt động</span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              {practiceAreas} Lĩnh vực
            </h3>
            <p className="text-xs text-slate-400 mt-1">Định dạng Checklist</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-navy/10 text-navy flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
        </div>

        {/* Contact Channels Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase">Kênh liên hệ (Zalo/FB)</span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              {activeChannelsCount} / {channels.length} Bật (ON)
            </h3>
            <p className="text-xs text-slate-400 mt-1">Tùy chỉnh linh hoạt trong CMS</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-navy/10 text-navy flex items-center justify-center">
            <PhoneCall className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Contact Channels Status Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-base font-bold text-navy mb-4 flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-gold" />
          Trạng thái Kênh Liên hệ (Zalo, Telegram, Facebook)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {channels.map((ch) => (
            <div
              key={ch.id}
              className={`p-4 rounded-lg border flex items-center justify-between ${
                ch.status
                  ? "bg-emerald-50/50 border-emerald-200 text-emerald-900"
                  : "bg-slate-50 border-slate-200 text-slate-500"
              }`}
            >
              <div>
                <span className="text-xs font-bold uppercase">{ch.platform}</span>
                <p className="text-sm font-semibold truncate mt-0.5">{ch.label}</p>
                <p className="text-xs truncate text-slate-500">{ch.url}</p>
              </div>
              <span
                className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                  ch.status ? "bg-emerald-600 text-white" : "bg-slate-300 text-slate-700"
                }`}
              >
                {ch.status ? "ON" : "OFF"}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
          <Link
            href="/admin/contact"
            className="text-xs font-semibold text-navy hover:text-gold transition-colors"
          >
            Quản lý Kênh liên hệ →
          </Link>
        </div>
      </div>

      {/* AI Add-on Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-navy to-slate-900 text-white rounded-xl p-6 shadow-md border border-navy-light/40 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gold/20 text-gold flex items-center justify-center border border-gold/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              AI Content Engine Add-on
              <span className="px-2 py-0.5 text-[10px] uppercase font-extrabold bg-emerald-500 text-white rounded-full">
                {siteAddOn?.status || "ACTIVE"}
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Hỗ trợ sinh bài viết SEO, viết lại giới thiệu, tối ưu thông điệp và tạo CTA ấn tượng.
            </p>
          </div>
        </div>
        <Link
          href="/admin/ai-content"
          className="px-4 py-2 bg-gold hover:bg-gold-dark text-navy font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-2"
        >
          Mở AI Content Studio →
        </Link>
      </div>

    </div>
  );
}
