import React from 'react';
import { formatDate } from './utils';

const AcademicTemplate = ({ data }) => {
  const { personalInfo = {}, targetJobTitle, summary, experiences = [], projects = [], education = [], skills = [] } = data || {};

  return (
<div className="w-full break-before-auto break-after-auto bg-white text-black  relative px-8 py-10 shadow-lg">
      {/* Academic Header */}
      <div className="text-center mb-6 pb-6 border-b-2 border-amber-800">
        <h1 className="text-3xl font-serif text-amber-900 mb-2">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {targetJobTitle && (
          <p className="text-lg text-amber-700 italic">{targetJobTitle}</p>
        )}
        <div className="mt-3 text-sm text-amber-800 space-y-1">
          {personalInfo.email && <p>{personalInfo.email}</p>}
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {personalInfo.location && <p>{personalInfo.location}</p>}
          {personalInfo.website && <p>{personalInfo.website}</p>}
        </div>
      </div>

      {/* Research Interests / Summary */}
      {summary && (
        <div className="mb-6 break-inside-avoid mb-4">
          <h2 className="text-sm font-serif font-bold text-amber-900 uppercase tracking-wider mb-2 border-b border-amber-200 pb-1">
            Research Interests & Summary
          </h2>
          <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
        </div>
      )}

      {/* Academic Experience */}
      {experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-serif font-bold text-amber-900 uppercase tracking-wider mb-3 border-b border-amber-200 pb-1">
            Academic & Professional Experience
          </h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="break-inside-avoid mb-4">
                <h3 className="font-bold text-gray-900 font-serif">{exp.role}</h3>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold">{exp.company}</h4>
                  <span className="text-sm">{formatDate(exp.startDate)} - {exp.endDate || 'Present'}</span>
                </div>
                {exp.location && <p className="text-sm text-gray-600">{exp.location}</p>}
                {exp.aiOptimizedBullets?.length > 0 ? (
                  <ul className="list-disc list-inside text-sm space-y-1 mt-2">
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

      {/* Education - Academic Focus */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-serif font-bold text-amber-900 uppercase tracking-wider mb-3 border-b border-amber-200 pb-1">
            Education
          </h2>
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

      {/* Skills */}
      {skills.length > 0 && (
        <div>
          <h2 className="text-sm font-serif font-bold text-amber-900 uppercase tracking-wider mb-3 border-b border-amber-200 pb-1">
            Skills & Expertise
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="text-sm bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-serif"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Two-Column Template
};

export default AcademicTemplate;
