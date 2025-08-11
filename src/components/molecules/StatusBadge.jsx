import React from "react";
import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    Planning: { variant: "planning", label: "Planning" },
    "In Progress": { variant: "inprogress", label: "In Progress" },
    "On Hold": { variant: "onhold", label: "On Hold" },
    Completed: { variant: "completed", label: "Completed" },
  };

  const config = statusConfig[status] || statusConfig.Planning;

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;