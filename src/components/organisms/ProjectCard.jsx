import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'

const STATUS_CONFIG = {
  planning: {
    label: 'Planning',
    variant: 'secondary',
    icon: 'Calendar',
    color: 'text-blue-600 bg-blue-50'
  },
  active: {
    label: 'Active',
    variant: 'success',
    icon: 'Play',
    color: 'text-green-600 bg-green-50'
  },
  completed: {
    label: 'Completed',
    variant: 'outline',
    icon: 'CheckCircle',
    color: 'text-gray-600 bg-gray-50'
  }
}

export default function ProjectCard({ project, onEdit, onDelete }) {
const status = STATUS_CONFIG[project.status_c || project.status] || STATUS_CONFIG.planning

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="glass rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${status.color}`}>
            <ApperIcon name={status.icon} className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 truncate" title={project.name}>
{project.name_c || project.Name}
            </h3>
            <Badge variant={status.variant} className="mt-1">
              {status.label}
            </Badge>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(project)}
            className="hover:bg-blue-50 hover:text-blue-600"
          >
            <ApperIcon name="Edit2" className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(project.Id)}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <ApperIcon name="Trash2" className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Description */}
{(project.description_c || project.description) && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 line-clamp-3" title={project.description_c || project.description}>
            {project.description_c || project.description}
          </p>
        </div>
      )}

      {/* Milestone */}
{(project.milestone_c || project.milestone) && (
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm">
            <ApperIcon name="Target" className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600 font-medium">Current Milestone:</span>
          </div>
          <p className="text-sm text-gray-700 mt-1 pl-6" title={project.milestone_c || project.milestone}>
            {project.milestone_c || project.milestone}
          </p>
        </div>
      )}
{/* Assignee */}
{(project.assignee_c?.Name || project.assignee) && (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <ApperIcon name="User" className="h-4 w-4" />
          <span>Assigned to: <span className="font-medium">{project.assignee_c?.Name || project.assignee}</span></span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <ApperIcon name="Hash" className="h-3 w-3" />
          <span>ID: {project.Id}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(project)}
            className="text-xs"
          >
            <ApperIcon name="Edit2" className="mr-1 h-3 w-3" />
            Edit
          </Button>
        </div>
      </div>
    </motion.div>
  )
}