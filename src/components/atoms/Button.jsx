import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-construction focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95";
  
  const variants = {
    default: "bg-gradient-to-r from-construction to-orange-500 text-white hover:shadow-lg hover:scale-105",
    secondary: "bg-midnight text-white hover:bg-slate-700 hover:shadow-lg",
    outline: "border-2 border-construction text-construction hover:bg-construction hover:text-white",
    ghost: "text-midnight hover:bg-slate-100",
    destructive: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg",
  };
  
  const sizes = {
    default: "h-10 px-6 py-2",
    sm: "h-8 px-4 text-sm",
    lg: "h-12 px-8 text-lg",
    xl: "h-14 px-10 text-xl",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;