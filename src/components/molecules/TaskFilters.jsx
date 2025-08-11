import React from 'react';
import Select from '@/components/atoms/Select';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const TaskFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  assignees = [],
  phases = []
}) => {
  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-midnight flex items-center space-x-2">
          <ApperIcon name="Filter" size={16} />
          <span>Filters</span>
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-slate-500 hover:text-slate-700"
          >
            <ApperIcon name="X" size={14} className="mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="text-sm font-medium text-slate-600 block mb-1">
            Search
          </label>
          <Input
            placeholder="Search tasks..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="h-9"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="text-sm font-medium text-slate-600 block mb-1">
            Status
          </label>
          <Select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="h-9"
          >
            <option value="">All Statuses</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </Select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="text-sm font-medium text-slate-600 block mb-1">
            Priority
          </label>
          <Select
            value={filters.priority || ''}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="h-9"
          >
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </Select>
        </div>

        {/* Assignee Filter */}
        <div>
          <label className="text-sm font-medium text-slate-600 block mb-1">
            Assignee
          </label>
          <Select
            value={filters.assigneeId || ''}
            onChange={(e) => handleFilterChange('assigneeId', e.target.value)}
            className="h-9"
          >
            <option value="">All Assignees</option>
            {assignees.map(assignee => (
              <option key={assignee.id} value={assignee.id}>
                {assignee.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Phase Filter - Full Width */}
      <div>
        <label className="text-sm font-medium text-slate-600 block mb-1">
          Phase
        </label>
        <Select
          value={filters.phaseId || ''}
          onChange={(e) => handleFilterChange('phaseId', e.target.value)}
          className="h-9 max-w-xs"
        >
          <option value="">All Phases</option>
          {phases.map(phase => (
            <option key={phase.id} value={phase.id}>
              {phase.name}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default TaskFilters;