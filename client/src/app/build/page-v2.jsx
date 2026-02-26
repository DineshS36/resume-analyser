'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  Eye, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Save
} from 'lucide-react';
import PersonalInfoForm from '@/components/PersonalInfoForm';
import ExperienceForm from '@/components/ExperienceForm';
import EducationForm from '@/components/EducationForm';
import SkillsForm from '@/components/SkillsForm';
import ResumePreviewEnhanced from '@/components/ResumePreviewEnhanced';
import useAutoSave from '@/hooks/useAutoSave';
import toast from 'react-hot-toast';

const steps = [
  { id: 'personal', label: 'Personal Info', icon: User, description: 'Your contact details' },
  { id: 'experience', label: 'Experience', icon: Briefcase, description: 'Work history' },
  { id: 'education', label: 'Education', icon: GraduationCap, description: 'Academic background' },
  { id: 'skills', label: 'Skills', icon: Wrench, description: 'Your expertise' },
  { id: 'preview', label: 'Preview & Export', icon: Eye, description: 'Review and download' },
];

export default function BuildResume() {
  const [currentStep, setCurrentStep] = useState(0);
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      summary: '',
    },
    experience: [],
    education: [],
    skills: [],
  });
  const [selectedTemplate, setSelectedTemplate] = useState('classic');

  // Auto-save functionality
  const { lastSaved } = useAutoSave('resume-builder', resumeData);

  // Update resume data
  const updateResumeData = (section, data) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data,
    }));
  };

  // Navigation
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

  // Calculate progress
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <motion.div 
                whileHover={{ rotate: 10 }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg mr-3"
              >
                <Sparkles className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  AI Resume Builder
                </h1>
                <p className="text-xs text-gray-500">Create your professional resume</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Auto-save indicator */}
              <div className="flex items-center text-xs text-gray-500">
                <Save className="h-3 w-3 mr-1" />
                {lastSaved ? `Saved ${lastSaved}` : 'Auto-save enabled'}
              </div>
              
              {/* Progress */}
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm text-gray-600">Step {currentStep + 1} of {steps.length}</span>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <div className="flex items-center justify-between overflow-x-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <motion.button
                  key={step.id}
                  onClick={() => goToStep(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                    isActive 
                      ? 'bg-blue-100 text-blue-700 shadow-md' 
                      : isCompleted
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <div className={`p-1.5 rounded-md ${
                    isActive ? 'bg-blue-200' : isCompleted ? 'bg-green-200' : 'bg-gray-200'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium">{step.label}</p>
                    <p className="text-xs opacity-75">{step.description}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 0 && (
              <PersonalInfoForm 
                data={resumeData.personalInfo}
                onChange={(data) => updateResumeData('personalInfo', data)}
              />
            )}
            
            {currentStep === 1 && (
              <ExperienceForm 
                data={resumeData.experience}
                onChange={(data) => updateResumeData('experience', data)}
              />
            )}
            
            {currentStep === 2 && (
              <EducationForm 
                data={resumeData.education}
                onChange={(data) => updateResumeData('education', data)}
              />
            )}
            
            {currentStep === 3 && (
              <SkillsForm 
                data={resumeData.skills}
                onChange={(data) => updateResumeData('skills', data)}
              />
            )}
            
            {currentStep === 4 && (
              <ResumePreviewEnhanced 
                data={resumeData}
                template={selectedTemplate}
                onTemplateChange={setSelectedTemplate}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.button
            onClick={prevStep}
            disabled={currentStep === 0}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Previous
          </motion.button>

          <div className="flex items-center space-x-4">
            {currentStep < steps.length - 1 ? (
              <motion.button
                onClick={nextStep}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Next Step
                <ChevronRight className="h-5 w-5 ml-2" />
              </motion.button>
            ) : (
              <motion.button
                onClick={() => toast.success('Resume ready for download!')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Finish & Download
              </motion.button>
            )}
          </div>
        </div>
      </footer>

      {/* Spacer for fixed footer */}
      <div className="h-24" />
    </div>
  );
}
