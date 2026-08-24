"use client";

import { useFormStatus } from "react-dom";
import { Loader2, Save, Power } from "lucide-react";

export function ToggleSubmitButton({ currentStatus }: { currentStatus: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`px-4 py-2 text-xs font-bold rounded-lg shadow-xs transition-all flex items-center gap-1.5 ${
        pending
          ? "bg-slate-300 text-slate-500 cursor-not-allowed"
          : currentStatus
          ? "bg-slate-200 hover:bg-slate-300 text-slate-800"
          : "bg-emerald-600 hover:bg-emerald-700 text-white"
      }`}
    >
      {pending ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Đang cập nhật...</span>
        </>
      ) : (
        <>
          <Power className="w-3.5 h-3.5" />
          <span>{currentStatus ? "Tắt (OFF)" : "Bật (ON)"}</span>
        </>
      )}
    </button>
  );
}

export function SaveSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`px-4 py-2 font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5 ${
        pending
          ? "bg-slate-400 text-white cursor-not-allowed opacity-80"
          : "bg-navy hover:bg-navy-dark text-white active:scale-95"
      }`}
    >
      {pending ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Đang lưu...</span>
        </>
      ) : (
        <>
          <Save className="w-3.5 h-3.5" />
          <span>Lưu thay đổi kênh</span>
        </>
      )}
    </button>
  );
}
