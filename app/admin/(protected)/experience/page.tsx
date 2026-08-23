import { getAuthenticatedUser } from "@/lib/auth/session";
import { getExperiences, createExperience, deleteExperience } from "@/lib/services/experience.service";
import { redirect } from "next/navigation";
import { Briefcase, Plus, Trash2 } from "lucide-react";

export default async function AdminExperiencePage() {
  const user = await getAuthenticatedUser();
  const siteId = user?.siteId;

  if (!siteId) redirect("/admin/login");

  let experiences: any[] = [];
  try {
    experiences = await getExperiences(siteId);
  } catch (err) {
    console.error("Error fetching experiences for admin:", err);
    experiences = [
      {
        id: "ex1",
        startYear: 2011,
        endYear: 2021,
        position: "Công tác trong ngành Kiểm sát tỉnh Đồng Tháp",
        organization: "Ngành Kiểm sát tỉnh Đồng Tháp",
        highlights: [{ id: "h1", content: "Kiểm sát viên giai đoạn 2017 - 2021" }],
      },
      {
        id: "ex2",
        startYear: 2021,
        endYear: 2025,
        position: "Công tác tại Ban Nội chính Tỉnh ủy Đồng Tháp",
        organization: "Ban Nội chính Tỉnh ủy Đồng Tháp",
        highlights: [{ id: "h2", content: "Chuyên lĩnh vực phòng, chống tham nhũng" }],
      },
      {
        id: "ex3",
        startYear: 2025,
        endYear: 2026,
        position: "Luật sư chuyên nghiệp",
        organization: "Luật sư chuyên nghiệp",
        highlights: [],
      },
    ];
  }

  async function handleAdd(formData: FormData) {
    "use server";
    const authUser = await getAuthenticatedUser();
    if (!authUser?.siteId) return;

    const startYear = parseInt(formData.get("startYear") as string);
    const endYearStr = formData.get("endYear") as string;
    const endYear = endYearStr ? parseInt(endYearStr) : null;
    const position = formData.get("position") as string;
    const organization = formData.get("organization") as string;
    const highlightStr = formData.get("highlight") as string;
    const highlights = highlightStr ? [highlightStr] : [];

    await createExperience(authUser.siteId, {
      startYear,
      endYear,
      position,
      organization,
      highlights,
      displayOrder: experiences.length + 1,
      status: "PUBLISHED",
    });

    redirect("/admin/experience");
  }

  async function handleDelete(formData: FormData) {
    "use server";
    const authUser = await getAuthenticatedUser();
    if (!authUser?.siteId) return;

    const id = formData.get("id") as string;
    await deleteExperience(id, authUser.siteId);
    redirect("/admin/experience");
  }

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-navy font-serif">Quản lý Kinh nghiệm Công tác</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Quản lý timeline quá trình công tác trong ngành Kiểm sát, Nội chính và Luật sư.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Experience Timeline List */}
        <div className="md:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <h2 className="text-xs font-bold uppercase text-navy tracking-wider mb-3">
            Timeline Quá trình Công tác ({experiences.length})
          </h2>

          <div className="space-y-4">
            {experiences.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex items-start justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-navy">
                    {item.startYear} – {item.endYear || "Hiện tại"}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-0.5">{item.position}</h3>
                  <p className="text-xs text-slate-600">{item.organization}</p>
                  {item.highlights.length > 0 && (
                    <ul className="mt-2 text-xs text-slate-500 list-disc pl-4">
                      {item.highlights.map((hl) => (
                        <li key={hl.id}>{hl.content}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <form action={handleDelete}>
                  <input type="hidden" name="id" value={item.id} />
                  <button
                    type="submit"
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Xóa giai đoạn này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>

        {/* Add Experience Form */}
        <div className="md:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <h2 className="text-xs font-bold uppercase text-navy tracking-wider mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-gold" />
            Thêm Giai đoạn Công tác
          </h2>

          <form action={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                  Năm bắt đầu
                </label>
                <input
                  type="number"
                  name="startYear"
                  placeholder="2011"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                  Năm kết thúc
                </label>
                <input
                  type="number"
                  name="endYear"
                  placeholder="2021 (Để trống nếu hiện tại)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Vị trí / Chức vụ công tác
              </label>
              <input
                type="text"
                name="position"
                placeholder="Công tác trong ngành Kiểm sát..."
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Cơ quan / Đơn vị
              </label>
              <input
                type="text"
                name="organization"
                placeholder="Viện Kiểm sát nhân dân..."
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Điểm nổi bật (Ví dụ: Kiểm sát viên 2017-2021)
              </label>
              <input
                type="text"
                name="highlight"
                placeholder="Kiểm sát viên giai đoạn..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-navy hover:bg-navy-dark text-white font-semibold text-xs rounded-lg shadow-sm transition-all"
            >
              Thêm vào timeline công tác
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
