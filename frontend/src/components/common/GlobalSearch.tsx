import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { 
  Cog, 
  Users, 
  FileText, 
  LayoutDashboard, 
  Kanban, 
  Calendar, 
  BarChart3,
  Search,
  Wrench,
  AlertTriangle
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const { equipment, teams, requests, getEquipmentById } = useData();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const pages = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Equipment', icon: Cog, path: '/equipment' },
    { name: 'Teams', icon: Users, path: '/teams' },
    { name: 'Requests', icon: FileText, path: '/requests' },
    { name: 'Kanban Board', icon: Kanban, path: '/kanban' },
    { name: 'Calendar', icon: Calendar, path: '/calendar' },
    { name: 'Reports', icon: BarChart3, path: '/reports' },
  ];

  const handleSelect = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search everything..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Pages">
          {pages.map((page) => (
            <CommandItem
              key={page.path}
              value={page.name}
              onSelect={() => handleSelect(page.path)}
              className="flex items-center gap-3"
            >
              <page.icon className="w-4 h-4 text-muted-foreground" />
              <span>{page.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Equipment">
          {equipment.slice(0, 5).map((eq) => (
            <CommandItem
              key={eq.id}
              value={`${eq.name} ${eq.serialNumber}`}
              onSelect={() => handleSelect('/equipment')}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Cog className="w-4 h-4 text-muted-foreground" />
                <div>
                  <span className="font-medium">{eq.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">{eq.serialNumber}</span>
                </div>
              </div>
              <StatusBadge condition={eq.condition} />
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Maintenance Requests">
          {requests.slice(0, 5).map((req) => {
            const eq = getEquipmentById(req.equipmentId);
            return (
              <CommandItem
                key={req.id}
                value={`${req.subject} ${eq?.name}`}
                onSelect={() => handleSelect('/requests')}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Wrench className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <span className="font-medium">{req.subject}</span>
                    <span className="text-xs text-muted-foreground ml-2">{eq?.name}</span>
                  </div>
                </div>
                <StatusBadge status={req.status} />
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Teams">
          {teams.map((team) => (
            <CommandItem
              key={team.id}
              value={`${team.name} ${team.specialization}`}
              onSelect={() => handleSelect('/teams')}
              className="flex items-center gap-3"
            >
              <Users className="w-4 h-4 text-muted-foreground" />
              <div>
                <span className="font-medium">{team.name}</span>
                <span className="text-xs text-muted-foreground ml-2">{team.specialization}</span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
