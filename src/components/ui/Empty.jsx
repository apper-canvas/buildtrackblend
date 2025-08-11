import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No items found",
  description = "Get started by creating your first item.",
  actionText = "Create New",
  onAction,
  icon = "Plus"
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-100">
        <ApperIcon name={icon} size={32} className="text-slate-400" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-midnight mb-2">{title}</h3>
        <p className="text-slate-600 mb-4 max-w-sm">{description}</p>
        {onAction && (
          <Button onClick={onAction}>
            <ApperIcon name="Plus" size={16} className="mr-2" />
            {actionText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;