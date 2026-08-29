import { getAuthenticatedUser } from "@/lib/auth/session";
import { getArticles } from "@/lib/services/article.service";
import { getMenus } from "@/lib/services/menu.service";
import { getEffectiveSiteId } from "@/lib/services/site.service";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Newspaper, Plus, Search, Edit, Eye } from "lucide-react";
import DeleteArticleButton from "@/components/admin/DeleteArticleButton";

export default async function AdminNewsPage({
  searchParams,
}: {
  searchParams?: { page?: string; search?: string };
}) {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/admin/login");

  const siteId = await getEffectiveSiteId(user);
  if (!siteId) redirect("/admin/login");

  const currentPage = parseInt(searchParams?.page || "1");
  const search = searchParams?.search || "";

  let newsData: any = { articles: [], totalCount: 0, totalPages: 1, currentPage: 1 };
  let newsMenuId = "";

  try {
    const menus = await getMenus(siteId);
    const newsMenu = menus.find(
      (m: any) => m.slug.toLowerCase() === "tin-tuc" || m.title.toLowerCase().includes("tin tức")
    );
    newsMenuId = newsMenu?.id || "";

    if (newsMenuId) {
      newsData = await getArticles(siteId, {
        page: currentPage,
        pageSize: 10,
        search,
        menuId: newsMenuId,
      });
    } else {
      newsData = await getArticles(siteId, {
        page: currentPage,
        pageSize: 10,
        search,
      });
    }
  } catch (e) {}

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy font-serif flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-gold" />
            Quản lý Bài viết Tin tức (Legal News CMS)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý bài viết tin tức pháp luật, hoạt động luật sư và thông cáo báo chí dành riêng cho Chuyên mục Tin tức.
          </p>
        </div>
        <Link
          href="/admin/news/create"
          className="px-4 py-2.5 bg-navy hover:bg-navy-dark text-white font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-gold" />
          Tạo Tin tức mới (Có AI Hỗ trợ)
        </Link>
      </div>

      {/* News Table & Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        {/* Search Bar */}
        <form className="flex gap-3 items-center justify-between pb-3 border-b border-slate-100">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Tìm kiếm bài viết tin tức..."
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-navy focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xs"
          >
            Tìm kiếm
          </button>
        </form>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                <th className="py-3 px-4">Bài viết tin tức</th>
                <th className="py-3 px-4">Chuyên mục</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4">Lượt xem</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {newsData.articles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Chưa có bài viết tin tức nào. Hãy bấm &quot;Tạo Tin tức mới&quot; để bắt đầu.
                  </td>
                </tr>
              ) : (
                newsData.articles.map((article: any) => (
                  <tr key={article.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800 line-clamp-1">{article.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Slug: /{article.slug} • Ngày tạo: {new Date(article.createdAt).toLocaleDateString("vi-VN")}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-700 font-semibold text-[10px] rounded">
                        {article.menu?.title || "Tin tức"}
                      </span>
                      {article.submenu && (
                        <div className="text-[10px] text-slate-500 mt-0.5">› {article.submenu.title}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          article.status === "PUBLISHED"
                            ? "bg-emerald-100 text-emerald-800"
                            : article.status === "DRAFT"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {article.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-600">
                      {article.viewCount || 0}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      <Link
                        href={`/tin-tuc/${article.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-navy hover:bg-slate-100 transition-colors inline-block"
                        title="Xem bài viết tin tức công khai"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/news/${article.id}/edit`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-navy hover:bg-slate-100 transition-colors inline-block"
                        title="Chỉnh sửa tin tức"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeleteArticleButton id={article.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {newsData.totalPages > 1 && (
          <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-500">
              Trang {newsData.currentPage} / {newsData.totalPages} (Tổng {newsData.totalCount} tin tức)
            </span>
            <div className="flex gap-2">
              {newsData.currentPage > 1 && (
                <Link
                  href={`/admin/news?page=${newsData.currentPage - 1}&search=${search}`}
                  className="px-3 py-1 bg-slate-100 text-slate-700 rounded hover:bg-slate-200"
                >
                  Trang trước
                </Link>
              )}
              {newsData.currentPage < newsData.totalPages && (
                <Link
                  href={`/admin/news?page=${newsData.currentPage + 1}&search=${search}`}
                  className="px-3 py-1 bg-slate-100 text-slate-700 rounded hover:bg-slate-200"
                >
                  Trang sau
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
