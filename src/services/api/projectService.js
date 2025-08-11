import projectsData from "@/services/mockData/projects.json";

class ProjectService {
  constructor() {
    this.projects = [...projectsData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [...this.projects].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getById(Id) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const project = this.projects.find(p => p.Id === Id);
    if (!project) {
      throw new Error("Project not found");
    }
    
    return { ...project };
  }

  async create(projectData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newProject = {
      ...projectData,
      Id: Math.max(...this.projects.map(p => p.Id), 0) + 1,
      createdAt: new Date().toISOString(),
    };
    
    this.projects.unshift(newProject);
    return { ...newProject };
  }

  async update(Id, updateData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.projects.findIndex(p => p.Id === Id);
    if (index === -1) {
      throw new Error("Project not found");
    }
    
    this.projects[index] = {
      ...this.projects[index],
      ...updateData,
    };
    
    return { ...this.projects[index] };
  }

  async delete(Id) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.projects.findIndex(p => p.Id === Id);
    if (index === -1) {
      throw new Error("Project not found");
    }
    
    this.projects.splice(index, 1);
    return true;
  }
}

export const projectService = new ProjectService();