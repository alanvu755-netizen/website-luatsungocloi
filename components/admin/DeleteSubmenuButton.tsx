"use client";

import { Trash2 } from "lucide-react";

interface DeleteSubmenuButtonProps {
  submenuId: string;
  submenuTitle: string;
  action: (formData: FormData) => Promise<void>;
}

export default function DeleteSubmenuButton({ submenuId, submenuTitle, action }: DeleteSubmenuButtonProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (
      !confirm(
        `⚠️ XÁC NHẬN XÓA CHUYÊN MỤC CON:\n\nBạn có chắc chắn muốn xóa Chuyên mục con "${submenuTitle}" không?`
      )
    ) {
      e.preventDefault();
    }
  };

  return (
    <form action={action} onSubmit={handleSubmit}>
      <input type="hidden" name="id" value={submenuId} />
      <button
        type="submit"
        className="text-slate-400 hover:text-red-600 transition-colors p-1"
        title="Xóa Chuyên mục con (Có hỏi xác nhận)"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </form>
  );
}
