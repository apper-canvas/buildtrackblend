import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const baseStyles = "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors";
  
  const variants = {
    default: "bg-slate-100 text-slate-800",
    planning: "bg-sky/10 text-sky border border-sky/20",
    inprogress: "bg-construction/10 text-construction border border-construction/20",
    onhold: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    completed: "bg-green-100 text-green-800 border border-green-200",
    success: "bg-green-100 text-green-800",
    destructive: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
  };

  return (
    <div
      ref={ref}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export default Badge;