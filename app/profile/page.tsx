'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, Save, Loader2, CheckCircle2, Briefcase, FolderGit2, Wrench, ArrowLeft, GraduationCap } from 'lucide-react';
import Link from 'next/link';

interface Education {
  id: string;
  institution: string;
  degree_type: string;
  field_of_study: string;
  start_year: string;
  end_year: string;
  graduation_year: string;
  final_grade: string;
  honors_or_scholarships: string;
  key_courses: string[];
  description: string;
}

interface Experience {
  id: string;
  company: string;
  role: string;
  dates: string;
  bulletFacts: string[];
  toolsSkills: string;
}

interface Project {
  id: string;
  title: string;
  contextGoal: string;
  bulletFacts: string[];
  resultsMetrics: string;
  techStack: string;
}

interface SkillsKeywords {
  hardSkills: string;
  softSkills: string;
  domains: string;
}

interface ProfileData {
  education: Education[];
  experiences: Experience[];
  projects: Project[];
  skillsKeywords: SkillsKeywords;
}

const defaultProfile: ProfileData = {
  education: [],
  experiences: [],
  projects: [],
  skillsKeywords: { hardSkills: '', softSkills: '', domains: '' },
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setProfile(data);
        }
      })
      .catch((err) => console.error('Failed to load profile', err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error('Failed to save');
      setSaveMessage('Profile saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setSaveMessage('Error saving profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const addEducation = () => {
    setProfile({
      ...profile,
      education: [
        ...(profile.education || []),
        {
          id: Date.now().toString(),
          institution: '',
          degree_type: '',
          field_of_study: '',
          start_year: '',
          end_year: '',
          graduation_year: '',
          final_grade: '',
          honors_or_scholarships: '',
          key_courses: [''],
          description: ''
        },
      ],
    });
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setProfile({
      ...profile,
      education: (profile.education || []).map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    });
  };

  const removeEducation = (id: string) => {
    setProfile({
      ...profile,
      education: (profile.education || []).filter((edu) => edu.id !== id),
    });
  };

  const addExperience = () => {
    setProfile({
      ...profile,
      experiences: [
        ...profile.experiences,
        { id: Date.now().toString(), company: '', role: '', dates: '', bulletFacts: [''], toolsSkills: '' },
      ],
    });
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setProfile({
      ...profile,
      experiences: profile.experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    });
  };

  const removeExperience = (id: string) => {
    setProfile({
      ...profile,
      experiences: profile.experiences.filter((exp) => exp.id !== id),
    });
  };

  const addProject = () => {
    setProfile({
      ...profile,
      projects: [
        ...profile.projects,
        { id: Date.now().toString(), title: '', contextGoal: '', bulletFacts: [''], resultsMetrics: '', techStack: '' },
      ],
    });
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    setProfile({
      ...profile,
      projects: profile.projects.map((proj) => (proj.id === id ? { ...proj, [field]: value } : proj)),
    });
  };

  const removeProject = (id: string) => {
    setProfile({
      ...profile,
      projects: profile.projects.filter((proj) => proj.id !== id),
    });
  };

  const updateSkills = (field: keyof SkillsKeywords, value: string) => {
    setProfile({
      ...profile,
      skillsKeywords: { ...profile.skillsKeywords, [field]: value },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 mb-4 font-medium">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Generator
            </Link>
            <h1 className="text-3xl font-display font-bold text-slate-900">Career Knowledge Base</h1>
            <p className="text-slate-600 mt-2">Manage your master CV data. The AI will use this to tailor your applications.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
            Save Profile
          </button>
        </div>

        {saveMessage && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-center border border-emerald-100">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            {saveMessage}
          </motion.div>
        )}

        <div className="space-y-8">
          {/* EDUCATION SECTION */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-indigo-500" /> Education
              </h2>
              <button onClick={addEducation} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                <Plus className="w-4 h-4 mr-1" /> Add Education
              </button>
            </div>

            <div className="space-y-8">
              {(profile.education || []).map((edu) => (
                <div key={edu.id} className="p-5 bg-slate-50 rounded-xl border border-slate-200 relative">
                  <button onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Institution</label>
                      <input type="text" value={edu.institution} onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. University of Technology" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Degree Type</label>
                      <input type="text" value={edu.degree_type} onChange={(e) => updateEducation(edu.id, 'degree_type', e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Bachelor of Science" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Field of Study</label>
                      <input type="text" value={edu.field_of_study} onChange={(e) => updateEducation(edu.id, 'field_of_study', e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Computer Science" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Start</label>
                        <input type="text" value={edu.start_year} onChange={(e) => updateEducation(edu.id, 'start_year', e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="2020" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">End</label>
                        <input type="text" value={edu.end_year} onChange={(e) => updateEducation(edu.id, 'end_year', e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="2024" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Grad</label>
                        <input type="text" value={edu.graduation_year} onChange={(e) => updateEducation(edu.id, 'graduation_year', e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="2024" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Final Grade</label>
                      <input type="text" value={edu.final_grade} onChange={(e) => updateEducation(edu.id, 'final_grade', e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. 3.8 GPA" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Honors / Scholarships</label>
                      <input type="text" value={edu.honors_or_scholarships} onChange={(e) => updateEducation(edu.id, 'honors_or_scholarships', e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Dean's List" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Description</label>
                    <textarea
                      value={edu.description}
                      onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                      className="w-full h-20 p-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-y"
                      placeholder="Short summary of studies or specialization..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Key Courses (One per line)</label>
                    <textarea
                      value={(edu.key_courses || []).join('\n')}
                      onChange={(e) => updateEducation(edu.id, 'key_courses', e.target.value.split('\n'))}
                      className="w-full h-24 p-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-y"
                      placeholder="Data Structures...&#10;Machine Learning..."
                    />
                  </div>
                </div>
              ))}
              {(!profile.education || profile.education.length === 0) && <p className="text-sm text-slate-500 text-center py-4">No education added yet.</p>}
            </div>
          </section>

          {/* EXPERIENCES SECTION */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-indigo-500" /> Experiences
              </h2>
              <button onClick={addExperience} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                <Plus className="w-4 h-4 mr-1" /> Add Experience
              </button>
            </div>

            <div className="space-y-8">
              {profile.experiences.map((exp, index) => (
                <div key={exp.id} className="p-5 bg-slate-50 rounded-xl border border-slate-200 relative">
                  <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Company</label>
                      <input type="text" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Google" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Role</label>
                      <input type="text" value={exp.role} onChange={(e) => updateExperience(exp.id, 'role', e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Software Engineer Intern" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Dates</label>
                      <input type="text" value={exp.dates} onChange={(e) => updateExperience(exp.id, 'dates', e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Jun 2023 - Aug 2023" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Tools & Skills</label>
                      <input type="text" value={exp.toolsSkills} onChange={(e) => updateExperience(exp.id, 'toolsSkills', e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. React, Node.js, AWS" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Bullet Facts (One per line)</label>
                    <textarea
                      value={exp.bulletFacts.join('\n')}
                      onChange={(e) => updateExperience(exp.id, 'bulletFacts', e.target.value.split('\n'))}
                      className="w-full h-32 p-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-y"
                      placeholder="Developed a new feature...&#10;Improved performance by 20%..."
                    />
                  </div>
                </div>
              ))}
              {profile.experiences.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No experiences added yet.</p>}
            </div>
          </section>

          {/* PROJECTS SECTION */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                <FolderGit2 className="w-5 h-5 mr-2 text-indigo-500" /> Projects
              </h2>
              <button onClick={addProject} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                <Plus className="w-4 h-4 mr-1" /> Add Project
              </button>
            </div>

            <div className="space-y-8">
              {profile.projects.map((proj, index) => (
                <div key={proj.id} className="p-5 bg-slate-50 rounded-xl border border-slate-200 relative">
                  <button onClick={() => removeProject(proj.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Title</label>
                      <input type="text" value={proj.title} onChange={(e) => updateProject(proj.id, 'title', e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. E-commerce Platform" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Context / Goal</label>
                      <input type="text" value={proj.contextGoal} onChange={(e) => updateProject(proj.id, 'contextGoal', e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Academic project for Web Dev course" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Results / Metrics</label>
                      <input type="text" value={proj.resultsMetrics} onChange={(e) => updateProject(proj.id, 'resultsMetrics', e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Handled 10k concurrent users" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Tech Stack</label>
                      <input type="text" value={proj.techStack} onChange={(e) => updateProject(proj.id, 'techStack', e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Next.js, Tailwind, Prisma" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Bullet Facts (One per line)</label>
                    <textarea
                      value={proj.bulletFacts.join('\n')}
                      onChange={(e) => updateProject(proj.id, 'bulletFacts', e.target.value.split('\n'))}
                      className="w-full h-32 p-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-y"
                      placeholder="Implemented user authentication...&#10;Designed database schema..."
                    />
                  </div>
                </div>
              ))}
              {profile.projects.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No projects added yet.</p>}
            </div>
          </section>

          {/* SKILLS SECTION */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-slate-900 flex items-center mb-6">
              <Wrench className="w-5 h-5 mr-2 text-indigo-500" /> Skills & Keywords
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Hard Skills (comma separated)</label>
                <input type="text" value={profile.skillsKeywords.hardSkills} onChange={(e) => updateSkills('hardSkills', e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Python, React, SQL" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Soft Skills (comma separated)</label>
                <input type="text" value={profile.skillsKeywords.softSkills} onChange={(e) => updateSkills('softSkills', e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Leadership, Agile, Public Speaking" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Domains / Industries (comma separated)</label>
                <input type="text" value={profile.skillsKeywords.domains} onChange={(e) => updateSkills('domains', e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. FinTech, E-commerce, Machine Learning" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
