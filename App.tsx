import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { JobFeed } from './components/JobFeed';
import { KanbanBoard } from './components/KanbanBoard';
import { ResumeManager } from './components/ResumeManager';
import { MOCK_JOBS, INITIAL_APPLICATIONS, INITIAL_PROFILE } from './services/mockData';
import { Profile, Application, ApplicationStatus } from './types';

// Simple Context-like state management for the demo
const AppContent = () => {
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  
  // Jobs are static in this demo, but could be state if we fetched them
  const jobs = MOCK_JOBS;

  const handleApply = (jobId: string) => {
    const newApp: Application = {
      id: `app_${Date.now()}`,
      jobId,
      userId: profile.id,
      status: ApplicationStatus.Applied,
      appliedAt: new Date().toISOString().split('T')[0]
    };
    setApplications([...applications, newApp]);
  };

  const handleStatusChange = (appId: string, newStatus: ApplicationStatus) => {
    setApplications(prev => 
      prev.map(app => app.id === appId ? { ...app, status: newStatus } : app)
    );
  };

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard applications={applications} jobs={jobs} />} />
        <Route path="/jobs" element={
          <JobFeed 
            jobs={jobs} 
            profile={profile} 
            applications={applications} 
            onApply={handleApply} 
          />
        } />
        <Route path="/applications" element={
          <KanbanBoard 
            applications={applications} 
            jobs={jobs} 
            onStatusChange={handleStatusChange} 
          />
        } />
        <Route path="/profile" element={
          <ResumeManager 
            profile={profile} 
            onUpdateProfile={setProfile} 
          />
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const App = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
