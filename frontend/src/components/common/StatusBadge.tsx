import React from 'react';
import { cn } from '@/lib/utils';
import { RequestStatus, RequestType, EquipmentCondition } from '@/types';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary';

interface StatusBadgeProps {
  status?: RequestStatus;
  type?: RequestType;
  condition?: EquipmentCondition;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  className?: string;
}

const statusStyles: Record<RequestStatus, BadgeVariant> = {
  'New': 'info',
  'In Progress': 'warning',
  'Repaired': 'success',
  'Scrap': 'danger',
};

const typeStyles: Record<RequestType, BadgeVariant> = {
  'Corrective': 'danger',
  'Preventive': 'info',
};

const conditionStyles: Record<EquipmentCondition, BadgeVariant> = {
  'Excellent': 'success',
  'Good': 'success',
  'Fair': 'warning',
  'Poor': 'danger',
  'Critical': 'danger',
};

const priorityStyles: Record<string, BadgeVariant> = {
  'Low': 'secondary',
  'Medium': 'info',
  'High': 'warning',
  'Critical': 'danger',
};

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-secondary text-secondary-foreground',
  success: 'bg-success/15 text-success border border-success/20',
  warning: 'bg-warning/15 text-warning border border-warning/20',
  danger: 'bg-danger/15 text-danger border border-danger/20',
  info: 'bg-info/15 text-info border border-info/20',
  secondary: 'bg-muted text-muted-foreground',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type,
  condition,
  priority,
  className,
}) => {
  let variant: BadgeVariant = 'default';
  let label = '';

  if (status) {
    variant = statusStyles[status];
    label = status;
  } else if (type) {
    variant = typeStyles[type];
    label = type;
  } else if (condition) {
    variant = conditionStyles[condition];
    label = condition;
  } else if (priority) {
    variant = priorityStyles[priority];
    label = priority;
  }

  return (
    <span className={cn(
      "status-badge",
      variantClasses[variant],
      className
    )}>
      {label}
    </span>
  );
};
