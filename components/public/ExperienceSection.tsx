import { Briefcase } from "lucide-react";

interface Highlight {
  id: string;
  content: string;
}

interface ExperienceItem {
  id: string;
  startYear: number;
  endYear?: number | null;
  position: string;
  organization: string;
  highlights?: Highlight[];
}

interface ExperienceSectionProps {
  items: ExperienceItem[];
}

export default function ExperienceSection({ items }: ExperienceSectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <section id="kinh-nghiem" className="py-4 mt-4">
      
      {/* Ribbon Header */}
      <div className="inline-flex items-center gap-2.5 bg-navy text-white px-5 py-2 rounded-r-full rounded-tl-lg shadow-sm mb-6">
        <Briefcase className="w-5 h-5 text-gold" />
        <h2 className="font-serif text-lg font-bold uppercase tracking-wide">
          KINH NGHIỆM CÔNG TÁC
        </h2>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 space-y-6 border-l-2 border-navy/30 ml-3">
        {items.map((item) => (
          <div key={item.id} className="relative group">
            
            {/* Timeline Node Dot */}
            <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-navy border-2 border-white ring-2 ring-navy/20 group-hover:scale-125 transition-transform"></div>

            {/* Time Period */}
            <span className="font-semibold text-navy text-base sm:text-lg block mb-1">
              {item.startYear} – {item.endYear || "Hiện tại"}
            </span>

            {/* Position & Organization */}
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">
              {item.position}
            </h3>

            {/* Highlights Bullets */}
            {item.highlights && item.highlights.length > 0 && (
              <ul className="mt-2 space-y-1 text-slate-600 text-sm sm:text-base pl-4 list-disc marker:text-navy">
                {item.highlights.map((hl) => (
                  <li key={hl.id}>{hl.content}</li>
                ))}
              </ul>
            )}

          </div>
        ))}
      </div>

    </section>
  );
}
