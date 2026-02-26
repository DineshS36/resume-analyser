'use client';

import { useState } from 'react';
import { Plus, Trash2, Sparkles, Building2, Calendar, MapPin, Loader2, Wand2, Check, X } from 'lucide-react';
import { generateBulletPoints } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ExperienceForm({ experiences, onChange, targetJobTitle }) {
  const [generatingForId, setGeneratingForId] = useState(null);
  const [suggestions, setSuggestions] = useState({});

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      aiOptimizedBullets: [],
    };
    onChange([...experiences, newExp]);
    toast.success('New experience added', { icon: '➕' });
  };

  const updateExperience = (id, field, value) => {
    onChange(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const deleteExperience = (id) => {
    if (confirm('Are you sure you want to delete this experience?')) {
      onChange(experiences.filter(exp => exp.id !== id));
      toast.success('Experience removed', { icon: '🗑️' });
    }
  };

  const handleGenerateBullets = async (exp) => {
    if (!exp.description || exp.description.trim().length < 10) {
      toast.error('Please enter a description first (at least 10 characters)', { icon: '⚠️' });
      return;
    }

    setGeneratingForId(exp.id);
    const loadingToast = toast.loading('AI is optimizing your bullet points...', { icon: '🤖' });

    try {
      const response = await generateBulletPoints(exp.description, targetJobTitle || 'Professional');
      setSuggestions({
        ...suggestions,
        [exp.id]: response.bullets,
      });
      toast.dismiss(loadingToast);
      toast.success('Suggestions ready! Choose your favorites.', { icon: '✨' });
    } catch (error) {
      console.error('Error generating bullets:', error);
      toast.dismiss(loadingToast);
      toast.error('Failed to generate suggestions. Please try again.', { icon: '❌' });
    } finally {
      setGeneratingForId(null);
    }
  };

  const acceptSuggestion = (expId, bullet) => {
    const exp = experiences.find(e => e.id === expId);
    const currentBullets = exp.aiOptimizedBullets || [];
    if (!currentBullets.includes(bullet)) {
      updateExperience(expId, 'aiOptimizedBullets', [...currentBullets, bullet]);
      toast.success('Bullet point added!', { icon: '✅' });
    }
  };

  const rejectSuggestion = (expId, bullet) => {
    setSuggestions({
      ...suggestions,
      [expId]: suggestions[expId].filter(b => b !== bullet),
    });
  };

  const removeBullet = (expId, bullet) => {
    const exp = experiences.find(e => e.id === expId);
    updateExperience(expId, 'aiOptimizedBullets', exp.aiOptimizedBullets.filter(b => b !== bullet));
  };

  return (
    <div className="space-y-4">
      {experiences.map((exp, index) => (
        <div
          key={exp.id}
          className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-blue-600" />
              Experience #{index + 1}
            </h3>
            <button
              onClick={() => deleteExperience(exp.id)}
              className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                placeholder="e.g., Google, Microsoft, Startup Inc."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Role/Position *</label>
              <input
                type="text"
                value={exp.role}
                onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                placeholder="e.g., Senior Software Engineer"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Start Date
              </label>
              <input
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                End Date
              </label>
              <input
                type="month"
                value={exp.endDate}
                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                placeholder="Present"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Location
              </label>
              <input
                type="text"
                value={exp.location}
                onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                placeholder="e.g., San Francisco, CA (or Remote)"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Raw Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description (for AI enhancement)
            </label>
            <textarea
              value={exp.description}
              onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
              placeholder="Describe your responsibilities and achievements in simple terms. Our AI will transform this into professional bullet points."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all resize-none shadow-sm"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                {exp.description.length}/500 characters
              </p>
              <button
                onClick={() => handleGenerateBullets(exp)}
                disabled={generatingForId === exp.id || !exp.description}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50"
              >
                {generatingForId === exp.id ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enhancing...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Enhance with AI
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Suggestions */}
          {suggestions[exp.id] && suggestions[exp.id].length > 0 && (
            <div className="mb-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-purple-900 mb-3 flex items-center">
                <Sparkles className="h-4 w-4 mr-2" />
                AI Suggestions - Click to add:
              </h4>
              <div className="space-y-2">
                {suggestions[exp.id].map((bullet, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between bg-white p-3 rounded-lg shadow-sm group hover:shadow-md transition-all"
                  >
                    <p className="text-sm text-gray-700 flex-1 mr-2">• {bullet}</p>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => acceptSuggestion(exp.id, bullet)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded transition-all"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => rejectSuggestion(exp.id, bullet)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-all"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Bullets */}
          {exp.aiOptimizedBullets && exp.aiOptimizedBullets.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-green-900 mb-3 flex items-center">
                <Check className="h-4 w-4 mr-2" />
                Selected Bullet Points:
              </h4>
              <ul className="space-y-2">
                {exp.aiOptimizedBullets.map((bullet, idx) => (
                  <li
                    key={idx}
                    className="flex items-start justify-between text-sm text-gray-700 bg-white p-2 rounded hover:bg-gray-50 transition-all"
                  >
                    <span>• {bullet}</span>
                    <button
                      onClick={() => removeBullet(exp.id, bullet)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}

      {/* Add Experience Button */}
      <button
        onClick={addExperience}
        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add Work Experience
      </button>

      {experiences.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No work experience added yet. Click the button above to get started.
        </p>
      )}
    </div>
  );
}
