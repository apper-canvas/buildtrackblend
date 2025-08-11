import tasksData from '@/services/mockData/tasks.json';

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
    this.nextId = Math.max(...this.tasks.map(t => t.Id), 0) + 1;
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...this.tasks];
  }

  async getByProjectId(projectId) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const projectTasks = this.tasks.filter(task => task.projectId === parseInt(projectId));
    return [...projectTasks];
  }

  async getById(Id) {
    if (!Number.isInteger(Id) || Id <= 0) {
      throw new Error('Invalid task ID');
    }
    
    await new Promise(resolve => setTimeout(resolve, 50));
    const task = this.tasks.find(t => t.Id === Id);
    
    if (!task) {
      throw new Error(`Task with ID ${Id} not found`);
    }
    
    return { ...task };
  }

  async create(taskData) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newTask = {
      ...taskData,
      Id: this.nextId++,
      status: taskData.status || 'Not Started',
      createdAt: new Date().toISOString()
    };
    
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(Id, updateData) {
    if (!Number.isInteger(Id) || Id <= 0) {
      throw new Error('Invalid task ID');
    }

    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = this.tasks.findIndex(t => t.Id === Id);
    if (index === -1) {
      throw new Error(`Task with ID ${Id} not found`);
    }

    // Handle completion date
    if (updateData.status === 'Completed' && this.tasks[index].status !== 'Completed') {
      updateData.completedDate = new Date().toISOString();
    } else if (updateData.status !== 'Completed') {
      updateData.completedDate = null;
    }

    this.tasks[index] = { 
      ...this.tasks[index], 
      ...updateData,
      Id // Ensure ID cannot be changed
    };
    
    return { ...this.tasks[index] };
  }

  async delete(Id) {
    if (!Number.isInteger(Id) || Id <= 0) {
      throw new Error('Invalid task ID');
    }

    await new Promise(resolve => setTimeout(resolve, 150));
    
    const index = this.tasks.findIndex(t => t.Id === Id);
    if (index === -1) {
      throw new Error(`Task with ID ${Id} not found`);
    }

    const deletedTask = { ...this.tasks[index] };
    this.tasks.splice(index, 1);
    
    return deletedTask;
  }

  // Get unique assignees for filtering
  async getAssignees() {
    await new Promise(resolve => setTimeout(resolve, 50));
    const assignees = [...new Map(
      this.tasks.map(task => [task.assigneeId, { 
        id: task.assigneeId, 
        name: task.assigneeName 
      }])
    ).values()];
    return assignees.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Get unique phases for filtering
  async getPhases() {
    await new Promise(resolve => setTimeout(resolve, 50));
    const phases = [...new Map(
      this.tasks.map(task => [task.phaseId, { 
        id: task.phaseId, 
        name: task.phaseName 
      }])
    ).values()];
    return phases.sort((a, b) => a.name.localeCompare(b.name));
  }
}

export const taskService = new TaskService();