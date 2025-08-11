import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import StatusBadge from "@/components/molecules/StatusBadge";
import ProjectMetric from "@/components/molecules/ProjectMetric";
import ProgressBar from "@/components/atoms/ProgressBar";
import ApperIcon from "@/components/ApperIcon";
import { format, differenceInDays } from "date-fns";

const ProjectCard = ({ project, onClick }) => {
  const { 
    name, 
    location, 
    clientName, 
    status, 
    startDate, 
    endDate, 
    totalBudget, 
    spentBudget,
    progress 
  } = project;

  const daysRemaining = differenceInDays(new Date(endDate), new Date());
  const budgetUtilization = totalBudget > 0 ? (spentBudget / totalBudget) * 100 : 0;
  
  const isOverBudget = budgetUtilization > 100;
  const isNearDeadline = daysRemaining <= 7 && daysRemaining > 0;
  const isOverdue = daysRemaining < 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDaysRemainingText = () => {
    if (isOverdue) return `${Math.abs(daysRemaining)} days overdue`;
    if (daysRemaining === 0) return "Due today";
    return `${daysRemaining} days left`;
  };

  const getDaysRemainingVariant = () => {
    if (isOverdue) return "error";
    if (isNearDeadline) return "warning";
    return "default";
  };

  const getBudgetVariant = () => {
    if (isOverBudget) return "error";
    if (budgetUtilization > 80) return "warning";
    return "success";
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer border border-slate-100 group"
      onClick={() => onClick?.(project)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-midnight font-display truncate group-hover:text-construction transition-colors">
            {name}
          </h3>
          <p className="text-sm text-slate-600 flex items-center mt-1">
            <ApperIcon name="MapPin" size={14} className="mr-1 text-slate-400" />
            {location}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Client: {clientName}
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-midnight">Progress</span>
          <span className="text-sm font-semibold text-construction">{progress}%</span>
        </div>
        <ProgressBar value={progress} />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <ProjectMetric
          icon={isOverdue ? "AlertTriangle" : "Calendar"}
          label="Timeline"
          value={getDaysRemainingText()}
          variant={getDaysRemainingVariant()}
        />
        <ProjectMetric
          icon={isOverBudget ? "TrendingUp" : "DollarSign"}
          label="Budget"
          value={`${Math.round(budgetUtilization)}%`}
          variant={getBudgetVariant()}
        />
      </div>

      {/* Budget Details */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-600">
            Spent: {formatCurrency(spentBudget)}
          </span>
          <span className="font-medium text-midnight">
            Total: {formatCurrency(totalBudget)}
          </span>
        </div>
      </div>

      {/* Warning indicators */}
      {(isOverdue || isOverBudget) && (
        <div className="mt-3 flex items-center space-x-2 text-xs">
          {isOverdue && (
            <span className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded">
              <ApperIcon name="AlertTriangle" size={12} className="mr-1" />
              Overdue
            </span>
          )}
          {isOverBudget && (
            <span className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded">
              <ApperIcon name="TrendingUp" size={12} className="mr-1" />
              Over Budget
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ProjectCard;