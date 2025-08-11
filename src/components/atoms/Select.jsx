import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        className={cn(
          "flex h-11 w-full appearance-none rounded-lg border-2 border-slate-200 bg-white px-4 py-2 pr-10 text-base text-midnight focus:border-construction focus:outline-none focus:ring-2 focus:ring-construction/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      <ApperIcon 
        name="ChevronDown" 
        size={16} 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
      />
    </div>
  );
});

Select.displayName = "Select";

export default Select;