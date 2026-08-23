import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { Shield, Cpu, Key, CheckCircle, AlertTriangle } from "lucide-react";

export default async function SYSADMINAIProviderPage({
  searchParams,
}: {
  searchParams?: { success?: string; error?: string };
}) {
  const user = await getAuthenticatedUser();

  // CRITICAL SECURITY ENFORCEMENT: SYSADMIN ONLY!
  if (!user || user.role.name !== "SYSADMIN") {
    redirect("/admin/dashboard");
  }

  const provider = await prisma.aIProvider.findUnique({
    where: { code: "GEMINI" },
  });

  async function handleUpdateProvider(formData: FormData) {
    "use server";
    const authUser = await getAuthenticatedUser();
    if (!authUser || authUser.role.name !== "SYSADMIN") {
      throw new Error("DENIED: SYSADMIN privilege required");
    }

    const name = formData.get("name") as string;
    const defaultModel = formData.get("defaultModel") as string;
    const apiKey = formData.get("apiKey") as string;
    const status = formData.get("status") === "true";

    const dataToUpdate: any = {
      name,
      defaultModel,
      status,
    };

    // If new API key provided, update credentialRef securely (never store plaintext)
    if (apiKey && apiKey.trim() !== "" && !apiKey.includes("••••")) {
      dataToUpdate.credentialRef = `env:GEMINI_API_KEY`;
    }

    await prisma.aIProvider.update({
      where: { code: "GEMINI" },
      data: dataToUpdate,
    });

    // Record AuditLog
    await prisma.auditLog.create({
      data: {
        adminUserId: authUser.id,
        action: "AI_PROVIDER_UPDATE",
        entityType: "AIProvider",
        entityId: provider?.id,
        metadata: JSON.stringify({ code: "GEMINI", status }),
      },
    });

    redirect("/admin/ai-provider?success=Cập nhật AI Provider thành công");
  }

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] uppercase font-extrabold bg-purple-600 text-white rounded-full">
              SYSADMIN ONLY
            </span>
            <h1 className="text-xl font-bold text-navy font-serif">Quản lý Nhà cung cấp AI (AI Provider)</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Cấu hình cấp nền tảng cho Google Gemini AI Engine. Chỉ tài khoản Quản trị Hệ thống (SYSADMIN) mới có quyền truy cập.
          </p>
        </div>
      </div>

      {searchParams?.success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-3">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{searchParams.success}</span>
        </div>
      )}

      {/* Provider Details Box */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-navy text-gold flex items-center justify-center font-bold">
              <Cpu className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{provider?.name}</h3>
              <p className="text-xs text-slate-400 font-mono">Mã provider: {provider?.code}</p>
            </div>
          </div>

          <span
            className={`px-3 py-1 text-xs font-bold rounded-full ${
              provider?.status ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
            }`}
          >
            ● {provider?.status ? "Hoạt động (Active)" : "Tạm ngưng (Disabled)"}
          </span>
        </div>

        <form action={handleUpdateProvider} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
              Tên Nhà cung cấp
            </label>
            <input
              type="text"
              name="name"
              defaultValue={provider?.name || "Google Gemini AI Provider"}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
              API Credential Key (Bảo mật tuyệt đối - Masked)
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                name="apiKey"
                defaultValue="••••••••••••••••••••••••••••"
                placeholder="Nhập API Key mới nếu muốn thay đổi..."
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Khóa API bí mật được lưu trữ qua biến môi trường bảo mật server. Không bao giờ xuất hiện ở mã client.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Model Mặc định
              </label>
              <input
                type="text"
                name="defaultModel"
                defaultValue={provider?.defaultModel || "gemini-1.5-flash"}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Trạng thái Provider
              </label>
              <select
                name="status"
                defaultValue={String(provider?.status ?? true)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-navy focus:outline-none"
              >
                <option value="true">Bật (Active)</option>
                <option value="false">Tắt (Disabled)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-navy hover:bg-navy-dark text-white font-semibold text-xs rounded-lg shadow-sm transition-all"
          >
            Lưu Cấu hình Platform AI Provider
          </button>
        </form>

      </div>

    </div>
  );
}
