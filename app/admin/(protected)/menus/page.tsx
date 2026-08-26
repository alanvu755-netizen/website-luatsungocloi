import { getAuthenticatedUser } from "@/lib/auth/session";
import { getMenus, createMenu, updateMenu, deleteMenu, createSubmenu, deleteSubmenu, MAX_SUBMENU_PER_MENU } from "@/lib/services/menu.service";
import { getEffectiveSiteId } from "@/lib/services/site.service";
import { redirect } from "next/navigation";
import { FolderTree, Plus, Trash2, Eye, EyeOff, AlertCircle } from "lucide-react";

export default async function AdminMenusPage({
  searchParams,
}: {
  searchParams?: { error?: string; success?: string };
}) {
  const user = await getAuthenticatedUser();
  const siteId = await getEffectiveSiteId(user);

  if (!user || !siteId) redirect("/admin/login");

  const menus = await getMenus(siteId);

  async function handleAddMenu(formData: FormData) {
    "use server";
    const authUser = await getAuthenticatedUser();
    const targetSiteId = await getEffectiveSiteId(authUser);
    if (!authUser || !targetSiteId) return;

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;

    try {
      await createMenu(targetSiteId, {
        title,
        slug,
        displayOrder: menus.length + 1,
        status: "VISIBLE",
      });
    } catch (err: any) {
      if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
      redirect(`/admin/menus?error=${encodeURIComponent(err.message)}`);
    }
    redirect("/admin/menus");
  }

  async function handleToggleMenuStatus(formData: FormData) {
    "use server";
    const authUser = await getAuthenticatedUser();
    const targetSiteId = await getEffectiveSiteId(authUser);
    if (!authUser || !targetSiteId) return;

    const id = formData.get("id") as string;
    const currentStatus = formData.get("currentStatus") as string;
    const newStatus = currentStatus === "VISIBLE" ? "HIDDEN" : "VISIBLE";

    await updateMenu(id, targetSiteId, { status: newStatus });
    redirect("/admin/menus");
  }

  async function handleDeleteMenu(formData: FormData) {
    "use server";
    const authUser = await getAuthenticatedUser();
    const targetSiteId = await getEffectiveSiteId(authUser);
    if (!authUser || !targetSiteId) return;

    const id = formData.get("id") as string;
    await deleteMenu(id, targetSiteId);
    redirect("/admin/menus");
  }

  async function handleAddSubmenu(formData: FormData) {
    "use server";
    const authUser = await getAuthenticatedUser();
    const targetSiteId = await getEffectiveSiteId(authUser);
    if (!authUser || !targetSiteId) return;

    const menuId = formData.get("menuId") as string;
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;

    try {
      await createSubmenu(targetSiteId, menuId, {
        title,
        slug,
        status: "VISIBLE",
      });
    } catch (err: any) {
      if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
      redirect(`/admin/menus?error=${encodeURIComponent(err.message)}`);
    }
    redirect("/admin/menus");
  }

  async function handleDeleteSubmenu(formData: FormData) {
    "use server";
    const authUser = await getAuthenticatedUser();
    const targetSiteId = await getEffectiveSiteId(authUser);
    if (!authUser || !targetSiteId) return;

    const id = formData.get("id") as string;
    await deleteSubmenu(id, targetSiteId);
    redirect("/admin/menus");
  }

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-navy font-serif flex items-center gap-2">
          <FolderTree className="w-5 h-5 text-gold" />
          Quản lý Dynamic Menu & Chuyên mục
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Tạo và quản lý danh mục Menu, Chuyên mục con (Tối đa 5 Chuyên mục / Menu) và trạng thái Hiển thị / Ẩn.
        </p>
      </div>

      {searchParams?.error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{searchParams.error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Menu & Submenu List */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-xs font-bold uppercase text-navy tracking-wider">
            Danh sách Menu ({menus.length})
          </h2>

          <div className="space-y-4">
            {menus.map((menu) => {
              const isMaxSubmenuReached = menu.submenus.length >= MAX_SUBMENU_PER_MENU;

              return (
                <div key={menu.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                  
                  {/* Menu Row */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base">{menu.title}</h3>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                            menu.status === "VISIBLE"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {menu.status === "VISIBLE" ? "Hiển thị" : "Ẩn"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">/{menu.slug}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <form action={handleToggleMenuStatus}>
                        <input type="hidden" name="id" value={menu.id} />
                        <input type="hidden" name="currentStatus" value={menu.status} />
                        <button
                          type="submit"
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                          title={menu.status === "VISIBLE" ? "Ẩn Menu" : "Hiển thị Menu"}
                        >
                          {menu.status === "VISIBLE" ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                        </button>
                      </form>

                      <form action={handleDeleteMenu}>
                        <input type="hidden" name="id" value={menu.id} />
                        <button
                          type="submit"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Xóa Menu"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Submenus (Chuyên mục) Section */}
                  <div className="pl-4 border-l-2 border-slate-200 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
                      <span>Chuyên mục ({menu.submenus.length}/{MAX_SUBMENU_PER_MENU})</span>
                      {isMaxSubmenuReached && (
                        <span className="text-amber-600 text-[11px] normal-case font-medium">
                          Menu này đã có tối đa 5 chuyên mục.
                        </span>
                      )}
                    </div>

                    {menu.submenus.map((sub) => (
                      <div key={sub.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold text-slate-800">{sub.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono ml-2">/{sub.slug}</span>
                        </div>
                        <form action={handleDeleteSubmenu}>
                          <input type="hidden" name="id" value={sub.id} />
                          <button type="submit" className="text-slate-400 hover:text-red-600">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      </div>
                    ))}

                    {/* Add Submenu Form */}
                    <form action={handleAddSubmenu} className="pt-2 flex items-center gap-2">
                      <input type="hidden" name="menuId" value={menu.id} />
                      <input
                        type="text"
                        name="title"
                        placeholder="Tên chuyên mục mới"
                        disabled={isMaxSubmenuReached}
                        required
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-navy focus:outline-none disabled:bg-slate-100"
                      />
                      <input
                        type="text"
                        name="slug"
                        placeholder="slug (vd: dat-dai)"
                        disabled={isMaxSubmenuReached}
                        required
                        className="w-32 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-navy focus:outline-none disabled:bg-slate-100"
                      />
                      <button
                        type="submit"
                        disabled={isMaxSubmenuReached}
                        className="px-3 py-1.5 bg-navy hover:bg-navy-dark text-white font-semibold text-xs rounded-lg shadow-xs disabled:opacity-40"
                      >
                        + Thêm
                      </button>
                    </form>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Create Main Menu Form */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs h-fit">
          <h2 className="text-xs font-bold uppercase text-navy tracking-wider mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-gold" />
            Tạo Menu Mới
          </h2>

          <form action={handleAddMenu} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Tên Menu (Hiển thị)
              </label>
              <input
                type="text"
                name="title"
                placeholder="Ví dụ: Thư viện pháp luật"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Đường dẫn Slug
              </label>
              <input
                type="text"
                name="slug"
                placeholder="thu-vien-phap-luat"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-navy hover:bg-navy-dark text-white font-semibold text-xs rounded-lg shadow-sm transition-all"
            >
              Tạo Menu Mới
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
