import { Scale, Check } from "lucide-react";

interface PracticeAreaItem {
  id: string;
  title: string;
  description?: string | null;
}

interface PracticeAreasSectionProps {
  items: PracticeAreaItem[];
}

export default function PracticeAreasSection({ items }: PracticeAreasSectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <section id="linh-vuc" className="py-4">
      
      {/* Ribbon Header */}
      <div className="inline-flex items-center gap-2.5 bg-navy text-white px-5 py-2 rounded-r-full rounded-tl-lg shadow-sm mb-6">
        <Scale className="w-5 h-5 text-gold" />
        <h2 className="font-serif text-lg font-bold uppercase tracking-wide">
          LĨNH VỰC HOẠT ĐỘNG
        </h2>
      </div>

      {/* Checklist Items List (Strictly Checklist, NO cards or grid tiles) */}
      <div className="space-y-4 pl-1">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3 group">
            
            {/* Solid Navy Circle Checkmark Icon */}
            <div className="w-6 h-6 rounded-full bg-navy flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs group-hover:bg-gold transition-colors">
              <Check className="w-3.5 h-3.5 text-white font-bold stroke-[3]" />
            </div>

            {/* Title Text */}
            <span className="text-slate-800 font-medium text-base sm:text-lg leading-snug">
              {item.title}
            </span>

          </div>
        ))}
      </div>

    </section>
  );
}
