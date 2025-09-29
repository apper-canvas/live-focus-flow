import projectsData from "@/services/mockData/projects.json";

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
    return [...projects];
  },

  // Get project by ID
  async getById(id) {
    await delay(150);
    const project = projects.find(p => p.Id === parseInt(id));
    if (!project) {
      throw new Error(`Project with ID ${id} not found`);
    }
    return { ...project };
  },

// Create new project
  async create(projectData) {
    await delay(300);
    const maxId = projects.reduce((max, p) => Math.max(max, p.Id), 0);
    
    const newProject = {
      Id: maxId + 1,
      name: projectData.name,
      description: projectData.description || "",
      status: projectData.status || "planning",
      milestone: projectData.milestone || ""
    };

    projects.push(newProject);
    return { ...newProject };
  },

  // Update existing project
  async update(id, updates) {
    await delay(250);
    const index = projects.findIndex(p => p.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error(`Project with ID ${id} not found`);
    }

projects[index] = {
      ...projects[index],
      ...updates
    };

    return { ...projects[index] };
  },

  // Get project statistics
  async getStats() {
    try {
      await delay(300);
      
      const projectsCopy = projects.map(project => ({ ...project }));
      
      const total = projectsCopy.length;
      const completed = projectsCopy.filter(project => project.status === 'completed').length;
      const active = projectsCopy.filter(project => project.status === 'active').length;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        total,
        completed,
        active,
        completionRate
      };
    } catch (error) {
      console.error('Error getting project stats:', error);
      return {
        total: 0,
        completed: 0,
        active: 0,
        completionRate: 0
      };
    }
  },
// Delete project
  async delete(id) {
    await delay(200);
    const index = projects.findIndex(p => p.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error(`Project with ID ${id} not found`);
    }

    const deletedProject = projects.splice(index, 1)[0];
    return { ...deletedProject };
  }
};