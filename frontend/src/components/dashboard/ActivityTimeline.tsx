import React from 'react';
import { MaintenanceRequest } from '@/types';
import { useData } from '@/contexts/DataContext';
import { format, formatDistanceToNow } from 'date-fns';
import { Clock, Wrench, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityTimelineProps {
  requests: MaintenanceRequest[];
}

const statusIcons = {
  'New': Clock,
  'In Progress': Wrench,
  'Repaired': CheckCircle,
  'Scrap': XCircle,
};

const statusColors = {
  'New': 'bg-info/10 text-info border-info/20',
  'In Progress': 'bg-warning/10 text-warning border-warning/20',
  'Repaired': 'bg-success/10 text-success border-success/20',
  'Scrap': 'bg-danger/10 text-danger border-danger/20',
};

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ requests }) => {
  const { getEquipmentById } = useData();

  if (requests.length === 0) {
    return (
      <div className="bg-card rounded-xl border p-6 animate-slide-up">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Clock className="w-10 h-10 text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">No recent activity</p>
          <p className="text-sm text-muted-foreground/70">Create a request to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border p-6 animate-slide-up">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
      <div className="space-y-1">
        {requests.map((request, index) => {
          const Icon = statusIcons[request.status];
          const colors = statusColors[request.status];
          const equipment = getEquipmentById(request.equipmentId);
          
          return (
            <div 
              key={request.id} 
              className="relative pl-8 pb-5 last:pb-0"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Timeline line */}
              {index < requests.length - 1 && (
                <div className="absolute left-3 top-6 bottom-0 w-px bg-border" />
              )}
              
              {/* Timeline dot */}
              <div className={cn(
                "absolute left-0 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center",
                colors
              )}>
                <Icon className="w-3 h-3" />
              </div>
              
              {/* Content */}
              <div className="min-h-[40px]">
                <p className="text-sm font-medium text-foreground leading-tight">
                  {request.subject}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {equipment?.name} • {request.status}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
