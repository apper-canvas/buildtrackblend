import React from "react";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";

const Tasks = () => {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-midnight">Tasks</h1>
          <p className="text-slate-600 mt-2">Manage project tasks and assignments</p>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="bg-white rounded-xl p-12 shadow-card border border-slate-100 text-center">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-construction/10 mx-auto mb-6">
            <ApperIcon name="CheckSquare" size={40} className="text-construction" />
          </div>
          <h2 className="text-2xl font-display font-bold text-midnight mb-4">
            Task Management Coming Soon
          </h2>
          <p className="text-slate-600 mb-6">
            We're building an advanced task management system that will help you organize, assign, and track tasks across all your construction projects.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-500">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Users" size={16} className="text-construction" />
              <span>Team assignments</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Calendar" size={16} className="text-construction" />
              <span>Due date tracking</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="CheckCircle" size={16} className="text-construction" />
              <span>Progress monitoring</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="MessageCircle" size={16} className="text-construction" />
              <span>Team collaboration</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;