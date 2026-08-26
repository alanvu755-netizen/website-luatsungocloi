import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PhoneCall, Calendar, User, Mail, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";

export default async function AdminConsultationsPage({
  searchParams,
}: {
  searchParams: { page?: string; q?: string };
}) {
  const user = await getAuthenticatedUser();
  const siteId = user?.siteId;

  if (!siteId) redirect("/admin/login");

  const page = Math.max(1, parseInt(searchParams.page || "1", 10));
  const pageSize = 10;
  const query = searchParams.q || "";

  const whereClause: any = { siteId };
  if (query) {
    whereClause.OR = [
      { fullName: { contains: query, mode: "insensitive" } },
      { phone: { contains: query } },
      { email: { contains: query, mode: "insensitive" } },
    ];
  }

  const [totalCount, leads] = await Promise.all([
    prisma.consultationLead.count({ where: whereClause }),
    prisma.consultationLead.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy font-serif flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-gold" />
            Khách hàng đăng ký tư vấn (`ConsultationLeads`)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tổng số yêu cầu tư vấn đã tiếp nhận: <strong className="text-navy font-bold">{totalCount}</strong> lượt đăng ký.
          </p>
        </div>

        {/* Search Input Form */}
        <form method="GET" className="flex items-center gap-2">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Tìm theo Tên hoặc SĐT..."
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs w-56 focus:ring-2 focus:ring-navy focus:outline-none"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-navy hover:bg-navy-dark text-white rounded-lg text-xs font-semibold"
          >
            Tìm kiếm
          </button>
        </form>
      </div>

      {leads.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3 shadow-xs">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-semibold text-slate-700">Chưa có yêu cầu tư vấn nào</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Khi khách hàng điền Form Đăng ký Tư vấn trên Website, thông tin sẽ được lưu trực tiếp tại đây và tự động gửi thông báo qua Email Admin.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-navy font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5">Họ và tên</th>
                  <th className="px-4 py-3.5">Số điện thoại</th>
                  <th className="px-4 py-3.5">Email</th>
                  <th className="px-4 py-3.5">Nội dung tư vấn</th>
                  <th className="px-4 py-3.5">Thời gian gửi</th>
                  <th className="px-4 py-3.5 text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-4 font-bold text-navy whitespace-nowrap flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      {lead.fullName}
                    </td>
                    <td className="px-4 py-4 font-bold text-navy whitespace-nowrap">
                      <a href={`tel:${lead.phone}`} className="hover:text-gold hover:underline flex items-center gap-1.5">
                        <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                        {lead.phone}
                      </a>
                    </td>
                    <td className="px-4 py-4 text-slate-600 whitespace-nowrap">
                      {lead.email ? (
                        <a href={`mailto:${lead.email}`} className="hover:underline flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {lead.email}
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">(Không cung cấp)</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-slate-800 font-medium max-w-xs sm:max-w-md">
                      <p className="line-clamp-3 whitespace-pre-wrap">{lead.content}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-500 whitespace-nowrap flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(lead.createdAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="px-4 py-4 text-right whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {lead.status || "NEW"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50">
              <span className="text-xs text-slate-500">
                Trang <strong>{page}</strong> / <strong>{totalPages}</strong> (Hiển thị 10/trang)
              </span>

              <div className="flex items-center gap-2">
                {page > 1 ? (
                  <Link
                    href={`/admin/consultations?page=${page - 1}${query ? `&q=${query}` : ""}`}
                    className="p-1.5 border border-slate-300 rounded hover:bg-white text-slate-700"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Link>
                ) : (
                  <span className="p-1.5 border border-slate-200 rounded text-slate-300 cursor-not-allowed">
                    <ChevronLeft className="w-4 h-4" />
                  </span>
                )}

                {page < totalPages ? (
                  <Link
                    href={`/admin/consultations?page=${page + 1}${query ? `&q=${query}` : ""}`}
                    className="p-1.5 border border-slate-300 rounded hover:bg-white text-slate-700"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <span className="p-1.5 border border-slate-200 rounded text-slate-300 cursor-not-allowed">
                    <ChevronRight className="w-4 h-4" />
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
