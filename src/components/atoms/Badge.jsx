import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  className, 
  variant = "default", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-200";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    high: "bg-red-100 text-red-700 border border-red-200",
    medium: "bg-yellow-100 text-yellow-700 border border-yellow-200", 
    low: "bg-blue-100 text-blue-700 border border-blue-200",
    success: "bg-green-100 text-green-700 border border-green-200"
  };

  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;