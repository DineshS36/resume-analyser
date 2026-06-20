'use client';

import { useState } from 'react';
import { Plus, Trash2, Sparkles, Building2, Calendar, MapPin, Loader2, Wand2, Check, X } from 'lucide-react';
import { generateBulletPoints, enhanceBulletPoint } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ExperienceForm({ experiences, onChange, targetJobTitle }) {
  const [generatingForId, setGeneratingForId] = useState(null);
  const [enhancingBullet, setEnhancingBullet] = useState(null);
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

  const handleEnhanceBullet = async (expId, bulletIndex, currentText) => {
    if (!currentText || currentText.trim().length < 5) {
      toast.error('Please enter at least 5 characters to enhance.');
      return;
    }
    
    setEnhancingBullet(`${expId}-${bulletIndex}`);
    try {
      const res = await enhanceBulletPoint(currentText, []);
      const exp = experiences.find(e => e.id === expId);
      const descArray = Array.isArray(exp.description) ? [...exp.description] : (exp.description || '').split('\n');
      descArray[bulletIndex] = res.enhancedBullet;
      updateExperience(expId, 'description', descArray);
      toast.success('Bullet enhanced!', { icon: '✨' });
    } catch (error) {
      toast.error('Failed to enhance bullet.');
    } finally {
      setEnhancingBullet(null);
    }
  };

  const updateDescBullet = (expId, bulletIndex, newValue) => {
    const exp = experiences.find(e => e.id === expId);
    const descArray = Array.isArray(exp.description) ? [...exp.description] : (exp.description || '').split('\n');
    descArray[bulletIndex] = newValue;
    updateExperience(expId, 'description', descArray);
  };

  const addDescBullet = (expId) => {
    const exp = experiences.find(e => e.id === expId);
    const descArray = Array.isArray(exp.description) ? [...exp.description] : (exp.description || '').split('\n');
    descArray.push('');
    updateExperience(expId, 'description', descArray);
  };

  const removeDescBulletIndex = (expId, bulletIndex) => {
    const exp = experiences.find(e => e.id === expId);
    const descArray = Array.isArray(exp.description) ? [...exp.description] : (exp.description || '').split('\n');
    descArray.splice(bulletIndex, 1);
    updateExperience(expId, 'description', descArray);
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
                value={exp.company || ''}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                placeholder="e.g., Google, Microsoft, Startup Inc."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm text-gray-900 placeholder-gray-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Role/Position *</label>
              <input
                type="text"
                value={exp.role || ''}
                onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                placeholder="e.g., Senior Software Engineer"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Start Date
              </label>
              <input
                type="month"
                value={exp.startDate || ''}
                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                End Date
              </label>
              <input
                type="month"
                value={exp.endDate || ''}
                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                placeholder="Present"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm text-gray-900 placeholder-gray-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Location
              </label>
              <input
                type="text"
                value={exp.location || ''}
                onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                placeholder="e.g., San Francisco, CA (or Remote)"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Bullet Points */}
          <div className="mb-4 space-y-3">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between items-end">
              <span>Job Description Bullets</span>
              <button
                onClick={() => handleGenerateBullets(exp)}
                disabled={generatingForId === exp.id || !exp.description || exp.description.length === 0}
                className="flex items-center px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-medium rounded shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                title="Generate new bullets based on your text"
              >
                {generatingForId === exp.id ? (
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3 mr-1" />
                )}
                Auto-Generate Ideas
              </button>
            </label>
            
            {(Array.isArray(exp.description) ? exp.description : (exp.description || '').split('\n')).map((bullet, bIndex) => {
              const isEnhancing = enhancingBullet === `${exp.id}-${bIndex}`;
              return (
                <div key={bIndex} className="flex items-start space-x-2">
                  <div className="flex-1 relative">
                    <textarea
                      value={bullet}
                      onChange={(e) => updateDescBullet(exp.id, bIndex, e.target.value)}
                      disabled={isEnhancing}
                      placeholder="Describe a key responsibility or achievement..."
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm resize-none text-gray-900 placeholder-gray-400 min-h-[60px]"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => handleEnhanceBullet(exp.id, bIndex, bullet)}
                      disabled={isEnhancing || !bullet.trim()}
                      className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors disabled:opacity-50"
                      title="Enhance with AI"
                    >
                      {isEnhancing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => removeDescBulletIndex(exp.id, bIndex)}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                      title="Remove Bullet"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
            <button
              onClick={() => addDescBullet(exp.id)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center mt-2"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Bullet
            </button>
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
