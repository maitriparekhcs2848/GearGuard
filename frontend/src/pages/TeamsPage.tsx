import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { useData } from '@/contexts/DataContext';
import { MaintenanceTeam } from '@/types';
import { TeamForm } from '@/components/teams/TeamForm';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users,
  Wrench,
  Zap,
  Monitor,
  Wind,
  User
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const specializationIcons = {
  Mechanical: Wrench,
  Electrical: Zap,
  IT: Monitor,
  HVAC: Wind,
};

const specializationColors = {
  Mechanical: 'bg-warning/10 text-warning border-warning/20',
  Electrical: 'bg-danger/10 text-danger border-danger/20',
  IT: 'bg-info/10 text-info border-info/20',
  HVAC: 'bg-success/10 text-success border-success/20',
};

const TeamsPage: React.FC = () => {
  const { teams, requests, deleteTeam } = useData();
  
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState<MaintenanceTeam | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleEdit = (team: MaintenanceTeam) => {
    setEditingTeam(team);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteTeam(id);
    toast.success('Team deleted successfully');
    setDeleteId(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTeam(undefined);
  };

  const getActiveRequestCount = (teamId: string) => {
    return requests.filter(r => r.teamId === teamId && (r.status === 'New' || r.status === 'In Progress')).length;
  };

  return (
    <div className="min-h-screen">
      <Header 
        title="Maintenance Teams" 
        action={
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Team
          </Button>
        }
      />
      
      <div className="p-6">
        {teams.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No teams yet"
            description="Create your first maintenance team to assign equipment and manage requests"
            actionLabel="Create Team"
            onAction={() => setShowForm(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team, index) => {
              const Icon = specializationIcons[team.specialization];
              const activeRequests = getActiveRequestCount(team.id);
              
              return (
                <div 
                  key={team.id} 
                  className="bg-card rounded-xl border overflow-hidden card-hover animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Header */}
                  <div className="p-5 border-b border-border">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2.5 rounded-lg border",
                          specializationColors[team.specialization]
                        )}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{team.name}</h3>
                          <p className="text-sm text-muted-foreground">{team.specialization}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(team)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-danger hover:text-danger"
                          onClick={() => setDeleteId(team.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 divide-x divide-border border-b border-border">
                    <div className="p-4 text-center">
                      <p className="text-2xl font-bold text-foreground">{team.members.length}</p>
                      <p className="text-sm text-muted-foreground">Members</p>
                    </div>
                    <div className="p-4 text-center">
                      <p className="text-2xl font-bold text-foreground">{activeRequests}</p>
                      <p className="text-sm text-muted-foreground">Active Requests</p>
                    </div>
                  </div>
                  
                  {/* Members */}
                  <div className="p-5">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Team Members</p>
                    <div className="space-y-2">
                      {team.members.map((member, i) => (
                        <div 
                          key={i} 
                          className="flex items-center gap-2 text-sm text-foreground"
                        >
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <span>{member}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <TeamForm 
        open={showForm} 
        onOpenChange={handleCloseForm}
        team={editingTeam}
      />
      
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Team"
        description="Are you sure you want to delete this team? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => deleteId && handleDelete(deleteId)}
      />
    </div>
  );
};

export default TeamsPage;
