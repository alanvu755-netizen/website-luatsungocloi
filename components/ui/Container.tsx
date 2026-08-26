import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "small" | "narrow" | "wide";
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = "",
  size = "default",
  ...props
}) => {
  const sizeClasses = {
    narrow: "max-w-4xl",
    small: "max-w-5xl",
    default: "max-w-7xl",
    wide: "max-w-full px-4 sm:px-8 lg:px-12",
  };

  return (
    <div
      className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
