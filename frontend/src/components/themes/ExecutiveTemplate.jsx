import React from 'react';
import { formatDate } from './utils';

const ExecutiveTemplate = ({ data }) => {
  const { personalInfo = {}, targetJobTitle, summary, experiences = [], projects = [], education = [], skills = [] } = data || {};

  return (
<div className="w-full break-before-auto break-after-auto bg-white text-black  relative px-8 py-10 shadow-lg">
      {/* Premium Header */}
      <div className="border-b-4 border-slate-800 pb-6 mb-6">
        <h1 className="text-4xl font-serif text-slate-900 mb-2">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {targetJobTitle && (
          <p className="text-xl text-slate-600 font-light tracking-wide">{targetJobTitle}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span className="text-slate-300">|</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span className="text-slate-300">|</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span className="text-slate-300">|</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </div>

      {/* Executive Summary */}
      {summary && (
        <div className="mb-6 bg-slate-50 p-4 rounded-lg break-inside-avoid mb-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Executive Summary</h2>
          <p className="text-sm leading-relaxed text-slate-700">{summary}</p>
        </div>
      )}

      {/* Leadership Experience */}
      {experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-serif font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">
            Professional Experience
          </h2>
          <div className="space-y-5">
            {experiences.map((exp) => (
              <div key={exp.id} className="break-inside-avoid mb-4">
                <h3 className="font-bold text-slate-900 text-lg">{exp.role}</h3>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold">{exp.company}</h4>
                  <span className="text-sm">{formatDate(exp.startDate)} — {exp.endDate || 'Present'}</span>
                </div>
                {exp.location && <p className="text-sm text-slate-500">{exp.location}</p>}
                {exp.aiOptimizedBullets?.length > 0 ? (
                  <ul className="list-disc list-inside text-sm space-y-1 mt-2 text-slate-700">
                    {exp.aiOptimizedBullets.map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>
                ) : exp.description ? (
                  <div className="text-sm text-slate-700">
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

      
      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3 uppercase tracking-wide">
            Projects
          </h2>
          <div className="space-y-4">
            {projects.map((proj) => (
              <div key={proj.id} className="order-l-2 border-purple-200 pl-3 break-inside-avoid mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900">{proj.projectName}</h3>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                      View Project
                    </a>
                  )}
                </div>
                {proj.techStack && (
                  <p className="text-sm text-gray-600 italic mb-2">{proj.techStack}</p>
                )}
                {proj.description ? (
                  <div className="text-sm text-gray-700">
                    {Array.isArray(proj.description) ? (
                      <ul className="list-disc ml-5 space-y-1.5 marker:text-gray-600 text-sm mt-2">
                        {proj.description.map((bullet, i) => {
                          const cleanBullet = bullet.replace(/^[-•*]\s*/, '').trim();
                          return (
                            <li key={i} className="leading-relaxed">
                              {cleanBullet}
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="text-sm mt-2 leading-relaxed">{proj.description}</p>
                    )}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-serif font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="break-inside-avoid mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold">{edu.institution}</h4>
                  <span className="text-sm">{edu.graduationDate}</span>
                </div>
                <p className="text-sm text-slate-700">
                  {edu.degree}
                  {edu.field && <span className="text-slate-500"> — {edu.field}</span>}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Core Competencies */}
      {skills.length > 0 && (
        <div>
          <h2 className="text-lg font-serif font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">
            Core Competencies
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center text-sm text-slate-700">
                <span className="w-2 h-2 bg-slate-400 rounded-full mr-2"></span>
                {skill.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutiveTemplate;
