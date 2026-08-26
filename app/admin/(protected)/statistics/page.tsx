import { getAuthenticatedUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { getAllStatistics, updateStatisticItem, createStatisticItem } from "@/lib/services/statistic.service";
import { CheckCircle, BarChart3, Plus, Hash } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminStatisticsPage({
  searchParams,
}: {
  searchParams?: { success?: string; error?: string };
}) {
  const user = await getAuthenticatedUser();
  const siteId = user?.siteId;

  if (!siteId) redirect("/admin/login");

  const items = await getAllStatistics(siteId);

  async function handleUpdateStatistic(formData: FormData) {
    "use server";
    const authUser = await getAuthenticatedUser();
    if (!authUser?.siteId) redirect("/admin/login");

    const id = formData.get("id") as string;
    const value = (formData.get("value") as string || "").trim();
    const label = (formData.get("label") as string || "").trim();
    const subtext = (formData.get("subtext") as string || "").trim();
    const displayOrder = parseInt(formData.get("displayOrder") as string || "0", 10);
    const status = formData.get("status") === "true";

    if (!id || !value || !label) {
      redirect("/admin/statistics?error=Vui lòng nhập đầy đủ Con số và Nhãn chỉ số");
    }

    await updateStatisticItem(id, authUser.siteId, {
      value,
      label,
      subtext: subtext || null,
      displayOrder,
      status,
    });

    revalidatePath("/");
    revalidatePath("/admin/statistics");
    redirect("/admin/statistics?success=Cập nhật chỉ số thành công");
  }

  async function handleCreateStatistic(formData: FormData) {
    "use server";
    const authUser = await getAuthenticatedUser();
    if (!authUser?.siteId) redirect("/admin/login");

    const value = (formData.get("value") as string || "").trim();
    const label = (formData.get("label") as string || "").trim();
    const subtext = (formData.get("subtext") as string || "").trim();
    const displayOrder = parseInt(formData.get("displayOrder") as string || "0", 10);

    if (!value || !label) {
      redirect("/admin/statistics?error=Vui lòng nhập đầy đủ Con số và Nhãn chỉ số mới");
    }

    await createStatisticItem(authUser.siteId, {
      value,
      label,
      subtext: subtext || null,
      displayOrder,
      status: true,
    });

    revalidatePath("/");
    revalidatePath("/admin/statistics");
    redirect("/admin/statistics?success=Thêm chỉ số mới thành công");
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-navy font-serif flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-gold" />
          Quản lý Chỉ số Nổi bật (4 Stat Items)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Quản lý các con số ấn tượng hiển thị trên trang chủ (Ví dụ: 800+, 500+, 10+, 100%). Dữ liệu lưu CSDL và được đồng bộ động.
        </p>
      </div>

      {searchParams?.success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-3">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{searchParams.success}</span>
        </div>
      )}

      {searchParams?.error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
          <span>⚠️ {searchParams.error}</span>
        </div>
      )}

      {/* List Existing Items */}
      <div className="space-y-4">
        {items.map((item, idx) => (
          <form key={item.id} action={handleUpdateStatistic} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <input type="hidden" name="id" defaultValue={item.id} />
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-gold" /> Chỉ số #{idx + 1} ({item.value})
              </span>
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-600 font-medium">Trạng thái:</label>
                <select
                  name="status"
                  defaultValue={item.status ? "true" : "false"}
                  className="text-xs font-semibold px-2 py-1 border border-slate-300 rounded-md focus:ring-1 focus:ring-navy"
                >
                  <option value="true">Hiển thị (ON)</option>
                  <option value="false">Ẩn (OFF)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                  Con số Nổi bật (Value) *
                </label>
                <input
                  type="text"
                  name="value"
                  defaultValue={item.value}
                  required
                  placeholder="e.g. 800+"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-navy focus:ring-2 focus:ring-navy focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                  Nhãn chỉ số (Label) *
                </label>
                <input
                  type="text"
                  name="label"
                  defaultValue={item.label}
                  required
                  placeholder="e.g. Vụ án & Hợp đồng"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-navy focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                  Thứ tự hiển thị (Order)
                </label>
                <input
                  type="number"
                  name="displayOrder"
                  defaultValue={item.displayOrder}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-navy focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Mô tả chi tiết phụ (Subtext / Option)
              </label>
              <input
                type="text"
                name="subtext"
                defaultValue={item.subtext || ""}
                placeholder="e.g. Đã thực hiện thành công"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-navy hover:bg-navy-dark text-white font-semibold text-xs rounded-lg shadow-sm transition-all"
              >
                Cập nhật chỉ số #{idx + 1}
              </button>
            </div>
          </form>
        ))}
      </div>

      {/* Add New Item Form */}
      <div className="bg-slate-50 border border-slate-300 border-dashed rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-navy flex items-center gap-2">
          <Plus className="w-4 h-4 text-gold" /> Thêm chỉ số nổi bật mới
        </h3>
        <form action={handleCreateStatistic} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Con số *</label>
              <input type="text" name="value" required placeholder="e.g. 50+" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Nhãn chỉ số *</label>
              <input type="text" name="label" required placeholder="e.g. Đối tác doanh nghiệp" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Thứ tự (Order)</label>
              <input type="number" name="displayOrder" defaultValue={items.length + 1} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Mô tả phụ</label>
            <input type="text" name="subtext" placeholder="e.g. Đồng hành dài hạn" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white" />
          </div>
          <button type="submit" className="px-4 py-2 bg-gold hover:bg-gold-dark text-white font-bold text-xs rounded-lg transition-all">
            + Tạo chỉ số mới
          </button>
        </form>
      </div>
    </div>
  );
}
