'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Copy, Check, RefreshCw } from 'lucide-react';
import { generateCoverLetter } from '@/lib/api';
import toast from 'react-hot-toast';

export default function CoverLetterForm({ resumeData, onGenerated }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [copied, setCopied] = useState(false);
  const [tone, setTone] = useState('professional');

  const handleGenerate = async () => {
    const { personalInfo, targetJobTitle, summary, experiences, skills } = resumeData;
    
    if (!targetJobTitle) {
      toast.error('Please enter a target job title first');
      return;
    }

    if (!personalInfo.fullName || !personalInfo.email) {
      toast.error('Please fill in your personal information first');
      return;
    }

    setIsGenerating(true);
    const loadingToast = toast.loading('AI is writing your cover letter...', {
      icon: '✍️',
    });

    try {
      const result = await generateCoverLetter(
        personalInfo,
        targetJobTitle,
        summary,
        experiences,
        skills,
        tone
      );
      
      toast.dismiss(loadingToast);
      setCoverLetter(result.coverLetter);
      toast.success('Cover letter generated!', {
        icon: '✨',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error generating cover letter:', error);
      toast.dismiss(loadingToast);
      toast.error('Failed to generate cover letter. Please try again.', {
        icon: '❌',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    toast.success('Copied to clipboard!', {
      icon: '📋',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  return (
    <div className="space-y-6">
      {/* Tone Selection */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <Sparkles className="h-4 w-4 mr-2 text-blue-600" />
          Select Tone
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'professional', label: 'Professional' },
            { id: 'friendly', label: 'Friendly' },
            { id: 'formal', label: 'Formal' },
            { id: 'confident', label: 'Confident' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTone(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tone === t.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-medium rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Generating Cover Letter...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5 mr-2" />
            Generate Cover Letter with AI
          </>
        )}
      </button>

      {/* Generated Cover Letter */}
      {coverLetter && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Generated Cover Letter</h3>
            <div className="flex gap-2">
              <button
                onClick={handleRegenerate}
                disabled={isGenerating}
                className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-all"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Regenerate
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-all"
              >
                {copied ? (
                  <Check className="h-4 w-4 mr-1 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4 mr-1" />
                )}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700 leading-relaxed">
              {coverLetter}
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      {!coverLetter && (
        <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
          <h4 className="text-sm font-semibold text-amber-900 mb-2">Tips for a Great Cover Letter</h4>
          <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
            <li>Customize the letter for each job application</li>
            <li>Highlight relevant achievements and skills</li>
            <li>Show enthusiasm for the company and role</li>
            <li>Keep it concise - typically 3-4 paragraphs</li>
            <li>Proofread for grammar and spelling errors</li>
          </ul>
        </div>
      )}
    </div>
  );
}
