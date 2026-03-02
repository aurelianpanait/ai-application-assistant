'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Briefcase, FileText, Sparkles, Loader2, CheckCircle2, ChevronRight, AlertCircle, ListOrdered, UserCircle } from 'lucide-react';
import Link from 'next/link';

interface TailoredResult {
  cvBulletPoints: string[];
  atsKeywords: string[];
  coverLetter: string;
}

export default function ApplicationAssistant() {
  const [jobDescription, setJobDescription] = useState('');
  const [bulletCount, setBulletCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TailoredResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTailor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      setError('Please provide the job description.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobDescription, bulletCount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to tailor application.');
      }

      if (data.text) {
        const parsed = JSON.parse(data.text) as TailoredResult;
        setResult(parsed);
      } else {
        throw new Error('Invalid response format from server.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while tailoring your application.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">
            Tailor Your Application <span className="text-indigo-600">in Seconds</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Paste the job description below. We&apos;ll use your Master CV Knowledge Base to extract ATS keywords, rewrite your bullet points, and draft a concise cover letter.
          </p>
          <div className="mt-6">
            <Link href="/profile" className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">
              <UserCircle className="w-4 h-4 mr-2" />
              Manage Career Knowledge Base
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8"
        >
          <form onSubmit={handleTailor} className="space-y-6">
            <div>
              <label htmlFor="jobDescription" className="flex items-center text-sm font-semibold text-slate-900 mb-2">
                <Briefcase className="w-4 h-4 mr-2 text-indigo-500" />
                Job Description
              </label>
              <textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job description here..."
                className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="bulletCount" className="flex items-center text-sm font-semibold text-slate-900 mb-2">
                <ListOrdered className="w-4 h-4 mr-2 text-indigo-500" />
                Number of Bullet Points
              </label>
              <select
                id="bulletCount"
                value={bulletCount}
                onChange={(e) => setBulletCount(Number(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm outline-none"
              >
                <option value={3}>3 Bullet Points (Concise)</option>
                <option value={5}>5 Bullet Points (Standard)</option>
                <option value={7}>7 Bullet Points (Detailed)</option>
                <option value={10}>10 Bullet Points (Comprehensive)</option>
              </select>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start text-red-600 text-sm">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium flex items-center justify-center transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Tailoring Application...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Tailor My Application
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Output Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 flex flex-col h-full"
        >
          {!result && !isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center min-h-[400px]">
              <Sparkles className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium text-slate-500">Your tailored results will appear here</p>
              <p className="text-sm mt-2 max-w-xs">Fill out the form and hit &quot;Tailor My Application&quot; to get started.</p>
            </div>
          )}

          {isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 min-h-[400px]">
              <Loader2 className="w-12 h-12 mb-4 animate-spin text-indigo-500" />
              <p className="text-lg font-medium text-slate-600 animate-pulse">Analyzing your CV...</p>
            </div>
          )}

          {result && !isLoading && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* ATS Keywords */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-500" />
                  Matched ATS Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.atsKeywords.map((keyword, i) => (
                    <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-sm font-medium">
                      {keyword}
                    </span>
                  ))}
                  {result.atsKeywords.length === 0 && (
                    <span className="text-sm text-slate-500 italic">No specific keywords matched.</span>
                  )}
                </div>
              </div>

              <div className="w-full h-px bg-slate-100" />

              {/* CV Bullet Points */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-indigo-500" />
                  Tailored CV Bullet Points
                </h3>
                <ul className="space-y-3">
                  {result.cvBulletPoints.map((point, i) => (
                    <li key={i} className="flex items-start">
                      <ChevronRight className="w-5 h-5 mr-2 text-indigo-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 text-sm leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="w-full h-px bg-slate-100" />

              {/* Cover Letter */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-indigo-500" />
                  Cover Letter Draft (Max 150 words)
                </h3>
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {result.coverLetter}
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
