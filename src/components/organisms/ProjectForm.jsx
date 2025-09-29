import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";

const PROJECT_STATUSES = [
  { value: 'planning', label: 'Planning', icon: 'Calendar' },
  { value: 'active', label: 'Active', icon: 'Play' },
  { value: 'completed', label: 'Completed', icon: 'CheckCircle' }
]

export default function ProjectForm({ project, onSubmit, onClose }) {
const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning',
    milestone: '',
    assignee: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Populate form when editing
useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        status: project.status || 'planning',
        milestone: project.milestone || '',
        assignee: project.assignee || ''
      })
    }
  }, [project])

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Form validation
const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required'
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Project name must be at least 3 characters'
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Project name must be less than 100 characters'
    }

    if (formData.description.trim().length > 500) {
      newErrors.description = 'Description must be less than 500 characters'
    }

    if (formData.milestone.trim().length > 200) {
      newErrors.milestone = 'Milestone must be less than 200 characters'
    }

    if (formData.assignee.trim().length > 0 && formData.assignee.trim().length < 3) {
      newErrors.assignee = 'Assignee name must be at least 3 characters'
    } else if (formData.assignee.trim().length > 50) {
      newErrors.assignee = 'Assignee name must be less than 50 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      await onSubmit({
...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
        milestone: formData.milestone.trim(),
        assignee: formData.assignee.trim()
      })
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setLoading(false)
    }
  }

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
    <motion.div
        initial={{
            opacity: 0
        }}
        animate={{
            opacity: 1
        }}
        exit={{
            opacity: 0
        }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}>
        <motion.div
            initial={{
                opacity: 0,
                scale: 0.95,
                y: 20
            }}
            animate={{
                opacity: 1,
                scale: 1,
                y: 0
            }}
            exit={{
                opacity: 0,
                scale: 0.95,
                y: 20
            }}
            className="glass rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}>
            {/* Fixed Header */}
            <div
                className="flex items-center justify-between p-6 pb-4 border-b border-gray-200/50 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="gradient-primary p-2 rounded-lg">
                        <ApperIcon name="Folder" className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {project ? "Edit Project" : "Create Project"}
                        </h2>
                        <p className="text-sm text-gray-600">
                            {project ? "Update project details" : "Add a new project to your workspace"}
                        </p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="shrink-0 hover:bg-gray-100">
                    <ApperIcon name="X" className="h-4 w-4" />
                </Button>
            </div>
            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto max-h-[70vh]">
                <div className="p-6 pt-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <form id="project-form" onSubmit={handleSubmit} className="space-y-4">
                            {/* Project Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *
                                                  </label>
                                <Input
                                    value={formData.name}
                                    onChange={e => handleChange("name", e.target.value)}
                                    placeholder="Enter project name..."
                                    className={errors.name ? "border-red-300 focus:border-red-500" : ""}
                                    maxLength={100} />
                                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                            </div>
                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description
                                                  </label>
                                <Textarea
                                    value={formData.description}
                                    onChange={e => handleChange("description", e.target.value)}
                                    placeholder="Describe your project..."
                                    rows={3}
                                    className={errors.description ? "border-red-300 focus:border-red-500" : ""}
                                    maxLength={500} />
                                {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
                                <p className="text-xs text-gray-500 mt-1">
                                    {formData.description.length}/500 characters
                                                  </p>
                            </div>
{/* Milestone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Current Milestone
                                                  </label>
                                <Input
                                    value={formData.milestone}
                                    onChange={e => handleChange("milestone", e.target.value)}
                                    placeholder="What's the current milestone?"
                                    className={errors.milestone ? "border-red-300 focus:border-red-500" : ""}
                                    maxLength={200} />
                                {errors.milestone && <p className="text-red-600 text-sm mt-1">{errors.milestone}</p>}
                                <p className="text-xs text-gray-500 mt-1">
                                    {formData.milestone.length}/200 characters
                                                  </p>
                            </div>

                            {/* Assignee */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Project Assignee</label>
                                <Input
                                    value={formData.assignee}
                                    onChange={e => handleChange("assignee", e.target.value)}
                                    placeholder="Who's responsible for this project?"
                                    className={errors.assignee ? "border-red-300 focus:border-red-500" : ""}
                                    maxLength={50} />
                                {errors.assignee && <p className="text-red-600 text-sm mt-1">{errors.assignee}</p>}
                                <p className="text-xs text-gray-500 mt-1">
                                    {formData.assignee.length}/50 characters
                                </p>
                            </div>
                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status
                                                  </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {PROJECT_STATUSES.map(status => <button
                                        key={status.value}
                                        type="button"
                                        onClick={() => handleChange("status", status.value)}
                                        className={`p-3 rounded-lg border-2 transition-all text-center ${formData.status === status.value ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}`}>
                                        <ApperIcon
                                            name={status.icon}
                                            className={`h-4 w-4 mx-auto mb-1 ${formData.status === status.value ? "text-primary" : "text-gray-400"}`} />
                                        <p
                                            className={`text-xs font-medium ${formData.status === status.value ? "text-primary" : "text-gray-600"}`}>
                                            {status.label}
                                        </p>
                                    </button>)}
                                </div>
                            </div>
                        </form>
                    </form></div>
            </div>
            {/* Fixed Action Buttons */}
            <div className="p-6 pt-4 border-t border-gray-200/50 shrink-0">
                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                        disabled={loading}>Cancel
                                      </Button>
                    <Button type="submit" form="project-form" className="flex-1" disabled={loading}>
                        {loading ? <div className="flex items-center gap-2">
                            <div
                                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {project ? "Updating..." : "Creating..."}
                        </div> : <>
                            <ApperIcon name={project ? "Save" : "Plus"} className="mr-2 h-4 w-4" />
                            {project ? "Update Project" : "Create Project"}
                        </>}
                    </Button>
                </div>
            </div>
        </motion.div>
    </motion.div>
</AnimatePresence>
  )
}