import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Label from '@/components/atoms/Label';
import FormField from '@/components/molecules/FormField';
import ApperIcon from '@/components/ApperIcon';
import { taskService } from '@/services/api/taskService';

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
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
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

  useEffect(() => {
    if (task) {
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
    } else {
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
  }, [task, projectId, isOpen]);

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

    if (formData.estimatedDuration && (isNaN(formData.estimatedDuration) || formData.estimatedDuration <= 0)) {
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
        [name]: ''
      }));
    }
  };

  const handlePhaseChange = (e) => {
    const phaseId = parseInt(e.target.value);
    const phase = phases.find(p => p.id === phaseId);
    setFormData(prev => ({
      ...prev,
      phaseId,
      phaseName: phase ? phase.name : ''
    }));
    
    if (errors.phaseId) {
      setErrors(prev => ({ ...prev, phaseId: '' }));
    }
  };

  const handleAssigneeChange = (e) => {
    const assigneeId = parseInt(e.target.value);
    const assignee = assignees.find(a => a.id === assigneeId);
    setFormData(prev => ({
      ...prev,
      assigneeId,
      assigneeName: assignee ? assignee.name : ''
    }));
    
    if (errors.assigneeId) {
      setErrors(prev => ({ ...prev, assigneeId: '' }));
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
        estimatedDuration: formData.estimatedDuration ? parseInt(formData.estimatedDuration) : null
      };

      if (task) {
        await taskService.update(task.Id, taskData);
        toast.success('Task updated successfully!');
      } else {
        await taskService.create(taskData);
        toast.success('Task created successfully!');
      }
      
      onTaskSaved();
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error(error.message || 'Failed to save task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-display font-bold text-midnight">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <FormField
            label="Task Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
            required
            placeholder="Enter task name"
          />

          <FormField
            label="Description"
            error={errors.description}
          >
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Task description (optional)"
              className="flex w-full rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-base text-midnight placeholder:text-slate-400 focus:border-construction focus:outline-none focus:ring-2 focus:ring-construction/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none"
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Phase"
              error={errors.phaseId}
              required
            >
              <Select
                name="phaseId"
                value={formData.phaseId}
                onChange={handlePhaseChange}
              >
                <option value="">Select a phase</option>
                {phases.map(phase => (
                  <option key={phase.id} value={phase.id}>
                    {phase.name}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField
              label="Priority Level"
              error={errors.priority}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Due Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleInputChange}
              error={errors.dueDate}
              required
            />

            <FormField
              label="Estimated Duration (days)"
              name="estimatedDuration"
              type="number"
              value={formData.estimatedDuration}
              onChange={handleInputChange}
              error={errors.estimatedDuration}
              placeholder="e.g., 5"
              min="1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Assigned To"
              error={errors.assigneeId}
              required
            >
              <Select
                name="assigneeId"
                value={formData.assigneeId}
                onChange={handleAssigneeChange}
              >
                <option value="">Select assignee</option>
                {assignees.map(assignee => (
                  <option key={assignee.id} value={assignee.id}>
                    {assignee.name}
                  </option>
                ))}
              </Select>
            </FormField>

            {task && (
              <FormField
                label="Status"
                error={errors.status}
              >
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </Select>
              </FormField>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200">
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
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default TaskModal;