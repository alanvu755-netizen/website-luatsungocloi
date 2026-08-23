import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { updateIntroductionDraft, publishIntroduction } from "@/lib/services/introduction.service";
import { redirect } from "next/navigation";
import { CheckCircle, FileText } from "lucide-react";

export default async function AdminIntroductionPage() {
  const user = await getAuthenticatedUser();
  const siteId = user?.siteId;

  if (!siteId) redirect("/admin/login");

  const intro = await prisma.introduction.findUnique({ where: { siteId } });

  async function handleSaveDraft(formData: FormData) {
    "use server";
    const authUser = await getAuthenticatedUser();
    if (!authUser?.siteId) return;

    const draftTitle = formData.get("draftTitle") as string;
    const draftContent = formData.get("draftContent") as string;

    await updateIntroductionDraft(authUser.siteId, {
      draftTitle,
      draftContent,
    });
    redirect("/admin/introduction");
  }

  async function handlePublish() {
    "use server";
    const authUser = await getAuthenticatedUser();
    if (!authUser?.siteId) return;

    await publishIntroduction(authUser.siteId, authUser.id);
    redirect("/admin/introduction");
  }

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy font-serif">Quản lý Phần Giới thiệu</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Chỉnh sửa đoạn văn giới thiệu tổng quan về Luật sư.
          </p>
        </div>
        <form action={handlePublish}>
          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Xuất bản ra Website Public
          </button>
        </form>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Published Version */}
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-emerald-800 tracking-wider">
              ĐANG XUẤT BẢN (Public)
            </span>
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-600 text-white rounded-full">
              PUBLISHED
            </span>
          </div>
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-navy text-base">{intro?.pubTitle}</h3>
            <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {intro?.pubContent}
            </div>
          </div>
        </div>

        {/* Edit Draft Form */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-navy tracking-wider">
              BẢN NHÁP (Draft)
            </span>
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-500 text-white rounded-full">
              DRAFT
            </span>
          </div>

          <form action={handleSaveDraft} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Tiêu đề phần
              </label>
              <input
                type="text"
                name="draftTitle"
                defaultValue={intro?.draftTitle || "GIỚI THIỆU"}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-navy focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Nội dung Giới thiệu (Tách các đoạn bằng 2 lần xuống dòng)
              </label>
              <textarea
                name="draftContent"
                rows={8}
                defaultValue={intro?.draftContent || ""}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 leading-relaxed focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-navy hover:bg-navy-dark text-white font-semibold text-xs rounded-lg shadow-sm transition-all"
            >
              Lưu bản nháp (Save Draft)
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
