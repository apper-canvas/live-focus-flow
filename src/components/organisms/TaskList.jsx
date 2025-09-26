import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/utils/cn";
import TaskCard from "@/components/organisms/TaskCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { taskService } from "@/services/api/taskService";
import { toast } from "react-toastify";

const TaskList = ({ 
  searchQuery = "",
  statusFilter = "all",
  priorityFilter = "all",
  onEditTask,
  refreshTrigger = 0,
  className 
}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [refreshTrigger]);

  const handleToggleComplete = async (taskId) => {
    const task = tasks.find(t => t.Id === taskId);
    if (!task) return;

    const updatedTask = { ...task, completed: !task.completed };
    
    // Optimistic update
    setTasks(prevTasks => 
      prevTasks.map(t => 
        t.Id === taskId ? updatedTask : t
      )
    );

    try {
      await taskService.update(taskId, { completed: !task.completed });
      
      toast.success(
        updatedTask.completed 
          ? "Task completed! 🎉" 
          : "Task reopened",
        {
          position: "top-right",
          autoClose: 2000
        }
      );
    } catch (error) {
      // Revert optimistic update
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t.Id === taskId ? task : t
        )
      );
      toast.error("Failed to update task");
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.Id !== taskId));
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task");
      console.error("Error deleting task:", error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!task.title.toLowerCase().includes(query) && 
          !task.description.toLowerCase().includes(query)) {
        return false;
      }
    }

    // Status filter
    if (statusFilter === "active" && task.completed) return false;
    if (statusFilter === "completed" && !task.completed) return false;

    // Priority filter
    if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;

    return true;
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Error 
        message={error}
        onRetry={loadTasks}
      />
    );
  }

  if (tasks.length === 0) {
    return (
<Empty 
        title="No tasks yet"
        description="Create your first task to get started with Focus Flow"
        actionText="Create Task"
        onAction={() => window.dispatchEvent(new window.CustomEvent('openTaskForm'))}
      />
    );
  }

  if (filteredTasks.length === 0) {
    return (
<Empty 
        title="No matching tasks"
        description="Try adjusting your search or filters to find tasks"
        actionText="Clear Filters"
        onAction={() => {
          window.dispatchEvent(new window.CustomEvent('clearFilters'));
        }}
      />
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <AnimatePresence mode="popLayout">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.Id}
            task={task}
            onToggleComplete={handleToggleComplete}
            onEdit={onEditTask}
            onDelete={handleDeleteTask}
          />
        ))}
      </AnimatePresence>
      
      {filteredTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default TaskList;