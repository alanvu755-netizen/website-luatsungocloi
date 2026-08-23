export default function PublicLoading() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-navy border-t-gold rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-600 tracking-wide font-sans animate-pulse">
          Đang tải trang Luật sư Lê Thị Ngọc Lợi...
        </p>
      </div>
    </div>
  );
}
