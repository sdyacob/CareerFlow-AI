import React, { useState, useMemo } from 'react';
import { Job, Profile, Application } from '../types';
import { calculateMatchScore, getMatchColor } from '../utils/matching';
import { MapPin, Briefcase, DollarSign, Check, Search, Filter, ArrowUpDown, X } from 'lucide-react';

interface JobFeedProps {
  jobs: Job[];
  profile: Profile;
  applications: Application[];
  onApply: (jobId: string) => void;
}

type SortOption = 'match' | 'salary' | 'date';
type JobTypeFilter = 'All' | 'Full-time' | 'Contract' | 'Remote';

export const JobFeed: React.FC<JobFeedProps> = ({ jobs, profile, applications, onApply }) => {
  const [filterType, setFilterType] = useState<JobTypeFilter>('All');
  const [filterLocation, setFilterLocation] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('match');
  
  // State to toggle filters on mobile
  const [showFilters, setShowFilters] = useState(false);

  // Helper to parse salary for sorting (normalizing to rough annual amount)
  const getSalaryValue = (salary: string) => {
    const normalized = salary.toLowerCase();
    const matches = normalized.match(/(\d+)/);
    if (!matches) return 0;
    let value = parseInt(matches[0]);
    
    // Check for 'k' (thousands)
    if (normalized.includes('k')) value *= 1000;
    
    // Check for hourly rates and convert to rough annual (x 2000 hours)
    if (normalized.includes('/hr') || normalized.includes('hour') || normalized.includes('/ hr')) {
        // If it was just a raw number like "80", it's now 80. If it was "80k", it's 80000.
        // Hourly usually doesn't have 'k'.
        if (!normalized.includes('k')) value *= 2000; 
    }
    
    return value;
  };

  // Helper to parse "posted at" string to days ago
  const getDateValue = (dateStr: string) => {
    const normalized = dateStr.toLowerCase();
    if (normalized.includes('just now')) return 0;
    
    const matches = normalized.match(/(\d+)/);
    const val = matches ? parseInt(matches[0]) : 0;
    
    if (normalized.includes('week')) return val * 7;
    if (normalized.includes('month')) return val * 30;
    return val; // assume days
  };

  const filteredAndSortedJobs = useMemo(() => {
    let result = [...jobs];

    // Filter by Type
    if (filterType !== 'All') {
      result = result.filter(job => job.type === filterType);
    }

    // Filter by Location
    if (filterLocation.trim()) {
      const loc = filterLocation.toLowerCase();
      result = result.filter(job => job.location.toLowerCase().includes(loc));
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'match') {
        const scoreA = calculateMatchScore(profile, a);
        const scoreB = calculateMatchScore(profile, b);
        return scoreB - scoreA; // Descending
      }
      if (sortBy === 'salary') {
        return getSalaryValue(b.salaryRange) - getSalaryValue(a.salaryRange); // Descending
      }
      if (sortBy === 'date') {
        return getDateValue(a.postedAt) - getDateValue(b.postedAt); // Ascending (0 days ago is newer than 2 days ago)
      }
      return 0;
    });

    return result;
  }, [jobs, filterType, filterLocation, sortBy, profile]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex justify-between items-center w-full md:w-auto">
           <div>
              <h2 className="text-2xl font-bold">Recommended Jobs</h2>
              <span className="text-sm text-gray-500">{filteredAndSortedJobs.length} jobs found</span>
           </div>
           
           {/* Mobile Filter Toggle Button */}
           <button 
             onClick={() => setShowFilters(!showFilters)}
             className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-2"
           >
             {showFilters ? <X size={18} /> : <Filter size={18} />}
             <span className="text-sm font-medium">{showFilters ? 'Close' : 'Filters'}</span>
           </button>
        </div>
        
        {/* Filters Toolbar - Conditionally rendered on mobile, always visible on desktop */}
        <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-col md:flex-row flex-wrap gap-3 items-stretch md:items-center bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm w-full md:w-auto transition-all`}>
            
            {/* Location Search */}
            <div className="relative group w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500" size={16} />
                <input 
                    type="text" 
                    placeholder="Filter location..." 
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-800 md:bg-transparent rounded-md md:rounded-none text-sm focus:outline-none w-full md:w-40 placeholder-gray-400"
                />
            </div>
            
            <div className="h-px w-full md:h-6 md:w-px bg-gray-200 dark:bg-gray-700 block my-1 md:my-0"></div>

            {/* Job Type Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto bg-gray-50 dark:bg-gray-800 md:bg-transparent p-1 rounded-md md:p-0">
                <Filter size={16} className="text-gray-400 hidden sm:block ml-2 md:ml-0" />
                <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as JobTypeFilter)}
                    className="bg-transparent text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer w-full md:w-auto p-1"
                >
                    <option value="All">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                </select>
            </div>

            <div className="h-px w-full md:h-6 md:w-px bg-gray-200 dark:bg-gray-700 block my-1 md:my-0"></div>

            {/* Sort By */}
            <div className="flex items-center gap-2 w-full md:w-auto bg-gray-50 dark:bg-gray-800 md:bg-transparent p-1 rounded-md md:p-0">
                <ArrowUpDown size={16} className="text-gray-400 hidden sm:block ml-2 md:ml-0" />
                <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="bg-transparent text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer w-full md:w-auto p-1"
                >
                    <option value="match">Sort: Match Score</option>
                    <option value="salary">Sort: Salary</option>
                    <option value="date">Sort: Newest</option>
                </select>
            </div>
        </div>
      </div>

      {filteredAndSortedJobs.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
              <Briefcase className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No jobs found</h3>
              <p className="text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAndSortedJobs.map(job => {
            const score = calculateMatchScore(profile, job);
            const hasApplied = applications.some(app => app.jobId === job.id);
            const scoreColor = getMatchColor(score);

            return (
                <div key={job.id} className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow flex flex-col group">
                <div className="flex justify-between items-start mb-4">
                    <div>
                    <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary-600 transition-colors" title={job.title}>{job.title}</h3>
                    <p className="text-gray-500 text-sm">{job.company}</p>
                    </div>
                    <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg ${scoreColor} shrink-0`}>
                    <span className="text-sm font-bold">{score}%</span>
                    </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">
                    <div className="flex items-center gap-2">
                    <MapPin size={16} className="shrink-0" />
                    <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                    <Briefcase size={16} className="shrink-0" />
                    <span>{job.type}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-500">{job.postedAt}</span>
                    </div>
                    <div className="flex items-center gap-2">
                    <DollarSign size={16} className="shrink-0" />
                    <span>{job.salaryRange}</span>
                    </div>
                </div>

                <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Missing Skills</p>
                    <div className="flex flex-wrap gap-1">
                    {job.requiredSkills
                        .filter(s => !profile.skills.map(sk => sk.toLowerCase()).includes(s.toLowerCase()))
                        .slice(0, 3)
                        .map(s => (
                        <span key={s} className="text-xs px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded">
                            {s}
                        </span>
                        ))
                    }
                    {job.requiredSkills.filter(s => !profile.skills.map(sk => sk.toLowerCase()).includes(s.toLowerCase())).length === 0 && (
                        <span className="text-xs px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded">All matched!</span>
                    )}
                    </div>
                </div>

                <button
                    onClick={() => onApply(job.id)}
                    disabled={hasApplied}
                    className={`w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                    hasApplied
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 cursor-default'
                        : 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
                    }`}
                >
                    {hasApplied ? (
                    <>
                        <Check size={16} />
                        Applied
                    </>
                    ) : (
                    'Quick Apply'
                    )}
                </button>
                </div>
            );
            })}
        </div>
      )}
    </div>
  );
};