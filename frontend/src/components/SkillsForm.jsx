'use client';

import { useState } from 'react';
import { Plus, Trash2, X, Sparkles } from 'lucide-react';

const SUGGESTED_SKILLS = [
  'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'SQL', 'AWS',
  'Docker', 'Git', 'HTML/CSS', 'Java', 'C++', 'PHP', 'Ruby', 'Go',
  'Machine Learning', 'Data Analysis', 'Project Management', 'Agile',
  'Leadership', 'Communication', 'Problem Solving', 'Teamwork',
  'Microsoft Office', 'Excel', 'PowerPoint', 'Word',
  'Salesforce', 'Tableau', 'Photoshop', 'Figma', 'Sketch',
];

export default function SkillsForm({ skills, onChange }) {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (!newSkill.trim()) return;
    
    if (skills.some(s => s.name.toLowerCase() === newSkill.trim().toLowerCase())) {
      alert('This skill has already been added.');
      return;
    }

    const skill = {
      id: Date.now().toString(),
      name: newSkill.trim(),
    };
    onChange([...skills, skill]);
    setNewSkill('');
  };

  const deleteSkill = (id) => {
    onChange(skills.filter((s) => s.id !== id));
  };

  const addSuggestedSkill = (skillName) => {
    if (skills.some(s => s.name.toLowerCase() === skillName.toLowerCase())) {
      return;
    }

    const skill = {
      id: Date.now().toString() + Math.random(),
      name: skillName,
    };
    onChange([...skills, skill]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="h-auto shrink-0 w-full flex flex-col bg-white rounded-xl p-6 shadow-sm space-y-6">
      {/* Add New Skill */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <Sparkles className="h-4 w-4 mr-2 text-blue-600" />
          Add New Skill
        </h3>
        <div className="flex w-full gap-3">
          <input
            type="text"
            value={newSkill || ''}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter a skill (e.g., React, Project Management)"
            className="w-full flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm text-gray-900 placeholder-gray-400"
          />
          <button
            onClick={addSkill}
            disabled={!newSkill.trim()}
            className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Suggested Skills */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Suggested Skills</h3>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_SKILLS.map((skill) => {
            const isAdded = skills.some(s => s.name.toLowerCase() === skill.toLowerCase());
            return (
              <button
                key={skill}
                onClick={() => addSuggestedSkill(skill)}
                disabled={isAdded}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isAdded
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 hover:from-blue-200 hover:to-indigo-200 hover:scale-105 shadow-sm'
                }`}
              >
                {isAdded ? '✓ ' : '+ '}{skill}
              </button>
            );
          })}
        </div>
      </div>

      {/* Added Skills */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Your Skills ({skills.length})
        </h3>
        {skills.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <Sparkles className="h-10 w-10 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">No skills added yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Add skills above or click on suggested skills
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center bg-white border-2 border-gray-200 rounded-xl px-3 py-2 group hover:border-blue-300 hover:shadow-md transition-all"
              >
                <span className="text-sm font-medium text-gray-700 mr-2">
                  {skill.name}
                </span>
                <button
                  onClick={() => deleteSkill(skill.id)}
                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200 shadow-sm">
        <h4 className="text-sm font-semibold text-purple-900 mb-2 flex items-center">
          <Sparkles className="h-4 w-4 mr-2" />
          Tips for Adding Skills
        </h4>
        <ul className="text-sm text-purple-800 space-y-1 list-disc list-inside">
          <li>Include both technical and soft skills</li>
          <li>Focus on skills relevant to your target job</li>
          <li>Be honest about your proficiency level</li>
          <li>Aim for 8-12 key skills for optimal ATS performance</li>
        </ul>
      </div>
    </div>
  );
}
