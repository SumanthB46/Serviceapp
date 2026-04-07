"use client";

import React from 'react';
import Badge from '../common/Badge';

interface StatusBadgeProps {
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const variants = {
    Confirmed: 'info',
    Pending: 'warning',
    Completed: 'success',
    Cancelled: 'danger',
  } as const;

  return (
    <Badge variant={variants[status]} size="sm" rounded>
      {status}
    </Badge>
  );
};

export default StatusBadge;
