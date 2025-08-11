import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { projectService } from "@/services/api/projectService";
import { taskService } from "@/services/api/taskService";
import ApperIcon from "@/components/ApperIcon";
import TaskModal from "@/components/organisms/TaskModal";
import TaskPhaseGroup from "@/components/molecules/TaskPhaseGroup";
import StatusBadge from "@/components/molecules/StatusBadge";
import TaskFilters from "@/components/molecules/TaskFilters";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ProgressBar from "@/components/atoms/ProgressBar";

const TaskContext = createContext({});

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Task-related state
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [assignees, setAssignees] = useState([]);
  const [phases, setPhases] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    assigneeId: '',
    phaseId: ''
  });
  const [expandedPhases, setExpandedPhases] = useState({});
  const [taskModal, setTaskModal] = useState({ isOpen: false, task: null });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const loadProject = async () => {
    try {
      setLoading(true);
      const projectData = await projectService.getById(parseInt(id));
      setProject(projectData);
    } catch (err) {
      setError('Failed to load project details');
      console.error('Error loading project:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      setTasksLoading(true);
      const projectTasks = await taskService.getByProjectId(parseInt(id));
      setTasks(projectTasks);
      setFilteredTasks(projectTasks);
      
      // Auto-expand first phase if tasks exist
      if (projectTasks.length > 0) {
        const firstPhase = projectTasks[0]?.phaseName;
        if (firstPhase) {
          setExpandedPhases(prev => ({ ...prev, [firstPhase]: true }));
        }
      }
    } catch (err) {
      console.error('Error loading tasks:', err);
      toast.error('Failed to load tasks');
    } finally {
      setTasksLoading(false);
    }
  };

  const loadAssignees = async () => {
    try {
      const assigneesData = await taskService.getAssignees();
      setAssignees(assigneesData);
    } catch (err) {
      console.error('Error loading assignees:', err);
    }
  };

  const loadPhases = async () => {
    try {
      const phasesData = await taskService.getPhases();
      setPhases(phasesData);
    } catch (err) {
      console.error('Error loading phases:', err);
    }
  };

  useEffect(() => {
    if (id) {
      loadProject();
      loadTasks();
      loadAssignees();
      loadPhases();
    }
  }, [id]);

  // Apply filters whenever tasks or filters change
  useEffect(() => {
    let filtered = [...tasks];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(task => 
        task.name?.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    // Apply priority filter
    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    // Apply assignee filter
    if (filters.assigneeId) {
      filtered = filtered.filter(task => task.assigneeId === parseInt(filters.assigneeId));
    }

    // Apply phase filter
    if (filters.phaseId) {
      filtered = filtered.filter(task => task.phaseId === parseInt(filters.phaseId));
    }

    setFilteredTasks(filtered);
  }, [tasks, filters]);

  const handleCreateTask = () => {
    setTaskModal({ isOpen: true, task: null });
  };

  const handleEditTask = (task) => {
    setTaskModal({ isOpen: true, task });
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.Id !== taskId));
      toast.success('Task deleted successfully');
    } catch (err) {
      console.error('Error deleting task:', err);
      toast.error('Failed to delete task');
    }
  };

  const handleTaskSaved = () => {
    loadTasks(); // Reload tasks after save
    setTaskModal({ isOpen: false, task: null });
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const updatedTask = await taskService.update(taskId, { status: newStatus });
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ));
      toast.success(`Task status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating task status:', err);
      toast.error('Failed to update task status');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: '',
      priority: '',
      assigneeId: '',
      phaseId: ''
    });
  };

  const togglePhase = (phaseName) => {
    setExpandedPhases(prev => ({
      ...prev,
      [phaseName]: !prev[phaseName]
    }));
  };

  const handleBack = () => {
    navigate('/projects');
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  if (!project) {
    return <Error message="Project not found" />;
  }

  return (
    <TaskContext.Provider value={{
      tasks: filteredTasks,
      assignees,
      phases,
      onCreateTask: handleCreateTask,
      onEditTask: handleEditTask,
      onDeleteTask: handleDeleteTask,
      onStatusChange: handleStatusChange
    }}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="p-2"
                >
                  <ApperIcon name="ArrowLeft" size={20} />
                </Button>
                <div>
                  <h1 className="font-display text-2xl font-bold text-midnight">
                    {project.name}
                  </h1>
                  <div className="flex items-center space-x-4 mt-2">
                    <StatusBadge status={project.status} />
                    <span className="text-slate-600">
                      {project.location}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-slate-600">Budget</div>
                  <div className="font-semibold text-midnight">
                    {formatCurrency(project.budget || project.totalBudget)}
                  </div>
                </div>
                <ProgressBar
                  value={project.progress}
                  className="w-24"
                />
                <span className="font-medium text-midnight">
                  {project.progress}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-slate-200">
            <nav className="flex space-x-8">
              {[
                { key: 'overview', label: 'Overview', icon: 'Home' },
                { key: 'tasks', label: 'Tasks', icon: 'CheckSquare' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-construction text-construction'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <ApperIcon name={tab.icon} size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'overview' && (
            <OverviewTab project={project} formatCurrency={formatCurrency} />
          )}
          {activeTab === 'tasks' && (
            <TasksTab project={project} />
          )}
        </div>

        {/* Task Modal */}
        <TaskModal
          isOpen={taskModal.isOpen}
          task={taskModal.task}
          projectId={parseInt(id)}
          onClose={() => setTaskModal({ isOpen: false, task: null })}
          onTaskSaved={handleTaskSaved}
        />
      </div>
    </TaskContext.Provider>
  );
}

function OverviewTab({ project, formatCurrency }) {
  return (
    <div className="space-y-8">
      {/* Project Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-slate-200 p-6"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-construction/10 rounded-lg">
              <ApperIcon name="Calendar" size={24} className="text-construction" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Start Date</p>
              <p className="font-semibold text-midnight">
                {format(new Date(project.startDate), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg border border-slate-200 p-6"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-sky/10 rounded-lg">
              <ApperIcon name="Clock" size={24} className="text-sky" />
            </div>
            <div>
              <p className="text-sm text-slate-600">End Date</p>
              <p className="font-semibold text-midnight">
                {format(new Date(project.endDate), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg border border-slate-200 p-6"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <ApperIcon name="DollarSign" size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Budget</p>
              <p className="font-semibold text-midnight">
                {formatCurrency(project.budget || project.totalBudget)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Project Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg border border-slate-200 p-6"
      >
        <h3 className="font-display text-lg font-semibold text-midnight mb-4">
          Project Description
        </h3>
        <p className="text-slate-600 leading-relaxed">
          {project.description}
        </p>
      </motion.div>
    </div>
  );
}

function TasksTab({ project }) {
  const {
    tasks,
    assignees,
    phases,
    onCreateTask,
    onEditTask,
    onDeleteTask,
    onStatusChange
  } = useContext(TaskContext);

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    assigneeId: '',
    phaseId: ''
  });
  const [expandedPhases, setExpandedPhases] = useState({});
  const [tasksLoading, setTasksLoading] = useState(false);

  // Group tasks by phase
  const tasksByPhase = tasks.reduce((acc, task) => {
    const phaseName = task.phaseName;
    if (!acc[phaseName]) {
      acc[phaseName] = [];
    }
    acc[phaseName].push(task);
    return acc;
  }, {});

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: '',
      priority: '',
      assigneeId: '',
      phaseId: ''
    });
  };

  const togglePhase = (phaseName) => {
    setExpandedPhases(prev => ({
      ...prev,
      [phaseName]: !prev[phaseName]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-midnight">
            Project Tasks
          </h2>
          <p className="text-slate-600 mt-1">
            Manage and track all tasks for {project.name}
          </p>
        </div>
        <Button
          onClick={onCreateTask}
          className="bg-construction hover:bg-construction/90"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Create Task
        </Button>
      </div>

      {/* Filters */}
      <TaskFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        assignees={assignees}
        phases={phases}
      />

      {/* Tasks by Phase */}
      {tasksLoading ? (
        <div className="flex justify-center py-8">
          <Loading />
        </div>
      ) : Object.keys(tasksByPhase).length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-slate-200 p-12 text-center"
        >
          <ApperIcon name="CheckSquare" size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="font-medium text-midnight mb-2">No tasks found</h3>
          <p className="text-slate-600 mb-4">
            Get started by creating your first task for this project.
          </p>
          <Button
            onClick={onCreateTask}
            className="bg-construction hover:bg-construction/90"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Create Task
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {Object.entries(tasksByPhase).map(([phaseName, phaseTasks], index) => (
            <motion.div
              key={phaseName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <TaskPhaseGroup
                phaseName={phaseName}
                tasks={phaseTasks}
                isExpanded={expandedPhases[phaseName] || false}
                onToggle={() => togglePhase(phaseName)}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
                onStatusChange={onStatusChange}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectDetail;