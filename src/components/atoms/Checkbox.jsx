import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = React.forwardRef(({ 
  className, 
  checked = false,
  onChange,
  disabled = false,
  ...props 
}, ref) => {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      className={cn(
        "relative flex h-5 w-5 items-center justify-center rounded border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        checked 
          ? "bg-gradient-to-br from-primary to-secondary border-primary text-white shadow-md" 
          : "border-gray-300 bg-white hover:border-primary hover:shadow-sm",
        className
      )}
      onClick={() => !disabled && onChange && onChange(!checked)}
      disabled={disabled}
      ref={ref}
      {...props}
    >
      {checked && (
        <ApperIcon 
          name="Check" 
          className="h-3 w-3 text-white animate-scale-in" 
        />
      )}
    </button>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;