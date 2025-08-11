import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ onClose, isMobile = false }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard", active: true },
    { name: "Projects", href: "/projects", icon: "Building", active: true },
    { name: "Tasks", href: "/tasks", icon: "CheckSquare", active: false },
    { name: "Resources", href: "/resources", icon: "Users", active: false },
    { name: "Financials", href: "/financials", icon: "DollarSign", active: false },
    { name: "Reports", href: "/reports", icon: "BarChart3", active: false },
  ];

  const sidebarClasses = cn(
    "h-screen bg-midnight text-white flex flex-col",
    isMobile 
      ? "w-64 fixed inset-y-0 left-0 z-50" 
      : "w-64 fixed inset-y-0 left-0"
  );

  return (
    <div className={sidebarClasses}>
      {/* Logo */}
      <div className="p-6 border-b border-slate-600">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-construction to-orange-500">
            <ApperIcon name="Building2" size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold">BuildTrack</h1>
            <p className="text-xs text-slate-400">Pro</p>
          </div>
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <ApperIcon name="X" size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={isMobile ? onClose : undefined}
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive && item.active
                  ? "bg-gradient-to-r from-construction to-orange-500 text-white shadow-lg"
                  : item.active
                  ? "text-slate-300 hover:text-white hover:bg-slate-700"
                  : "text-slate-500 cursor-not-allowed opacity-60"
              )
            }
          >
            <ApperIcon 
              name={item.icon} 
              size={20} 
              className={cn(
                "transition-colors",
                item.active ? "" : "opacity-50"
              )}
            />
            <span className="font-medium">{item.name}</span>
            {!item.active && (
              <span className="ml-auto text-xs bg-slate-600 px-2 py-1 rounded text-slate-300">
                Soon
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-600">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-construction to-orange-500 flex items-center justify-center">
            <ApperIcon name="User" size={16} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">John Smith</p>
            <p className="text-xs text-slate-400">Project Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;