import React from 'react';
import { motion } from 'framer-motion';
import { format, isAfter, differenceInDays } from 'date-fns';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const getDueDateStatus = () => {
    if (task.status === 'Completed') return 'completed';
    
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const daysUntilDue = differenceInDays(dueDate, today);
    
    if (daysUntilDue < 0) return 'overdue';
    if (daysUntilDue <= 2) return 'due-soon';
    return 'normal';
  };

  const getDueDateText = () => {
    const dueDate = new Date(task.dueDate);
    const dueDateStatus = getDueDateStatus();
    
    if (dueDateStatus === 'completed') {
      return `Completed ${task.completedDate ? format(new Date(task.completedDate), 'MMM dd') : ''}`;
    }
    
    if (dueDateStatus === 'overdue') {
      const daysOverdue = Math.abs(differenceInDays(dueDate, new Date()));
      return `${daysOverdue} day${daysOverdue > 1 ? 's' : ''} overdue`;
    }
    
    if (dueDateStatus === 'due-soon') {
      const daysUntil = differenceInDays(dueDate, new Date());
      if (daysUntil === 0) return 'Due today';
      if (daysUntil === 1) return 'Due tomorrow';
      return `Due in ${daysUntil} days`;
    }
    
    return format(dueDate, 'MMM dd, yyyy');
  };

  const getPriorityVariant = () => {
    switch (task.priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'warning';
      case 'Low': return 'default';
      default: return 'default';
    }
  };

  const getStatusVariant = () => {
    switch (task.status) {
      case 'Completed': return 'completed';
      case 'In Progress': return 'inprogress';
      case 'Not Started': return 'planning';
      default: return 'default';
    }
  };

  const getStatusIcon = () => {
    switch (task.status) {
      case 'Completed': return 'CheckCircle2';
      case 'In Progress': return 'Clock';
      case 'Not Started': return 'Circle';
      default: return 'Circle';
    }
  };

  const handleStatusToggle = () => {
    let newStatus;
    switch (task.status) {
      case 'Not Started': newStatus = 'In Progress'; break;
      case 'In Progress': newStatus = 'Completed'; break;
      case 'Completed': newStatus = 'In Progress'; break;
      default: newStatus = 'In Progress';
    }
    onStatusChange(task.Id, newStatus);
  };

  const dueDateStatus = getDueDateStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-3">
          <h4 className="font-medium text-midnight truncate">
            {task.name}
          </h4>
          {task.description && (
            <p className="text-sm text-slate-600 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant={getPriorityVariant()}>
            {task.priority}
          </Badge>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              className="h-8 w-8 p-0"
            >
              <ApperIcon name="Edit2" size={14} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.Id)}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <ApperIcon name="Trash2" size={14} />
            </Button>
          </div>
        </div>
      </div>

      {/* Status and Progress */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={handleStatusToggle}
          className="flex items-center space-x-2 text-sm hover:bg-slate-50 rounded p-1 -ml-1 transition-colors"
        >
          <ApperIcon 
            name={getStatusIcon()} 
            size={16} 
            className={`${
              task.status === 'Completed' ? 'text-green-600' :
              task.status === 'In Progress' ? 'text-construction' :
              'text-slate-400'
            }`}
          />
          <Badge variant={getStatusVariant()}>
            {task.status}
          </Badge>
        </button>

        <div className={`text-xs font-medium ${
          dueDateStatus === 'overdue' ? 'text-red-600' :
          dueDateStatus === 'due-soon' ? 'text-orange-600' :
          dueDateStatus === 'completed' ? 'text-green-600' :
          'text-slate-600'
        }`}>
          {getDueDateText()}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-slate-600 pt-3 border-t border-slate-100">
        <div className="flex items-center space-x-2">
          <ApperIcon name="User" size={14} />
          <span>{task.assigneeName}</span>
        </div>
        
        {task.estimatedDuration && (
          <div className="flex items-center space-x-1">
            <ApperIcon name="Clock" size={14} />
            <span>{task.estimatedDuration}d</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TaskCard;