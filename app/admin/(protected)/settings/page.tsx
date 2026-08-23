import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { Settings, CheckCircle } from "lucide-react";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams?: { success?: string };
}) {
  const user = await getAuthenticatedUser();
  const siteId = user?.siteId;

  if (!siteId) redirect("/admin/login");

  const settings = await prisma.siteSettings.findUnique({ where: { siteId } });

  async function handleUpdateSettings(formData: FormData) {
    "use server";
    const authUser = await getAuthenticatedUser();
    if (!authUser?.siteId) return;

    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const address = formData.get("address") as string;
    const floatingContactEnabled = formData.get("floatingContactEnabled") === "on";

    await prisma.siteSettings.update({
      where: { siteId: authUser.siteId },
      data: {
        phone,
        email,
        address,
        floatingContactEnabled,
      },
    });

    redirect("/admin/settings?success=Cập nhật cài đặt chung thành công");
  }

  return (
    <div className="space-y-6 max-w-3xl">
      
      <div>
        <h1 className="text-xl font-bold text-navy font-serif">Cài đặt Chung & Thông tin Trụ sở</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Quản lý thông tin địa chỉ, số điện thoại hotline và bật/tắt thanh liên hệ nổi mobile.
        </p>
      </div>

      {searchParams?.success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-3">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{searchParams.success}</span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <form action={handleUpdateSettings} className="space-y-5">
          
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
              Số điện thoại Hotline
            </label>
            <input
              type="text"
              name="phone"
              defaultValue={settings?.phone || "0902 081 061"}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-navy focus:ring-2 focus:ring-navy focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
              Email Liên hệ
            </label>
            <input
              type="email"
              name="email"
              defaultValue={settings?.email || "luatsuloi@gmail.com"}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
              Địa chỉ trụ sở
            </label>
            <textarea
              name="address"
              rows={3}
              defaultValue={settings?.address || ""}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 leading-relaxed focus:ring-2 focus:ring-navy focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100">
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <input
                type="checkbox"
                name="floatingContactEnabled"
                defaultChecked={settings?.floatingContactEnabled ?? true}
                className="w-4 h-4 rounded text-navy focus:ring-navy"
              />
              <div>
                <span className="text-xs font-bold text-navy block">
                  Bật Thanh Liên hệ Nổi (Floating Contact Bar) trên Mobile
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Khi bật, các nút gọi nhanh và kênh liên hệ đang ON sẽ xuất hiện ở góc màn hình mobile.
                </span>
              </div>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-navy hover:bg-navy-dark text-white font-semibold text-xs rounded-lg shadow-sm transition-all"
          >
            Lưu cài đặt chung
          </button>
        </form>
      </div>

    </div>
  );
}
