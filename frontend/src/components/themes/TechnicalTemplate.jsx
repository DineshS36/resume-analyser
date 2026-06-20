import React from 'react';
import { formatDate } from './utils';

const TechnicalTemplate = ({ data }) => {
  const { personalInfo = {}, targetJobTitle, summary, experiences = [], projects = [], education = [], skills = [] } = data || {};

  return (
<div className="w-full break-before-auto break-after-auto bg-white text-black  relative px-8 py-10 shadow-lg">
      {/* Header */}
      <div className="bg-blue-900 text-white p-6 -mx-8 -mt-8 mb-6">
        <h1 className="text-3xl font-mono font-bold mb-2">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {targetJobTitle && (
          <p className="text-blue-200 font-mono">{targetJobTitle}</p>
        )}
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-blue-100 font-mono">
          {personalInfo.email && <span>{`<${personalInfo.email}>`}</span>}



          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>[{personalInfo.location}]</span>}
          {personalInfo.linkedin && <span>@{personalInfo.linkedin}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </div>

      {/* Technical Summary */}
      {summary && (
        <div className="mb-6 break-inside-avoid mb-4">
          <h2 className="text-sm font-mono font-bold text-blue-900 uppercase mb-2">// Summary</h2>
          <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
        </div>
      )}

      {/* Technical Skills - Highlighted */}
      {skills.length > 0 && (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h2 className="text-sm font-mono font-bold text-blue-900 uppercase mb-3">## Technical Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="text-sm bg-blue-900 text-white px-3 py-1 rounded font-mono"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Project/Experience */}
      {experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-mono font-bold text-blue-900 uppercase mb-3">## Experience</h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="order-l-2 border-blue-300 pl-4 break-inside-avoid mb-4">
                <h3 className="font-bold text-gray-900 font-mono">{exp.role}</h3>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold">{exp.company}</h4>
                  <span className="text-sm">{formatDate(exp.startDate)} - {exp.endDate || 'Present'}</span>
                </div>
                {exp.location && <p className="text-xs text-gray-500 font-mono">{exp.location}</p>}
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

      
      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3 uppercase tracking-wide">
            Projects
          </h2>
          <div className="space-y-4">
            {projects.map((proj) => (
              <div key={proj.id} className="order-l-2 border-blue-300 pl-4 break-inside-avoid mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900 font-mono">{proj.projectName}</h3>
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
        <div>
          <h2 className="text-sm font-mono font-bold text-blue-900 uppercase mb-3">## Education</h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="order-l-2 border-blue-300 pl-4 break-inside-avoid mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold">{edu.institution}</h4>
                  <span className="text-sm">{edu.graduationDate}</span>
                </div>
                <p className="text-sm text-gray-700 font-mono">
                  {edu.degree}
                  {edu.field && ` in ${edu.field}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicalTemplate;
