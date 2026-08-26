import React from "react";

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  className?: string;
}

export const FormLabel: React.FC<FormLabelProps> = ({
  children,
  required = false,
  optional = false,
  className = "",
  ...props
}) => {
  return (
    <label
      className={`block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 font-bold ml-1" title="Trường bắt buộc">*</span>}
      {optional && <span className="text-slate-400 font-normal ml-1.5 text-xs">(Không bắt buộc)</span>}
    </label>
  );
};

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className = "", error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full px-3.5 py-2.5 sm:py-3 text-sm sm:text-base text-slate-800 bg-white border ${
          error ? "border-red-400 focus:ring-red-300" : "border-slate-300 focus:border-gold focus:ring-gold/30"
        } rounded-xl shadow-2xs focus:outline-none focus:ring-2 transition-colors duration-200 placeholder:text-slate-400`}
        {...props}
      />
    );
  }
);
FormInput.displayName = "FormInput";

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ className = "", error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full px-3.5 py-2.5 sm:py-3 text-sm sm:text-base text-slate-800 bg-white border ${
          error ? "border-red-400 focus:ring-red-300" : "border-slate-300 focus:border-gold focus:ring-gold/30"
        } rounded-xl shadow-2xs focus:outline-none focus:ring-2 transition-colors duration-200 placeholder:text-slate-400 resize-y min-h-[100px]`}
        {...props}
      />
    );
  }
);
FormTextarea.displayName = "FormTextarea";

export const FormError: React.FC<{ message?: string }> = ({ message }) => {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">⚠️ {message}</p>;
};
