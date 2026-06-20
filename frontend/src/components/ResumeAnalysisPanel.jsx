'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  AlertCircle, 
  Lightbulb,
  Target,
  FileText,
  Award,
  TrendingUp
} from 'lucide-react';

const ResumeAnalysisPanel = ({ analysis }) => {
  const [expandedSections, setExpandedSections] = useState({
    strengths: true,
    improvements: true,
    ats: false,
    content: false
  });

  if (!analysis) return null;

  const { overallScore, atsScore, contentScore, completenessScore, feedback } = analysis;

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getScoreColor = (value) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const ScoreBar = ({ label, score, icon: Icon }) => (
    <div className="flex items-center space-x-3 mb-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
        <Icon className="h-4 w-4 text-gray-600" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className={`text-sm font-bold ${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
            {score}/100
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full ${getScoreColor(score)}`}
          />
        </div>
      </div>
    </div>
  );

  const Section = ({ title, icon: Icon, items, type, isExpanded, onToggle }) => (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-3">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            type === 'strength' ? 'bg-green-100' : 
            type === 'improvement' ? 'bg-yellow-100' : 
            type === 'ats' ? 'bg-blue-100' : 'bg-purple-100'
          }`}>
            <Icon className={`h-4 w-4 ${
              type === 'strength' ? 'text-green-600' : 
              type === 'improvement' ? 'text-yellow-600' : 
              type === 'ats' ? 'text-blue-600' : 'text-purple-600'
            }`} />
          </div>
          <span className="font-semibold text-gray-900">{title}</span>
          <span className="text-sm text-gray-500">({items?.length || 0})</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-white">
              {items && items.length > 0 ? (
                <ul className="space-y-2">
                  {items.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start space-x-2"
                    >
                      {type === 'strength' ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : type === 'improvement' ? (
                        <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Lightbulb className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      )}
                      <span className="text-sm text-gray-700">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">No items available</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-auto shrink-0 w-full flex flex-col bg-white rounded-xl shadow-sm p-6 border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
        Detailed Analysis
      </h3>

      {/* Score Breakdown */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Score Breakdown</h4>
        <ScoreBar label="ATS Compatibility" score={atsScore} icon={Target} />
        <ScoreBar label="Content Quality" score={contentScore} icon={FileText} />
        <ScoreBar label="Completeness" score={completenessScore} icon={Award} />
      </div>

      {/* Feedback Sections */}
      <Section
        title="Strengths"
        icon={CheckCircle}
        items={feedback?.strengths}
        type="strength"
        isExpanded={expandedSections.strengths}
        onToggle={() => toggleSection('strengths')}
      />

      <Section
        title="Areas for Improvement"
        icon={AlertCircle}
        items={feedback?.improvements}
        type="improvement"
        isExpanded={expandedSections.improvements}
        onToggle={() => toggleSection('improvements')}
      />

      <Section
        title="ATS Optimization Tips"
        icon={Target}
        items={feedback?.atsTips}
        type="ats"
        isExpanded={expandedSections.ats}
        onToggle={() => toggleSection('ats')}
      />

      <Section
        title="Content Enhancement Tips"
        icon={Lightbulb}
        items={feedback?.contentTips}
        type="content"
        isExpanded={expandedSections.content}
        onToggle={() => toggleSection('content')}
      />
    </motion.div>
  );
};

export default ResumeAnalysisPanel;
