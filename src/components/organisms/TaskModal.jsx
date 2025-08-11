import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { taskService } from "@/services/api/taskService";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";

const TaskModal = ({ 
  isOpen, 
  onClose, 
  task = null, 
  projectId,
  onTaskSaved 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phaseId: '',
    phaseName: '',
    dueDate: '',
    priority: 'Medium',
    estimatedDuration: '',
    assigneeId: '',
    assigneeName: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [assignees, setAssignees] = useState([]);
  const [phases, setPhases] = useState([]);

  // Mock data for assignees and phases (in real app, these would come from APIs)
  const mockAssignees = [
    { id: 1, name: "John Martinez" },
    { id: 2, name: "Sarah Chen" },
    { id: 3, name: "Mike Rodriguez" },
    { id: 4, name: "Lisa Thompson" },
    { id: 5, name: "David Kim" },
    { id: 6, name: "Emily Davis" }
  ];

  const mockPhases = [
    { id: 1, name: "Foundation" },
    { id: 2, name: "Structure" },
    { id: 3, name: "MEP Systems" },
    { id: 4, name: "Interior" },
    { id: 5, name: "Site Work" },
    { id: 6, name: "Planning" },
    { id: 7, name: "Final" }
  ];

useEffect(() => {
    setAssignees(mockAssignees);
    setPhases(mockPhases);
  }, []);

  // Reset form when modal opens/closes or task changes
  useEffect(() => {
    if (isOpen && task) {
      // Editing existing task
      setFormData({
        name: task.name || '',
        description: task.description || '',
        projectId: task.projectId || projectId,
        phaseId: task.phaseId || '',
        phaseName: task.phaseName || '',
        dueDate: task.dueDate || '',
        priority: task.priority || 'Medium',
        status: task.status || 'Not Started',
        estimatedDuration: task.estimatedDuration || '',
        assigneeId: task.assigneeId || '',
        assigneeName: task.assigneeName || ''
      });
    } else if (isOpen) {
      // Creating new task
      setFormData({
        name: '',
        description: '',
        projectId: projectId,
        phaseId: '',
        phaseName: '',
        dueDate: '',
        priority: 'Medium',
        status: 'Not Started',
        estimatedDuration: '',
        assigneeId: '',
        assigneeName: ''
      });
    }
setErrors({});
  }, [isOpen, task, projectId]);
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Task name is required';
    }

    if (!formData.phaseId) {
      newErrors.phaseId = 'Phase is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (!formData.assigneeId) {
      newErrors.assigneeId = 'Assignee is required';
    }

    if (formData.estimatedDuration && (isNaN(formData.estimatedDuration) || parseInt(formData.estimatedDuration) < 1)) {
      newErrors.estimatedDuration = 'Duration must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handlePhaseChange = (e) => {
    const phaseId = parseInt(e.target.value);
    const selectedPhase = phases.find(p => p.id === phaseId);
    
    setFormData(prev => ({
      ...prev,
      phaseId: phaseId,
      phaseName: selectedPhase ? selectedPhase.name : ''
    }));

    if (errors.phaseId) {
      setErrors(prev => ({
        ...prev,
        phaseId: undefined
      }));
    }
  };

  const handleAssigneeChange = (e) => {
    const assigneeId = parseInt(e.target.value);
    const selectedAssignee = assignees.find(a => a.id === assigneeId);
    
    setFormData(prev => ({
      ...prev,
      assigneeId: assigneeId,
      assigneeName: selectedAssignee ? selectedAssignee.name : ''
    }));

    if (errors.assigneeId) {
      setErrors(prev => ({
        ...prev,
        assigneeId: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const taskData = {
        ...formData,
        projectId: projectId,
        estimatedDuration: formData.estimatedDuration ? parseInt(formData.estimatedDuration) : null
      };

      if (task) {
        // Update existing task
        await taskService.update(task.Id, taskData);
        toast.success('Task updated successfully');
      } else {
        // Create new task
        await taskService.create(taskData);
        toast.success('Task created successfully');
      }

      onTaskSaved();
    } catch (err) {
      console.error('Error saving task:', err);
      toast.error('Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="font-display text-xl font-semibold text-midnight">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <ApperIcon name="X" size={18} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Task Name */}
          <FormField
            label="Task Name"
            required
            error={errors.name}
          >
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter task name"
              className={errors.name ? 'border-red-500' : ''}
            />
          </FormField>

          {/* Description */}
          <FormField
            label="Description"
            error={errors.description}
          >
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter task description (optional)"
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-construction focus:border-transparent resize-none"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Phase */}
            <FormField
              label="Phase"
              required
              error={errors.phaseId}
            >
              <Select
                value={formData.phaseId}
                onChange={handlePhaseChange}
                className={errors.phaseId ? 'border-red-500' : ''}
              >
                <option value="">Select phase</option>
                {phases.map(phase => (
                  <option key={phase.id} value={phase.id}>
                    {phase.name}
                  </option>
                ))}
              </Select>
            </FormField>

            {/* Priority */}
            <FormField
              label="Priority"
              required
            >
              <Select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Due Date */}
            <FormField
              label="Due Date"
              required
              error={errors.dueDate}
            >
              <Input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className={errors.dueDate ? 'border-red-500' : ''}
              />
            </FormField>

            {/* Estimated Duration */}
            <FormField
              label="Estimated Duration (days)"
              error={errors.estimatedDuration}
            >
              <Input
                type="number"
                name="estimatedDuration"
                value={formData.estimatedDuration}
                onChange={handleInputChange}
                placeholder="e.g., 5"
                min="1"
                className={errors.estimatedDuration ? 'border-red-500' : ''}
              />
            </FormField>
          </div>

          {/* Assignee */}
          <FormField
            label="Assignee"
            required
            error={errors.assigneeId}
          >
            <Select
              value={formData.assigneeId}
              onChange={handleAssigneeChange}
              className={errors.assigneeId ? 'border-red-500' : ''}
            >
              <option value="">Select assignee</option>
              {assignees.map(assignee => (
                <option key={assignee.id} value={assignee.id}>
                  {assignee.name}
                </option>
              ))}
            </Select>
          </FormField>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-construction hover:bg-construction/90"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </div>
              ) : (
                task ? 'Update Task' : 'Create Task'
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
);
};

export default TaskModal;