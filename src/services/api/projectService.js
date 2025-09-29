import projectsData from '@/services/mockData/projects.json';

// Create a copy to avoid mutating the original data
let projects = [...projectsData];

// Simulate network delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const projectService = {
  // Get all projects
async getAll() {
    await delay(200);
    const currentUser = getCurrentUser();
    // Filter projects to only return those assigned to current user
    const userProjects = projects.filter(project => project.assignee === currentUser);
    return [...userProjects];
  },

  // Get project by ID
async getById(id) {
    await delay(150);
    const currentUser = getCurrentUser();
    const project = projects.find(p => p.Id === parseInt(id));
    
    if (!project) {
      throw new Error(`Project with ID ${id} not found`);
    }
    
    // Check if user has access to this project
    if (project.assignee !== currentUser) {
      throw new Error(`Access denied: You don't have permission to view this project`);
    }
    
    return { ...project };
  },

// Create new project
async create(projectData) {
    await delay(300);
    const currentUser = getCurrentUser();
    const maxId = projects.reduce((max, p) => Math.max(max, p.Id), 0);
    
    const newProject = {
      Id: maxId + 1,
      name: projectData.name,
      description: projectData.description || "",
      status: projectData.status || "planning",
      milestone: projectData.milestone || "",
      assignee: projectData.assignee || currentUser // Ensure assignee is set
    };

    projects.push(newProject);
    return { ...newProject };
  },

  // Update existing project
async update(id, updates) {
    await delay(250);
    const currentUser = getCurrentUser();
    const index = projects.findIndex(p => p.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error(`Project with ID ${id} not found`);
    }

    // Check if user has access to this project
    if (projects[index].assignee !== currentUser) {
      throw new Error(`Access denied: You don't have permission to modify this project`);
    }

    projects[index] = {
      ...projects[index],
      ...updates
    };
    return { ...projects[index] };
  },

  // Delete project
async delete(id) {
    await delay(200);
    const currentUser = getCurrentUser();
    const index = projects.findIndex(p => p.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error(`Project with ID ${id} not found`);
    }

    // Check if user has access to this project
    if (projects[index].assignee !== currentUser) {
      throw new Error(`Access denied: You don't have permission to delete this project`);
    }

    const deletedProject = projects.splice(index, 1)[0];
    return { ...deletedProject };
  }
};

// Helper function to get current user
function getCurrentUser() {
  // In a real application, this would come from authentication context
  // For now, we'll use an environment variable or default to a test user
  return import.meta?.env?.VITE_CURRENT_USER || 'current-user';
}