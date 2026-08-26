import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { getEffectiveSiteId } from "@/lib/services/site.service";
import { redirect } from "next/navigation";
import { Search, CheckCircle } from "lucide-react";

export default async function AdminSeoPage({
  searchParams,
}: {
  searchParams?: { success?: string };
}) {
  const user = await getAuthenticatedUser();
  const siteId = await getEffectiveSiteId(user);

  if (!user || !siteId) redirect("/admin/login");

  const settings = await prisma.siteSettings.findUnique({ where: { siteId } });

  async function handleUpdateSeo(formData: FormData) {
    "use server";
    const authUser = await getAuthenticatedUser();
    const targetSiteId = await getEffectiveSiteId(authUser);
    if (!authUser || !targetSiteId) return;

    const seoTitle = formData.get("seoTitle") as string;
    const seoDescription = formData.get("seoDescription") as string;

    await prisma.siteSettings.update({
      where: { siteId: targetSiteId },
      data: {
        seoTitle,
        seoDescription,
      },
    });

    redirect("/admin/seo?success=Cập nhật SEO thành công");
  }

  return (
    <div className="space-y-6 max-w-3xl">
      
      <div>
        <h1 className="text-xl font-bold text-navy font-serif">Cấu hình SEO & Thẻ Meta</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Tối ưu hóa tiêu đề Title và Mô tả Meta Description cho công cụ tìm kiếm Google.
        </p>
      </div>

      {searchParams?.success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-3">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{searchParams.success}</span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        
        {/* Google Search Preview */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
            Xem trước kết quả tìm kiếm Google
          </span>
          <h3 className="text-navy font-medium text-base hover:underline cursor-pointer truncate">
            {settings?.seoTitle || "Luật sư – Thạc sĩ Lê Thị Ngọc Lợi | Tư vấn pháp lý"}
          </h3>
          <p className="text-xs text-emerald-700 font-normal">
            https://luatsuloilethingocloi.vn
          </p>
          <p className="text-xs text-slate-600 line-clamp-2">
            {settings?.seoDescription || "Luật sư – Thạc sĩ Lê Thị Ngọc Lợi với hơn 13 năm kinh nghiệm trong ngành Kiểm sát..."}
          </p>
        </div>

        <form action={handleUpdateSeo} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
              Thẻ Title Website (Khuyến nghị 50–60 ký tự)
            </label>
            <input
              type="text"
              name="seoTitle"
              defaultValue={settings?.seoTitle || ""}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-navy focus:ring-2 focus:ring-navy focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
              Thẻ Meta Description (Khuyến nghị 150–160 ký tự)
            </label>
            <textarea
              name="seoDescription"
              rows={4}
              defaultValue={settings?.seoDescription || ""}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 leading-relaxed focus:ring-2 focus:ring-navy focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-navy hover:bg-navy-dark text-white font-semibold text-xs rounded-lg shadow-sm transition-all"
          >
            Lưu cấu hình SEO
          </button>
        </form>

      </div>

    </div>
  );
}
