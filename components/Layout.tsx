import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, FileText, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Sidebar = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive 
        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 font-medium' 
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
    }`;

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen flex flex-col fixed left-0 top-0 z-20 hidden md:flex">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
          CareerFlow AI
        </h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        <NavLink to="/" className={linkClass}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/jobs" className={linkClass}>
          <Briefcase size={20} />
          <span>Job Feed</span>
        </NavLink>
        <NavLink to="/applications" className={linkClass}>
          <FileText size={20} />
          <span>Applications</span>
        </NavLink>
        <NavLink to="/profile" className={linkClass}>
          <User size={20} />
          <span>My Profile</span>
        </NavLink>
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 text-sm font-bold">
            AD
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-900 dark:text-white">Alex Developer</p>
            <p className="text-gray-500 text-xs">Free Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

const MobileHeader = () => {
    return (
        <div className="md:hidden h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 justify-between sticky top-0 z-30">
             <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                CareerFlow AI
            </h1>
            {/* Simple hamburger placeholder - in real app would toggle sidebar */}
            <button className="text-gray-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
        </div>
    )
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Sidebar />
      <div className="md:pl-64 flex flex-col min-h-screen">
        <MobileHeader />
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
