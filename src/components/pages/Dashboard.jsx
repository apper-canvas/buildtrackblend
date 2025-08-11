import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ProjectCard from "@/components/organisms/ProjectCard";
import ProjectForm from "@/components/organisms/ProjectForm";
import DashboardStats from "@/components/organisms/DashboardStats";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { projectService } from "@/services/api/projectService";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const loadProjects = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err) {
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (projectData) => {
    try {
      setIsCreating(true);
      const newProject = await projectService.create(projectData);
      setProjects(prev => [newProject, ...prev]);
      toast.success("Project created successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to create project");
    } finally {
      setIsCreating(false);
    }
  };

  const handleProjectClick = (project) => {
    toast.info(`Opening project: ${project.name}`, {
      autoClose: 2000
    });
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-card animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-slate-200 rounded-lg"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-20"></div>
                <div className="h-8 bg-slate-200 rounded w-16"></div>
                <div className="h-3 bg-slate-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
        <Loading type="cards" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-card">
              <div className="flex items-center justify-center h-20">
                <ApperIcon name="AlertTriangle" size={32} className="text-slate-400" />
              </div>
            </div>
          ))}
        </div>
        <Error message={error} onRetry={loadProjects} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-midnight">Project Dashboard</h1>
          <p className="text-slate-600 mt-2">Monitor and manage all your construction projects</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats Dashboard */}
      <DashboardStats projects={projects} />

      {/* Projects Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-midnight">Recent Projects</h2>
          {projects.length > 0 && (
            <Button variant="ghost" size="sm">
              View All Projects
              <ApperIcon name="ArrowRight" size={14} className="ml-2" />
            </Button>
          )}
        </div>

        {projects.length === 0 ? (
          <Empty
            title="No projects yet"
            description="Create your first construction project to get started with tracking progress, budgets, and timelines."
            actionText="Create Your First Project"
            onAction={() => setShowCreateForm(true)}
            icon="Building"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProjectCard
                  project={project}
                  onClick={handleProjectClick}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Create Project Modal */}
      <ProjectForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSubmit={handleCreateProject}
        isLoading={isCreating}
      />
    </div>
  );
};

export default Dashboard;