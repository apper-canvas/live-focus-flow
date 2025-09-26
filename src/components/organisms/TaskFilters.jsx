import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import SearchableSelect from "@/components/atoms/SearchableSelect";
import FilterButton from "@/components/molecules/FilterButton";
import ApperIcon from "@/components/ApperIcon";
const TaskFilters = ({ 
  statusFilter = "all",
  priorityFilter = "all", 
  onStatusChange,
  onPriorityChange,
  taskCounts = {},
  className 
}) => {
  const statusFilters = [
    { value: "all", label: "All Tasks", icon: "List", count: taskCounts.total },
    { value: "active", label: "Active", icon: "Circle", count: taskCounts.active },
    { value: "completed", label: "Completed", icon: "CheckCircle", count: taskCounts.completed }
  ];

  const priorityFilters = [
    { value: "all", label: "All Priorities", icon: "Filter", count: taskCounts.total },
    { value: "high", label: "High", icon: "AlertCircle", count: taskCounts.high },
    { value: "medium", label: "Medium", icon: "Clock", count: taskCounts.medium },
    { value: "low", label: "Low", icon: "Minus", count: taskCounts.low }
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Status Filters */}
<div>
        <h3 className="mb-3 text-sm font-medium text-gray-700">
          Filter by Status
        </h3>
        <SearchableSelect
          options={statusFilters}
          value={statusFilter}
          onChange={onStatusChange}
          placeholder="Select status filter..."
          searchPlaceholder="Search status options..."
          className="w-full max-w-xs"
        />
      </div>

      {/* Priority Filters */}
<div>
        <h3 className="mb-3 text-sm font-medium text-gray-700">
          Filter by Priority
        </h3>
        <SearchableSelect
          options={priorityFilters}
          value={priorityFilter}
          onChange={onPriorityChange}
          placeholder="Select priority filter..."
          searchPlaceholder="Search priority options..."
          className="w-full max-w-xs"
        />
      </div>

      {/* Clear All Filters */}
      {(statusFilter !== "all" || priorityFilter !== "all") && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <FilterButton
            onClick={() => {
              onStatusChange?.("all");
              onPriorityChange?.("all");
            }}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            <ApperIcon name="X" className="mr-2 h-4 w-4" />
            Clear All Filters
          </FilterButton>
        </motion.div>
      )}
    </div>
  );
};

export default TaskFilters;