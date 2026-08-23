import { getAuthenticatedUser } from "@/lib/auth/session";
import { getEducations, createEducation, deleteEducation } from "@/lib/services/education.service";
import { redirect } from "next/navigation";
import { GraduationCap, Plus, Trash2 } from "lucide-react";

export default async function AdminEducationPage() {
  const user = await getAuthenticatedUser();
  const siteId = user?.siteId;

  if (!siteId) redirect("/admin/login");

  let educations: any[] = [];
  try {
    educations = await getEducations(siteId);
  } catch (err) {
    console.error("Error fetching educations for admin:", err);
    educations = [
      { id: "e1", degree: "Cử nhân Luật", institution: "Đại học Cần Thơ" },
      { id: "e2", degree: "Thạc sĩ Luật", institution: "Đại học Luật Thành phố Hồ Chí Minh" },
    ];
  }

  async function handleAdd(formData: FormData) {
    "use server";
    const authUser = await getAuthenticatedUser();
    if (!authUser?.siteId) return;

    const degree = formData.get("degree") as string;
    const institution = formData.get("institution") as string;

    await createEducation(authUser.siteId, {
      degree,
      institution,
      displayOrder: educations.length + 1,
      status: "PUBLISHED",
    });

    redirect("/admin/education");
  }

  async function handleDelete(formData: FormData) {
    "use server";
    const authUser = await getAuthenticatedUser();
    if (!authUser?.siteId) return;

    const id = formData.get("id") as string;
    await deleteEducation(id, authUser.siteId);
    redirect("/admin/education");
  }

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-navy font-serif">Quản lý Học vấn</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Thêm, chỉnh sửa hoặc xóa danh sách bằng cấp học vấn của Luật sư.
        </p>
      </div>

      {/* Grid: List vs Add Form */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* List of Education Items */}
        <div className="md:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <h2 className="text-xs font-bold uppercase text-navy tracking-wider mb-3">
            Danh sách Học vấn ({educations.length})
          </h2>

          <div className="space-y-3">
            {educations.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-navy bg-navy/10 px-2 py-0.5 rounded-md">
                    Thứ tự #{idx + 1}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-1">{item.degree}</h3>
                  <p className="text-xs text-slate-600">{item.institution}</p>
                </div>

                <form action={handleDelete}>
                  <input type="hidden" name="id" value={item.id} />
                  <button
                    type="submit"
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Xóa bằng cấp này"
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
            Thêm Học vấn Mới
          </h2>

          <form action={handleAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Tên bằng cấp / Trình độ
              </label>
              <input
                type="text"
                name="degree"
                placeholder="Ví dụ: Tiến sĩ Luật"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Tên Trường / Đơn vị Đào tạo
              </label>
              <input
                type="text"
                name="institution"
                placeholder="Ví dụ: Đại học Luật Hà Nội"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-navy hover:bg-navy-dark text-white font-semibold text-xs rounded-lg shadow-sm transition-all"
            >
              Thêm bằng cấp vào danh sách
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
