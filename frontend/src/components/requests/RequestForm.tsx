import React, { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { MaintenanceRequest, RequestType, RequestStatus } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface RequestFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request?: MaintenanceRequest;
  preselectedEquipmentId?: string;
  preselectedDate?: Date;
}

const requestTypes: RequestType[] = ['Corrective', 'Preventive'];
const statuses: RequestStatus[] = ['New', 'In Progress', 'Repaired', 'Scrap'];
const priorities = ['Low', 'Medium', 'High', 'Critical'] as const;

export const RequestForm: React.FC<RequestFormProps> = ({
  open,
  onOpenChange,
  request,
  preselectedEquipmentId,
  preselectedDate,
}) => {
  const { equipment, teams, getTeamById, addRequest, updateRequest } = useData();
  const isEdit = !!request;

  const [formData, setFormData] = useState({
    subject: request?.subject || '',
    equipmentId: request?.equipmentId || preselectedEquipmentId || '',
    type: request?.type || '' as RequestType,
    status: request?.status || 'New' as RequestStatus,
    scheduledDate: request?.scheduledDate 
      ? new Date(request.scheduledDate).toISOString().split('T')[0]
      : preselectedDate 
        ? preselectedDate.toISOString().split('T')[0]
        : '',
    assignedTo: request?.assignedTo || '',
    teamId: request?.teamId || '',
    description: request?.description || '',
    priority: request?.priority || 'Medium' as typeof priorities[number],
  });

  const [availableMembers, setAvailableMembers] = useState<string[]>([]);

  useEffect(() => {
    if (formData.equipmentId) {
      const eq = equipment.find(e => e.id === formData.equipmentId);
      if (eq) {
        setFormData(prev => ({ ...prev, teamId: eq.teamId }));
        const team = getTeamById(eq.teamId);
        if (team) {
          setAvailableMembers(team.members);
        }
      }
    }
  }, [formData.equipmentId, equipment, getTeamById]);

  useEffect(() => {
    if (formData.teamId) {
      const team = getTeamById(formData.teamId);
      if (team) {
        setAvailableMembers(team.members);
      }
    }
  }, [formData.teamId, getTeamById]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.equipmentId || !formData.type || 
        !formData.scheduledDate || !formData.assignedTo || !formData.teamId) {
      toast.error('Please fill in all required fields');
      return;
    }

    const data = {
      subject: formData.subject,
      equipmentId: formData.equipmentId,
      type: formData.type,
      status: formData.status,
      scheduledDate: new Date(formData.scheduledDate),
      assignedTo: formData.assignedTo,
      teamId: formData.teamId,
      description: formData.description,
      priority: formData.priority,
    };

    if (isEdit && request) {
      updateRequest(request.id, data);
      toast.success('Request updated successfully');
    } else {
      addRequest(data);
      toast.success('Request created successfully');
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl animate-scale-in">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Request' : 'Create Maintenance Request'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief description of the issue"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Equipment *</Label>
              <Select 
                value={formData.equipmentId} 
                onValueChange={(value) => setFormData({ ...formData, equipmentId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select equipment" />
                </SelectTrigger>
                <SelectContent>
                  {equipment.map(eq => (
                    <SelectItem key={eq.id} value={eq.id}>
                      {eq.name} ({eq.serialNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Type *</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: RequestType) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {requestTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {isEdit && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: RequestStatus) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label>Priority *</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value: typeof priorities[number]) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map(priority => (
                    <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Scheduled Date *</Label>
              <Input
                id="scheduledDate"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Maintenance Team</Label>
              <Select 
                value={formData.teamId} 
                onValueChange={(value) => setFormData({ ...formData, teamId: value, assignedTo: '' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Auto-assigned from equipment" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Assigned To *</Label>
              <Select 
                value={formData.assignedTo} 
                onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
                disabled={availableMembers.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={availableMembers.length > 0 ? "Select team member" : "Select equipment first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableMembers.map(member => (
                    <SelectItem key={member} value={member}>{member}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of the maintenance request..."
                rows={4}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? 'Update Request' : 'Create Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
