import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, AlertCircle, MessageSquare, Lightbulb } from 'lucide-react';
import api from '../lib/api';

export default function InterviewPrepModal({ isOpen, onClose, resumeData }) {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!isOpen || !resumeData || questions.length > 0) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await api.post('/api/interview-prep', { resumeData });

        if (response.data && response.data.success && response.data.questions) {
          setQuestions(response.data.questions);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'An error occurred while fetching questions.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [isOpen, resumeData, questions.length]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">AI Interview Prep</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                <p className="text-gray-500 font-medium animate-pulse">Analyzing resume & generating tailored questions...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="p-4 bg-red-50 rounded-full">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <p className="text-red-600 font-medium text-center">{error}</p>
                <button 
                  onClick={() => { setQuestions([]); setError(null); }}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
                >
                  Try Again
                </button>
              </div>
            ) : questions.length > 0 ? (
              <div className="space-y-6">
                <p className="text-gray-600 mb-6">
                  Based on your resume, our AI recruiter has generated the following high-probability questions. Practice your answers using the STAR method.
                </p>
                <div className="space-y-4">
                  {questions.map((q, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-start">
                        <span className="text-blue-500 font-bold mr-3 mt-0.5">{idx + 1}.</span>
                        {q.question}
                      </h4>
                      <div className="bg-blue-50/50 rounded-lg p-4 flex items-start space-x-3 border border-blue-100">
                        <Lightbulb className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-blue-900 mb-1">STAR Method Tip</p>
                          <p className="text-sm text-blue-800 leading-relaxed">{q.tip}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          
          {/* Footer */}
          {!isLoading && !error && questions.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Done Practicing
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
