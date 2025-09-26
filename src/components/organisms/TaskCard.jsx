import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Checkbox from "@/components/atoms/Checkbox";
import { format, isToday, isYesterday } from "date-fns";

const TaskCard = ({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  className 
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM d");
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      high: { 
        variant: "high", 
        color: "bg-red-500", 
        label: "High",
        icon: "AlertCircle" 
      },
      medium: { 
        variant: "medium", 
        color: "bg-yellow-500", 
        label: "Medium",
        icon: "Clock" 
      },
      low: { 
        variant: "low", 
        color: "bg-blue-500", 
        label: "Low",
        icon: "Minus" 
      }
    };
    return configs[priority] || configs.medium;
  };

  const handleToggleComplete = async () => {
    setIsUpdating(true);
    try {
      await onToggleComplete?.(task.Id);
    } catch (error) {
      console.error("Error toggling task:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete?.(task.Id);
    } catch (error) {
      console.error("Error deleting task:", error);
      setIsDeleting(false);
    }
  };

  const priorityConfig = getPriorityConfig(task.priority);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2, shadow: "0 8px 25px -5px rgba(0, 0, 0, 0.1)" }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200",
        task.completed && "opacity-60",
        isDeleting && "opacity-50 pointer-events-none",
        className
      )}
    >
      {/* Priority indicator */}
      <div className={cn(
        "absolute left-0 top-0 h-full w-1",
        priorityConfig.color
      )} />

      <div className="flex items-start gap-4">
        <div className="mt-1">
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={isUpdating}
            className={cn(
              task.completed && "checkbox-bounce"
            )}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className={cn(
                "font-semibold text-gray-900 transition-all duration-200",
                task.completed && "text-gray-500 line-through"
              )}>
                {task.title}
              </h3>
              {task.description && (
                <p className={cn(
                  "mt-2 text-sm text-gray-600",
                  task.completed && "text-gray-400 line-through"
                )}>
                  {task.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit?.(task)}
                className="h-8 w-8 text-gray-400 hover:text-primary"
              >
                <ApperIcon name="Edit3" className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-8 w-8 text-gray-400 hover:text-red-500"
              >
                {isDeleting ? (
                  <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />
                ) : (
                  <ApperIcon name="Trash2" className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant={priorityConfig.variant}>
                <ApperIcon 
                  name={priorityConfig.icon} 
                  className="mr-1.5 h-3 w-3" 
                />
                {priorityConfig.label}
              </Badge>
            </div>

            <span className="text-xs text-gray-400">
              {formatDate(task.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Completion overlay */}
      {task.completed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-accent/5 to-green-500/5 pointer-events-none"
        />
      )}
    </motion.div>
  );
};

export default TaskCard;