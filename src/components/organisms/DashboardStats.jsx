import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const DashboardStats = ({ projects = [] }) => {
  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === "In Progress").length,
    completed: projects.filter(p => p.status === "Completed").length,
    onHold: projects.filter(p => p.status === "On Hold").length,
  };

  const totalBudget = projects.reduce((sum, p) => sum + p.totalBudget, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.spentBudget, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statCards = [
    {
      title: "Total Projects",
      value: stats.total,
      icon: "Building",
      gradient: "from-sky to-blue-500",
      change: "+2 this month",
    },
    {
      title: "Active Projects",
      value: stats.active,
      icon: "Activity",
      gradient: "from-construction to-orange-500",
      change: `${stats.active} in progress`,
    },
    {
      title: "Total Budget",
      value: formatCurrency(totalBudget),
      icon: "DollarSign",
      gradient: "from-green-500 to-green-600",
      change: formatCurrency(totalSpent) + " spent",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: "CheckCircle",
      gradient: "from-purple-500 to-purple-600",
      change: `${stats.onHold} on hold`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-200 border border-slate-100 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${stat.gradient}`}>
              <ApperIcon name={stat.icon} size={24} className="text-white" />
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-600">{stat.title}</p>
            <p className="text-2xl font-bold text-midnight font-display">{stat.value}</p>
            <p className="text-xs text-slate-500">{stat.change}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;