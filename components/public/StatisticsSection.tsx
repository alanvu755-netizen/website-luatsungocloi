import React from "react";
import { Users, FileCheck2, Award, Heart } from "lucide-react";

export interface StatisticItemData {
  id: string;
  value: string;
  label: string;
  subtext?: string | null;
  displayOrder: number;
}

interface StatisticsSectionProps {
  items?: StatisticItemData[];
  className?: string;
}

const DEFAULT_STATS = [
  { id: "s1", value: "500+", label: "Khách hàng tin tưởng", icon: Users },
  { id: "s2", value: "800+", label: "Vụ việc đã giải quyết", icon: FileCheck2 },
  { id: "s3", value: "10+", label: "Năm kinh nghiệm", icon: Award },
  { id: "s4", value: "100%", label: "Tận tâm vì khách hàng", icon: Heart },
];

export const StatisticsSection: React.FC<StatisticsSectionProps> = ({
  items = [],
  className = "",
}) => {
  const displayStats = DEFAULT_STATS.map((stat, idx) => {
    if (items && items[idx]) {
      return {
        ...stat,
        value: items[idx].value,
        label: items[idx].label,
      };
    }
    return stat;
  });

  return (
    <section className={`py-10 bg-[#051C38] text-white border-y border-navy-light/30 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-center text-center">
          {displayStats.map((stat) => {
            const IconComp = stat.icon;
            return (
              <div key={stat.id} className="flex items-center justify-center gap-3.5 p-2">
                <div className="w-12 h-12 rounded-xl bg-navy-light/50 border border-gold/40 flex items-center justify-center text-gold flex-shrink-0">
                  <IconComp className="w-6 h-6 text-gold stroke-[1.75]" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-serif font-extrabold text-2xl sm:text-3xl text-gold leading-none">
                    {stat.value}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-200 font-medium leading-tight mt-1">
                    {stat.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
