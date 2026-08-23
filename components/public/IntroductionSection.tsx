import { User } from "lucide-react";

interface IntroductionProps {
  data: {
    title: string;
    content: string;
  } | null;
}

export default function IntroductionSection({ data }: IntroductionProps) {
  if (!data) return null;

  const paragraphs = data.content.split("\n\n").filter(Boolean);

  return (
    <section id="gioi-thieu" className="bg-surface-soft border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
      
      {/* Section Badge Header */}
      <div className="flex items-center gap-3 mb-4 border-b border-slate-200/60 pb-3">
        <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white shadow-xs">
          <User className="w-5 h-5 text-white" />
        </div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-navy uppercase tracking-wide">
          {data.title || "GIỚI THIỆU"}
        </h2>
      </div>

      {/* Body Content */}
      <div className="space-y-3.5 text-slate-700 leading-relaxed text-base sm:text-lg font-normal">
        {paragraphs.map((para, idx) => (
          <p key={idx} className="text-justify sm:text-left">
            {para}
          </p>
        ))}
      </div>

    </section>
  );
}
