import React from 'react';
import { formatDate } from './utils';

const FinanceTemplate = ({ data }) => {
  const { personalInfo = {}, targetJobTitle, summary, experiences = [], projects = [], education = [], skills = [] } = data || {};

  return (
    <div className="w-full break-before-auto break-after-auto bg-white text-black  relative px-8 py-10 shadow-lg font-serif">
      <div className="bg-slate-800 text-white p-6 -mx-8 -mt-8 mb-6">
        <h1 className="text-3xl font-bold mb-1">{personalInfo.fullName || 'Your Name'}</h1>
        {targetJobTitle && <p className="text-slate-300 font-medium tracking-wide">{targetJobTitle}</p>}
        <div className="mt-4 flex gap-4 text-sm text-slate-300">{personalInfo.email && <span>{personalInfo.email}</span>}{personalInfo.phone && <span>|</span>}{personalInfo.phone && <span>{personalInfo.phone}</span>}{personalInfo.location && <span>|</span>}{personalInfo.location && <span>{personalInfo.location}</span>}</div>
      </div>
      {summary && <div className="mb-6 bg-slate-50 p-4 rounded break-inside-avoid mb-4"><h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Professional Profile</h2><p className="text-sm leading-relaxed text-slate-700">{summary}</p></div>}
      {experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800 border-b-2 border-slate-800 pb-1 mb-4">Professional Experience</h2>
          <div className="space-y-5">
            {experiences.map((exp) => (
              <div key={exp.id} className="break-inside-avoid mb-4">
                <h3 className="font-bold text-slate-900">{exp.role}</h3>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold">{exp.company}</h4>
                  <span className="text-sm">{formatDate(exp.startDate)} — {exp.endDate || 'Present'}</span>
                </div>
                {exp.location && <p className="text-sm text-slate-500">{exp.location}</p>}
                {exp.aiOptimizedBullets?.length > 0 ? (<ul className="list-disc list-inside text-sm space-y-1 mt-2 text-slate-700">{exp.aiOptimizedBullets.map((bullet, idx) => (<li key={idx}>{bullet}</li>))}</ul>) : exp.description ? (
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
      {education.length > 0 && <div className="mb-6"><h2 className="text-lg font-bold text-slate-800 border-b-2 border-slate-800 pb-1 mb-3">Education</h2>{education.map((edu) => (<div key={edu.id} className="lex justify-between items-start mb-2 break-inside-avoid mb-4"><div><p className="font-bold text-slate-900">{edu.institution}</p><p className="text-sm text-slate-600">{edu.degree}{edu.field && ` in ${edu.field}`}</p></div><p className="text-sm text-slate-500">{edu.graduationDate}</p></div>))}</div>}
      {skills.length > 0 && <div><h2 className="text-lg font-bold text-slate-800 border-b-2 border-slate-800 pb-1 mb-3">Technical Competencies</h2><div className="grid grid-cols-2 gap-2">{skills.map((skill) => (<div key={skill.id} className="flex items-center text-sm text-slate-700"><span className="w-2 h-2 bg-slate-800 mr-2"></span>{skill.name}</div>))}</div></div>}
    </div>
  );
};

export default FinanceTemplate;
