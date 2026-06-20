'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ChevronRight, ChevronLeft, User, Briefcase, GraduationCap, Wrench, Eye, Download, RotateCcw, LogOut, UserCircle, FolderDot, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import PersonalInfoForm from '@/components/PersonalInfoFormEnhanced';
import ExperienceForm from '@/components/ExperienceForm';
import ProjectsForm from '@/components/ProjectsForm';
import EducationForm from '@/components/EducationForm';
import SkillsForm from '@/components/SkillsForm';
import ResumePreview from '@/components/ResumePreviewEnhanced';
import TemplateSelector from '@/components/TemplateSelector';
import PDFGenerator from '@/components/PDFGenerator';
import ResumeScoreCard from '@/components/ResumeScoreCard';
import ResumeAnalysisPanel from '@/components/ResumeAnalysisPanel';
import InterviewPrepModal from '@/components/InterviewPrepModal';
import { useAutoSave } from '@/hooks/useAutoSave';
import { analyzeResume } from '@/lib/api';
import toast from 'react-hot-toast';

const steps = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'projects', label: 'Projects', icon: FolderDot },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'preview', label: 'Preview', icon: Eye },
];

export default function BuildResume() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
    },
    targetJobTitle: '',
    summary: '',
    experiences: [
      {
        id: Date.now().toString(),
        company: '',
        role: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
        aiOptimizedBullets: [],
      },
    ],
    projects: [],
    education: [],
    skills: [],
    template: 'classic',
  });

  useAutoSave(resumeData, setResumeData);

  // Auth guard — redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  const updateResumeData = useCallback((section, data) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data,
    }));
  }, []);

  // Handler for when a PDF is parsed by AI — populates all form sections.
  // The backend already provides React-ready objects with UUIDs, so we just
  // pass them through with minimal reshaping.
  const handlePDFParsed = useCallback((parsedData) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        fullName: parsedData.personalInfo?.fullName || '',
        email: parsedData.personalInfo?.email || '',
        phone: parsedData.personalInfo?.phone || '',
        location: parsedData.personalInfo?.location || '',
        linkedin: parsedData.personalInfo?.linkedin || '',
        website: parsedData.personalInfo?.personalWebsite || prev.personalInfo?.website || '',
      },
      targetJobTitle: parsedData.personalInfo?.targetJobTitle || prev.targetJobTitle || '',
      summary: parsedData.personalInfo?.summary || prev.summary || '',
      experiences: Array.isArray(parsedData.experience) && parsedData.experience.length > 0
        ? parsedData.experience
        : prev.experiences,
      projects: Array.isArray(parsedData.projects) && parsedData.projects.length > 0
        ? parsedData.projects
        : prev.projects,
      education: Array.isArray(parsedData.education) && parsedData.education.length > 0
        ? parsedData.education
        : prev.education,
      skills: Array.isArray(parsedData.skills) && parsedData.skills.length > 0
        ? parsedData.skills
        : prev.skills,
      template: prev.template,
    }));
  }, []);

  // Show loading while checking auth
  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }


  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep = (index) => {
    setCurrentStep(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data and start fresh?')) {
      localStorage.removeItem('resume_builder_draft');
      setResumeData({
        personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '', website: '' },
        targetJobTitle: '',
        summary: '',
        experiences: [],
        projects: [],
        education: [],
        skills: [],
        template: 'classic',
      });
      setCurrentStep(0);
      toast.success('All data cleared!', { icon: '🗑️' });
    }
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    const loadingToast = toast.loading('Generating your PDF...', {
      icon: '📄',
    });
    
    try {
      await PDFGenerator.generate(resumeData);
      toast.dismiss(loadingToast);
      toast.success('PDF downloaded successfully!', {
        icon: '🎉',
        duration: 4000,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.dismiss(loadingToast);
      toast.error('Failed to generate PDF. Please try again.', {
        icon: '❌',
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const loadingToast = toast.loading('Analyzing your resume...', {
      icon: '🔍',
    });
    
    try {
      const response = await analyzeResume({
        personalInfo: resumeData.personalInfo,
        experiences: resumeData.experiences,
        education: resumeData.education,
        skills: resumeData.skills,
        targetJobTitle: resumeData.targetJobTitle,
      });
      
      setAnalysis(response.analysis);
      toast.dismiss(loadingToast);
      toast.success(`Resume score: ${response.analysis.overallScore}/100`, {
        icon: '📊',
        duration: 4000,
      });
    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast.dismiss(loadingToast);
      toast.error('Failed to analyze resume. Please try again.', {
        icon: '❌',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalInfoForm
            data={resumeData.personalInfo}
            targetJobTitle={resumeData.targetJobTitle}
            summary={resumeData.summary}
            onChange={(data) => updateResumeData('personalInfo', data)}
            onTargetJobTitleChange={(title) => updateResumeData('targetJobTitle', title)}
            onSummaryChange={(summary) => updateResumeData('summary', summary)}
            experiences={resumeData.experiences}
            skills={resumeData.skills}
            onResumeParsed={handlePDFParsed}
          />
        );
      case 1:
        return (
          <ExperienceForm
            experiences={resumeData.experiences}
            onChange={(experiences) => updateResumeData('experiences', experiences)}
            targetJobTitle={resumeData.targetJobTitle}
          />
        );
      case 2:
        return (
          <ProjectsForm
            projects={resumeData.projects || []}
            onChange={(projects) => updateResumeData('projects', projects)}
          />
        );
      case 3:
        return (
          <EducationForm
            education={resumeData.education}
            onChange={(education) => updateResumeData('education', education)}
          />
        );
      case 4:
        return (
          <SkillsForm
            skills={resumeData.skills}
            onChange={(skills) => updateResumeData('skills', skills)}
          />
        );
      case 5:
        return (
          <div className="space-y-6">
            <ResumeScoreCard 
              score={analysis?.overallScore || 0}
              isLoading={isAnalyzing}
              onAnalyze={handleAnalyze}
            />
            <ResumeAnalysisPanel analysis={analysis} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-400 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-400 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '7s', animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-2 cursor-pointer hover:scale-102 transition-transform"
              onClick={() => router.push('/')}
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg shadow-md">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                AI Resume Builder
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 mr-2 pr-3 border-r border-gray-200">
                <UserCircle className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  {user?.fullName || user?.email}
                </span>
              </div>
              <button
                onClick={handleClearData}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Start Fresh
              </button>
              <button
                onClick={logout}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="relative">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;

                return (
                  <button
                    key={step.id}
                    onClick={() => goToStep(index)}
                    className={`flex flex-col items-center space-y-2 relative z-10 ${
                      index === steps.length - 1 ? '' : 'flex-1'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 ${
                        isActive 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 ring-4 ring-blue-200 scale-110' 
                          : isCompleted 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                          : 'bg-gray-200'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${isActive || isCompleted ? 'text-white' : 'text-gray-500'}`} />
                    </div>
                    <span
                      className={`text-sm font-medium transition-colors duration-300 ${
                        isActive
                          ? 'text-blue-600'
                          : isCompleted
                          ? 'text-green-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </button>
                );
              })}
            </div>
            {/* Progress Bar */}
            <div className="absolute top-6 left-0 right-0 h-1.5 bg-gray-200 rounded-full -z-0">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-screen-2xl mx-auto mt-8">
          {/* Form Section */}
          <div className="lg:col-span-4 h-[calc(100vh-100px)] bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300 flex flex-col overflow-hidden">
            {/* Header (Fixed at top) */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-2xl font-bold text-gray-900">
                {steps[currentStep].label}
              </h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            
            {/* Content (Scrollable in the middle) */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="transition-all duration-300">
                {renderStepContent()}
              </div>
            </div>

            {/* Navigation Buttons (Fixed at bottom) */}
            <div className="flex justify-between p-6 pt-4 border-t border-gray-100 bg-white/90 backdrop-blur-sm flex-shrink-0">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  currentStep === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-sm hover:scale-102'
                }`}
              >
                <ChevronLeft className="h-4 w-4 mr-1.5" />
                Previous
              </button>

              {currentStep === steps.length - 1 ? (
                <button
                  onClick={() => setShowInterviewModal(true)}
                  className="flex items-center px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-105 transition-all"
                >
                  <MessageSquare className="h-4 w-4 mr-1.5" />
                  Interview Prep
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105 transition-all"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1.5" />
                </button>
              )}
            </div>
          </div>

          {/* Live Preview Section */}
          <div className="lg:col-span-8 bg-gray-50 rounded-xl p-4 flex flex-col h-[calc(100vh-100px)] overflow-hidden">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-blue-600" />
                  Live Preview
                </h3>
                <span className="text-xs text-gray-500 bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">
                  Auto-updating
                </span>
              </div>
              <div 
                className="border-2 border-gray-100 rounded-xl overflow-hidden bg-white shadow-inner"
              >
                <ResumePreview 
                  data={resumeData} 
                  template={resumeData.template}
                  onTemplateChange={(template) => updateResumeData('template', template)}
                />
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">
                This is how your resume will look when downloaded
              </p>
            </div>
          </div>
        </div>
      </div>
      <InterviewPrepModal 
        isOpen={showInterviewModal} 
        onClose={() => setShowInterviewModal(false)} 
        resumeData={resumeData} 
      />
    </div>
  );
}
