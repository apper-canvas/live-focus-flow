import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import ProgressRing from "@/components/molecules/ProgressRing";
import { taskService } from "@/services/api/taskService";
import { projectService } from "@/services/api/projectService";
const ProgressSummary = ({ 
  refreshTrigger = 0,
  className 
}) => {
  const [stats, setStats] = useState({
tasks: {
      total: 0,
      completed: 0,
      active: 0,
      completionRate: 0
    },
    projects: {
      total: 0,
      completed: 0,
      active: 0,
      completionRate: 0
    }
  });
  const [loading, setLoading] = useState(false);

const loadStats = async () => {
    setLoading(true);
    try {
      const [taskData, projectData] = await Promise.all([
        taskService.getStats(),
        projectService.getStats()
      ]);
      setStats({
        tasks: taskData,
        projects: projectData
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [refreshTrigger]);

  const statCards = [
    {
      label: "Total Tasks",
value: stats.projects.total,
      icon: "Folder",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      label: "Working Projects",
      value: stats.projects.active,
      icon: "FolderOpen",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      label: "Completed Projects",
      value: stats.projects.completed,
      icon: "FolderCheck",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      label: "Total Tasks",
      value: stats.tasks.total,
      icon: "List",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      label: "Working Tasks",
      value: stats.tasks.active,
      icon: "Circle",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      label: "Completed Tasks",
      value: stats.tasks.completed,
      icon: "CheckCircle",
      color: "text-accent",
      bgColor: "bg-accent/10"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg",
        className
      )}
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Progress Overview
        </h2>
        {loading && (
          <ApperIcon name="Loader2" className="h-4 w-4 animate-spin text-gray-400" />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
{/* Progress Ring for Tasks */}
        <div className="flex justify-center">
          <div className="relative">
            <ProgressRing 
              progress={stats.tasks.completionRate} 
              size={120} 
              strokeWidth={8}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-accent to-green-500 bg-clip-text text-transparent">
                {stats.tasks.completionRate}%
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Tasks Complete
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                stat.bgColor
              )}>
                <ApperIcon 
                  name={stat.icon} 
                  className={cn("h-5 w-5", stat.color)} 
                />
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

{/* Progress Message */}
      <div className="mt-6 text-center">
        {stats.tasks.completionRate === 100 && stats.tasks.total > 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-lg bg-gradient-to-r from-accent/10 to-green-500/10 p-4 text-accent"
          >
            <ApperIcon name="Trophy" className="mx-auto mb-2 h-8 w-8" />
            <p className="font-semibold">All tasks completed! 🎉</p>
            <p className="text-sm opacity-80">Great job staying focused!</p>
          </motion.div>
        ) : stats.tasks.active > 0 || stats.projects.active > 0 ? (
          <p className="text-sm text-gray-600">
            You have {stats.tasks.active} active task{stats.tasks.active !== 1 ? 's' : ''} and {stats.projects.active} active project{stats.projects.active !== 1 ? 's' : ''} remaining. Keep going! 💪
          </p>
        ) : stats.tasks.total === 0 && stats.projects.total === 0 ? (
          <p className="text-sm text-gray-600">
            Ready to start your productive day? Create your first project or task! ✨
          </p>
        ) : null}
      </div>
    </motion.div>
  );
};

export default ProgressSummary;