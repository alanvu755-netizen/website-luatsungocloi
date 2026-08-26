import { getAuthenticatedUser } from "@/lib/auth/session";
import { getArticles, deleteArticle } from "@/lib/services/article.service";
import { getMenus } from "@/lib/services/menu.service";
import { getEffectiveSiteId } from "@/lib/services/site.service";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, Plus, Search, Trash2, Edit, Eye } from "lucide-react";

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams?: { page?: string; search?: string; menuId?: string };
}) {
  const user = await getAuthenticatedUser();
  const siteId = await getEffectiveSiteId(user);

  if (!user || !siteId) redirect("/admin/login");

  const currentPage = parseInt(searchParams?.page || "1");
  const search = searchParams?.search || "";
  const menuId = searchParams?.menuId || "";

  let articlesData: any = { articles: [], totalCount: 0, totalPages: 1, currentPage: 1 };
  let menus: any[] = [];

  try {
    const res = await Promise.all([
      getArticles(siteId, {
        page: currentPage,
        pageSize: 10,
        search,
        menuId,
      }),
      getMenus(siteId),
    ]);
    articlesData = res[0] || articlesData;
    menus = res[1] || [];
  } catch (e) {}

  async function handleDelete(formData: FormData) {
    "use server";
    const authUser = await getAuthenticatedUser();
    const targetSiteId = await getEffectiveSiteId(authUser);
    if (!authUser || !targetSiteId) return;

    const id = formData.get("id") as string;
    await deleteArticle(id, targetSiteId);
    redirect("/admin/articles");
  }

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy font-serif flex items-center gap-2">
            <FileText className="w-5 h-5 text-gold" />
            Quản lý Bài viết Content CMS
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý danh sách bài viết tư vấn pháp luật, bài phân tích và tin tức SEO.
          </p>
        </div>
        <Link
          href="/admin/articles/create"
          className="px-4 py-2.5 bg-navy hover:bg-navy-dark text-white font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-gold" />
          Viết Bài mới (Có AI Hỗ trợ)
        </Link>
      </div>

      {/* Articles Table & Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        
        {/* Search & Filter Bar */}
        <form className="flex flex-col sm:flex-row gap-3 items-center justify-between pb-3 border-b border-slate-100">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Tìm kiếm bài viết theo tiêu đề..."
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-navy focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              name="menuId"
              defaultValue={menuId}
              className="px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:ring-2 focus:ring-navy focus:outline-none"
            >
              <option value="">-- Tất cả Menu --</option>
              {menus.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              Lọc
            </button>
          </div>
        </form>

        {/* Table List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[10px] font-bold text-slate-500">
              <tr>
                <th className="py-3 px-4">Tiêu đề bài viết</th>
                <th className="py-3 px-4">Menu / Chuyên mục</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4">Lượt đọc / Chia sẻ</th>
                <th className="py-3 px-4">Ngày tạo</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {articlesData.articles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Chưa có bài viết nào. Hãy bấm nút "Viết Bài mới" để khởi tạo bài viết đầu tiên.
                  </td>
                </tr>
              ) : (
                articlesData.articles.map((art: any) => (
                  <tr key={art.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 text-sm line-clamp-1">{art.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono">/{art.slug}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-navy">{art.menu.title}</span>
                      {art.submenu && (
                        <span className="text-slate-500 font-normal"> → {art.submenu.title}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-full ${
                          art.status === "PUBLISHED"
                            ? "bg-emerald-100 text-emerald-800"
                            : art.status === "DRAFT"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {art.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-slate-600">
                      <div className="flex items-center gap-2">
                        <span title="Lượt đọc">👁️ {art.viewCount || 0}</span>
                        <span className="text-slate-300">•</span>
                        <span title="Lượt chia sẻ">🔗 {art.shareCount || 0}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(art.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link
                        href={`/admin/articles/${art.id}/edit`}
                        className="inline-block p-1.5 rounded-lg text-slate-500 hover:text-navy hover:bg-slate-100"
                        title="Chỉnh sửa bài viết"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>

                      <form
                        action={handleDelete}
                        className="inline-block"
                        onSubmit={(e) => {
                          if (!confirm("⚠️ XÁC NHẬN XÓA: Bạn có chắc chắn muốn xóa bài viết này không?\n\nHành động này sẽ xóa vĩnh viễn bài viết khỏi hệ thống và không thể hoàn tác.")) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <input type="hidden" name="id" value={art.id} />
                        <button
                          type="submit"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Xóa bài viết"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Server-Side Pagination Bar */}
        {articlesData.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
            <span className="text-slate-500">
              Trang {articlesData.currentPage} / {articlesData.totalPages} (Tổng {articlesData.totalCount} bài)
            </span>
            <div className="flex gap-2">
              {articlesData.currentPage > 1 && (
                <Link
                  href={`/admin/articles?page=${articlesData.currentPage - 1}&search=${search}&menuId=${menuId}`}
                  className="px-3 py-1.5 border border-slate-300 rounded-md font-semibold text-slate-700 hover:bg-slate-50"
                >
                  ← Trang trước
                </Link>
              )}
              {articlesData.currentPage < articlesData.totalPages && (
                <Link
                  href={`/admin/articles?page=${articlesData.currentPage + 1}&search=${search}&menuId=${menuId}`}
                  className="px-3 py-1.5 border border-slate-300 rounded-md font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Trang sau →
                </Link>
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
