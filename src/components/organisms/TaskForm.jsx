import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projectService } from "@/services/api/projectService";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import PrioritySelector from "@/components/molecules/PrioritySelector";
import SearchableSelect from "@/components/atoms/SearchableSelect";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
const TaskForm = ({ 
  isOpen = false, 
  onClose, 
  onSubmit, 
  initialData = null,
  className 
}) => {
const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    priority: initialData?.priority || "medium",
    assignee: initialData?.assignee || "",
    projectId: initialData?.projectId || ""
  });
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  // Load projects for lookup
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setProjectsLoading(true);
        const projectsData = await projectService.getAll();
        setProjects(projectsData);
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setProjectsLoading(false);
      }
    };

    if (isOpen) {
      loadProjects();
    }
  }, [isOpen]);

  // Prepare project options for SearchableSelect
  const projectOptions = [
    { value: "", label: "No Project", icon: "Folder" },
    ...projects.map(project => ({
      value: project.Id,
      label: project.name,
      icon: "FolderOpen"
    }))
  ];

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(formData);
setFormData({ title: "", description: "", priority: "medium", assignee: "", projectId: "" });
      setErrors({});
      onClose?.();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ title: "", description: "", priority: "medium" });
    setErrors({});
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className={cn("overflow-hidden", className)}
        >
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {initialData ? "Edit Task" : "Create New Task"}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Task Title
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter task title..."
                  className={cn(
                    errors.title && "border-red-500 focus:border-red-500 focus:ring-red-200"
                  )}
                />
                {errors.title && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors.title}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description (Optional)
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add task details..."
                />
              </div>

              <PrioritySelector
                value={formData.priority}
                onChange={(priority) => setFormData({ ...formData, priority })}
/>

              {/* Assignee Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignee
                </label>
                <Input
                  value={formData.assignee}
                  onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
                  placeholder="Enter assignee name..."
                  className="w-full"
                />
              </div>

              {/* Project Lookup Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project
                </label>
                <SearchableSelect
                  options={projectOptions}
                  value={formData.projectId}
                  onChange={(value) => setFormData(prev => ({ ...prev, projectId: value }))}
                  placeholder="Select project..."
                  searchPlaceholder="Search projects..."
                  disabled={projectsLoading}
                  className="w-full"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <ApperIcon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                      {initialData ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <ApperIcon name={initialData ? "Save" : "Plus"} className="mr-2 h-4 w-4" />
                      {initialData ? "Update Task" : "Create Task"}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskForm;