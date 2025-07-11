'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Crown, 
  Shield, 
  Database, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  Server,
  Users,
  BarChart3,
  Settings,
  Eye,
  Download,
  GraduationCap,
  UserCheck
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { StatsCard } from '@/components/dashboard';

interface Department {
  _id: string;
  name: string;
  code: string;
  description: string;
}

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher' | 'admin' | 'super-admin';
  department: string;
  isActive: boolean;
  createdAt: string;
}

interface DepartmentStats {
  department: string;
  students: number;
  teachers: number;
  activeRate: string;
  trend: 'up' | 'down';
}

export default function SuperAdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [systemStats, setSystemStats] = useState<any[]>([]);
  const [departmentStats, setDepartmentStats] = useState<DepartmentStats[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch departments and users
      const [departmentsResponse, usersResponse] = await Promise.all([
        apiClient.getDepartments(),
        apiClient.getUsers()
      ]);

      if (departmentsResponse.success) {
        setDepartments(departmentsResponse.data || []);
      }

      if (usersResponse.success) {
        setUsers(usersResponse.data.users || []);
      }

      // Calculate real system stats
      calculateSystemStats();
      calculateDepartmentStats();

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSystemStats = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.isActive).length;
    const students = users.filter(u => u.role === 'student').length;
    const teachers = users.filter(u => u.role === 'teacher').length;
    const admins = users.filter(u => u.role === 'admin').length;

    const stats = [
      {
        title: 'Total Users',
        value: totalUsers.toString(),
        change: `${activeUsers} active`,
        icon: Users,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      },
      {
        title: 'Students',
        value: students.toString(),
        change: `${Math.round((students / totalUsers) * 100)}% of total`,
        icon: GraduationCap,
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      },
      {
        title: 'Teachers',
        value: teachers.toString(),
        change: `${Math.round((teachers / totalUsers) * 100)}% of total`,
        icon: UserCheck,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100'
      },
      {
        title: 'Departments',
        value: departments.length.toString(),
        change: `${admins} admins`,
        icon: Database,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100'
      }
    ];

    setSystemStats(stats);
  };

  const calculateDepartmentStats = () => {
    const deptStats: DepartmentStats[] = departments.map(dept => {
      const deptUsers = users.filter(u => u.department === dept._id);
      const students = deptUsers.filter(u => u.role === 'student').length;
      const teachers = deptUsers.filter(u => u.role === 'teacher').length;
      const activeUsers = deptUsers.filter(u => u.isActive).length;
      const activeRate = deptUsers.length > 0 ? Math.round((activeUsers / deptUsers.length) * 100) : 0;

      return {
        department: dept.name,
        students,
        teachers,
        activeRate: `${activeRate}%`,
        trend: activeRate >= 85 ? 'up' : 'down'
      };
    });

    setDepartmentStats(deptStats);
  };

  const criticalAlerts = [
    {
      type: 'info',
      message: 'System running smoothly',
      time: 'Just now',
      action: 'monitoring'
    }
  ];

  const auditLogs = [
    {
      user: user?.email || 'admin@university.edu',
      action: 'Dashboard accessed',
      resource: 'Super Admin Panel',
      timestamp: new Date().toLocaleString(),
      ip: 'System'
    }
  ];

  if (loading) {
    return (
      <DashboardLayout role="super-admin">
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading dashboard data...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="super-admin">
      <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center space-x-3">
            <Crown className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold mb-2">Super Admin Dashboard</h1>
              <p className="text-purple-100">Complete system oversight and control panel for Head of Department.</p>
            </div>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemStats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
              color={stat.color}
              bgColor={stat.bgColor}
            />
          ))}
        </div>

        {/* Department Overview & Critical Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Department Overview</span>
              </CardTitle>
              <CardDescription>Performance metrics across all departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentStats.map((dept, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{dept.department}</h4>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className={`w-4 h-4 ${
                          dept.trend === 'up' ? 'text-green-500' : 'text-red-500'
                        }`} />
                        <span className="text-sm font-medium">{dept.activeRate}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Students</p>
                        <p className="font-medium text-blue-600">{dept.students}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Teachers</p>
                        <p className="font-medium text-green-600">{dept.teachers}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Critical Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>System Alerts</span>
              </CardTitle>
              <CardDescription>Recent system notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {criticalAlerts.map((alert, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                      </div>
                      <Badge 
                        variant={alert.type === 'critical' ? 'destructive' : 
                                 alert.type === 'warning' ? 'default' : 'secondary'}
                        className="ml-2"
                      >
                        {alert.action}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Audit Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Users className="w-6 h-6" />
                  <span className="text-sm">Manage Users</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Database className="w-6 h-6" />
                  <span className="text-sm">Departments</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Eye className="w-6 h-6" />
                  <span className="text-sm">System Logs</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Download className="w-6 h-6" />
                  <span className="text-sm">Export Data</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Audit Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>Latest system activities and user actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{log.action}</p>
                        <p className="text-xs text-gray-500">{log.resource}</p>
                        <p className="text-xs text-gray-400 mt-1">{log.timestamp}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-gray-600">{log.user}</p>
                        <p className="text-xs text-gray-400">{log.ip}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}