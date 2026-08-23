import { getAuthenticatedUser } from "@/lib/auth/session";
import { getPracticeAreas, createPracticeArea, deletePracticeArea } from "@/lib/services/practice-area.service";
import { redirect } from "next/navigation";
import { Scale, Plus, Trash2, Check } from "lucide-react";
import { withTimeout } from "@/lib/db/prisma";

export default async function AdminPracticeAreasPage() {
  const user = await getAuthenticatedUser();
  const siteId = user?.siteId;

  if (!siteId) redirect("/admin/login");

  const practiceAreas = await withTimeout(
    getPracticeAreas(siteId),
    [
      { id: "p1", title: "Dân sự – Hình sự – Hành chính" },
      { id: "p2", title: "Doanh nghiệp – Thương mại – Lao động" },
      { id: "p3", title: "Đất đai – Nhà ở" },
      { id: "p4", title: "Ly hôn – Hôn nhân gia đình" },
      { id: "p5", title: "Hợp đồng – Giao dịch dân sự" },
      { id: "p6", title: "Tư vấn pháp lý thường xuyên cho cá nhân, tổ chức" },
      { id: "p7", title: "Đại diện tham gia tố tụng, giải quyết tranh chấp" },
      { id: "p8", title: "Bào chữa người bị buộc tội, bảo vệ quyền và lợi ích hợp pháp cho đương sự" },
    ] as any,
    800
  );

  async function handleAdd(formData: FormData) {
    "use server";
    const authUser = await getAuthenticatedUser();
    if (!authUser?.siteId) return;

    const title = formData.get("title") as string;

    await createPracticeArea(authUser.siteId, {
      title,
      displayOrder: practiceAreas.length + 1,
      status: "PUBLISHED",
    });

    redirect("/admin/practice-areas");
  }

  async function handleDelete(formData: FormData) {
    "use server";
    const authUser = await getAuthenticatedUser();
    if (!authUser?.siteId) return;

    const id = formData.get("id") as string;
    await deletePracticeArea(id, authUser.siteId);
    redirect("/admin/practice-areas");
  }

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-navy font-serif">Quản lý Lĩnh vực Hoạt động</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Thêm, sửa hoặc xóa các lĩnh vực hành nghề luật sư (Hiển thị dạng Checklist chuẩn với icon tích xanh navy).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Practice Areas List */}
        <div className="md:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <h2 className="text-xs font-bold uppercase text-navy tracking-wider mb-3">
            Danh sách Lĩnh vực ({practiceAreas.length})
          </h2>

          <div className="space-y-3">
            {practiceAreas.map((item, idx) => (
              <div
                key={item.id}
                className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-navy text-white flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{item.title}</span>
                </div>

                <form action={handleDelete}>
                  <input type="hidden" name="id" value={item.id} />
                  <button
                    type="submit"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Xóa lĩnh vực này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>

        {/* Add Form */}
        <div className="md:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <h2 className="text-xs font-bold uppercase text-navy tracking-wider mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-gold" />
            Thêm Lĩnh vực Hoạt động
          </h2>

          <form action={handleAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Tên Lĩnh vực Hành nghề
              </label>
              <input
                type="text"
                name="title"
                placeholder="Ví dụ: Tố tụng Trọng tài Thương mại"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-navy hover:bg-navy-dark text-white font-semibold text-xs rounded-lg shadow-sm transition-all"
            >
              Thêm vào danh sách Checklist
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
