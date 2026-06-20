import React from 'react';
import { formatDate } from './utils';

const TwoColumnTemplate = ({ data }) => {
  const { personalInfo = {}, targetJobTitle, summary, experiences = [], projects = [], education = [], skills = [] } = data || {};

  return (
<div className="w-full break-before-auto break-after-auto bg-white text-black  relative shadow-lg flex">
      <div className="w-1/3 bg-gray-900 text-white p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold mb-2">{personalInfo.fullName || 'Your Name'}</h1>
          {targetJobTitle && <p className="text-gray-400 text-sm">{targetJobTitle}</p>}
        </div>
        <div className="space-y-4 text-sm">
          {personalInfo.email && <div><p className="text-gray-500 text-xs uppercase">Email</p><p>{personalInfo.email}</p></div>}
          {personalInfo.phone && <div><p className="text-gray-500 text-xs uppercase">Phone</p><p>{personalInfo.phone}</p></div>}
          {personalInfo.location && <div><p className="text-gray-500 text-xs uppercase">Location</p><p>{personalInfo.location}</p></div>}
        </div>
        {skills.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 text-gray-400">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (<span key={skill.id} className="text-xs bg-gray-800 px-2 py-1 rounded">{skill.name}</span>))}
            </div>
          </div>
        )}
        {education.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 text-gray-400">Education</h3>
            {education.map((edu) => (<div key={edu.id} className="b-3 break-inside-avoid mb-4"><p className="font-medium text-sm">{edu.institution}</p><p className="text-xs text-gray-400">{edu.degree}{edu.field && ` in ${edu.field}`}</p></div>))}
          </div>
        )}
      </div>
      <div className="w-2/3 p-6">
        {summary && <div className="mb-6 break-inside-avoid mb-4"><h2 className="text-lg font-bold text-gray-900 mb-2">Summary</h2><p className="text-sm leading-relaxed">{summary}</p></div>}
        {experiences.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Experience</h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="break-inside-avoid mb-4">
                  <h3 className="font-bold text-gray-900">{exp.role}</h3>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold">{exp.company}</h4>
                    <span className="text-sm">{formatDate(exp.startDate)} - {exp.endDate || 'Present'}</span>
                  </div>
                  {exp.location && <p className="text-xs text-gray-500">{exp.location}</p>}
                  {exp.aiOptimizedBullets?.length > 0 ? (<ul className="list-disc list-inside text-sm space-y-1 mt-2">{exp.aiOptimizedBullets.map((bullet, idx) => (<li key={idx} className="text-gray-700">{bullet}</li>))}</ul>) : exp.description ? (
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
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Projects</h2>
            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id} className="break-inside-avoid mb-4">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-900">{proj.projectName}</h3>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        View Project
                      </a>
                    )}
                  </div>
                  {proj.techStack && <p className="text-xs text-gray-500 mb-2 italic">{proj.techStack}</p>}
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
      </div>
    </div>
  );
};

export default TwoColumnTemplate;
