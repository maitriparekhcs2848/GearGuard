import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Equipment, EquipmentCategory, Department, EquipmentCondition } from '@/types';
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

interface EquipmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipment?: Equipment;
}

const categories: EquipmentCategory[] = ['Machinery', 'Vehicles', 'Computers', 'Tools'];
const departments: Department[] = ['Production', 'IT', 'Sales', 'HR', 'Finance'];
const conditions: EquipmentCondition[] = ['Excellent', 'Good', 'Fair', 'Poor', 'Critical'];

export const EquipmentForm: React.FC<EquipmentFormProps> = ({
  open,
  onOpenChange,
  equipment,
}) => {
  const { teams, addEquipment, updateEquipment } = useData();
  const isEdit = !!equipment;

  const [formData, setFormData] = useState({
    name: equipment?.name || '',
    serialNumber: equipment?.serialNumber || '',
    category: equipment?.category || '' as EquipmentCategory,
    department: equipment?.department || '' as Department,
    teamId: equipment?.teamId || '',
    location: equipment?.location || '',
    purchaseDate: equipment?.purchaseDate 
      ? new Date(equipment.purchaseDate).toISOString().split('T')[0] 
      : '',
    warrantyExpiry: equipment?.warrantyExpiry 
      ? new Date(equipment.warrantyExpiry).toISOString().split('T')[0] 
      : '',
    condition: equipment?.condition || '' as EquipmentCondition,
    usageHours: equipment?.usageHours || 0,
    healthScore: equipment?.healthScore || 100,
    assignedEmployee: equipment?.assignedEmployee || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.serialNumber || !formData.category || 
        !formData.department || !formData.teamId || !formData.location ||
        !formData.purchaseDate || !formData.warrantyExpiry || !formData.condition) {
      toast.error('Please fill in all required fields');
      return;
    }

    const data = {
      name: formData.name,
      serialNumber: formData.serialNumber,
      category: formData.category,
      department: formData.department,
      teamId: formData.teamId,
      location: formData.location,
      purchaseDate: new Date(formData.purchaseDate),
      warrantyExpiry: new Date(formData.warrantyExpiry),
      condition: formData.condition,
      usageHours: formData.usageHours,
      healthScore: formData.healthScore,
      assignedEmployee: formData.assignedEmployee || undefined,
    };

    if (isEdit && equipment) {
      updateEquipment(equipment.id, data);
      toast.success('Equipment updated successfully');
    } else {
      addEquipment(data);
      toast.success('Equipment added successfully');
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl animate-scale-in">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Equipment' : 'Add New Equipment'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Equipment name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number *</Label>
              <Input
                id="serialNumber"
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                placeholder="SN-XXXX-XXX"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value: EquipmentCategory) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Department *</Label>
              <Select 
                value={formData.department} 
                onValueChange={(value: Department) => setFormData({ ...formData, department: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Maintenance Team *</Label>
              <Select 
                value={formData.teamId} 
                onValueChange={(value) => setFormData({ ...formData, teamId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Building A, Floor 1"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date *</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="warrantyExpiry">Warranty Expiry *</Label>
              <Input
                id="warrantyExpiry"
                type="date"
                value={formData.warrantyExpiry}
                onChange={(e) => setFormData({ ...formData, warrantyExpiry: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Condition *</Label>
              <Select 
                value={formData.condition} 
                onValueChange={(value: EquipmentCondition) => setFormData({ ...formData, condition: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map(cond => (
                    <SelectItem key={cond} value={cond}>{cond}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="usageHours">Usage Hours</Label>
              <Input
                id="usageHours"
                type="number"
                value={formData.usageHours}
                onChange={(e) => setFormData({ ...formData, usageHours: Number(e.target.value) })}
                min="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="healthScore">Health Score (0-100)</Label>
              <Input
                id="healthScore"
                type="number"
                value={formData.healthScore}
                onChange={(e) => setFormData({ ...formData, healthScore: Number(e.target.value) })}
                min="0"
                max="100"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="assignedEmployee">Assigned Employee</Label>
              <Input
                id="assignedEmployee"
                value={formData.assignedEmployee}
                onChange={(e) => setFormData({ ...formData, assignedEmployee: e.target.value })}
                placeholder="Employee name (optional)"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? 'Update Equipment' : 'Add Equipment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
