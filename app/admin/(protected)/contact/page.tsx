import { getAuthenticatedUser } from "@/lib/auth/session";
import { getContactChannels, updateContactChannel, toggleContactChannelStatus } from "@/lib/services/contact-channel.service";
import { redirect } from "next/navigation";
import { PhoneCall, CheckCircle2, AlertCircle, Globe } from "lucide-react";

export default async function AdminContactPage({
  searchParams,
}: {
  searchParams?: { error?: string; success?: string };
}) {
  const user = await getAuthenticatedUser();
  const siteId = user?.siteId;

  if (!siteId) redirect("/admin/login");

  const channels = await getContactChannels(siteId);

  async function handleToggle(formData: FormData) {
    "use server";
    const authUser = await getAuthenticatedUser();
    if (!authUser?.siteId) return;

    const id = formData.get("id") as string;
    const currentStatus = formData.get("currentStatus") === "true";
    const newStatus = !currentStatus;

    try {
      await toggleContactChannelStatus(id, authUser.siteId, newStatus);
      redirect("/admin/contact?success=Cập nhật trạng thái thành công");
    } catch (err: any) {
      const msg = encodeURIComponent(err.message || "Lỗi cập nhật kênh liên hệ");
      redirect(`/admin/contact?error=${msg}`);
    }
  }

  async function handleUpdateChannel(formData: FormData) {
    "use server";
    const authUser = await getAuthenticatedUser();
    if (!authUser?.siteId) return;

    const id = formData.get("id") as string;
    const url = formData.get("url") as string;
    const label = formData.get("label") as string;
    const status = formData.get("status") === "on";

    try {
      await updateContactChannel(id, authUser.siteId, {
        label,
        url,
        status,
      });
      redirect("/admin/contact?success=Cập nhật kênh liên hệ thành công");
    } catch (err: any) {
      const msg = encodeURIComponent(err.message || "Lỗi cập nhật kênh liên hệ");
      redirect(`/admin/contact?error=${msg}`);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-navy font-serif">Quản lý Kênh liên hệ (Zalo, Telegram, Facebook)</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Cấu hình Bật (ON) hoặc Tắt (OFF) từng kênh liên hệ. Khi BẬT, bắt buộc phải có URL hợp lệ.
        </p>
      </div>

      {/* Error & Success Feedback Banners */}
      {searchParams?.error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{searchParams.error}</span>
        </div>
      )}

      {searchParams?.success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{searchParams.success}</span>
        </div>
      )}

      {/* Contact Channels Grid */}
      <div className="space-y-4">
        {channels.map((ch) => (
          <div
            key={ch.id}
            className={`bg-white border rounded-xl p-5 shadow-xs transition-all ${
              ch.status ? "border-emerald-300 ring-1 ring-emerald-200" : "border-slate-200"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                    ch.status ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {ch.platform.substring(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">{ch.label}</h3>
                    <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {ch.platform}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Trạng thái hiện tại:{" "}
                    <strong className={ch.status ? "text-emerald-600" : "text-slate-500"}>
                      {ch.status ? "BẬT (ON)" : "TẮT (OFF)"}
                    </strong>
                  </p>
                </div>
              </div>

              {/* Quick Toggle Button */}
              <form action={handleToggle}>
                <input type="hidden" name="id" value={ch.id} />
                <input type="hidden" name="currentStatus" value={String(ch.status)} />
                <button
                  type="submit"
                  className={`px-4 py-2 text-xs font-bold rounded-lg shadow-xs transition-all ${
                    ch.status
                      ? "bg-slate-200 hover:bg-slate-300 text-slate-800"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  }`}
                >
                  {ch.status ? "Tắt (OFF)" : "Bật (ON)"}
                </button>
              </form>
            </div>

            {/* Detailed Update Form */}
            <form action={handleUpdateChannel} className="space-y-4">
              <input type="hidden" name="id" value={ch.id} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Nhãn hiển thị
                  </label>
                  <input
                    type="text"
                    name="label"
                    defaultValue={ch.label}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Đường dẫn URL ({ch.platform})
                  </label>
                  <input
                    type="url"
                    name="url"
                    defaultValue={ch.url}
                    placeholder={`https://${ch.platform.toLowerCase()}.me/...`}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    name="status"
                    defaultChecked={ch.status}
                    className="w-4 h-4 rounded text-navy focus:ring-navy"
                  />
                  <span>Bật hiển thị kênh này trên Public Website</span>
                </label>

                <button
                  type="submit"
                  className="px-4 py-2 bg-navy hover:bg-navy-dark text-white font-semibold text-xs rounded-lg shadow-sm transition-all"
                >
                  Lưu thay đổi kênh
                </button>
              </div>
            </form>
          </div>
        ))}
      </div>

    </div>
  );
}
