'use client';

import { useState } from 'react';
import { Plus, Trash2, GraduationCap } from 'lucide-react';

export default function EducationForm({ education, onChange }) {
  const [editingId, setEditingId] = useState(null);

  const addEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      graduationDate: '',
    };
    onChange([...education, newEducation]);
    setEditingId(newEducation.id);
  };

  const updateEducation = (id, field, value) => {
    onChange(
      education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  const deleteEducation = (id) => {
    onChange(education.filter((edu) => edu.id !== id));
    if (editingId === id) setEditingId(null);
  };

  return (
    <div className="h-auto shrink-0 w-full flex flex-col space-y-4">
      {education.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <GraduationCap className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 mb-4">No education added yet</p>
          <button
            onClick={addEducation}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Education
          </button>
        </div>
      ) : (
        <>
          {education.map((edu) => (
            <div
              key={edu.id}
              className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {editingId === edu.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institution *
                    </label>
                    <input
                      type="text"
                      value={edu.institution || ''}
                      onChange={(e) =>
                        updateEducation(edu.id, 'institution', e.target.value)
                      }
                      placeholder="University or School Name"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm text-gray-900 placeholder-gray-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Degree *
                      </label>
                      <select
                        value={edu.degree || ''}
                        onChange={(e) =>
                          updateEducation(edu.id, 'degree', e.target.value)
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm text-gray-900"
                      >
                        <option value="">Select Degree</option>
                        <option value="High School Diploma">High School Diploma</option>
                        <option value="Associate's Degree">Associate's Degree</option>
                        <option value="Bachelor's Degree">Bachelor's Degree</option>
                        <option value="Master's Degree">Master's Degree</option>
                        <option value="Doctorate (PhD)">Doctorate (PhD)</option>
                        <option value="Professional Degree">Professional Degree</option>
                        <option value="Certificate">Certificate</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Field of Study
                      </label>
                      <input
                        type="text"
                        value={edu.field || ''}
                        onChange={(e) =>
                          updateEducation(edu.id, 'field', e.target.value)
                        }
                        placeholder="e.g., Computer Science"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm text-gray-900 placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Graduation Date
                    </label>
                    <input
                      type="text"
                      value={edu.graduationDate || ''}
                      onChange={(e) =>
                        updateEducation(edu.id, 'graduationDate', e.target.value)
                      }
                      placeholder="MM/YYYY"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm text-gray-900 placeholder-gray-400"
                    />
                  </div>

                  <button
                    onClick={() => setEditingId(null)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {edu.institution || 'Unknown Institution'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {edu.degree}
                      {edu.field && ` in ${edu.field}`}
                    </p>
                    {edu.graduationDate && (
                      <p className="text-sm text-gray-500">
                        Graduated: {edu.graduationDate}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingId(edu.id)}
                      className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-all hover:scale-105"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteEducation(edu.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all hover:scale-110"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          <button
            onClick={addEducation}
            className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Another Education
          </button>
        </>
      )}
    </div>
  );
}
