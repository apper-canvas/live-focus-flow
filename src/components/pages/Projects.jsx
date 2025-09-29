import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { projectService } from "@/services/api/projectService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Dashboard from "@/components/pages/Dashboard";
import Tasks from "@/components/pages/Tasks";
import Button from "@/components/atoms/Button";
import ProjectCard from "@/components/organisms/ProjectCard";
import ProjectForm from "@/components/organisms/ProjectForm";
import SearchBar from "@/components/molecules/SearchBar";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
export default function Projects() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  // State management
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all')

  // Load projects
  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await projectService.getAll()
      setProjects(data)
    } catch (err) {
      setError(err.message)
      toast.error(`Failed to load projects: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Create project handler
  const handleCreateProject = async (projectData) => {
    try {
      const newProject = await projectService.create(projectData)
      setProjects(prev => [newProject, ...prev])
      toast.success('Project created successfully!')
      setShowForm(false)
    } catch (error) {
      toast.error(`Failed to create project: ${error.message}`)
      throw error
    }
  }

  // Edit project handlers
  const handleEditProject = (project) => {
    setEditingProject(project)
    setShowForm(true)
  }

  const handleUpdateProject = async (projectData) => {
    try {
      const updatedProject = await projectService.update(editingProject.Id, projectData)
      setProjects(prev => prev.map(p => p.Id === editingProject.Id ? updatedProject : p))
      toast.success('Project updated successfully!')
      handleCloseForm()
    } catch (error) {
      toast.error(`Failed to update project: ${error.message}`)
      throw error
    }
  }

  // Delete project handler
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return
    }

    try {
      await projectService.delete(projectId)
      setProjects(prev => prev.filter(p => p.Id !== projectId))
      toast.success('Project deleted successfully!')
    } catch (error) {
      toast.error(`Failed to delete project: ${error.message}`)
    }
  }

  // Form handlers
  const handleCloseForm = () => {
    setShowForm(false)
    setEditingProject(null)
  }

  const handleOpenProjectForm = () => {
    setEditingProject(null)
    setShowForm(true)
  }

  // Search handler
  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query)
    const newParams = new URLSearchParams(searchParams)
    if (query) {
      newParams.set('search', query)
    } else {
      newParams.delete('search')
    }
    setSearchParams(newParams)
  }, [searchParams, setSearchParams])

  // Filter handler
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status)
    const newParams = new URLSearchParams(searchParams)
    if (status && status !== 'all') {
      newParams.set('status', status)
    } else {
      newParams.delete('status')
    }
    setSearchParams(newParams)
  }

  // Filter projects
const filteredProjects = projects.filter(project => {
    const matchesSearch = !searchQuery || 
      (project.name_c || project.Name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description_c || project.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    
const matchesStatus = statusFilter === 'all' || (project.status_c || project.status) === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const projectCount = filteredProjects.length
const statusCounts = {
    all: projects.length,
    active: projects.filter(p => (p.status_c || p.status) === 'active').length,
    planning: projects.filter(p => (p.status_c || p.status) === 'planning').length,
    completed: projects.filter(p => (p.status_c || p.status) === 'completed').length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Error message={error} onRetry={loadProjects} />
      </div>
    )
  }

return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-primary to-secondary p-2">
                <ApperIcon name="Target" className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Focus Flow</h1>
                <p className="text-xs text-gray-500">Project Management</p>
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
              >
                <ApperIcon name="CheckSquare" className="mr-2 h-4 w-4" />
                Tasks
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/projects')}
                className="text-primary font-medium"
              >
                <ApperIcon name="Folder" className="mr-2 h-4 w-4" />
                Projects
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 max-w-md">
              <SearchBar
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search projects..."
              />
            </div>
            
            <div className="flex flex-wrap gap-3 items-center">
              {/* Status filters */}
              <div className="flex gap-2">
                {Object.entries(statusCounts).map(([status, count]) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusFilterChange(status)}
                    className="capitalize"
                  >
                    {status} ({count})
                  </Button>
                ))}
              </div>
              
              <Button onClick={handleOpenProjectForm} className="shrink-0">
                <ApperIcon name="Plus" className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Project List */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {filteredProjects.length === 0 ? (
            <Empty 
              title="No projects found"
              description={searchQuery || statusFilter !== 'all' 
                ? "Try adjusting your search or filter criteria" 
                : "Create your first project to get started"}
              action={
                <Button onClick={handleOpenProjectForm}>
                  <ApperIcon name="Plus" className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
              }
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <ProjectCard
                    project={project}
                    onEdit={handleEditProject}
                    onDelete={handleDeleteProject}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Project Form Modal */}
        {showForm && (
          <ProjectForm
            project={editingProject}
            onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
            onClose={handleCloseForm}
          />
        )}
      </main>
    </div>
  )
}