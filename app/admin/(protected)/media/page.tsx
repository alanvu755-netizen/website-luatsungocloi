import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { Image as ImageIcon, Upload } from "lucide-react";

export default async function AdminMediaPage() {
  const user = await getAuthenticatedUser();
  const siteId = user?.siteId;

  if (!siteId) redirect("/admin/login");

  const mediaList = await prisma.media.findMany({
    where: { siteId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl font-bold text-navy font-serif">Thư viện Ảnh (Media Library)</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Quản lý tệp tin hình ảnh chân dung, logo và các tư liệu hình ảnh của Luật sư.
        </p>
      </div>

      {/* Media Grid */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <span className="text-xs font-bold uppercase text-navy">
            Danh sách tệp tin ({mediaList.length})
          </span>
          <button className="px-4 py-2 bg-navy hover:bg-navy-dark text-white font-semibold text-xs rounded-lg shadow-sm flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Tải ảnh mới lên
          </button>
        </div>

        {mediaList.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">Chưa có hình ảnh nào được tải lên.</p>
            <p className="text-xs text-slate-400 mt-1">Ảnh đại diện mặc định từ `customer-reference.png` được sử dụng.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {mediaList.map((item) => (
              <div key={item.id} className="border border-slate-200 rounded-lg overflow-hidden group">
                <div className="aspect-square bg-slate-100 relative">
                  <img src={item.url} alt={item.alt || item.fileName} className="object-cover w-full h-full" />
                </div>
                <div className="p-2 text-xs truncate font-medium text-slate-700">
                  {item.originalName}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
