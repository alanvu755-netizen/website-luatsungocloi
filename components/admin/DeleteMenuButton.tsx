"use client";

import { Trash2 } from "lucide-react";

interface DeleteMenuButtonProps {
  menuId: string;
  menuTitle: string;
  action: (formData: FormData) => Promise<void>;
}

export default function DeleteMenuButton({ menuId, menuTitle, action }: DeleteMenuButtonProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (
      !confirm(
        `⚠️ XÁC NHẬN XÓA MENU:\n\nThao tác này sẽ xóa vĩnh viễn Menu "${menuTitle}" và tất cả các Chuyên mục con liên quan.\n\nBạn có chắc chắn muốn xóa không?`
      )
    ) {
      e.preventDefault();
    }
  };

  return (
    <form action={action} onSubmit={handleSubmit}>
      <input type="hidden" name="id" value={menuId} />
      <button
        type="submit"
        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
        title="Xóa Menu (Có hỏi xác nhận)"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </form>
  );
}
