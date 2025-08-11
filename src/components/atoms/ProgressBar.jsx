import React from "react";
import { cn } from "@/utils/cn";

const ProgressBar = React.forwardRef(({ 
  className, 
  value = 0, 
  showValue = false,
  variant = "default",
  size = "default",
  ...props 
}, ref) => {
  const baseStyles = "w-full bg-slate-200 rounded-full overflow-hidden";
  
  const variants = {
    default: "bg-gradient-to-r from-construction to-orange-500",
    success: "bg-gradient-to-r from-green-500 to-green-600",
    warning: "bg-gradient-to-r from-yellow-500 to-yellow-600",
    info: "bg-gradient-to-r from-sky to-blue-500",
  };
  
  const sizes = {
    sm: "h-1.5",
    default: "h-2",
    lg: "h-3",
  };

  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div className="flex items-center space-x-2">
      <div
        ref={ref}
        className={cn(baseStyles, sizes[size], className)}
        {...props}
      >
        <div
          className={cn("h-full transition-all duration-500 ease-out", variants[variant])}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showValue && (
        <span className="text-xs font-medium text-slate-600 min-w-[2.5rem]">
          {Math.round(clampedValue)}%
        </span>
      )}
    </div>
  );
});

ProgressBar.displayName = "ProgressBar";

export default ProgressBar;