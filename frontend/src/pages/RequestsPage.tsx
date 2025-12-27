import React, { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { useData } from '@/contexts/DataContext';
import { MaintenanceRequest } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { RequestForm } from '@/components/requests/RequestForm';
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
  FileText,
  Clock,
  User
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const RequestsPage: React.FC = () => {
  const { requests, getEquipmentById, getTeamById, deleteRequest } = useData();
  
  const [showForm, setShowForm] = useState(false);
  const [editingRequest, setEditingRequest] = useState<MaintenanceRequest | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const eq = getEquipmentById(req.equipmentId);
      const matchesSearch = req.subject.toLowerCase().includes(search.toLowerCase()) ||
                           (eq?.name.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
      const matchesType = typeFilter === 'all' || req.type === typeFilter;
      const matchesPriority = priorityFilter === 'all' || req.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesType && matchesPriority;
    });
  }, [requests, search, statusFilter, typeFilter, priorityFilter, getEquipmentById]);

  const handleEdit = (req: MaintenanceRequest) => {
    setEditingRequest(req);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteRequest(id);
    toast.success('Request deleted successfully');
    setDeleteId(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRequest(undefined);
  };

  return (
    <div className="min-h-screen">
      <Header 
        title="Maintenance Requests" 
        action={
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Request
          </Button>
        }
      />
      
      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by subject or equipment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Repaired">Repaired</SelectItem>
              <SelectItem value="Scrap">Scrap</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Corrective">Corrective</SelectItem>
              <SelectItem value="Preventive">Preventive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Requests Table */}
        {filteredRequests.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No requests found"
            description={search || statusFilter !== 'all' || typeFilter !== 'all' || priorityFilter !== 'all'
              ? "Try adjusting your search or filters"
              : "Create your first maintenance request to get started"}
            actionLabel="Create Request"
            onAction={() => setShowForm(true)}
          />
        ) : (
          <div className="bg-card rounded-xl border overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Subject</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Equipment</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Type</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Priority</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Scheduled</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Assigned</th>
                    <th className="text-right px-6 py-3 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRequests.map((request) => {
                    const eq = getEquipmentById(request.equipmentId);
                    
                    return (
                      <tr key={request.id} className="table-row-hover">
                        <td className="px-6 py-4">
                          <div className="font-medium text-foreground">{request.subject}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {request.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {eq?.name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge type={request.type} />
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge priority={request.priority} />
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={request.status} />
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {format(new Date(request.scheduledDate), 'MMM d, yyyy')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="w-4 h-4" />
                            {request.assignedTo}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEdit(request)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-danger hover:text-danger"
                              onClick={() => setDeleteId(request.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <RequestForm 
        open={showForm} 
        onOpenChange={handleCloseForm}
        request={editingRequest}
      />
      
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Request"
        description="Are you sure you want to delete this maintenance request? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => deleteId && handleDelete(deleteId)}
      />
    </div>
  );
};

export default RequestsPage;
