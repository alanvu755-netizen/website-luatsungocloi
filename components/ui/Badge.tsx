import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: "gold" | "navy" | "outline" | "soft" | "success";
  size?: "sm" | "md";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "gold",
  size = "md",
  className = "",
  ...props
}) => {
  const variantClasses = {
    gold: "bg-gold/15 text-gold-dark border border-gold/30",
    navy: "bg-navy-dark text-white border border-navy/20",
    outline: "bg-transparent text-navy-dark border border-slate-300",
    soft: "bg-slate-100 text-slate-700 border border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs font-medium rounded-md",
    md: "px-2.5 py-1 text-xs sm:text-sm font-medium rounded-lg",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 shadow-2xs ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
