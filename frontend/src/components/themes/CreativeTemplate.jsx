import React from 'react';
import { formatDate } from './utils';

const CreativeTemplate = ({ data }) => {
  const { personalInfo = {}, targetJobTitle, summary, experiences = [], projects = [], education = [], skills = [] } = data || {};

  return (
<div className="w-full break-before-auto break-after-auto bg-white text-black  relative shadow-lg flex">
      {/* Sidebar */}
      <div className="w-1/3 bg-gradient-to-b from-purple-600 to-pink-600 text-white p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {targetJobTitle && (
            <p className="text-purple-100 text-sm">{targetJobTitle}</p>
          )}
        </div>
        
        <div className="space-y-3 text-sm">
          {personalInfo.email && <p className="flex items-center gap-2">✉ {personalInfo.email}</p>}
          {personalInfo.phone && <p className="flex items-center gap-2">☎ {personalInfo.phone}</p>}
          {personalInfo.location && <p className="flex items-center gap-2">📍 {personalInfo.location}</p>}
          {personalInfo.linkedin && <p className="flex items-center gap-2">💼 {personalInfo.linkedin}</p>}
          {personalInfo.website && <p className="flex items-center gap-2">🌐 {personalInfo.website}</p>}
        </div>

        {skills.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-purple-100">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="text-xs bg-white/20 px-2 py-1 rounded"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-6">
        {summary && (
        <div className="mb-6 break-inside-avoid mb-4">
            <h2 className="text-lg font-bold text-purple-600 mb-2">About</h2>
            <p className="text-sm leading-relaxed">{summary}</p>
          </div>
        )}

        {experiences.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-purple-600 mb-3">Experience</h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="order-l-2 border-purple-200 pl-3 break-inside-avoid mb-4">
                  <h3 className="font-bold text-gray-900">{exp.role}</h3>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold">{exp.company}</h4>
                    <span className="text-sm">{formatDate(exp.startDate)} - {exp.endDate || 'Present'}</span>
                  </div>
                  {exp.location && <p className="text-xs text-gray-500 mb-2">{exp.location}</p>}
                  {exp.aiOptimizedBullets?.length > 0 ? (
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {exp.aiOptimizedBullets.map((bullet, idx) => (
                        <li key={idx} className="text-gray-700">{bullet}</li>
                      ))}
                    </ul>
                  ) : exp.description ? (
                  <div className="text-sm text-gray-700">
                    {Array.isArray(exp.description) ? (
                      <ul className="list-disc ml-5 space-y-1.5 marker:text-gray-600 text-sm mt-2">
                        {exp.description.map((bullet, i) => {
                          const cleanBullet = bullet.replace(/^[-•*]\s*/, '').trim();
                          return (
                            <li key={i} className="leading-relaxed">
                              {cleanBullet}
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="text-sm mt-2 leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                ) : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-purple-600 mb-3">Education</h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="break-inside-avoid mb-4">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold">{edu.institution}</h4>
                    <span className="text-sm">{edu.graduationDate}</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {edu.degree}
                    {edu.field && ` in ${edu.field}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreativeTemplate;
