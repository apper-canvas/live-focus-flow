import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import TaskForm from "@/components/organisms/TaskForm";
import TaskList from "@/components/organisms/TaskList";
import TaskFilters from "@/components/organisms/TaskFilters";
import { taskService } from "@/services/api/taskService";
import { toast } from "react-toastify";

const Tasks = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Check for create action in URL params
  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      setShowForm(true);
      // Clear the URL param
      navigate('/tasks', { replace: true });
    }
  }, [searchParams, navigate]);

  // Task counts for filter buttons (simplified for demo)
  const taskCounts = {
    total: 0,
    active: 0,
    completed: 0,
    high: 0,
    medium: 0,
    low: 0
  };

  const handleCreateTask = async (taskData) => {
    try {
      await taskService.create(taskData);
      setRefreshTrigger(prev => prev + 1);
      toast.success("Task created successfully! 🎯");
    } catch (error) {
      toast.error("Failed to create task");
      console.error("Error creating task:", error);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleUpdateTask = async (taskData) => {
    if (!editingTask) return;
    
    try {
      await taskService.update(editingTask.Id, taskData);
      setRefreshTrigger(prev => prev + 1);
      toast.success("Task updated successfully! ✨");
    } catch (error) {
      toast.error("Failed to update task");
      console.error("Error updating task:", error);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
  }, []);

  // Listen for global events
  React.useEffect(() => {
    const handleOpenTaskForm = () => setShowForm(true);
    const handleClearFiltersEvent = () => handleClearFilters();

    window.addEventListener('openTaskForm', handleOpenTaskForm);
    window.addEventListener('clearFilters', handleClearFiltersEvent);

    return () => {
      window.removeEventListener('openTaskForm', handleOpenTaskForm);
      window.removeEventListener('clearFilters', handleClearFiltersEvent);
    };
  }, [handleClearFilters]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-primary to-secondary p-2">
                <ApperIcon name="Target" className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Focus Flow</h1>
                <p className="text-xs text-gray-500">Task Management</p>
              </div>
            </div>

            <nav className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
              >
                <ApperIcon name="BarChart3" className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/tasks')}
                className="text-primary font-medium"
              >
                <ApperIcon name="CheckSquare" className="mr-2 h-4 w-4" />
                Tasks
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <ApperIcon name="Filter" className="h-4 w-4" />
              </Button>
              
              <Button
                onClick={() => setShowForm(true)}
                className="gradient-primary"
              >
                <ApperIcon name="Plus" className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:block space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}
          >
            <TaskFilters
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
              onStatusChange={setStatusFilter}
              onPriorityChange={setPriorityFilter}
              taskCounts={taskCounts}
            />
          </motion.aside>

          {/* Main Task Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search tasks by title or description..."
              />

              <TaskForm
                isOpen={showForm}
                onClose={handleCloseForm}
                onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                initialData={editingTask}
              />
            </motion.div>

            {/* Task List */}
            <TaskList
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
              onEditTask={handleEditTask}
              refreshTrigger={refreshTrigger}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Tasks;