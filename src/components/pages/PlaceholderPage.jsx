import React from "react";
import ApperIcon from "@/components/ApperIcon";

const PlaceholderPage = ({ 
  title, 
  description, 
  icon = "Package",
  features = []
}) => {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-midnight">{title}</h1>
          <p className="text-slate-600 mt-2">{description}</p>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="bg-white rounded-xl p-12 shadow-card border border-slate-100 text-center">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-construction/10 mx-auto mb-6">
            <ApperIcon name={icon} size={40} className="text-construction" />
          </div>
          <h2 className="text-2xl font-display font-bold text-midnight mb-4">
            {title} Coming Soon
          </h2>
          <p className="text-slate-600 mb-6">
            We're working on advanced {title.toLowerCase()} features to enhance your construction project management experience.
          </p>
          {features.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-500">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <ApperIcon name="Check" size={16} className="text-construction" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;