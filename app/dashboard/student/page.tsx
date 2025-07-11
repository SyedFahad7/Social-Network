'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  FileText, 
  Award, 
  Clock, 
  TrendingUp, 
  CheckCircle,
  AlertCircle,
  BookOpen
} from 'lucide-react';

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const stats = [
    {
      title: 'Attendance',
      value: '87%',
      change: '+2%',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'Assignments Due',
      value: '3',
      change: 'This week',
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900'
    },
    {
      title: 'Certificates',
      value: '12',
      change: '2 pending approval',
      icon: Award,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      title: 'GPA',
      value: '8.7',
      change: '+0.3',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900'
    }
  ];

  const recentActivities = [
    {
      type: 'assignment',
      title: 'Data Structures Assignment 2 uploaded',
      time: '2 hours ago',
      status: 'new'
    },
    {
      type: 'certificate',
      title: 'Python Certification approved',
      time: '1 day ago',
      status: 'approved'
    },
    {
      type: 'feedback',
      title: 'Monthly feedback form available',
      time: '2 days ago',
      status: 'pending'
    },
    {
      type: 'test',
      title: 'Database Management surprise test completed',
      time: '3 days ago',
      status: 'completed'
    }
  ];

  const upcomingDeadlines = [
    {
      title: 'Machine Learning Assignment 1',
      subject: 'CS401',
      dueDate: '2025-01-15',
      priority: 'high'
    },
    {
      title: 'Web Development Project',
      subject: 'CS402',
      dueDate: '2025-01-18',
      priority: 'medium'
    },
    {
      title: 'Monthly Feedback Form',
      subject: 'General',
      dueDate: '2025-01-20',
      priority: 'low'
    }
  ];

  return (
    <DashboardLayout role="student">
      <div className="p-4 lg:p-6 space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg p-4 lg:p-6 text-white">
          <h1 className="text-xl lg:text-2xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0] || 'Student'}!</h1>
          <p className="text-blue-100 text-sm lg:text-base">Here's what's happening with your academic journey today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</p>
                    <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white mt-1 truncate">{stat.value}</p>
                    <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">{stat.change}</p>
                  </div>
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg ${stat.bgColor} flex items-center justify-center flex-shrink-0 ml-2`}>
                    <stat.icon className={`w-5 h-5 lg:w-6 lg:h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Clock className="w-5 h-5" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>Your latest academic updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                    </div>
                    <Badge 
                      variant={activity.status === 'approved' ? 'default' : 
                               activity.status === 'pending' ? 'secondary' : 'outline'}
                      className="flex-shrink-0"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <AlertCircle className="w-5 h-5" />
                <span>Upcoming Deadlines</span>
              </CardTitle>
              <CardDescription>Don't miss these important dates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline, index) => (
                  <div key={index} className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{deadline.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{deadline.subject}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Due: {deadline.dueDate}</p>
                      </div>
                      <Badge 
                        variant={deadline.priority === 'high' ? 'destructive' : 
                                 deadline.priority === 'medium' ? 'default' : 'secondary'}
                        className="flex-shrink-0 ml-2"
                      >
                        {deadline.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer group">
            <CardContent className="p-4 lg:p-6 text-center">
              <Calendar className="w-10 h-10 lg:w-12 lg:h-12 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">View Timetable</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Check your class schedule</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer group">
            <CardContent className="p-4 lg:p-6 text-center">
              <Award className="w-10 h-10 lg:w-12 lg:h-12 text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Upload Certificate</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Add your latest achievements</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer group sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 lg:p-6 text-center">
              <BookOpen className="w-10 h-10 lg:w-12 lg:h-12 text-purple-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Question Banks</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Access study materials</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}