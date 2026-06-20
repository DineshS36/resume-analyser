import React from 'react';
import { formatDate } from './utils';

const MedicalTemplate = ({ data }) => {
  const { personalInfo = {}, targetJobTitle, summary, experiences = [], projects = [], education = [], skills = [] } = data || {};

  return (
<div className="w-full break-before-auto break-after-auto bg-white text-black  relative px-8 py-10 shadow-lg">
      <div className="bg-gradient-to-r from-cyan-700 to-sky-600 text-white p-6 -mx-8 -mt-8 mb-6">
        <h1 className="text-3xl font-bold mb-2">{personalInfo.fullName || 'Your Name'}</h1>
        {targetJobTitle && <p className="text-cyan-100">{targetJobTitle}</p>}
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-cyan-100">{personalInfo.email && <span>{personalInfo.email}</span>}{personalInfo.phone && <span>• {personalInfo.phone}</span>}{personalInfo.location && <span>• {personalInfo.location}</span>}</div>
      </div>
      {summary && <div className="mb-6 break-inside-avoid mb-4"><h2 className="text-lg font-bold text-cyan-700 mb-2 flex items-center"><span className="w-2 h-6 bg-cyan-500 mr-2 rounded"></span>Clinical Summary</h2><p className="text-sm leading-relaxed text-gray-700">{summary}</p></div>}
      {experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-cyan-700 mb-4 flex items-center"><span className="w-2 h-6 bg-cyan-500 mr-2 rounded"></span>Clinical Experience</h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="order-l-4 border-cyan-200 pl-4 break-inside-avoid mb-4">
                <h3 className="font-bold text-gray-900">{exp.role}</h3>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold">{exp.company}</h4>
                  <span className="text-sm">{formatDate(exp.startDate)} - {exp.endDate || 'Present'}</span>
                </div>
                {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
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
        <div className="mb-6">
          <h2 className="text-lg font-bold text-cyan-700 mb-4 flex items-center"><span className="w-2 h-6 bg-cyan-500 mr-2 rounded"></span>Projects</h2>
          <div className="space-y-4">
            {projects.map((proj) => (
              <div key={proj.id} className="order-l-4 border-cyan-200 pl-4 break-inside-avoid mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900">{proj.projectName}</h3>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-600 hover:underline">
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
      {education.length > 0 && <div className="mb-6"><h2 className="text-lg font-bold text-cyan-700 mb-3 flex items-center"><span className="w-2 h-6 bg-cyan-500 mr-2 rounded"></span>Education & Training</h2>{education.map((edu) => (<div key={edu.id} className="b-3 border-l-4 border-cyan-200 pl-4 break-inside-avoid mb-4"><p className="font-bold text-gray-900">{edu.institution}</p><p className="text-sm text-gray-700">{edu.degree}{edu.field && ` in ${edu.field}`}</p><p className="text-xs text-gray-500">{edu.graduationDate}</p></div>))}</div>}
      {skills.length > 0 && <div><h2 className="text-lg font-bold text-cyan-700 mb-3 flex items-center"><span className="w-2 h-6 bg-cyan-500 mr-2 rounded"></span>Licenses & Skills</h2><div className="flex flex-wrap gap-2">{skills.map((skill) => (<span key={skill.id} className="text-sm bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full border border-cyan-200">{skill.name}</span>))}</div></div>}
    </div>
  );
};

export default MedicalTemplate;
