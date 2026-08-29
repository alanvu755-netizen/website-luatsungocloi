"use client";

import { useState, useEffect } from "react";
import { Scale, Plus, Trash2, Edit, CheckCircle, AlertCircle, Eye, EyeOff, Save, Home, Users, FileText, Building2, Shield } from "lucide-react";

interface PracticeArea {
  id: string;
  title: string;
  description?: string | null;
  icon?: string | null;
  displayOrder: number;
  status: "PUBLISHED" | "DRAFT" | "HIDDEN";
}

const ICON_OPTIONS = [
  { value: "Home", label: "🏠 Đất đai - Nhà ở (Home)" },
  { value: "Users", label: "👥 Hôn nhân - Gia đình (Users)" },
  { value: "FileText", label: "📄 Dân sự - Hợp đồng (FileText)" },
  { value: "Scale", label: "⚖️ Tranh tụng tại Tòa (Scale)" },
  { value: "Building2", label: "🏢 Doanh nghiệp (Building2)" },
  { value: "Shield", label: "🛡️ Hình sự - Hành chính (Shield)" },
];

export default function AdminPracticeAreasPage() {
  const [practiceAreas, setPracticeAreas] = useState<PracticeArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formIcon, setFormIcon] = useState("Home");
  const [formOrder, setFormOrder] = useState(0);
  const [formStatus, setFormStatus] = useState<"PUBLISHED" | "DRAFT" | "HIDDEN">("PUBLISHED");

  const fetchPracticeAreas = async () => {
    try {
      const res = await fetch("/api/admin/practice-areas");
      const data = await res.json();
      if (data.practiceAreas) {
        setPracticeAreas(data.practiceAreas);
      }
    } catch (e) {
      setFeedback({ type: "error", message: "Không thể tải danh sách Lĩnh vực hoạt động." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPracticeAreas();
  }, []);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormTitle("");
    setFormDesc("");
    setFormIcon("Home");
    setFormOrder(practiceAreas.length + 1);
    setFormStatus("PUBLISHED");
  };

  const handleOpenEdit = (item: PracticeArea) => {
    setIsEditing(true);
    setEditingId(item.id);
    setFormTitle(item.title);
    setFormDesc(item.description || "");
    setFormIcon(item.icon || "Home");
    setFormOrder(item.displayOrder);
    setFormStatus(item.status);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFeedback({ type: "error", message: "Tiêu đề lĩnh vực không được để trống." });
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      const url = isEditing
        ? `/api/admin/practice-areas/${editingId}`
        : "/api/admin/practice-areas";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          description: formDesc,
          icon: formIcon,
          displayOrder: formOrder,
          status: formStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lỗi lưu Lĩnh vực hoạt động.");

      setFeedback({
        type: "success",
        message: isEditing
          ? "✓ Cập nhật Lĩnh vực hoạt động thành công!"
          : "✓ Thêm Lĩnh vực hoạt động mới thành công!",
      });

      handleOpenCreate();
      fetchPracticeAreas();
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Đã xảy ra lỗi khi lưu." });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (item: PracticeArea) => {
    const nextStatus = item.status === "PUBLISHED" ? "HIDDEN" : "PUBLISHED";
    try {
      const res = await fetch(`/api/admin/practice-areas/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        fetchPracticeAreas();
      }
    } catch (e) {}
  };

  const handleDelete = async (id: string, title: string) => {
    if (
      !confirm(
        `⚠️ XÁC NHẬN XÓA LĨNH VỰC HOẠT ĐỘNG:\n\nBạn có chắc chắn muốn xóa Lĩnh vực "${title}" khỏi hệ thống không?\n\nHành động này sẽ xóa hoàn toàn khỏi danh sách và không thể hoàn tác.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/practice-areas/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: "success", message: `✓ Đã xóa Lĩnh vực "${title}" thành công.` });
        if (editingId === id) handleOpenCreate();
        fetchPracticeAreas();
      } else {
        throw new Error(data.message || "Lỗi xóa Lĩnh vực hoạt động.");
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Không thể xóa Lĩnh vực hoạt động." });
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Đang tải danh sách Lĩnh vực hoạt động...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-navy font-serif flex items-center gap-2">
            <Scale className="w-5 h-5 text-gold" />
            Quản lý Lĩnh vực Hoạt động (Practice Areas)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý danh sách các Lĩnh vực tư vấn pháp lý chuyên sâu hiển thị trên Trang chủ & Trang chuyên mục Lĩnh vực hoạt động.
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-3 border ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold"
              : "bg-red-50 border-red-200 text-red-700 font-semibold"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Practice Areas List Table */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase text-navy tracking-wider">
                Danh sách Lĩnh vực ({practiceAreas.length})
              </h2>
              <button
                type="button"
                onClick={handleOpenCreate}
                className="px-3 py-1.5 bg-navy hover:bg-navy-dark text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 text-gold" />
                Thêm mới
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {practiceAreas.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  Chưa có Lĩnh vực hoạt động nào trong CSDL.
                </div>
              ) : (
                practiceAreas.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 transition-colors flex items-start justify-between gap-3 ${
                      editingId === item.id ? "bg-amber-50/60 border-l-4 border-gold" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-mono text-[10px] font-bold rounded">
                          #{item.displayOrder}
                        </span>
                        <h3 className="text-xs font-bold text-navy uppercase tracking-tight">{item.title}</h3>
                        <span
                          className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full ${
                            item.status === "PUBLISHED"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-[11px] text-slate-600 font-light line-clamp-2">{item.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title={item.status === "PUBLISHED" ? "Ẩn Lĩnh vực" : "Hiện Lĩnh vực"}
                      >
                        {item.status === "PUBLISHED" ? (
                          <Eye className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-navy hover:bg-slate-100 transition-colors"
                        title="Chỉnh sửa Lĩnh vực"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Xóa Lĩnh vực (Có hỏi xác nhận)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Create / Edit Form */}
        <div className="md:col-span-5">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 sticky top-6"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-xs font-bold uppercase text-navy tracking-wider flex items-center gap-1.5">
                {isEditing ? (
                  <>
                    <Edit className="w-4 h-4 text-navy" />
                    Chỉnh sửa Lĩnh vực
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-gold" />
                    Thêm Lĩnh vực mới
                  </>
                )}
              </h2>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleOpenCreate}
                  className="text-[11px] text-slate-500 underline font-medium hover:text-navy"
                >
                  Hủy sửa
                </button>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Tên Lĩnh vực Hành nghề <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="VD: ĐẤT ĐAI – NHÀ Ở"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Mô tả ngắn gọn (Hiển thị trên Card)
              </label>
              <textarea
                rows={3}
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="VD: Tư vấn thủ tục sang tên, tranh chấp tài sản đất đai, tách thửa, cấp sổ đỏ lần đầu..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-700 focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Biểu tượng (Icon)</label>
                <select
                  value={formIcon}
                  onChange={(e) => setFormIcon(e.target.value)}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:ring-2 focus:ring-navy focus:outline-none"
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Thứ tự hiển thị</label>
                <input
                  type="number"
                  value={formOrder}
                  onChange={(e) => setFormOrder(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-navy focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Trạng thái xuất bản</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:ring-2 focus:ring-navy focus:outline-none font-semibold"
              >
                <option value="PUBLISHED">PUBLISHED (Xuất bản công khai)</option>
                <option value="DRAFT">DRAFT (Bản nháp)</option>
                <option value="HIDDEN">HIDDEN (Tạm ẩn)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-navy hover:bg-navy-dark text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-gold" />
              <span>{isEditing ? "Cập nhật Lĩnh vực hoạt động" : "Thêm Lĩnh vực hoạt động"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
