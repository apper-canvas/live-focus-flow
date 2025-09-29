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
    const { user, isOwner } = getCurrentUser();
    
    // If owner, return all projects; otherwise filter by assignee
    if (isOwner) {
      return [...projects];
    }
    
// Filter projects by assignee name (now from lookup)
    const userProjects = projects.filter(project => project.assignee === user);
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
    
    // Check if user has access to this project (skip check for owner)
const { user, isOwner } = getCurrentUser();
    // Check access using assignee name from lookup
    if (!isOwner && project.assignee !== user) {
      throw new Error(`Access denied: You don't have permission to view this project`);
    }
    return { ...project };
  },

// Create new project
async create(projectData) {
    await delay(300);
    const { user } = getCurrentUser();
    const maxId = projects.reduce((max, p) => Math.max(max, p.Id), 0);
    
    const newProject = {
      Id: maxId + 1,
      name: projectData.name,
      description: projectData.description || "",
      status: projectData.status || "planning",
      milestone: projectData.milestone || "",
      assignee: projectData.assignee || user // Use lookup value or current user as fallback
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

// Check if user has access to this project (skip check for owner)
    const { user, isOwner } = getCurrentUser();
    // Check access using assignee name from lookup
    if (!isOwner && projects[index].assignee !== user) {
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

// Check if user has access to this project (skip check for owner)
const { user, isOwner } = getCurrentUser();
    // Check access using assignee name from lookup
    if (!isOwner && projects[index].assignee !== user) {
      throw new Error(`Access denied: You don't have permission to delete this project`);
    }

    const deletedProject = projects.splice(index, 1)[0];
    return { ...deletedProject };
  }
};

// Helper function to get current user
function getCurrentUser() {
  // In a real application, this would come from authentication context
  const user = import.meta?.env?.VITE_CURRENT_USER || 'current-user';
  const appOwner = import.meta?.env?.VITE_APP_OWNER;
  const isOwner = appOwner && user === appOwner;
  
  return { user, isOwner };
}