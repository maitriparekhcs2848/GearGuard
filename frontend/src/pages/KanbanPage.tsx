import React, { useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Header } from '@/components/layout/Header';
import { useData } from '@/contexts/DataContext';
import { MaintenanceRequest, RequestStatus } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Plus, Clock, User } from 'lucide-react';
import { RequestForm } from '@/components/requests/RequestForm';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const columns: { id: RequestStatus; title: string; colorClass: string }[] = [
  { id: 'New', title: 'New', colorClass: 'border-t-kanban-new' },
  { id: 'In Progress', title: 'In Progress', colorClass: 'border-t-kanban-progress' },
  { id: 'Repaired', title: 'Repaired', colorClass: 'border-t-kanban-repaired' },
  { id: 'Scrap', title: 'Scrap', colorClass: 'border-t-kanban-scrap' },
];

const KanbanPage: React.FC = () => {
  const { requests, updateRequestStatus, getEquipmentById } = useData();
  const [showForm, setShowForm] = React.useState(false);

  const groupedRequests = useMemo(() => {
    const groups: Record<RequestStatus, MaintenanceRequest[]> = {
      'New': [],
      'In Progress': [],
      'Repaired': [],
      'Scrap': [],
    };
    
    requests.forEach(req => {
      if (groups[req.status]) {
        groups[req.status].push(req);
      }
    });
    
    return groups;
  }, [requests]);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    
    const sourceStatus = result.source.droppableId as RequestStatus;
    const destStatus = result.destination.droppableId as RequestStatus;
    
    if (sourceStatus === destStatus) return;
    
    const requestId = result.draggableId;
    try {
      await updateRequestStatus(requestId, destStatus);
      toast.success(`Request moved to ${destStatus}`);
    } catch (error) {
      toast.error('Failed to update request status');
      console.error('Failed to update request status:', error);
    }
  };

  return (
    <div className="min-h-screen">
      <Header 
        title="Kanban Board" 
        action={
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Request
          </Button>
        }
      />
      
      <div className="p-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {columns.map((column) => (
              <div key={column.id} className="flex flex-col">
                {/* Column Header */}
                <div className={cn(
                  "bg-card rounded-t-lg border border-b-0 border-t-4 p-4",
                  column.colorClass
                )}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">{column.title}</h3>
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {groupedRequests[column.id].length}
                    </span>
                  </div>
                </div>
                
                {/* Column Content */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        "flex-1 bg-muted/30 rounded-b-lg border border-t-0 p-3 min-h-[500px] transition-colors",
                        snapshot.isDraggingOver && "bg-primary/5"
                      )}
                    >
                      <div className="space-y-3">
                        {groupedRequests[column.id].map((request, index) => {
                          const eq = getEquipmentById(request.equipmentId);
                          
                          return (
                            <Draggable
                              key={request.id}
                              draggableId={request.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={cn(
                                    "kanban-card",
                                    snapshot.isDragging && "shadow-lg ring-2 ring-primary/20"
                                  )}
                                >
                                  <div className="space-y-3">
                                    <div>
                                      <h4 className="font-medium text-foreground text-sm mb-1">
                                        {request.subject}
                                      </h4>
                                      <p className="text-xs text-muted-foreground">
                                        {eq?.name || 'Unknown Equipment'}
                                      </p>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                      <StatusBadge type={request.type} />
                                      <StatusBadge priority={request.priority} />
                                    </div>
                                    
                                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                                      <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {format(new Date(request.scheduledDate), 'MMM d')}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        {request.assignedTo.split(' ')[0]}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      <RequestForm open={showForm} onOpenChange={setShowForm} />
    </div>
  );
};

export default KanbanPage;
