export type EquipmentCategory = 'Machinery' | 'Vehicles' | 'Computers' | 'Tools';
export type Department = 'Production' | 'IT' | 'Sales' | 'HR' | 'Finance';
export type TeamSpecialization = 'Mechanical' | 'Electrical' | 'IT' | 'HVAC';
export type RequestType = 'Corrective' | 'Preventive';
export type RequestStatus = 'New' | 'In Progress' | 'Repaired' | 'Scrap';
export type EquipmentCondition = 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';

export interface MaintenanceTeam {
  id: string;
  name: string;
  specialization: TeamSpecialization;
  members: string[];
  activeRequests: number;
  createdAt: Date;
}

export interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  category: EquipmentCategory;
  department: Department;
  teamId: string;
  location: string;
  purchaseDate: Date;
  warrantyExpiry: Date;
  condition: EquipmentCondition;
  usageHours: number;
  maintenanceCount: number;
  isScrap: boolean;
  healthScore: number;
  assignedEmployee?: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface DashboardStats {
  totalEquipment: number;
  activeRequests: number;
  totalTeams: number;
  completedThisMonth: number;
}
