import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ProjectCard from "@/components/organisms/ProjectCard";
import ProjectForm from "@/components/organisms/ProjectForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { projectService } from "@/services/api/projectService";
const Projects = () => {
const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [filters, setFilters] = useState({
    status: "All",
    search: ""
  });
  const [sortBy, setSortBy] = useState("newest");

  const statusOptions = ["All", "Planning", "In Progress", "On Hold", "Completed"];

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

  useEffect(() => {
    let filtered = projects;

    // Filter by status
    if (filters.status !== "All") {
      filtered = filtered.filter(project => project.status === filters.status);
    }

    // Filter by search
    if (filters.search.trim()) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(search) ||
        project.location.toLowerCase().includes(search) ||
        project.clientName.toLowerCase().includes(search)
      );
    }

    // Sort projects
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "deadline":
        filtered.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
        break;
      case "budget":
        filtered.sort((a, b) => b.totalBudget - a.totalBudget);
        break;
      default:
        break;
    }

    setFilteredProjects(filtered);
  }, [projects, filters, sortBy]);

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
    navigate(`/projects/${project.Id}`);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadProjects} />;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-midnight">All Projects</h1>
          <p className="text-slate-600 mt-2">
            {projects.length === 0 ? "No projects created yet" : `Managing ${projects.length} construction projects`}
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          New Project
        </Button>
      </div>

      {projects.length > 0 && (
        <>
          {/* Filters and Search */}
          <div className="bg-white rounded-xl p-6 shadow-card border border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <ApperIcon 
                    name="Search" 
                    size={18} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  />
                  <Input
                    placeholder="Search projects..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="w-full md:w-48">
                <Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </Select>
              </div>

              {/* Sort */}
              <div className="w-full md:w-48">
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="deadline">Deadline</option>
                  <option value="budget">Budget (High-Low)</option>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {(filters.status !== "All" || filters.search) && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200">
                <span className="text-sm text-slate-600">Active filters:</span>
                {filters.status !== "All" && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-construction/10 text-construction">
                    Status: {filters.status}
                    <button
                      onClick={() => handleFilterChange("status", "All")}
                      className="ml-1 hover:text-construction/70"
                    >
                      <ApperIcon name="X" size={12} />
                    </button>
                  </span>
                )}
                {filters.search && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-sky/10 text-sky">
                    Search: "{filters.search}"
                    <button
                      onClick={() => handleFilterChange("search", "")}
                      className="ml-1 hover:text-sky/70"
                    >
                      <ApperIcon name="X" size={12} />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>
              Showing {filteredProjects.length} of {projects.length} projects
            </span>
            {filteredProjects.length !== projects.length && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilters({ status: "All", search: "" });
                  setSortBy("newest");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </>
      )}

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Empty
          title="No projects yet"
          description="Create your first construction project to get started with tracking progress, budgets, and timelines."
          actionText="Create Your First Project"
          onAction={() => setShowCreateForm(true)}
          icon="Building"
        />
      ) : filteredProjects.length === 0 ? (
        <Empty
          title="No projects match your filters"
          description="Try adjusting your search terms or filters to find the projects you're looking for."
          actionText="Clear Filters"
          onAction={() => {
            setFilters({ status: "All", search: "" });
            setSortBy("newest");
          }}
          icon="Filter"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProjectCard
                project={project}
                onClick={handleProjectClick}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

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

export default Projects;