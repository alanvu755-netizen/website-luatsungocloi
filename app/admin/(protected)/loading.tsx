export default function AdminProtectedLoading() {
  return (
    <div className="flex-1 bg-slate-100 flex flex-col justify-center items-center py-24 min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-9 h-9 border-3 border-navy border-t-gold rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500 font-sans tracking-wider animate-pulse">
          Đang nạp dữ liệu CMS...
        </p>
      </div>
    </div>
  );
}
