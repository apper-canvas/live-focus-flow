import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";

const FilterButton = ({ 
  active = false, 
  onClick, 
  children, 
  className,
  count
}) => {
  return (
    <Button
      variant={active ? "primary" : "secondary"}
      onClick={onClick}
      className={cn(
        "relative",
        active && "shadow-lg",
        className
      )}
    >
      {children}
      {count !== undefined && count > 0 && (
        <span className={cn(
          "ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium",
          active 
            ? "bg-white/20 text-white" 
            : "bg-gray-100 text-gray-600"
        )}>
          {count}
        </span>
      )}
    </Button>
  );
};

export default FilterButton;