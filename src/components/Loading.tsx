interface LoadingProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "w-4 h-4",
  md: "w-8 h-8",
  lg: "w-12 h-12",
};

export const Loading = ({ size = "md", className = "" }: LoadingProps) => (
  <div className={`flex items-center justify-center ${className}`}>
    <svg className={`animate-spin ${sizeStyles[size]}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  </div>
);

export const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
    <Loading size="lg" />
  </div>
);