import React, { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { useData } from '@/contexts/DataContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline';
import { Cog, Users, FileText, CheckCircle, Plus, ArrowRight, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RequestForm } from '@/components/requests/RequestForm';
import { EquipmentForm } from '@/components/equipment/EquipmentForm';
import { TeamForm } from '@/components/teams/TeamForm';
import { Link } from 'react-router-dom';
import { format, differenceInDays, isAfter } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';

const Dashboard: React.FC = () => {
  const { equipment, teams, requests, getEquipmentById, getTeamById } = useData();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showEquipmentForm, setShowEquipmentForm] = useState(false);
  const [showTeamForm, setShowTeamForm] = useState(false);

  const stats = useMemo(() => ({
    totalEquipment: equipment.length,
    activeRequests: requests.filter(r => r.status === 'New' || r.status === 'In Progress').length,
    totalTeams: teams.length,
    completedThisMonth: requests.filter(r => r.status === 'Repaired').length,
  }), [equipment, teams, requests]);

  const overdueRequests = useMemo(() => 
    requests.filter(r => 
      (r.status === 'New' || r.status === 'In Progress') && 
      new Date() > new Date(r.scheduledDate)
    ).length,
    [requests]
  );

  const recentRequests = useMemo(() => 
    [...requests]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5),
    [requests]
  );

  const requestsByTeam = useMemo(() => {
    const data: Record<string, number> = {};
    teams.forEach(team => {
      data[team.name] = requests.filter(r => r.teamId === team.id).length;
    });
    return Object.entries(data).map(([name, count]) => ({ name: name.replace(' Team', ''), count }));
  }, [teams, requests]);

  const requestsByStatus = useMemo(() => {
    const statusCounts = {
      'New': requests.filter(r => r.status === 'New').length,
      'In Progress': requests.filter(r => r.status === 'In Progress').length,
      'Repaired': requests.filter(r => r.status === 'Repaired').length,
      'Scrap': requests.filter(r => r.status === 'Scrap').length,
    };
    return Object.entries(statusCounts)
      .filter(([, count]) => count > 0)
      .map(([status, count]) => ({ status, count }));
  }, [requests]);

  // Generate trend data for area chart
  const trendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, i) => ({
      month,
      requests: Math.floor(Math.random() * 20) + 10 + i * 2,
      completed: Math.floor(Math.random() * 15) + 5 + i,
    }));
  }, []);

  const COLORS = ['hsl(217, 91%, 60%)', 'hsl(37, 90%, 51%)', 'hsl(145, 63%, 42%)', 'hsl(6, 78%, 57%)'];

  const getDueBadge = (date: string) => {
    const days = differenceInDays(new Date(date), new Date());
    if (days < 0) return { label: `${Math.abs(days)}d overdue`, variant: 'overdue' as const };
    if (days <= 2) return { label: `Due in ${days}d`, variant: 'urgent' as const };
    return { label: format(new Date(date), 'MMM d'), variant: 'normal' as const };
  };

  return (
    <div className="min-h-screen">
      <Header 
        title="Dashboard" 
        subtitle="Welcome back! Here's what's happening with your equipment."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowTeamForm(true)} className="btn-press">
              <Users className="w-4 h-4 mr-2" />
              Add Team
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowEquipmentForm(true)} className="btn-press">
              <Cog className="w-4 h-4 mr-2" />
              Add Equipment
            </Button>
            <Button size="sm" onClick={() => setShowRequestForm(true)} className="btn-press">
              <Plus className="w-4 h-4 mr-2" />
              Create Request
            </Button>
          </div>
        }
      />
      
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Equipment"
            value={stats.totalEquipment}
            icon={Cog}
            color="primary"
            trend={{ value: 12, isPositive: true }}
            delay={0}
          />
          <StatCard
            title="Active Requests"
            value={stats.activeRequests}
            icon={FileText}
            color="warning"
            trend={{ value: overdueRequests, isPositive: false }}
            delay={100}
          />
          <StatCard
            title="Maintenance Teams"
            value={stats.totalTeams}
            icon={Users}
            color="info"
            delay={200}
          />
          <StatCard
            title="Completed This Month"
            value={stats.completedThisMonth}
            icon={CheckCircle}
            color="success"
            trend={{ value: 24, isPositive: true }}
            delay={300}
          />
        </div>

        {/* Alert Banner for Overdue */}
        {overdueRequests > 0 && (
          <div className="bg-danger/10 border border-danger/20 rounded-xl p-4 flex items-center gap-4 animate-fade-in">
            <div className="p-2 bg-danger/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-danger" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-danger">Attention Required</h4>
              <p className="text-sm text-danger/80">
                You have {overdueRequests} overdue maintenance request{overdueRequests > 1 ? 's' : ''} that need immediate attention.
              </p>
            </div>
            <Link to="/requests">
              <Button variant="outline" size="sm" className="border-danger/30 text-danger hover:bg-danger/10">
                View Requests
              </Button>
            </Link>
          </div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Area Chart - Trend */}
          <div className="lg:col-span-2 bg-card rounded-xl border p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Maintenance Trend</h3>
                <p className="text-sm text-muted-foreground">Request volume over time</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Requests</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-muted-foreground">Completed</span>
                </div>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: 'var(--shadow-lg)',
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="requests" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorRequests)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorCompleted)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart - Requests by Status */}
          <div className="bg-card rounded-xl border p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-lg font-semibold text-foreground mb-4">Status Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={requestsByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="status"
                  >
                    {requestsByStatus.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        className="transition-all duration-300 hover:opacity-80"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar Chart - Requests by Team */}
          <div className="lg:col-span-2 bg-card rounded-xl border p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Team Workload</h3>
                <p className="text-sm text-muted-foreground">Requests assigned per team</p>
              </div>
              <Link to="/teams">
                <Button variant="ghost" size="sm">
                  View Teams <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={requestsByTeam} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={true} vertical={false} />
                  <XAxis 
                    type="number"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    type="category"
                    dataKey="name" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    width={100}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="hsl(var(--primary))" 
                    radius={[0, 4, 4, 0]}
                    className="transition-all duration-300"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Timeline */}
          <ActivityTimeline requests={recentRequests} />
        </div>

        {/* Recent Requests Table */}
        <div className="bg-card rounded-xl border animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="p-6 flex items-center justify-between border-b border-border">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Recent Maintenance Requests</h3>
              <p className="text-sm text-muted-foreground">Latest {recentRequests.length} requests</p>
            </div>
            <Link to="/requests">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subject</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Equipment</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Due Date</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Team</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentRequests.map((request, index) => {
                  const eq = getEquipmentById(request.equipmentId);
                  const team = getTeamById(request.teamId);
                  const dueBadge = getDueBadge(request.scheduledDate);
                  
                  return (
                    <tr 
                      key={request.id} 
                      className="table-row-hover"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{request.subject}</div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {eq?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge type={request.type} />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={request.status} />
                      </td>
                      <td className="px-6 py-4">
                        <span className={`countdown-badge ${dueBadge.variant}`}>
                          <Clock className="w-3 h-3" />
                          {dueBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {team?.name || 'Unassigned'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <RequestForm open={showRequestForm} onOpenChange={setShowRequestForm} />
      <EquipmentForm open={showEquipmentForm} onOpenChange={setShowEquipmentForm} />
      <TeamForm open={showTeamForm} onOpenChange={setShowTeamForm} />
    </div>
  );
};

export default Dashboard;
