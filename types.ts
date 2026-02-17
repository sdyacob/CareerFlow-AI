export type Skill = string;

export enum ExperienceLevel {
  Junior = 'Junior',
  Mid = 'Mid-Level',
  Senior = 'Senior',
  Lead = 'Lead',
  Executive = 'Executive'
}

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  skills: Skill[];
  experienceLevel: ExperienceLevel;
  summary: string;
  resumeUrl?: string; // Simulated URL
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Contract' | 'Remote';
  salaryRange: string;
  description: string;
  requiredSkills: Skill[];
  postedAt: string;
}

export enum ApplicationStatus {
  Applied = 'Applied',
  Interviewing = 'Interviewing',
  Offer = 'Offer',
  Rejected = 'Rejected'
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  status: ApplicationStatus;
  appliedAt: string;
  notes?: string;
}

// For drag and drop
export interface KanbanColumn {
  id: ApplicationStatus;
  title: string;
}
