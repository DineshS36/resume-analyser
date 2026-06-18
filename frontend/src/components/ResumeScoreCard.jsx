'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const ResumeScoreCard = ({ score, isLoading, onAnalyze }) => {
  const getScoreColor = (value) => {
    if (value >= 80) return 'text-green-500';
    if (value >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (value) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (value) => {
    if (value >= 80) return 'Excellent';
    if (value >= 60) return 'Good';
    return 'Needs Work';
  };

  const getScoreIcon = (value) => {
    if (value >= 80) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (value >= 60) return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
          Resume Score
        </h3>
        <button
          onClick={onAnalyze}
          disabled={isLoading}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Analyze Resume
            </>
          )}
        </button>
      </div>

      {score > 0 ? (
        <div className="flex items-center space-x-6">
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-200"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className={getScoreColor(score)}
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{
                  strokeDasharray: circumference,
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
                {score}
              </span>
              <span className="text-xs text-gray-500">/ 100</span>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {getScoreIcon(score)}
              <span className={`text-lg font-semibold ${getScoreColor(score)}`}>
                {getScoreLabel(score)}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {score >= 80
                ? "Your resume is well-optimized and ATS-friendly. Great job!"
                : score >= 60
                ? "Your resume is good but has room for improvement. Check the suggestions below."
                : "Your resume needs significant improvements. Follow the recommendations to boost your score."}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-4">
            Get AI-powered feedback on your resume's ATS compatibility and content quality.
          </p>
          <div className="flex justify-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              ATS Score
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
              Content Quality
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
              Completeness
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ResumeScoreCard;
