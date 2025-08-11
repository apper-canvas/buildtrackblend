import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ProgressBar from "@/components/atoms/ProgressBar";
import ApperIcon from "@/components/ApperIcon";
import StatusBadge from "@/components/molecules/StatusBadge";
import { projectService } from "@/services/api/projectService";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", name: "Overview", icon: "FileText" }
  ];

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      setLoading(true);
      setError("");
      const projectData = await projectService.getById(parseInt(id));
      setProject(projectData);
    } catch (err) {
      setError("Failed to load project details");
      toast.error("Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleBack = () => {
    navigate("/projects");
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
                        {formatCurrency(project.budget)}
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
                      {formatCurrency(project.budget)}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;