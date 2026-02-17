import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Application, ApplicationStatus, Job } from '../types';

interface DashboardProps {
  applications: Application[];
  jobs: Job[];
}

const COLORS = ['#3b82f6', '#eab308', '#22c55e', '#ef4444'];

export const Dashboard: React.FC<DashboardProps> = ({ applications }) => {
  const statusCounts = [
    { name: 'Applied', value: applications.filter(a => a.status === ApplicationStatus.Applied).length },
    { name: 'Interviewing', value: applications.filter(a => a.status === ApplicationStatus.Interviewing).length },
    { name: 'Offer', value: applications.filter(a => a.status === ApplicationStatus.Offer).length },
    { name: 'Rejected', value: applications.filter(a => a.status === ApplicationStatus.Rejected).length },
  ];

  const activityData = [
    { day: 'Mon', apps: 2 },
    { day: 'Tue', apps: 5 },
    { day: 'Wed', apps: 1 },
    { day: 'Thu', apps: 3 },
    { day: 'Fri', apps: 4 },
    { day: 'Sat', apps: 0 },
    { day: 'Sun', apps: 1 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Total Applications</h3>
          <p className="text-3xl font-bold">{applications.length}</p>
          <span className="text-green-500 text-xs font-medium flex items-center mt-2">
            +12% from last week
          </span>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Interviews Scheduled</h3>
          <p className="text-3xl font-bold">{statusCounts[1].value}</p>
          <span className="text-gray-500 text-xs font-medium mt-2 block">
            Upcoming in 7 days
          </span>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Response Rate</h3>
          <p className="text-3xl font-bold">15%</p>
          <span className="text-gray-500 text-xs font-medium mt-2 block">
            Industry avg: 5-10%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm min-h-[300px]">
          <h3 className="text-lg font-semibold mb-6">Application Status</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusCounts}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ backgroundColor: 'rgb(17 24 39)', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs text-gray-500">
             {statusCounts.map((s, i) => (
                 <div key={s.name} className="flex items-center gap-1">
                     <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                     {s.name}
                 </div>
             ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm min-h-[300px]">
          <h3 className="text-lg font-semibold mb-6">Weekly Activity</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ backgroundColor: 'rgb(17 24 39)', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="apps" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
