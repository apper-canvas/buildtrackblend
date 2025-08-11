import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import TaskModal from "@/components/organisms/TaskModal";
import TaskFilters from "@/components/molecules/TaskFilters";
import TaskPhaseGroup from "@/components/molecules/TaskPhaseGroup";
import { projectService } from "@/services/api/projectService";
import { taskService } from "@/services/api/taskService";
import ApperIcon from "@/components/ApperIcon";
import StatusBadge from "@/components/molecules/StatusBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Badge from "@/components/atoms/Badge";
import ProgressBar from "@/components/atoms/ProgressBar";
const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Tasks state
  const [tasks, setTasks] = useState([]);
  const [taskLoading, setTaskLoading] = useState(false);
  const [taskError, setTaskError] = useState(null);
  const [taskModal, setTaskModal] = useState({ isOpen: false, task: null });
  const [taskFilters, setTaskFilters] = useState({
    search: '',
    status: '',
    priority: '',
    assigneeId: '',
    phaseId: ''
  });
  const [expandedPhases, setExpandedPhases] = useState({});
  const [assignees, setAssignees] = useState([]);
  const [phases, setPhases] = useState([]);

const tabs = [
    { id: "overview", name: "Overview", icon: "FileText" },
    { id: "tasks", name: "Tasks", icon: "CheckSquare" }
  ];

  useEffect(() => {
    loadProject();
  }, [id]);

const loadProject = async () => {
    try {
      setLoading(true);
      setError(null);
      const projectData = await projectService.getById(parseInt(id));
      setProject(projectData);
    } catch (err) {
      console.error("Error loading project:", err);
      setError(err.message);
      toast.error("Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "tasks") {
      loadTasks();
      loadAssignees();
      loadPhases();
    }
  }, [activeTab, id]);

  async function loadTasks() {
    try {
      setTaskLoading(true);
      setTaskError(null);
      const tasksData = await taskService.getByProjectId(parseInt(id));
      setTasks(tasksData);
      
      // Auto-expand phases that have tasks
      const phases = [...new Set(tasksData.map(task => task.phaseName))];
      const initialExpanded = {};
      phases.forEach(phase => {
        initialExpanded[phase] = true;
      });
      setExpandedPhases(initialExpanded);
    } catch (err) {
      console.error("Error loading tasks:", err);
      setTaskError(err.message);
    } finally {
      setTaskLoading(false);
    }
  }

  async function loadAssignees() {
    try {
      const assigneesData = await taskService.getAssignees();
      setAssignees(assigneesData);
    } catch (err) {
      console.error("Error loading assignees:", err);
    }
  }

  async function loadPhases() {
    try {
      const phasesData = await taskService.getPhases();
      setPhases(phasesData);
    } catch (err) {
      console.error("Error loading phases:", err);
    }
  }

  // Task management functions
  const handleCreateTask = () => {
    setTaskModal({ isOpen: true, task: null });
  };

  const handleEditTask = (task) => {
    setTaskModal({ isOpen: true, task });
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskService.delete(taskId);
      toast.success('Task deleted successfully!');
      loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task. Please try again.');
    }
  };

  const handleTaskSaved = () => {
    loadTasks();
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.update(taskId, { status: newStatus });
      toast.success(`Task status updated to ${newStatus}!`);
      loadTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status.');
    }
  };

  const handleFilterChange = (newFilters) => {
    setTaskFilters(newFilters);
  };

  const handleClearFilters = () => {
    setTaskFilters({
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
};

  const handleBack = () => {
    navigate('/projects');
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProject} />;
  if (!project) return <Error message="Project not found" onRetry={handleBack} />;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-slate-600 hover:text-midnight"
          >
            <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>

      {/* Project Title */}
      <div className="bg-white rounded-xl p-6 shadow-card border border-slate-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-display font-bold text-midnight mb-2">
              {project.name}
            </h1>
            <div className="flex items-center space-x-4 text-slate-600">
              <div className="flex items-center">
                <ApperIcon name="MapPin" size={16} className="mr-1" />
                {project.location}
              </div>
              <div className="flex items-center">
                <ApperIcon name="User" size={16} className="mr-1" />
                {project.client}
              </div>
            </div>
          </div>
          <StatusBadge status={project.status} />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-card border border-slate-100">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? "border-construction text-construction"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                <ApperIcon name={tab.icon} size={16} />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

{/* Tab Content */}
        <div className="p-6">
          {activeTab === "overview" && (
            <OverviewTab project={project} formatCurrency={formatCurrency} />
          )}
          
          {activeTab === "tasks" && (
            <TasksTab project={project} />
          )}
        </div>
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
  );
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Overview Tab Component
const OverviewTab = ({ project, formatCurrency }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-8"
  >
    {/* Project Progress */}
    <div className="bg-slate-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-midnight mb-4">Project Progress</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-600">Overall Completion</span>
          <span className="font-medium text-midnight">{project.progress}%</span>
        </div>
        <ProgressBar progress={project.progress} />
      </div>
    </div>

    {/* Project Details Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Basic Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-midnight">Basic Information</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-600 block mb-1">
              Project Name
            </label>
            <p className="text-midnight font-medium">{project.name}</p>
          </div>
<div>
            <label className="text-sm font-medium text-slate-600 block mb-1">
              Client
            </label>
            <p className="text-midnight">{project.client}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600 block mb-1">
              Location
            </label>
            <p className="text-midnight">{project.location}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600 block mb-1">
              Status
            </label>
            <StatusBadge status={project.status} />
          </div>
        </div>
      </div>

      {/* Timeline & Budget */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-midnight">Timeline & Budget</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-600 block mb-1">
              Start Date
            </label>
            <p className="text-midnight">
              {format(new Date(project.startDate), 'MMM dd, yyyy')}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600 block mb-1">
              End Date
            </label>
            <p className="text-midnight">
              {format(new Date(project.endDate), 'MMM dd, yyyy')}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600 block mb-1">
              Budget
            </label>
            <p className="text-midnight font-medium text-lg">
              {formatCurrency(project.totalBudget)}
            </p>
          </div>

          {project.description && (
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1">
                Description
              </label>
              <p className="text-midnight text-sm leading-relaxed">
                {project.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Project Statistics */}
    <div className="bg-slate-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-midnight mb-4">Project Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-construction mb-1">
            {project.progress}%
          </div>
          <div className="text-sm text-slate-600">Completed</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-sky mb-1">
            {formatCurrency(project.totalBudget)}
          </div>
          <div className="text-sm text-slate-600">Total Budget</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-midnight mb-1">
            {Math.ceil((new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24))}
          </div>
          <div className="text-sm text-slate-600">Days Remaining</div>
        </div>
      </div>
    </div>
  </motion.div>
);

// Tasks Tab Component
const TasksTab = ({ project }) => {
  const { 
    tasks, taskLoading, taskError, taskFilters, expandedPhases, assignees, phases,
    handleCreateTask, handleEditTask, handleDeleteTask, handleStatusChange,
    handleFilterChange, handleClearFilters, togglePhase 
  } = React.useContext(TaskContext);

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter(task => {
    if (taskFilters.search && !task.name.toLowerCase().includes(taskFilters.search.toLowerCase()) &&
        !task.description?.toLowerCase().includes(taskFilters.search.toLowerCase())) {
      return false;
    }
    if (taskFilters.status && task.status !== taskFilters.status) return false;
    if (taskFilters.priority && task.priority !== taskFilters.priority) return false;
    if (taskFilters.assigneeId && task.assigneeId !== parseInt(taskFilters.assigneeId)) return false;
    if (taskFilters.phaseId && task.phaseId !== parseInt(taskFilters.phaseId)) return false;
    return true;
  });

  // Group filtered tasks by phase
  const tasksByPhase = filteredTasks.reduce((acc, task) => {
    const phaseName = task.phaseName;
    if (!acc[phaseName]) {
      acc[phaseName] = [];
    }
    acc[phaseName].push(task);
    return acc;
  }, {});

  if (taskLoading) {
    return <Loading />;
  }

  if (taskError) {
    return <Error message={taskError} onRetry={() => window.location.reload()} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Tasks Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-midnight">Project Tasks</h3>
          <p className="text-slate-600 text-sm">
            Manage and track tasks for {project.name}
          </p>
        </div>
        <Button onClick={handleCreateTask}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          New Task
        </Button>
      </div>

      {/* Task Filters */}
      <TaskFilters
        filters={taskFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        assignees={assignees}
        phases={phases}
      />

      {/* Tasks by Phase */}
      <div className="space-y-4">
        {Object.keys(tasksByPhase).length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <ApperIcon name="CheckSquare" size={64} className="mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">No tasks found</h3>
            <p className="text-slate-500 mb-6">
              {tasks.length === 0 ? "Start by creating your first task." : "Try adjusting your filters."}
            </p>
            <Button onClick={handleCreateTask}>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Create Task
            </Button>
          </div>
        ) : (
          Object.entries(tasksByPhase)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([phaseName, phaseTasks]) => (
              <TaskPhaseGroup
                key={phaseName}
                phaseName={phaseName}
                tasks={phaseTasks}
                isExpanded={expandedPhases[phaseName] !== false}
                onToggle={() => togglePhase(phaseName)}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            ))
        )}
      </div>
    </motion.div>
  );
};

// Create a context to pass task functions to TasksTab
// Create a context to pass task functions to TasksTab
const TaskContext = React.createContext();

export default ProjectDetail;