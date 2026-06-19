'use client';

import { useState } from 'react';
import { Plus, Trash2, FolderDot, Link as LinkIcon, Code } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProjectsForm({ projects = [], onChange }) {
  const addProject = () => {
    const newProj = {
      id: Date.now().toString(),
      projectName: '',
      techStack: '',
      link: '',
      description: '',
    };
    onChange([...projects, newProj]);
    toast.success('New project added', { icon: '➕' });
  };

  const updateProject = (id, field, value) => {
    onChange((projects || []).map(proj => 
      proj.id === id ? { ...proj, [field]: value } : proj
    ));
  };

  const deleteProject = (id) => {
    if (confirm('Are you sure you want to delete this project?')) {
      onChange((projects || []).filter(proj => proj.id !== id));
      toast.success('Project removed', { icon: '🗑️' });
    }
  };

  return (
    <div className="space-y-4">
      {(projects || []).map((proj, index) => (
        <div
          key={proj.id}
          className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <FolderDot className="h-5 w-5 mr-2 text-blue-600" />
              Project #{index + 1}
            </h3>
            <button
              onClick={() => deleteProject(proj.id)}
              className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
              <input
                type="text"
                value={proj.projectName || ''}
                onChange={(e) => updateProject(proj.id, 'projectName', e.target.value)}
                placeholder="e.g., E-commerce Store, Personal Portfolio"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Code className="h-4 w-4 mr-1" />
                Tech Stack
              </label>
              <input
                type="text"
                value={proj.techStack || ''}
                onChange={(e) => updateProject(proj.id, 'techStack', e.target.value)}
                placeholder="e.g., React, Node.js, MongoDB"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <LinkIcon className="h-4 w-4 mr-1" />
                Link
              </label>
              <input
                type="url"
                value={proj.link || ''}
                onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                placeholder="e.g., https://github.com/yourusername/project"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Raw Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Description
            </label>
            <textarea
              value={Array.isArray(proj.description) ? proj.description.join('\n') : (proj.description || '')}
              onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
              placeholder="Describe what you built and the impact it had. Use bullet points or multiple lines."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm h-32 resize-none text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>
      ))}

      {/* Add Project Button */}
      <button
        onClick={addProject}
        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add Project
      </button>

      {(projects || []).length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No projects added yet. Click the button above to get started.
        </p>
      )}
    </div>
  );
}
