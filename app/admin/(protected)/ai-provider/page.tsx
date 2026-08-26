"use client";

import { useState, useEffect } from "react";
import { Cpu, Key, CheckCircle, AlertCircle, Save, Check, Plus, Edit, Trash2, Eye, EyeOff, Layers } from "lucide-react";

interface DBObjective {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  promptGuidance: string;
  ctaGuidance?: string | null;
  displayOrder: number;
  status: boolean;
}

export default function SYSADMINAIProviderPage() {
  const [activeTab, setActiveTab] = useState<"PROVIDER" | "OBJECTIVES">("PROVIDER");

  // AI Provider State
  const [name, setName] = useState("Google Gemini AI Engine");
  const [defaultModel, setDefaultModel] = useState("gemini-1.5-flash");
  const [apiKey, setApiKey] = useState("••••••••••••••••••••••••••••");
  const [status, setStatus] = useState(true);

  // Objectives State
  const [objectives, setObjectives] = useState<DBObjective[]>([]);
  const [editingObj, setEditingObj] = useState<DBObjective | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State for Create/Edit Objective
  const [formCode, setFormCode] = useState("");
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPrompt, setFormPrompt] = useState("");
  const [formCTA, setFormCTA] = useState("");
  const [formOrder, setFormOrder] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchObjectives = () => {
    fetch("/api/admin/content-objectives")
      .then((res) => res.json())
      .then((data) => {
        if (data.objectives) {
          setObjectives(data.objectives);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/ai-provider").then((r) => r.json()),
      fetch("/api/admin/content-objectives").then((r) => r.json()),
    ])
      .then(([providerData, objData]) => {
        if (providerData.provider) {
          setName(providerData.provider.name || "Google Gemini AI Engine");
          setDefaultModel(providerData.provider.defaultModel || "gemini-1.5-flash");
          setStatus(providerData.provider.status ?? true);
        }
        if (objData.objectives) {
          setObjectives(objData.objectives);
        }
      })
      .catch(() => setFeedback({ type: "error", message: "Không thể tải cấu hình AI Provider." }))
      .finally(() => setLoading(false));
  }, []);

  const handleProviderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/ai-provider", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, defaultModel, apiKey, status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lỗi cập nhật AI Provider.");

      setFeedback({ type: "success", message: "✓ Cập nhật & Lưu cấu hình AI Provider thành công!" });
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Lỗi lưu cấu hình." });
    } finally {
      setSaving(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingObj(null);
    setIsCreating(true);
    setFormCode("");
    setFormName("");
    setFormDesc("");
    setFormPrompt("");
    setFormCTA("");
    setFormOrder(objectives.length + 1);
  };

  const handleOpenEdit = (obj: DBObjective) => {
    setIsCreating(false);
    setEditingObj(obj);
    setFormCode(obj.code);
    setFormName(obj.name);
    setFormDesc(obj.description || "");
    setFormPrompt(obj.promptGuidance);
    setFormCTA(obj.ctaGuidance || "");
    setFormOrder(obj.displayOrder);
  };

  const handleSaveObjective = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const url = isCreating
        ? "/api/admin/content-objectives"
        : `/api/admin/content-objectives/${editingObj?.id}`;
      const method = isCreating ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: formCode,
          name: formName,
          description: formDesc,
          promptGuidance: formPrompt,
          ctaGuidance: formCTA,
          displayOrder: formOrder,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lỗi lưu Mục tiêu bài viết.");

      setFeedback({ type: "success", message: isCreating ? "✓ Tạo Mục tiêu bài viết mới thành công!" : "✓ Cập nhật Mục tiêu thành công!" });
      setIsCreating(false);
      setEditingObj(null);
      fetchObjectives();
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Lỗi thao tác." });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (obj: DBObjective) => {
    try {
      const res = await fetch(`/api/admin/content-objectives/${obj.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: !obj.status }),
      });
      if (res.ok) {
        fetchObjectives();
      }
    } catch (e) {}
  };

  const handleDeleteObjective = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa Mục tiêu bài viết này không?")) return;
    try {
      const res = await fetch(`/api/admin/content-objectives/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchObjectives();
      }
    } catch (e) {}
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Đang tải cấu hình AI Provider & Objectives...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] uppercase font-extrabold bg-purple-600 text-white rounded-full">
              SYSADMIN ONLY
            </span>
            <h1 className="text-xl font-bold text-navy font-serif">Quản lý Cấu hình AI & Content Objectives</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Cấu hình Gemini AI Provider, Bật/Tắt AI toàn hệ thống và Quản lý 7+ Mục tiêu nội dung (Content Objectives) cho AI Writer V2.
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-3 border ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold"
              : "bg-red-50 border-red-200 text-red-700"
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

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab("PROVIDER")}
          className={`px-4 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "PROVIDER"
              ? "border-navy text-navy bg-white shadow-xs rounded-t-lg"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Cpu className="w-4 h-4" />
          AI Provider Settings
        </button>

        <button
          onClick={() => setActiveTab("OBJECTIVES")}
          className={`px-4 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "OBJECTIVES"
              ? "border-navy text-navy bg-white shadow-xs rounded-t-lg"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Layers className="w-4 h-4" />
          Quản lý Content Objectives ({objectives.length})
        </button>
      </div>

      {/* TAB 1: PROVIDER SETTINGS */}
      {activeTab === "PROVIDER" && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <form onSubmit={handleProviderSubmit} className="space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-navy text-gold flex items-center justify-center font-bold">
                  <Cpu className="w-6 h-6 stroke-[1.75]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-navy">{name}</h3>
                  <p className="text-xs text-slate-500">Mô hình mặc định: {defaultModel}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 font-medium">Trạng thái Bật/Tắt AI Provider:</span>
                <button
                  type="button"
                  onClick={() => setStatus(!status)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    status ? "bg-emerald-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      status ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Tên Nhà cung cấp AI Engine
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                AI Model Mặc định
              </label>
              <select
                value={defaultModel}
                onChange={(e) => setDefaultModel(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:ring-2 focus:ring-navy focus:outline-none"
              >
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Cực nhanh, tối ưu chi phí)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Lý luận sâu, bài viết dài)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-slate-500" />
                Gemini API Key (Mã hóa Server-Side)
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-navy focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-navy hover:bg-navy-dark text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-gold" />
                <span>Lưu cấu hình AI Provider</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: CONTENT OBJECTIVES MANAGEMENT */}
      {activeTab === "OBJECTIVES" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-navy uppercase tracking-wider">
              Danh sách Mục tiêu Bài viết AI (Content Objectives)
            </h2>
            <button
              onClick={handleOpenCreate}
              className="px-3.5 py-2 bg-navy hover:bg-navy-dark text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-gold" />
              Thêm Mục tiêu mới
            </button>
          </div>

          {/* Form Modal / Inline Editor */}
          {(isCreating || editingObj) && (
            <form onSubmit={handleSaveObjective} className="bg-slate-50 border border-slate-300 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-xs uppercase text-navy border-b border-slate-200 pb-2">
                {isCreating ? "Tạo Mục tiêu Nội dung Mới" : `Chỉnh sửa: ${editingObj?.name}`}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Mã Objective (Code) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    disabled={!isCreating}
                    placeholder="VD: LEGAL_QNA"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono uppercase bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Tên hiển thị <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="VD: 🔎 Giải đáp vấn đề pháp lý"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Thứ tự (Display Order)</label>
                  <input
                    type="number"
                    value={formOrder}
                    onChange={(e) => setFormOrder(parseInt(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Mô tả định hướng</label>
                <input
                  type="text"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Mô tả ngắn gọn mục tiêu giúp Admin dễ chọn..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Hướng dẫn cấu trúc cho AI Prompt (Prompt Guidance) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formPrompt}
                  onChange={(e) => setFormPrompt(e.target.value)}
                  placeholder="Các yêu cầu cấu trúc, thứ tự phân tích cho AI..."
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-mono bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Chiến lược Call-To-Action (CTA Guidance)
                </label>
                <textarea
                  rows={2}
                  value={formCTA}
                  onChange={(e) => setFormCTA(e.target.value)}
                  placeholder="Hướng dẫn cách viết đoạn kêu gọi hành động CTA ở cuối bài..."
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-mono bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingObj(null);
                  }}
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs font-semibold rounded"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded shadow-xs"
                >
                  Lưu Objective
                </button>
              </div>
            </form>
          )}

          {/* Objectives Data Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                  <th className="py-3 px-4">Stt</th>
                  <th className="py-3 px-4">Mã (Code)</th>
                  <th className="py-3 px-4">Tên hiển thị & Mô tả</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {objectives.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400">
                      Chưa có Mục tiêu nào trong CSDL.
                    </td>
                  </tr>
                ) : (
                  objectives.map((obj) => (
                    <tr key={obj.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-400">{obj.displayOrder}</td>
                      <td className="py-3 px-4 font-mono font-bold text-navy">{obj.code}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">{obj.name}</div>
                        {obj.description && <div className="text-[11px] text-slate-500 mt-0.5">{obj.description}</div>}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            obj.status ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {obj.status ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleToggleStatus(obj)}
                          className="p-1 rounded text-slate-400 hover:text-slate-700"
                          title={obj.status ? "Tắt Objective" : "Bật Objective"}
                        >
                          {obj.status ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleOpenEdit(obj)}
                          className="p-1 rounded text-slate-400 hover:text-navy"
                          title="Sửa Objective"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteObjective(obj.id)}
                          className="p-1 rounded text-slate-400 hover:text-red-600"
                          title="Xóa Objective"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
