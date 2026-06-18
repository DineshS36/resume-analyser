'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, X, RefreshCw, Wand2, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import toast from 'react-hot-toast';

const toneOptions = [
  { id: 'professional', label: 'Professional', description: 'Formal and polished' },
  { id: 'confident', label: 'Confident', description: 'Bold and assertive' },
  { id: 'creative', label: 'Creative', description: 'Innovative and unique' },
  { id: 'technical', label: 'Technical', description: 'Precise and detailed' },
];

export default function AISuggestionCard({ 
  suggestions, 
  onAccept, 
  onReject, 
  onAcceptAll, 
  onRegenerate, 
  isGenerating,
  originalText 
}) {
  const [selectedTone, setSelectedTone] = useState('professional');
  const [showToneSelector, setShowToneSelector] = useState(false);
  const [expandedSuggestion, setExpandedSuggestion] = useState(null);
  const [showDiff, setShowDiff] = useState(false);

  const handleRegenerate = () => {
    onRegenerate(selectedTone);
  };

  const handleAcceptAll = () => {
    suggestions.forEach(suggestion => onAccept(suggestion));
    toast.success(`All ${suggestions.length} suggestions applied!`, { icon: '🎉' });
  };

  const highlightDifferences = (original, suggestion) => {
    // Simple diff highlighting - in production, use a proper diff library
    return (
      <div className="space-y-2">
        <div className="bg-red-50 border border-red-200 rounded p-2">
          <p className="text-xs text-red-600 font-medium mb-1">Original:</p>
          <p className="text-sm text-gray-600 line-through">{original}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded p-2">
          <p className="text-xs text-green-600 font-medium mb-1">AI Enhanced:</p>
          <p className="text-sm text-gray-800 font-medium">{suggestion}</p>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 border border-purple-200 rounded-xl p-5 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-2 rounded-lg mr-3">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">AI Suggestions Ready</h4>
            <p className="text-sm text-gray-600">{suggestions.length} professional bullet points generated</p>
          </div>
        </div>
        
        {/* Tone Selector */}
        <div className="relative">
          <button
            onClick={() => setShowToneSelector(!showToneSelector)}
            className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Wand2 className="h-4 w-4 mr-2 text-purple-600" />
            {toneOptions.find(t => t.id === selectedTone)?.label}
            <ChevronDown className="h-4 w-4 ml-2" />
          </button>
          
          <AnimatePresence>
            {showToneSelector && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-20"
              >
                {toneOptions.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => {
                      setSelectedTone(tone.id);
                      setShowToneSelector(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                      selectedTone === tone.id ? 'bg-purple-50 text-purple-700' : ''
                    }`}
                  >
                    <p className="font-medium text-sm">{tone.label}</p>
                    <p className="text-xs text-gray-500">{tone.description}</p>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <motion.button
          onClick={handleAcceptAll}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          <Check className="h-4 w-4 mr-2" />
          Accept All ({suggestions.length})
        </motion.button>
        
        <motion.button
          onClick={handleRegenerate}
          disabled={isGenerating}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center px-4 py-2 bg-white border border-purple-300 text-purple-700 text-sm font-medium rounded-lg hover:bg-purple-50 transition-all disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Regenerating...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate ({toneOptions.find(t => t.id === selectedTone)?.label})
            </>
          )}
        </motion.button>

        <button
          onClick={() => setShowDiff(!showDiff)}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all"
        >
          <Lightbulb className="h-4 w-4 mr-2" />
          {showDiff ? 'Hide' : 'Show'} Comparison
        </button>
      </div>

      {/* Suggestions List */}
      <div className="space-y-3">
        <AnimatePresence>
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 mr-4">
                    {showDiff && originalText ? (
                      highlightDifferences(originalText, suggestion)
                    ) : (
                      <p className="text-gray-800 leading-relaxed">• {suggestion}</p>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    <motion.button
                      onClick={() => onAccept(suggestion)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Accept this suggestion"
                    >
                      <Check className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      onClick={() => onReject(suggestion)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Reject this suggestion"
                    >
                      <X className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Tips */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800 flex items-center">
          <Lightbulb className="h-4 w-4 mr-2 flex-shrink-0" />
          Tip: Click "Accept All" to use all suggestions, or pick individual ones. You can also regenerate with different tones!
        </p>
      </div>
    </motion.div>
  );
}
