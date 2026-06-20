import React from 'react';
import { formatDate } from './utils';

const ConsultantTemplate = ({ data }) => {
  const { personalInfo = {}, targetJobTitle, summary, experiences = [], projects = [], education = [], skills = [] } = data || {};

  return (
<div className="w-full break-before-auto break-after-auto bg-white text-black  relative px-8 py-10 shadow-lg">
      <div className="border-b-2 border-orange-500 pb-4 mb-6">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-1">{personalInfo.fullName || 'Your Name'}</h1>
        {targetJobTitle && <p className="text-lg text-orange-600 font-medium">{targetJobTitle}</p>}
        <div className="mt-3 flex gap-4 text-sm text-gray-600">{personalInfo.email && <span>{personalInfo.email}</span>}{personalInfo.phone && <span>• {personalInfo.phone}</span>}{personalInfo.location && <span>• {personalInfo.location}</span>}</div>
      </div>
      {summary && <div className="mb-6 bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500 break-inside-avoid mb-4"><h2 className="text-sm font-bold text-orange-800 uppercase tracking-wider mb-2">Expertise</h2><p className="text-sm leading-relaxed text-gray-700">{summary}</p></div>}
      {experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-serif font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Professional Experience</h2>
          <div className="space-y-5">
            {experiences.map((exp) => (
              <div key={exp.id} className="break-inside-avoid mb-4">
                <h3 className="font-bold text-gray-900">{exp.role}</h3>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold">{exp.company}</h4>
                  <span className="text-sm">{formatDate(exp.startDate)} — {exp.endDate || 'Present'}</span>
                </div>
                {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                {exp.aiOptimizedBullets?.length > 0 ? (<ul className="list-disc list-inside text-sm space-y-1 mt-2 text-gray-700">{exp.aiOptimizedBullets.map((bullet, idx) => (<li key={idx}>{bullet}</li>))}</ul>) : exp.description ? (
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
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-serif font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Projects</h2>
          <div className="space-y-5">
            {projects.map((proj) => (
              <div key={proj.id} className="break-inside-avoid mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900">{proj.projectName}</h3>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-sm text-orange-600 hover:underline italic">
                      View Project
                    </a>
                  )}
                </div>
                {proj.techStack && <p className="text-sm text-gray-500 italic mb-2">{proj.techStack}</p>}
                {proj.description ? (
                  <div className="text-sm text-gray-700">
                    {Array.isArray(proj.description) ? (
                      <ul className="list-disc ml-5 space-y-1.5 marker:text-gray-600 text-sm mt-2">
                        {proj.description.map((bullet, i) => {
                          const cleanBullet = bullet.replace(/^[-•*]s*/, '').trim();
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
      {education.length > 0 && <div className="mb-6"><h2 className="text-lg font-serif font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">Education & Credentials</h2>{education.map((edu) => (<div key={edu.id} className="b-2 break-inside-avoid mb-4"><p className="font-bold text-gray-900">{edu.institution}</p><p className="text-sm text-gray-600">{edu.degree}{edu.field && ` in ${edu.field}`}</p></div>))}</div>}
      {skills.length > 0 && <div><h2 className="text-lg font-serif font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">Core Competencies</h2><div className="grid grid-cols-2 gap-2">{skills.map((skill) => (<div key={skill.id} className="flex items-center text-sm text-gray-700"><span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>{skill.name}</div>))}</div></div>}
    </div>
  );
};

export default ConsultantTemplate;
