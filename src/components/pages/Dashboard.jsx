import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { taskService } from "@/services/api/taskService";
import { projectService } from "@/services/api/projectService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Projects from "@/components/pages/Projects";
import Tasks from "@/components/pages/Tasks";
import Button from "@/components/atoms/Button";
import ProgressSummary from "@/components/organisms/ProgressSummary";
import ProjectForm from "@/components/organisms/ProjectForm";
import TaskForm from "@/components/organisms/TaskForm";

const Dashboard = () => {
  const navigate = useNavigate();
const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showTaskForm, setShowTaskForm] = useState(false);
const [showProjectForm, setShowProjectForm] = useState(false);

  const handleCreateTask = () => {
    setShowTaskForm(true);
  };

  const handleCreateProject = () => {
    setShowProjectForm(true);
  };


  const handleTaskSubmit = async (taskData) => {
    try {
      await taskService.create(taskData);
      toast.success('Task created successfully!');
      setShowTaskForm(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error('Failed to create task. Please try again.');
    }
  };

  const handleProjectSubmit = async (projectData) => {
    try {
      await projectService.create(projectData);
      toast.success('Project created successfully!');
      setShowProjectForm(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      toast.error('Failed to create project. Please try again.');
    }
  };

  const handleViewTasks = () => {
    navigate('/tasks');
  };
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
                <p className="text-xs text-gray-500">Dashboard</p>
              </div>
            </div>

            <nav className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-primary font-medium"
              >
                <ApperIcon name="BarChart3" className="mr-2 h-4 w-4" />
                Dashboard
</Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/tasks')}
              >
                <ApperIcon name="CheckSquare" className="mr-2 h-4 w-4" />
                Tasks
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/projects')}
              >
                <ApperIcon name="Folder" className="mr-2 h-4 w-4" />
                Projects
              </Button>
              <Button
                onClick={handleCreateTask}
                className="gradient-primary"
              >
                <ApperIcon name="Plus" className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Focus Flow
            </h2>
            <p className="text-gray-600">
              Stay productive and track your progress
            </p>
          </motion.div>

          {/* Progress Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-4xl mx-auto"
          >
            <ProgressSummary refreshTrigger={refreshTrigger} />
          </motion.div>

        </div>
</main>

      {/* Task Creation Modal */}
      <TaskForm
        isOpen={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        onSubmit={handleTaskSubmit}
      />

{/* Project Creation Modal */}
      <ProjectForm
        isOpen={showProjectForm}
        onClose={() => setShowProjectForm(false)}
        onSubmit={handleProjectSubmit}
      />
    </div>
  );
};

export default Dashboard;