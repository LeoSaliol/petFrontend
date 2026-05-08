interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  fallback?: string;
  className?: string;
}

const sizeStyles = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
  xl: "w-16 h-16 text-xl",
};

export const Avatar = ({ src, alt = "Avatar", size = "md", fallback, className = "" }: AvatarProps) => {
  const initials = fallback
    ? fallback
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  if (!src) {
    return (
      <div
        className={`
          ${sizeStyles[size]}
          rounded-full bg-gray-300 dark:bg-gray-600
          flex items-center justify-center
          font-medium text-gray-600 dark:text-gray-300
          ${className}
        `}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`
        ${sizeStyles[size]}
        rounded-full object-cover
        ${className}
      `}
    />
  );
};