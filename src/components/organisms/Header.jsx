import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ onMenuClick }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ApperIcon name="Menu" size={20} className="text-midnight" />
          </button>

          <div>
            <h2 className="text-2xl font-display font-bold text-midnight">
              Welcome back, John
            </h2>
            <p className="text-slate-600">
              Let's build something amazing today
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button>
            <ApperIcon name="Plus" size={16} className="mr-2" />
            New Project
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;