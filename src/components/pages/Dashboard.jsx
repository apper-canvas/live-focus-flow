import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ProgressSummary from "@/components/organisms/ProgressSummary";
import { taskService } from "@/services/api/taskService";
import { toast } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateTask = () => {
    navigate('/tasks?action=create');
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

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={handleCreateTask}
                  className="h-16 gradient-primary justify-start text-left"
                >
                  <div className="flex items-center">
                    <div className="rounded-lg bg-white/20 p-2 mr-4">
                      <ApperIcon name="Plus" className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">Create New Task</div>
                      <div className="text-sm opacity-80">Add a task to your list</div>
                    </div>
                  </div>
                </Button>
                
                <Button
                  onClick={handleViewTasks}
                  variant="outline"
                  className="h-16 justify-start text-left border-gray-200 hover:border-primary hover:bg-primary/5"
                >
                  <div className="flex items-center">
                    <div className="rounded-lg bg-primary/10 p-2 mr-4">
                      <ApperIcon name="List" className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Manage Tasks</div>
                      <div className="text-sm text-gray-500">View and edit your tasks</div>
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;