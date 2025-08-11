import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  onRetry,
  showRetry = true 
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
        <ApperIcon name="AlertTriangle" size={32} className="text-red-500" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-midnight mb-2">Oops! Something went wrong</h3>
        <p className="text-slate-600 mb-4">{message}</p>
        {showRetry && onRetry && (
          <Button onClick={onRetry} variant="outline">
            <ApperIcon name="RefreshCw" size={16} className="mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default Error;