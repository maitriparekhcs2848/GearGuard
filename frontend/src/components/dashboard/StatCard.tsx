import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
  delay?: number;
}

const colorStyles = {
  primary: {
    bg: 'bg-primary/10',
    text: 'text-primary',
    glow: 'group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]',
  },
  success: {
    bg: 'bg-success/10',
    text: 'text-success',
    glow: 'group-hover:shadow-[0_0_20px_hsl(var(--success)/0.3)]',
  },
  warning: {
    bg: 'bg-warning/10',
    text: 'text-warning',
    glow: 'group-hover:shadow-[0_0_20px_hsl(var(--warning)/0.3)]',
  },
  danger: {
    bg: 'bg-danger/10',
    text: 'text-danger',
    glow: 'group-hover:shadow-[0_0_20px_hsl(var(--danger)/0.3)]',
  },
  info: {
    bg: 'bg-info/10',
    text: 'text-info',
    glow: 'group-hover:shadow-[0_0_20px_hsl(var(--info)/0.3)]',
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'primary',
  className,
  delay = 0,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'number' ? value : parseInt(value.toString(), 10);
  
  useEffect(() => {
    if (typeof value !== 'number') {
      setDisplayValue(numericValue);
      return;
    }
    
    const duration = 800;
    const steps = 30;
    const increment = numericValue / steps;
    let current = 0;
    
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setDisplayValue(numericValue);
          clearInterval(interval);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [numericValue, delay, value]);

  const styles = colorStyles[color];

  return (
    <div 
      className={cn(
        "stat-card group animate-slide-up",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium tracking-wide uppercase">
            {title}
          </p>
          <p className="text-3xl font-bold text-foreground tracking-tight animate-count">
            {typeof value === 'number' ? displayValue.toLocaleString() : value}
          </p>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium",
              trend.isPositive ? "text-success" : "text-danger"
            )}>
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground font-normal">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-xl transition-all duration-300",
          styles.bg,
          styles.text,
          styles.glow
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
