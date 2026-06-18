'use client';

import { useState, useRef } from 'react';
import { User, Mail, Phone, MapPin, Linkedin, Globe, Sparkles, Loader2, CheckCircle, AlertCircle, Upload, FileText } from 'lucide-react';
import { generateSummary, parseResumePDF } from '@/lib/api';
import toast from 'react-hot-toast';
import { useValidation } from '@/hooks/useValidation';

export default function PersonalInfoForm({ data, targetJobTitle, summary, onChange, onTargetJobTitleChange, onSummaryChange, experiences, skills, onResumeParsed }) {
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const { errors, validateField } = useValidation();

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
    validateField(field, value);
  };

  // --- PDF Upload Handlers ---
  const handleFileSelect = async (file) => {
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file only.', { icon: '📄' });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 10 MB.', { icon: '⚠️' });
      return;
    }

    setIsParsing(true);
    const loadingToast = toast.loading('Parsing resume with AI... This may take a moment.', {
      icon: '🤖',
    });

    try {
      const result = await parseResumePDF(file);
      toast.dismiss(loadingToast);

      if (result.success && result.data && onResumeParsed) {
        onResumeParsed(result.data);
        toast.success('Resume parsed successfully! All fields have been populated.', {
          icon: '🎉',
          duration: 4000,
        });
      } else {
        toast.error('Failed to parse resume. Please try again.', { icon: '❌' });
      }
    } catch (error) {
      console.error('Error parsing resume:', error);
      toast.dismiss(loadingToast);
      const errorMsg = error.response?.data?.error || 'Failed to parse resume. Please try again.';
      toast.error(errorMsg, { icon: '❌' });
    } finally {
      setIsParsing(false);
      // Reset the file input so the same file can be re-uploaded
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleGenerateSummary = async () => {
    if (!targetJobTitle) {
      toast.error('Please enter a target job title first');
      return;
    }

    if (experiences.length === 0) {
      toast.error('Please add at least one work experience');
      return;
    }

    setIsGeneratingSummary(true);
    const loadingToast = toast.loading('AI is crafting your professional summary...', {
      icon: '🤖',
    });

    try {
      const result = await generateSummary(experiences, skills, targetJobTitle);
      toast.dismiss(loadingToast);
      onSummaryChange(result.summary);
      toast.success('Professional summary generated!', {
        icon: '✨',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.dismiss(loadingToast);
      toast.error('Failed to generate summary. Please try again.', {
        icon: '❌',
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const fields = [
    { id: 'fullName', label: 'Full Name', type: 'text', icon: User, placeholder: 'John Doe', required: true },
    { id: 'email', label: 'Email Address', type: 'email', icon: Mail, placeholder: 'john@example.com', required: true },
    { id: 'phone', label: 'Phone Number', type: 'tel', icon: Phone, placeholder: '+1 (555) 123-4567', required: false },
    { id: 'location', label: 'Location', type: 'text', icon: MapPin, placeholder: 'New York, NY', required: false },
    { id: 'linkedin', label: 'LinkedIn URL', type: 'url', icon: Linkedin, placeholder: 'https://linkedin.com/in/johndoe', required: false },
    { id: 'website', label: 'Personal Website', type: 'url', icon: Globe, placeholder: 'https://johndoe.com', required: false },
  ];

  return (
    <div className="space-y-6">
      {/* PDF Upload Dropzone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isParsing && fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-300 ${
          isParsing
            ? 'border-amber-400 bg-amber-50 cursor-wait'
            : isDragOver
            ? 'border-blue-500 bg-blue-50 scale-[1.02] shadow-lg shadow-blue-100'
            : 'border-gray-300 bg-gradient-to-br from-gray-50 to-blue-50 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => handleFileSelect(e.target.files[0])}
          className="hidden"
          disabled={isParsing}
        />
        
        {isParsing ? (
          <div className="flex flex-col items-center space-y-3">
            <div className="relative">
              <div className="h-14 w-14 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200 animate-pulse">
                <Loader2 className="h-7 w-7 text-white animate-spin" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-800">Parsing resume with AI...</p>
              <p className="text-xs text-amber-600 mt-1">Extracting your information — this may take a moment</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <div className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
              <Upload className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Upload Existing Resume <span className="text-blue-600">(PDF)</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Drag & drop your PDF here, or <span className="text-blue-600 font-medium underline">click to browse</span>
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <FileText className="h-3.5 w-3.5" />
              <span>PDF only • Max 10 MB</span>
              <span>•</span>
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span>AI auto-fills all fields</span>
            </div>
          </div>
        )}
      </div>

      <div className="relative flex items-center justify-center">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="mx-4 text-xs font-medium text-gray-400 uppercase tracking-wider">or fill manually</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      {/* Target Job Title */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow duration-300">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Target Job Title <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={targetJobTitle}
            onChange={(e) => onTargetJobTitleChange(e.target.value)}
            placeholder="e.g., Senior Software Engineer"
            className="w-full pl-4 pr-4 py-3 border-2 border-blue-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all bg-white shadow-sm"
          />
        </div>
        <p className="text-xs text-blue-600 mt-2 flex items-center">
          <Sparkles className="h-3 w-3 mr-1" />
          This helps AI tailor your resume for specific roles
        </p>
      </div>

      {/* Personal Information Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => {
          const Icon = field.icon;
          const error = errors[field.id];
          
          return (
            <div key={field.id} className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon className={`h-5 w-5 transition-colors ${error ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-500'}`} />
                </div>
                <input
                  type={field.type}
                  value={data[field.id] || ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  onBlur={(e) => validateField(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className={`w-full pl-10 pr-10 py-3 border-2 rounded-xl focus:ring-4 transition-all shadow-sm ${
                    error
                      ? 'border-red-300 focus:ring-red-200 focus:border-red-500 bg-red-50'
                      : 'border-gray-200 focus:ring-blue-200 focus:border-blue-500 hover:border-blue-300'
                  }`}
                />
                {error && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
                {!error && data[field.id] && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
              {error && (
                <p className="text-xs text-red-600 mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {error}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Professional Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-semibold text-gray-900">
            Professional Summary
          </label>
          <button
            onClick={handleGenerateSummary}
            disabled={isGeneratingSummary || !targetJobTitle}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
          </button>
        </div>
        
        <textarea
          value={summary}
          onChange={(e) => onSummaryChange(e.target.value)}
          placeholder="Write a brief professional summary, or click 'Generate with AI' to create one automatically..."
          rows={4}
          className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all resize-none shadow-sm"
        />
        
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-purple-600">
            {summary.length}/500 characters
          </p>
          {summary && (
            <span className="text-xs text-green-600 flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              Summary added
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
