import { Job, Application, ApplicationStatus, Profile, ExperienceLevel } from '../types';

export const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: 'TechCorp Solutions',
    location: 'San Francisco, CA (Hybrid)',
    type: 'Full-time',
    salaryRange: '$160k - $220k',
    description: 'We are looking for a React expert to lead our dashboard team.',
    requiredSkills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL'],
    postedAt: '2 days ago'
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    company: 'StartupX',
    location: 'Remote',
    type: 'Full-time',
    salaryRange: '$120k - $150k',
    description: 'Join a fast-paced team building the future of fintech.',
    requiredSkills: ['Node.js', 'PostgreSQL', 'React', 'AWS', 'Docker'],
    postedAt: '1 week ago'
  },
  {
    id: '3',
    title: 'Product Designer',
    company: 'Creative Studio',
    location: 'New York, NY',
    type: 'Contract',
    salaryRange: '$80 - $120 / hr',
    description: 'Design beautiful interfaces for our top-tier clients.',
    requiredSkills: ['Figma', 'UI/UX', 'Prototyping', 'User Research'],
    postedAt: '3 days ago'
  },
  {
    id: '4',
    title: 'AI Engineer',
    company: 'DataMinds',
    location: 'Austin, TX',
    type: 'Full-time',
    salaryRange: '$180k - $250k',
    description: 'Build the next generation of LLM applications.',
    requiredSkills: ['Python', 'PyTorch', 'TensorFlow', 'NLP', 'Machine Learning'],
    postedAt: 'Just now'
  }
];

export const INITIAL_PROFILE: Profile = {
  id: 'user_1',
  fullName: 'Alex Developer',
  email: 'alex@example.com',
  skills: ['JavaScript', 'HTML', 'CSS'],
  experienceLevel: ExperienceLevel.Junior,
  summary: 'Aspiring developer looking for opportunities.',
  resumeUrl: ''
};

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app_1',
    jobId: '2',
    userId: 'user_1',
    status: ApplicationStatus.Applied,
    appliedAt: '2023-10-01',
    notes: 'Referral from Sarah.'
  },
  {
    id: 'app_2',
    jobId: '3',
    userId: 'user_1',
    status: ApplicationStatus.Rejected,
    appliedAt: '2023-09-15'
  }
];
