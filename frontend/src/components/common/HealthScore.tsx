import React from 'react';
import { cn } from '@/lib/utils';

interface HealthScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const HealthScore: React.FC<HealthScoreProps> = ({
  score,
  size = 'md',
  showLabel = true,
  className,
}) => {
  const getColor = () => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-danger';
  };

  const getBgColor = () => {
    if (score >= 80) return 'bg-success';
    if (score >= 60) return 'bg-warning';
    return 'bg-danger';
  };

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs text-muted-foreground">Health Score</span>
          <span className={cn("text-xs font-semibold", getColor())}>
            {score}%
          </span>
        </div>
      )}
      <div className={cn("w-full bg-muted rounded-full overflow-hidden", sizeClasses[size])}>
        <div 
          className={cn("h-full rounded-full transition-all duration-500", getBgColor())}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};
