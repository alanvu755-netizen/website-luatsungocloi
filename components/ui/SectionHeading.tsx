import React from "react";

interface SectionHeadingProps {
  subtitle?: string;
  title: string;
  description?: string;
  align?: "left" | "center" | "right";
  theme?: "dark" | "light";
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  subtitle,
  title,
  description,
  align = "center",
  theme = "dark",
  className = "",
}) => {
  const alignClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  const titleThemeClasses = {
    dark: "text-navy-dark",
    light: "text-white",
  };

  const subtitleThemeClasses = {
    dark: "text-gold-dark font-medium uppercase tracking-wider text-xs sm:text-sm",
    light: "text-gold-light font-medium uppercase tracking-wider text-xs sm:text-sm",
  };

  const descThemeClasses = {
    dark: "text-slate-600 max-w-2xl text-sm sm:text-base leading-relaxed",
    light: "text-slate-300 max-w-2xl text-sm sm:text-base leading-relaxed",
  };

  return (
    <div className={`flex flex-col mb-8 sm:mb-12 ${alignClasses[align]} ${className}`}>
      {subtitle && (
        <span className={`inline-block mb-2 ${subtitleThemeClasses[theme]}`}>
          {subtitle}
        </span>
      )}
      
      <h2
        className={`font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${titleThemeClasses[theme]}`}
      >
        {title}
      </h2>

      {/* Decorative Gold Accent Bar */}
      <div
        className={`h-1 w-16 bg-gradient-to-r from-gold to-gold-light rounded-full my-3 sm:my-4 ${
          align === "center" ? "mx-auto" : align === "right" ? "ml-auto" : ""
        }`}
      />

      {description && (
        <p className={`mt-1 ${descThemeClasses[theme]}`}>{description}</p>
      )}
    </div>
  );
};

export default SectionHeading;
