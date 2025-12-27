import React, { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { useData } from '@/contexts/DataContext';
import { Equipment } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { HealthScore } from '@/components/common/HealthScore';
import { EquipmentForm } from '@/components/equipment/EquipmentForm';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Cog, 
  FileText,
  MapPin,
  Calendar,
  Wrench
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const EquipmentPage: React.FC = () => {
  const { equipment, teams, getTeamById, getRequestsByEquipmentId, deleteEquipment } = useData();
  
  const [showForm, setShowForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  const filteredEquipment = useMemo(() => {
    return equipment.filter(eq => {
      const matchesSearch = eq.name.toLowerCase().includes(search.toLowerCase()) ||
                           eq.serialNumber.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || eq.category === categoryFilter;
      const matchesDepartment = departmentFilter === 'all' || eq.department === departmentFilter;
      return matchesSearch && matchesCategory && matchesDepartment;
    });
  }, [equipment, search, categoryFilter, departmentFilter]);

  const handleEdit = (eq: Equipment) => {
    setEditingEquipment(eq);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteEquipment(id);
    toast.success('Equipment deleted successfully');
    setDeleteId(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEquipment(undefined);
  };

  return (
    <div className="min-h-screen">
      <Header 
        title="Equipment Management" 
        action={
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Equipment
          </Button>
        }
      />
      
      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or serial number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Machinery">Machinery</SelectItem>
              <SelectItem value="Vehicles">Vehicles</SelectItem>
              <SelectItem value="Computers">Computers</SelectItem>
              <SelectItem value="Tools">Tools</SelectItem>
            </SelectContent>
          </Select>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Production">Production</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Equipment Grid */}
        {filteredEquipment.length === 0 ? (
          <EmptyState
            icon={Cog}
            title="No equipment found"
            description={search || categoryFilter !== 'all' || departmentFilter !== 'all' 
              ? "Try adjusting your search or filters"
              : "Add your first piece of equipment to get started"}
            actionLabel="Add Equipment"
            onAction={() => setShowForm(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEquipment.map((eq, index) => {
              const team = getTeamById(eq.teamId);
              const requestCount = getRequestsByEquipmentId(eq.id).length;
              
              return (
                <div 
                  key={eq.id} 
                  className="bg-card rounded-xl border p-5 card-hover animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{eq.name}</h3>
                      <p className="text-sm text-muted-foreground">{eq.serialNumber}</p>
                    </div>
                    <StatusBadge condition={eq.condition} />
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{eq.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Warranty: {format(new Date(eq.warrantyExpiry), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Wrench className="w-4 h-4" />
                      <span>{team?.name || 'No team assigned'}</span>
                    </div>
                  </div>
                  
                  <HealthScore score={eq.healthScore} />
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      {requestCount} Request{requestCount !== 1 ? 's' : ''}
                    </Button>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEdit(eq)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-danger hover:text-danger"
                        onClick={() => setDeleteId(eq.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <EquipmentForm 
        open={showForm} 
        onOpenChange={handleCloseForm}
        equipment={editingEquipment}
      />
      
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Equipment"
        description="Are you sure you want to delete this equipment? This will also remove all associated maintenance requests."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => deleteId && handleDelete(deleteId)}
      />
    </div>
  );
};

export default EquipmentPage;
