import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const PrioritySelector = ({ 
  value = "medium", 
  onChange, 
  className 
}) => {
  const priorities = [
    { 
      value: "high", 
      label: "High Priority", 
      color: "bg-red-500 border-red-600",
      textColor: "text-red-700",
      bgColor: "bg-red-50 hover:bg-red-100",
      icon: "AlertCircle"
    },
    { 
      value: "medium", 
      label: "Medium Priority", 
      color: "bg-yellow-500 border-yellow-600",
      textColor: "text-yellow-700",
      bgColor: "bg-yellow-50 hover:bg-yellow-100",
      icon: "Clock"
    },
    { 
      value: "low", 
      label: "Low Priority", 
      color: "bg-blue-500 border-blue-600",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50 hover:bg-blue-100",
      icon: "Minus"
    }
  ];

  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-gray-700">
        Priority Level
      </label>
      <div className="grid grid-cols-3 gap-2">
        {priorities.map((priority) => (
          <button
            key={priority.value}
            type="button"
            onClick={() => onChange?.(priority.value)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-lg border-2 p-3 text-center transition-all duration-200 hover:shadow-md",
              value === priority.value
                ? `${priority.bgColor} border-current ${priority.textColor} shadow-md`
                : "border-gray-200 bg-white hover:border-gray-300"
            )}
          >
            <div className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full",
              value === priority.value ? priority.color : "bg-gray-200"
            )}>
              <ApperIcon
                name={priority.icon}
                className={cn(
                  "h-3 w-3",
                  value === priority.value ? "text-white" : "text-gray-500"
                )}
              />
            </div>
            <span className="text-xs font-medium">
              {priority.label.split(" ")[0]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PrioritySelector;