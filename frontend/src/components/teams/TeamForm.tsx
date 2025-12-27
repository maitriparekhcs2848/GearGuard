import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { MaintenanceTeam, TeamSpecialization } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface TeamFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team?: MaintenanceTeam;
}

const specializations: TeamSpecialization[] = ['Mechanical', 'Electrical', 'IT', 'HVAC'];

export const TeamForm: React.FC<TeamFormProps> = ({
  open,
  onOpenChange,
  team,
}) => {
  const { addTeam, updateTeam } = useData();
  const isEdit = !!team;

  const [formData, setFormData] = useState({
    name: team?.name || '',
    specialization: team?.specialization || '' as TeamSpecialization,
    members: team?.members.join(', ') || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.specialization || !formData.members) {
      toast.error('Please fill in all required fields');
      return;
    }

    const members = formData.members.split(',').map(m => m.trim()).filter(m => m);
    
    if (members.length === 0) {
      toast.error('Please add at least one team member');
      return;
    }

    const data = {
      name: formData.name,
      specialization: formData.specialization,
      members,
    };

    if (isEdit && team) {
      updateTeam(team.id, data);
      toast.success('Team updated successfully');
    } else {
      addTeam(data);
      toast.success('Team created successfully');
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Team' : 'Create New Team'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="teamName">Team Name *</Label>
            <Input
              id="teamName"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Alpha Mechanics"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Specialization *</Label>
            <Select 
              value={formData.specialization} 
              onValueChange={(value: TeamSpecialization) => setFormData({ ...formData, specialization: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select specialization" />
              </SelectTrigger>
              <SelectContent>
                {specializations.map(spec => (
                  <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="members">Team Members * (comma-separated)</Label>
            <Input
              id="members"
              value={formData.members}
              onChange={(e) => setFormData({ ...formData, members: e.target.value })}
              placeholder="John Smith, Maria Garcia, Ahmed Hassan"
            />
            <p className="text-xs text-muted-foreground">
              Enter member names separated by commas
            </p>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? 'Update Team' : 'Create Team'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
