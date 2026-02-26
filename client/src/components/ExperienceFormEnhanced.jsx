'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Building2, Calendar, MapPin, Wand2, Loader2, Sparkles } from 'lucide-react';
import { generateBulletPoints } from '@/lib/api';
import toast from 'react-hot-toast';
import AISuggestionCard from './AISuggestionCard';
import AIThinkingAnimation from './AIThinkingAnimation';

const inputVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
    },
  }),
};

export default function ExperienceForm({ experiences, onChange, targetJobTitle }) {
  const [generatingForIndex, setGeneratingForIndex] = useState(null);
  const [suggestions, setSuggestions] = useState({});

  const handleAdd = () => {
    const newExp = {
      id: Date.now(),
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      bullets: [],
    };
    onChange([...experiences, newExp]);
  };

  const handleRemove = (id) => {
    onChange(experiences.filter((exp) => exp.id !== id));
  };

  const handleUpdate = (id, field, value) => {
    onChange(
      experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const handleGenerateBullets = async (exp, index) => {
    if (!targetJobTitle) {
      toast.error('Please enter a target job title in the Personal Info step first');
      return;
    }

    if (!exp.description || exp.description.length < 10) {
      toast.error('Please enter a job description first (at least 10 characters)');
      return;
    }

    setGeneratingForIndex(index);
    const loadingToast = toast.loading('AI is enhancing your experience...', {
      icon: '🤖',
    });

    try {
      const result = await generateBulletPoints(exp.description, targetJobTitle);

      toast.dismiss(loadingToast);
      
      // Store suggestions for this experience
      setSuggestions(prev => ({
        ...prev,
        [index]: result.bullets
      }));

      toast.success('AI suggestions ready!', {
        icon: '✨',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error generating bullets:', error);
      toast.dismiss(loadingToast);
      toast.error('Failed to generate suggestions. Please try again.', {
        icon: '❌',
      });
    } finally {
      setGeneratingForIndex(null);
    }
  };

  const handleAcceptBullet = (index, bullet) => {
    const exp = experiences[index];
    const updatedBullets = [...(exp.bullets || []), bullet];
    handleUpdate(exp.id, 'bullets', updatedBullets);
    
    // Remove from suggestions
    setSuggestions(prev => ({
      ...prev,
      [index]: prev[index]?.filter(b => b !== bullet) || []
    }));
    
    toast.success('Bullet point added!', { icon: '✅' });
  };

  const handleAcceptAllBullets = (index) => {
    const exp = experiences[index];
    const currentBullets = exp.bullets || [];
    const newBullets = [...currentBullets, ...(suggestions[index] || [])];
    handleUpdate(exp.id, 'bullets', newBullets);
    
    // Clear suggestions
    setSuggestions(prev => ({
      ...prev,
      [index]: []
    }));
    
    toast.success(`Added ${suggestions[index]?.length} bullet points!`, { icon: '🎉' });
  };

  const handleRejectBullet = (index, bullet) => {
    setSuggestions(prev => ({
      ...prev,
      [index]: prev[index]?.filter(b => b !== bullet) || []
    }));
  };

  const handleRegenerate = async (index, tone) => {
    const exp = experiences[index];
    setGeneratingForIndex(index);
    
    try {
      const result = await generateBulletPoints(exp.description, targetJobTitle, tone);

      setSuggestions(prev => ({
        ...prev,
        [index]: result.bullets
      }));
      
      toast.success(`Regenerated with ${tone} tone!`, { icon: '✨' });
    } catch (error) {
      toast.error('Failed to regenerate. Please try again.', { icon: '❌' });
    } finally {
      setGeneratingForIndex(null);
    }
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            custom={index}
            variants={inputVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                Experience #{index + 1}
              </h3>
              <motion.button
                onClick={() => handleRemove(exp.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company *
                </label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => handleUpdate(exp.id, 'company', e.target.value)}
                  placeholder="Company Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role/Position *
                </label>
                <input
                  type="text"
                  value={exp.role}
                  onChange={(e) => handleUpdate(exp.id, 'role', e.target.value)}
                  placeholder="Job Title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) => handleUpdate(exp.id, 'location', e.target.value)}
                    placeholder="City, State"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => handleUpdate(exp.id, 'startDate', e.target.value)}
                      className="w-full pl-10 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => handleUpdate(exp.id, 'endDate', e.target.value)}
                      placeholder="Present"
                      className="w-full pl-10 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description
              </label>
              <textarea
                value={exp.description}
                onChange={(e) => handleUpdate(exp.id, 'description', e.target.value)}
                placeholder="Describe your responsibilities and achievements..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">
                  {exp.description.length} characters
                </p>
                <motion.button
                  onClick={() => handleGenerateBullets(exp, index)}
                  disabled={generatingForIndex === index || !exp.description}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {generatingForIndex === index ? (
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
                </motion.button>
              </div>
            </div>

            {/* AI Thinking Animation */}
            <AnimatePresence>
              {generatingForIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4"
                >
                  <AIThinkingAnimation 
                    message="AI is analyzing your experience..."
                    progress={45}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* AI Suggestions */}
            <AnimatePresence>
              {suggestions[index] && suggestions[index].length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4"
                >
                  <AISuggestionCard
                    suggestions={suggestions[index]}
                    originalText={exp.description}
                    onAccept={(bullet) => handleAcceptBullet(index, bullet)}
                    onReject={(bullet) => handleRejectBullet(index, bullet)}
                    onAcceptAll={() => handleAcceptAllBullets(index)}
                    onRegenerate={(tone) => handleRegenerate(index, tone)}
                    isGenerating={generatingForIndex === index}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Accepted Bullets */}
            {exp.bullets && exp.bullets.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Added Bullet Points ({exp.bullets.length})
                </h4>
                <ul className="space-y-2">
                  {exp.bullets.map((bullet, bulletIndex) => (
                    <motion.li
                      key={bulletIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-sm text-gray-700 flex items-start"
                    >
                      <span className="text-green-600 mr-2">•</span>
                      {bullet}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add Experience Button */}
      <motion.button
        onClick={handleAdd}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add Work Experience
      </motion.button>

      {experiences.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No work experience added yet. Click the button above to add your first experience.
        </p>
      )}
    </div>
  );
}
