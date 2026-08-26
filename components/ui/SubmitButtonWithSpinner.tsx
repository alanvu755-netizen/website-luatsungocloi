import React from "react";
import { Loader2 } from "lucide-react";

interface SubmitButtonWithSpinnerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  variant?: "primary" | "gold" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
}

export const SubmitButtonWithSpinner: React.FC<SubmitButtonWithSpinnerProps> = ({
  children,
  isLoading = false,
  loadingText = "Đang xử lý...",
  variant = "gold",
  size = "md",
  fullWidth = false,
  disabled,
  className = "",
  ...props
}) => {
  const variantClasses = {
    gold: "bg-gradient-to-r from-gold to-gold-light hover:from-gold-dark hover:to-gold text-navy-dark shadow-md hover:shadow-lg font-semibold border border-gold/40",
    primary: "bg-navy hover:bg-navy-dark text-white shadow-md hover:shadow-lg font-semibold border border-navy-light/30",
    secondary: "bg-slate-800 hover:bg-slate-900 text-white shadow-xs font-medium",
    outline: "bg-transparent hover:bg-gold/10 text-gold-dark border-2 border-gold font-semibold",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs sm:text-sm rounded-lg",
    md: "px-5 py-2.5 text-sm sm:text-base rounded-xl",
    lg: "px-7 py-3.5 text-base sm:text-lg rounded-xl",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`relative inline-flex items-center justify-center transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer ${
        fullWidth ? "w-full" : ""
      } ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin text-current" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default SubmitButtonWithSpinner;
