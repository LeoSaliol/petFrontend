import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  onClick?: () => void;
}

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export const Card = ({ children, className = "", padding = "md", hover = false, onClick }: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-gray-900
        rounded-xl border border-gray-200 dark:border-gray-700
        ${paddingStyles[padding]}
        ${hover ? "hover:shadow-lg transition-shadow cursor-pointer" : ""}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};