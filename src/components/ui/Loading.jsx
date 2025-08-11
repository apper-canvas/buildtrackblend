import React from "react";

const Loading = ({ type = "cards" }) => {
  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-card animate-pulse">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <div className="h-3 bg-slate-200 rounded w-16"></div>
                <div className="h-3 bg-slate-200 rounded w-10"></div>
              </div>
              <div className="h-2 bg-slate-200 rounded-full"></div>
            </div>
            
            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-slate-200 rounded"></div>
                <div className="flex flex-col space-y-1">
                  <div className="h-2 bg-slate-200 rounded w-12"></div>
                  <div className="h-3 bg-slate-200 rounded w-16"></div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-slate-200 rounded"></div>
                <div className="flex flex-col space-y-1">
                  <div className="h-2 bg-slate-200 rounded w-12"></div>
                  <div className="h-3 bg-slate-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-64">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-construction rounded-full animate-spin"></div>
        <div className="mt-4 text-center">
          <div className="h-4 bg-slate-200 rounded w-24 mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;