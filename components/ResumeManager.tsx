import React, { useState } from 'react';
import { Upload, Loader2, CheckCircle, FileText, Sparkles } from 'lucide-react';
import { parseResumeText } from '../services/geminiService';
import { Profile } from '../types';

interface ResumeManagerProps {
  profile: Profile;
  onUpdateProfile: (profile: Profile) => void;
}

export const ResumeManager: React.FC<ResumeManagerProps> = ({ profile, onUpdateProfile }) => {
  const [isParsing, setIsParsing] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleParse = async () => {
    if (!resumeText.trim()) return;
    setIsParsing(true);
    setError(null);
    try {
      const extractedData = await parseResumeText(resumeText);
      onUpdateProfile({
        ...profile,
        ...extractedData,
        skills: Array.from(new Set([...profile.skills, ...(extractedData.skills || [])]))
      });
      setResumeText(''); // Clear after success
    } catch (err) {
      setError("Failed to analyze resume. Please check your API key.");
    } finally {
      setIsParsing(false);
    }
  };

  // Mock file read for demonstration (browsers restrict full path access)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, use PDF.js or pdf-parse here. 
      // For this demo, we assume the user pastes text or we pretend to read a text file.
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setResumeText(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Upload Section */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Upload size={18} className="text-primary-600" />
            Update Profile
          </h2>
          
          <div className="space-y-4">
             <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer relative">
                <input 
                    type="file" 
                    accept=".txt,.md" // Restricting to text for this demo to ensure FileReader works simply
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <FileText className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Click to upload Resume (TXT)
                </p>
                <p className="text-xs text-gray-500 mt-1">or paste text below</p>
             </div>

             <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text here..."
                className="w-full h-40 p-3 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
             />

             {error && <p className="text-red-500 text-sm">{error}</p>}

             <button
                onClick={handleParse}
                disabled={isParsing || !resumeText}
                className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
             >
                {isParsing ? (
                    <>
                        <Loader2 className="animate-spin" size={18} />
                        Analyzing with AI...
                    </>
                ) : (
                    <>
                        <Sparkles size={18} />
                        Extract & Auto-Fill
                    </>
                )}
             </button>
          </div>
        </div>
      </div>

      {/* Profile Preview */}
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm h-full">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.fullName}</h2>
                    <p className="text-gray-500">{profile.email}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold uppercase tracking-wide">
                    {profile.experienceLevel}
                </span>
            </div>

            <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Summary</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {profile.summary || "No summary available. Upload a resume to generate one."}
                </p>
            </div>

            <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Skills</h3>
                {profile.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-sm">
                                {skill}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 italic text-sm">No skills listed yet.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
