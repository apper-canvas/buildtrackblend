import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const ProjectMetric = ({ 
  icon, 
  label, 
  value, 
  variant = "default",
  className 
}) => {
  const variants = {
    default: "text-midnight",
    success: "text-green-600",
    warning: "text-yellow-600",
    error: "text-red-600",
    info: "text-sky",
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <ApperIcon 
        name={icon} 
        size={16} 
        className={cn("text-slate-400", variants[variant])} 
      />
      <div className="flex flex-col">
        <span className="text-xs text-slate-500 uppercase tracking-wide">{label}</span>
        <span className={cn("text-sm font-semibold", variants[variant])}>{value}</span>
      </div>
    </div>
  );
};

export default ProjectMetric;