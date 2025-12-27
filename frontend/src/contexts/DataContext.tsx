import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Equipment, MaintenanceTeam, MaintenanceRequest } from '@/types';
import { useAuth } from './AuthContext';

const API_BASE = 'http://localhost:5000/api';

interface DataContextType {
  equipment: Equipment[];
  teams: MaintenanceTeam[];
  requests: MaintenanceRequest[];
  addEquipment: (equipment: Omit<Equipment, 'id' | 'createdAt' | 'maintenanceCount' | 'isScrap'>) => Promise<void>;
  updateEquipment: (id: string, equipment: Partial<Equipment>) => Promise<void>;
  deleteEquipment: (id: string) => Promise<void>;
  addTeam: (team: Omit<MaintenanceTeam, 'id' | 'createdAt' | 'activeRequests'>) => Promise<void>;
  updateTeam: (id: string, team: Partial<MaintenanceTeam>) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
  addRequest: (request: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRequest: (id: string, request: Partial<MaintenanceRequest>) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
  updateRequestStatus: (id: string, status: MaintenanceRequest['status']) => Promise<void>;
  getEquipmentById: (id: string) => Equipment | undefined;
  getTeamById: (id: string) => MaintenanceTeam | undefined;
  getRequestsByEquipmentId: (equipmentId: string) => MaintenanceRequest[];
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DataProviderContent: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [teams, setTeams] = useState<MaintenanceTeam[]>([]);
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  });

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const [eqRes, teamRes, reqRes] = await Promise.all([
          fetch(`${API_BASE}/equipment`, { headers: getHeaders() }),
          fetch(`${API_BASE}/teams`, { headers: getHeaders() }),
          fetch(`${API_BASE}/requests`, { headers: getHeaders() })
        ]);
        const eqData = await eqRes.json();
        const teamData = await teamRes.json();
        const reqData = await reqRes.json();
        setEquipment(eqData.data || eqData);
        setTeams(teamData.data || teamData);
        setRequests(reqData.data || reqData);
      } catch (error) {
        console.error('Failed to load data', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [token]);

  const addEquipment = async (eq: Omit<Equipment, 'id' | 'createdAt' | 'maintenanceCount' | 'isScrap'>) => {
    try {
      const res = await fetch(`${API_BASE}/equipment`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(eq),
      });
      const newEquipment = await res.json();
      setEquipment(prev => [...prev, newEquipment.data || newEquipment]);
    } catch (error) {
      console.error('Failed to add equipment', error);
    }
  };

  const updateEquipment = async (id: string, updates: Partial<Equipment>) => {
    try {
      const res = await fetch(`${API_BASE}/equipment/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      const updated = await res.json();
      setEquipment(prev => prev.map(eq => eq.id === id ? (updated.data || updated) : eq));
    } catch (error) {
      console.error('Failed to update equipment', error);
    }
  };

  const deleteEquipment = async (id: string) => {
    try {
      await fetch(`${API_BASE}/equipment/${id}`, { 
        method: 'DELETE',
        headers: getHeaders(),
      });
      setEquipment(prev => prev.filter(eq => eq.id !== id));
      setRequests(prev => prev.filter(req => req.equipmentId !== id));
    } catch (error) {
      console.error('Failed to delete equipment', error);
    }
  };

  const addTeam = async (team: Omit<MaintenanceTeam, 'id' | 'createdAt' | 'activeRequests'>) => {
    try {
      const res = await fetch(`${API_BASE}/teams`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(team),
      });
      const newTeam = await res.json();
      setTeams(prev => [...prev, newTeam.data || newTeam]);
    } catch (error) {
      console.error('Failed to add team', error);
    }
  };

  const updateTeam = async (id: string, updates: Partial<MaintenanceTeam>) => {
    try {
      const res = await fetch(`${API_BASE}/teams/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      const updated = await res.json();
      setTeams(prev => prev.map(team => team.id === id ? (updated.data || updated) : team));
    } catch (error) {
      console.error('Failed to update team', error);
    }
  };

  const deleteTeam = async (id: string) => {
    try {
      await fetch(`${API_BASE}/teams/${id}`, { 
        method: 'DELETE',
        headers: getHeaders(),
      });
      setTeams(prev => prev.filter(team => team.id !== id));
    } catch (error) {
      console.error('Failed to delete team', error);
    }
  };

  const addRequest = async (req: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await fetch(`${API_BASE}/requests`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(req),
      });
      const newRequest = await res.json();
      setRequests(prev => [...prev, newRequest.data || newRequest]);
    } catch (error) {
      console.error('Failed to add request', error);
    }
  };

  const updateRequest = async (id: string, updates: Partial<MaintenanceRequest>) => {
    try {
      const res = await fetch(`${API_BASE}/requests/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      const updated = await res.json();
      setRequests(prev => prev.map(req => 
        req.id === id ? (updated.data || updated) : req
      ));
    } catch (error) {
      console.error('Failed to update request', error);
    }
  };

  const deleteRequest = async (id: string) => {
    try {
      await fetch(`${API_BASE}/requests/${id}`, { 
        method: 'DELETE',
        headers: getHeaders(),
      });
      setRequests(prev => prev.filter(req => req.id !== id));
    } catch (error) {
      console.error('Failed to delete request', error);
    }
  };

  const updateRequestStatus = async (id: string, status: MaintenanceRequest['status']) => {
    await updateRequest(id, { status });
  };

  const getEquipmentById = (id: string) => equipment.find(eq => eq.id === id);
  const getTeamById = (id: string) => teams.find(team => team.id === id);
  const getRequestsByEquipmentId = (equipmentId: string) => 
    requests.filter(req => req.equipmentId === equipmentId);

  return (
    <DataContext.Provider value={{
      equipment,
      teams,
      requests,
      addEquipment,
      updateEquipment,
      deleteEquipment,
      addTeam,
      updateTeam,
      deleteTeam,
      addRequest,
      updateRequest,
      deleteRequest,
      updateRequestStatus,
      getEquipmentById,
      getTeamById,
      getRequestsByEquipmentId,
      loading,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <DataProviderContent>
      {children}
    </DataProviderContent>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
