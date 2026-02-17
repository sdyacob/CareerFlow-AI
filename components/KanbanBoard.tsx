import React, { useState } from 'react';
import { Application, ApplicationStatus, Job } from '../types';
import { MoreHorizontal } from 'lucide-react';

interface KanbanBoardProps {
  applications: Application[];
  jobs: Job[];
  onStatusChange: (appId: string, newStatus: ApplicationStatus) => void;
}

const COLUMNS: { id: ApplicationStatus; title: string; color: string }[] = [
  { id: ApplicationStatus.Applied, title: 'Applied', color: 'bg-blue-500' },
  { id: ApplicationStatus.Interviewing, title: 'Interviewing', color: 'bg-yellow-500' },
  { id: ApplicationStatus.Offer, title: 'Offer', color: 'bg-green-500' },
  { id: ApplicationStatus.Rejected, title: 'Rejected', color: 'bg-red-500' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ applications, jobs, onStatusChange }) => {
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, appId: string) => {
    e.dataTransfer.setData('appId', appId);
    setDraggedAppId(appId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: ApplicationStatus) => {
    e.preventDefault();
    const appId = e.dataTransfer.getData('appId');
    if (appId) {
      onStatusChange(appId, status);
    }
    setDraggedAppId(null);
  };

  const getJobDetails = (jobId: string) => jobs.find(j => j.id === jobId);

  return (
    <div className="h-[calc(100vh-12rem)] overflow-x-auto">
        <div className="flex gap-6 h-full min-w-[1000px]">
        {COLUMNS.map(column => (
            <div
            key={column.id}
            className="flex-1 bg-gray-100 dark:bg-gray-900/50 rounded-xl p-4 flex flex-col min-w-[280px]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
            >
            <div className="flex items-center gap-2 mb-4">
                <div className={`w-3 h-3 rounded-full ${column.color}`} />
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">{column.title}</h3>
                <span className="text-xs text-gray-500 ml-auto bg-white dark:bg-gray-800 px-2 py-1 rounded-md">
                {applications.filter(a => a.status === column.id).length}
                </span>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                {applications
                .filter(app => app.status === column.id)
                .map(app => {
                    const job = getJobDetails(app.jobId);
                    if (!job) return null;

                    return (
                    <div
                        key={app.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, app.id)}
                        className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-move hover:shadow-md transition-all ${draggedAppId === app.id ? 'opacity-50' : ''}`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-sm line-clamp-1">{job.title}</h4>
                            <button className="text-gray-400 hover:text-gray-600">
                                <MoreHorizontal size={16} />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">{job.company}</p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{app.appliedAt}</span>
                            {/* Simulate Avatar */}
                             <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-[10px] font-bold">
                                AD
                             </div>
                        </div>
                    </div>
                    );
                })}
            </div>
            </div>
        ))}
        </div>
    </div>
  );
};
