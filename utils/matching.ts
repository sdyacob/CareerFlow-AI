import { Job, Profile } from '../types';

/**
 * Calculates a match score (0-100) based on skill intersection.
 * In a real app, this could be weighted by experience level or importance.
 */
export const calculateMatchScore = (profile: Profile, job: Job): number => {
  if (!profile.skills || profile.skills.length === 0) return 0;
  if (!job.requiredSkills || job.requiredSkills.length === 0) return 0;

  const profileSkillsLower = profile.skills.map(s => s.toLowerCase());
  const jobSkillsLower = job.requiredSkills.map(s => s.toLowerCase());

  const matches = jobSkillsLower.filter(skill => 
    profileSkillsLower.includes(skill)
  );

  const rawScore = (matches.length / jobSkillsLower.length) * 100;
  
  // Basic normalization to ensure it feels "fair" even with few requirements
  return Math.min(Math.round(rawScore), 100);
};

export const getMatchColor = (score: number): string => {
  if (score >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
  if (score >= 50) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
  return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
};
