'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Check, X } from 'lucide-react';
import { generateBulletPoints } from '@/lib/api';

export default function AIEnhanceButton({ 
  rawInput, 
  targetJobTitle, 
  onAccept, 
  disabled = false,
  className = '' 
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState(null);

  const handleEnhance = async () => {
    if (!rawInput || !targetJobTitle) {
      setError('Please provide both a job description and target job title');
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await generateBulletPoints(rawInput, targetJobTitle);
      setSuggestions(response.bullets || []);
      setShowSuggestions(true);
    } catch (err) {
      console.error('AI Enhancement error:', err);
      setError('Failed to generate suggestions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAccept = (bullet) => {
    onAccept(bullet);
    setSuggestions(prev => prev.filter(b => b !== bullet));
    if (suggestions.length <= 1) {
      setShowSuggestions(false);
    }
  };

  const handleReject = (bullet) => {
    setSuggestions(prev => prev.filter(b => b !== bullet));
    if (suggestions.length <= 1) {
      setShowSuggestions(false);
    }
  };

  const handleDismiss = () => {
    setShowSuggestions(false);
    setSuggestions([]);
  };

  if (showSuggestions && suggestions.length > 0) {
    return (
      <div className={`bg-purple-50 rounded-lg p-4 border border-purple-200 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-purple-900 flex items-center">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Suggestions
          </h4>
          <button 
            onClick={handleDismiss}
            className="text-purple-600 hover:text-purple-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-purple-700 mb-3">
          Click ✓ to add to your resume, or ✕ to dismiss
        </p>
        <div className="space-y-2">
          {suggestions.map((bullet, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between bg-white rounded-lg p-3 border border-purple-200 shadow-sm"
            >
              <p className="text-sm text-gray-700 flex-1 mr-3 leading-relaxed">{bullet}</p>
              <div className="flex space-x-1 flex-shrink-0">
                <button
                  onClick={() => handleAccept(bullet)}
                  className="p-1.5 text-green-600 hover:bg-green-100 rounded-md transition-colors"
                  title="Accept"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleReject(bullet)}
                  className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                  title="Reject"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <button
        onClick={handleEnhance}
        disabled={isGenerating || disabled || !rawInput || !targetJobTitle}
        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
          isGenerating || disabled || !rawInput || !targetJobTitle
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm hover:shadow-md'
        }`}
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Enhancing...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Enhance with AI
          </>
        )}
      </button>
      
      {error && (
        <p className="text-xs text-red-600 mt-2">{error}</p>
      )}
      
      {!targetJobTitle && !error && (
        <p className="text-xs text-gray-500 mt-2">
          Enter a target job title to enable AI enhancement
        </p>
      )}
    </div>
  );
}

