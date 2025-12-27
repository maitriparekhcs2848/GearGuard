import React, { useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { useData } from '@/contexts/DataContext';
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
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const COLORS = ['hsl(217, 91%, 60%)', 'hsl(37, 90%, 51%)', 'hsl(145, 63%, 42%)', 'hsl(6, 78%, 57%)', 'hsl(204, 70%, 53%)'];

const ReportsPage: React.FC = () => {
  const { equipment, teams, requests } = useData();

  const equipmentByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    equipment.forEach(eq => {
      counts[eq.category] = (counts[eq.category] || 0) + 1;
    });
    return Object.entries(counts).map(([category, count]) => ({ category, count }));
  }, [equipment]);

  const requestsByType = useMemo(() => {
    const corrective = requests.filter(r => r.type === 'Corrective').length;
    const preventive = requests.filter(r => r.type === 'Preventive').length;
    return [
      { type: 'Corrective', count: corrective },
      { type: 'Preventive', count: preventive },
    ];
  }, [requests]);

  const equipmentHealth = useMemo(() => {
    const ranges = [
      { range: '0-40', min: 0, max: 40 },
      { range: '41-60', min: 41, max: 60 },
      { range: '61-80', min: 61, max: 80 },
      { range: '81-100', min: 81, max: 100 },
    ];
    return ranges.map(({ range, min, max }) => ({
      range,
      count: equipment.filter(eq => eq.healthScore >= min && eq.healthScore <= max).length,
    }));
  }, [equipment]);

  const requestsTrend = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const start = startOfMonth(date);
      const end = endOfMonth(date);
      
      const count = requests.filter(r => {
        const reqDate = new Date(r.createdAt);
        return isWithinInterval(reqDate, { start, end });
      }).length;
      
      months.push({
        month: format(date, 'MMM'),
        requests: count,
      });
    }
    return months;
  }, [requests]);

  const teamWorkload = useMemo(() => {
    return teams.map(team => {
      const activeRequests = requests.filter(r => 
        r.teamId === team.id && (r.status === 'New' || r.status === 'In Progress')
      ).length;
      const completedRequests = requests.filter(r => 
        r.teamId === team.id && r.status === 'Repaired'
      ).length;
      return {
        name: team.name,
        active: activeRequests,
        completed: completedRequests,
      };
    });
  }, [teams, requests]);

  const priorityDistribution = useMemo(() => {
    const counts: Record<string, number> = {
      Low: 0,
      Medium: 0,
      High: 0,
      Critical: 0,
    };
    requests.forEach(r => {
      counts[r.priority]++;
    });
    return Object.entries(counts)
      .filter(([, count]) => count > 0)
      .map(([priority, count]) => ({ priority, count }));
  }, [requests]);

  return (
    <div className="min-h-screen">
      <Header title="Reports & Analytics" />
      
      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border p-5 animate-slide-up">
            <h4 className="text-sm text-muted-foreground">Total Equipment</h4>
            <p className="text-3xl font-bold text-foreground mt-1">{equipment.length}</p>
          </div>
          <div className="bg-card rounded-xl border p-5 animate-slide-up" style={{ animationDelay: '0.05s' }}>
            <h4 className="text-sm text-muted-foreground">Total Requests</h4>
            <p className="text-3xl font-bold text-foreground mt-1">{requests.length}</p>
          </div>
          <div className="bg-card rounded-xl border p-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-sm text-muted-foreground">Active Teams</h4>
            <p className="text-3xl font-bold text-foreground mt-1">{teams.length}</p>
          </div>
          <div className="bg-card rounded-xl border p-5 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <h4 className="text-sm text-muted-foreground">Avg Health Score</h4>
            <p className="text-3xl font-bold text-foreground mt-1">
              {equipment.length > 0 
                ? Math.round(equipment.reduce((sum, eq) => sum + eq.healthScore, 0) / equipment.length)
                : 0}%
            </p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Requests Trend */}
          <div className="bg-card rounded-xl border p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="section-title">Requests Trend (6 Months)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={requestsTrend}>
                  <defs>
                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="requests" 
                    stroke="hsl(217, 91%, 60%)" 
                    fill="url(#colorRequests)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Team Workload */}
          <div className="bg-card rounded-xl border p-6 animate-slide-up" style={{ animationDelay: '0.25s' }}>
            <h3 className="section-title">Team Workload</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamWorkload}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="active" name="Active" fill="hsl(37, 90%, 51%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" name="Completed" fill="hsl(145, 63%, 42%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Equipment by Category */}
          <div className="bg-card rounded-xl border p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="section-title">Equipment by Category</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={equipmentByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="category"
                  >
                    {equipmentByCategory.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Request Type Distribution */}
          <div className="bg-card rounded-xl border p-6 animate-slide-up" style={{ animationDelay: '0.35s' }}>
            <h3 className="section-title">Request Types</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={requestsByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="type"
                  >
                    <Cell fill="hsl(6, 78%, 57%)" />
                    <Cell fill="hsl(204, 70%, 53%)" />
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="bg-card rounded-xl border p-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <h3 className="section-title">Priority Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    type="number"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    type="category"
                    dataKey="priority"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    width={70}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(217, 91%, 60%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Equipment Health Distribution */}
        <div className="bg-card rounded-xl border p-6 animate-slide-up" style={{ animationDelay: '0.45s' }}>
          <h3 className="section-title">Equipment Health Score Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={equipmentHealth}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="range" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  <Cell fill="hsl(6, 78%, 57%)" />
                  <Cell fill="hsl(37, 90%, 51%)" />
                  <Cell fill="hsl(204, 70%, 53%)" />
                  <Cell fill="hsl(145, 63%, 42%)" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
