import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const ProjectForm = ({ isOpen, onClose, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    clientName: "",
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: "",
    totalBudget: "",
    status: "Planning"
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Project name is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.clientName.trim()) newErrors.clientName = "Client name is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.totalBudget || parseFloat(formData.totalBudget) <= 0) {
      newErrors.totalBudget = "Valid budget amount is required";
    }
    
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        totalBudget: parseFloat(formData.totalBudget),
        spentBudget: 0,
        progress: 0
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      location: "",
      clientName: "",
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: "",
      totalBudget: "",
      status: "Planning"
    });
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-display font-bold text-midnight">Create New Project</h2>
                  <p className="text-slate-600 mt-1">Set up your construction project details</p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  disabled={isLoading}
                >
                  <ApperIcon name="X" size={20} className="text-slate-400" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <FormField
                    label="Project Name"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter project name"
                    error={errors.name}
                    disabled={isLoading}
                  />
                </div>

                <FormField
                  label="Location"
                  required
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="Enter project location"
                  error={errors.location}
                  disabled={isLoading}
                />

                <FormField
                  label="Client Name"
                  required
                  value={formData.clientName}
                  onChange={(e) => handleInputChange("clientName", e.target.value)}
                  placeholder="Enter client name"
                  error={errors.clientName}
                  disabled={isLoading}
                />

                <FormField
                  label="Start Date"
                  required
                  error={errors.startDate}
                >
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                    disabled={isLoading}
                  />
                </FormField>

                <FormField
                  label="End Date"
                  required
                  error={errors.endDate}
                >
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                    disabled={isLoading}
                  />
                </FormField>

                <FormField
                  label="Total Budget"
                  required
                  error={errors.totalBudget}
                >
                  <Input
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.totalBudget}
                    onChange={(e) => handleInputChange("totalBudget", e.target.value)}
                    placeholder="Enter budget amount"
                    disabled={isLoading}
                  />
                </FormField>

                <FormField
                  label="Initial Status"
                  required
                >
                  <Select
                    value={formData.status}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="On Hold">On Hold</option>
                  </Select>
                </FormField>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-200">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="min-w-32"
                >
                  {isLoading ? (
                    <>
                      <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Plus" size={16} className="mr-2" />
                      Create Project
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProjectForm;