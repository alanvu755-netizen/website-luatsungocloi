import { GraduationCap } from "lucide-react";

interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  description?: string | null;
}

interface EducationSectionProps {
  items: EducationItem[];
}

export default function EducationSection({ items }: EducationSectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <section id="hoc-van" className="py-4">
      
      {/* Ribbon Header */}
      <div className="inline-flex items-center gap-2.5 bg-navy text-white px-5 py-2 rounded-r-full rounded-tl-lg shadow-sm mb-6">
        <GraduationCap className="w-5 h-5 text-gold" />
        <h2 className="font-serif text-lg font-bold uppercase tracking-wide">
          HỌC VẤN
        </h2>
      </div>

      {/* Bullet List Items */}
      <div className="space-y-5 pl-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3 group">
            {/* Blue Dot Bullet */}
            <div className="w-3 h-3 rounded-full bg-navy mt-1.5 flex-shrink-0 group-hover:scale-125 transition-transform"></div>
            
            <div>
              <h3 className="font-semibold text-slate-900 text-base sm:text-lg leading-snug">
                {item.degree}
              </h3>
              <p className="text-slate-600 text-sm sm:text-base font-normal">
                {item.institution}
              </p>
              {item.description && (
                <p className="text-xs text-slate-500 mt-1">{item.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
    </section>
  );
}
