import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-base text-midnight placeholder:text-slate-400 focus:border-construction focus:outline-none focus:ring-2 focus:ring-construction/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;