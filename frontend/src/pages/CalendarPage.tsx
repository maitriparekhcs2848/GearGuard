import React, { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Calendar as CalendarIcon
} from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday
} from 'date-fns';
import { RequestForm } from '@/components/requests/RequestForm';
import { StatusBadge } from '@/components/common/StatusBadge';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const CalendarPage: React.FC = () => {
  const { requests, getEquipmentById } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDayDialog, setShowDayDialog] = useState(false);

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const getRequestsForDate = (date: Date) => {
    return requests.filter(req => 
      isSameDay(new Date(req.scheduledDate), date)
    );
  };

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const dayRequests = getRequestsForDate(date);
    if (dayRequests.length > 0) {
      setShowDayDialog(true);
    } else {
      setShowForm(true);
    }
  };

  const handleCreateRequest = () => {
    setShowDayDialog(false);
    setShowForm(true);
  };

  const dayRequests = selectedDate ? getRequestsForDate(selectedDate) : [];

  return (
    <div className="min-h-screen">
      <Header 
        title="Maintenance Calendar" 
        action={
          <Button onClick={() => { setSelectedDate(new Date()); setShowForm(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Maintenance
          </Button>
        }
      />
      
      <div className="p-6">
        <div className="bg-card rounded-xl border overflow-hidden animate-fade-in">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-foreground">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <Button variant="outline" size="sm" onClick={handleToday}>
                Today
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-4">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div 
                  key={day} 
                  className="text-center text-sm font-medium text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const dayReqs = getRequestsForDate(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isCurrentDay = isToday(day);
                
                return (
                  <button
                    key={index}
                    onClick={() => handleDateClick(day)}
                    className={cn(
                      "min-h-[100px] p-2 text-left rounded-lg transition-colors border",
                      isCurrentMonth 
                        ? "bg-background hover:bg-muted" 
                        : "bg-muted/30 text-muted-foreground hover:bg-muted/50",
                      isCurrentDay && "ring-2 ring-primary"
                    )}
                  >
                    <div className={cn(
                      "text-sm font-medium mb-1",
                      isCurrentDay && "text-primary"
                    )}>
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-1">
                      {dayReqs.slice(0, 2).map(req => (
                        <div 
                          key={req.id}
                          className={cn(
                            "text-xs px-1.5 py-0.5 rounded truncate",
                            req.type === 'Preventive' 
                              ? "bg-info/10 text-info" 
                              : "bg-danger/10 text-danger"
                          )}
                        >
                          {req.subject}
                        </div>
                      ))}
                      {dayReqs.length > 2 && (
                        <div className="text-xs text-muted-foreground px-1">
                          +{dayReqs.length - 2} more
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-info" />
            <span className="text-muted-foreground">Preventive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-danger" />
            <span className="text-muted-foreground">Corrective</span>
          </div>
        </div>
      </div>

      {/* Day Detail Dialog */}
      <Dialog open={showDayDialog} onOpenChange={setShowDayDialog}>
        <DialogContent className="max-w-md animate-scale-in">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3">
            {dayRequests.map(req => {
              const eq = getEquipmentById(req.equipmentId);
              return (
                <div 
                  key={req.id} 
                  className="p-3 rounded-lg border bg-muted/30"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-foreground">{req.subject}</h4>
                      <p className="text-sm text-muted-foreground">{eq?.name}</p>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge type={req.type} />
                    <span className="text-sm text-muted-foreground">
                      Assigned to {req.assignedTo}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <Button onClick={handleCreateRequest} className="w-full mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Schedule New Maintenance
          </Button>
        </DialogContent>
      </Dialog>

      <RequestForm 
        open={showForm} 
        onOpenChange={setShowForm}
        preselectedDate={selectedDate || undefined}
      />
    </div>
  );
};

export default CalendarPage;
