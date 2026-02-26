'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Linkedin, Globe, Sparkles, Briefcase, Loader2 } from 'lucide-react';
import AIEnhanceButton from './AIEnhanceButton';
import { generateSummary } from '@/lib/api';
import toast from 'react-hot-toast';

const inputVariants = {
  focus: { scale: 1.02, transition: { duration: 0.2 } },
  blur: { scale: 1, transition: { duration: 0.2 } },
};

export default function PersonalInfoForm({ 
  data, 
  targetJobTitle, 
  summary, 
  onChange, 
  onTargetJobTitleChange, 
  onSummaryChange,
  experiences,
  skills 
}) {
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = '';
    if (name === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) error = 'Please enter a valid email';
    }
    if (name === 'phone' && value) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(value)) error = 'Please enter a valid phone number';
    }
    if (name === 'linkedin' && value && !value.includes('linkedin.com')) {
      error = 'Please enter a valid LinkedIn URL';
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, data[field]);
  };

  const handleGenerateSummary = async () => {
    if (!targetJobTitle) {
      toast.error('Please enter a target job title first', { icon: '⚠️' });
      return;
    }
    if (experiences.length === 0) {
      toast.error('Please add at least one work experience', { icon: '⚠️' });
      return;
    }

    setIsGeneratingSummary(true);
    const loadingToast = toast.loading('AI is crafting your summary...', { icon: '🤖' });

    try {
      const response = await generateSummary(experiences, skills.map(s => s.name), targetJobTitle);
      onSummaryChange(response.summary);
      toast.dismiss(loadingToast);
      toast.success('Summary generated!', { icon: '✨' });
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.dismiss(loadingToast);
      toast.error('Failed to generate summary. Please try again.', { icon: '❌' });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const fields = [
    { name: 'fullName', label: 'Full Name', icon: User, type: 'text', placeholder: 'John Doe', required: true },
    { name: 'email', label: 'Email Address', icon: Mail, type: 'email', placeholder: 'john@example.com', required: true },
    { name: 'phone', label: 'Phone Number', icon: Phone, type: 'tel', placeholder: '+1 (555) 123-4567' },
    { name: 'location', label: 'Location', icon: MapPin, type: 'text', placeholder: 'New York, NY' },
    { name: 'linkedin', label: 'LinkedIn URL', icon: Linkedin, type: 'url', placeholder: 'https://linkedin.com/in/johndoe' },
    { name: 'website', label: 'Personal Website', icon: Globe, type: 'url', placeholder: 'https://johndoe.com' },
  ];

  return (
    <div className="space-y-6">
      {/* Target Job Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100"
      >
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
          <Briefcase className="h-4 w-4 mr-2 text-blue-600" />
          Target Job Title *
        </label>
        <input
          type="text"
          value={targetJobTitle}
          onChange={(e) => onTargetJobTitleChange(e.target.value)}
          placeholder="e.g., Senior Software Engineer"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <p className="text-xs text-gray-500 mt-2">
          This helps our AI tailor content for your specific role
        </p>
      </motion.div>

      {/* Personal Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field, index) => (
          <motion.div
            key={field.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={field.name === 'fullName' ? 'md:col-span-2' : ''}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
              <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <motion.input
                type={field.type}
                value={data[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                onBlur={() => handleBlur(field.name)}
                placeholder={field.placeholder}
                whileFocus="focus"
                variants={inputVariants}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 ${
                  errors[field.name] && touched[field.name]
                    ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                }`}
              />
            </div>
            {errors[field.name] && touched[field.name] && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 mt-1"
              >
                {errors[field.name]}
              </motion.p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Professional Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-amber-500" />
            Professional Summary
          </label>
          <motion.button
            onClick={handleGenerateSummary}
            disabled={isGeneratingSummary || !targetJobTitle}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingSummary ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate with AI
              </>
            )}
          </motion.button>
        </div>
        <textarea
          value={summary}
          onChange={(e) => onSummaryChange(e.target.value)}
          placeholder="Write a brief professional summary or click 'Generate with AI' to create one automatically..."
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
        />
        <p className="text-xs text-gray-500">
          Tip: A good summary highlights your key achievements and career goals in 3-4 sentences
        </p>
      </motion.div>
    </div>
  );
}
