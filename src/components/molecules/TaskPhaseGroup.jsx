import React from 'react';
import { motion } from 'framer-motion';
import TaskCard from '@/components/molecules/TaskCard';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

const TaskPhaseGroup = ({ 
  phaseName, 
  tasks, 
  isExpanded, 
  onToggle, 
  onEditTask, 
  onDeleteTask, 
  onStatusChange 
}) => {
  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      {/* Phase Header */}
      <div 
        onClick={onToggle}
        className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ApperIcon 
              name="ChevronRight" 
              size={16} 
              className="text-slate-500"
            />
          </motion.div>
          <h3 className="font-display font-semibold text-midnight text-lg">
            {phaseName}
          </h3>
          <Badge variant="default">
            {totalTasks} task{totalTasks !== 1 ? 's' : ''}
          </Badge>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm text-slate-600">
            {completedTasks} of {totalTasks} completed
          </div>
          <div className="w-24 bg-slate-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <span className="text-sm font-medium text-slate-700 min-w-[3rem]">
            {completionPercentage}%
          </span>
        </div>
      </div>

      {/* Tasks List */}
      <motion.div
        initial={false}
        animate={{ 
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="p-4 space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <ApperIcon name="CheckSquare" size={48} className="mx-auto mb-3 text-slate-300" />
              <p>No tasks in this phase yet.</p>
            </div>
          ) : (
            tasks.map((task, index) => (
              <motion.div
                key={task.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <TaskCard
                  task={task}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onStatusChange={onStatusChange}
                />
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TaskPhaseGroup;