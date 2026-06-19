'use client';

export default function ResumePreview({ data, template }) {
  const { personalInfo, targetJobTitle, summary, experiences, education, skills } = data;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return dateStr;
  };

  // Classic Template
  const ClassicTemplate = () => (
    <div className="w-full break-before-auto break-after-auto bg-white text-black  relative px-8 py-10 shadow-lg">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {targetJobTitle && (
          <p className="text-lg text-gray-600 mb-2">{targetJobTitle}</p>
        )}
        <div className="text-sm text-gray-600 flex flex-wrap justify-center gap-3">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
          {personalInfo.website && <span>• {personalInfo.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6 break-inside-avoid mb-4">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2 uppercase tracking-wide">
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3 uppercase tracking-wide">
            Work Experience
          </h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="break-inside-avoid mb-4">
                <h3 className="font-bold text-gray-900">{exp.role}</h3>
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

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3 uppercase tracking-wide">
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
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3 uppercase tracking-wide">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="text-sm bg-gray-100 px-2 py-1 rounded"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Modern Template
  const ModernTemplate = () => (
    <div className="w-full break-before-auto break-after-auto bg-white text-black  relative px-8 py-10 shadow-lg">
      {/* Header with accent */}
      <div className="bg-primary-600 text-white p-6 -mx-8 -mt-8 mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {targetJobTitle && (
          <p className="text-lg text-primary-100 mb-3">{targetJobTitle}</p>
        )}
        <div className="text-sm text-primary-100 flex flex-wrap gap-3">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
          {personalInfo.website && <span>• {personalInfo.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6 break-inside-avoid mb-4">
          <h2 className="text-lg font-bold text-primary-600 mb-2 flex items-center">
            <span className="w-1 h-6 bg-primary-600 mr-2 rounded"></span>
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-primary-600 mb-3 flex items-center">
            <span className="w-1 h-6 bg-primary-600 mr-2 rounded"></span>
            Work Experience
          </h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="order-l-2 border-primary-200 pl-4 break-inside-avoid mb-4">
                <h3 className="font-bold text-gray-900">{exp.role}</h3>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold">{exp.company}</h4>
                  <span className="text-sm">{formatDate(exp.startDate)} - {exp.endDate || 'Present'}</span>
                </div>
                {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
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

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-primary-600 mb-3 flex items-center">
            <span className="w-1 h-6 bg-primary-600 mr-2 rounded"></span>
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="order-l-2 border-primary-200 pl-4 break-inside-avoid mb-4">
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
          <h2 className="text-lg font-bold text-primary-600 mb-3 flex items-center">
            <span className="w-1 h-6 bg-primary-600 mr-2 rounded"></span>
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="text-sm bg-primary-100 text-primary-700 px-3 py-1 rounded-full"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Minimal Template
  const MinimalTemplate = () => (
    <div className="w-full break-before-auto break-after-auto bg-white text-black  relative px-8 py-10 shadow-lg">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-light text-gray-900 mb-2">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {targetJobTitle && (
          <p className="text-lg text-gray-500 mb-3">{targetJobTitle}</p>
        )}
        <div className="text-sm text-gray-400 space-y-1">
          {personalInfo.email && <p>{personalInfo.email}</p>}
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {personalInfo.location && <p>{personalInfo.location}</p>}
          {personalInfo.linkedin && <p>{personalInfo.linkedin}</p>}
          {personalInfo.website && <p>{personalInfo.website}</p>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-8 break-inside-avoid mb-4">
          <p className="text-sm leading-relaxed text-gray-600 italic">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            Experience
          </h2>
          <div className="space-y-6">
            {experiences.map((exp) => (
              <div key={exp.id} className="break-inside-avoid mb-4">
                <h3 className="font-medium text-gray-900">{exp.role}</h3>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold">{exp.company}</h4>
                  <span className="text-sm">{formatDate(exp.startDate)} - {exp.endDate || 'Present'}</span>
                </div>
                {exp.aiOptimizedBullets?.length > 0 ? (
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {exp.aiOptimizedBullets.map((bullet, idx) => (
                      <li key={idx} className="text-gray-600">{bullet}</li>
                    ))}
                  </ul>
                ) : exp.description ? (
                  <div className="text-sm text-gray-600">
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

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="break-inside-avoid mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold">{edu.institution}</h4>
                  <span className="text-sm">{edu.graduationDate}</span>
                </div>
                <p className="text-sm text-gray-500">
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
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            Skills
          </h2>
          <p className="text-sm text-gray-600">
            {skills.map(s => s.name).join(' • ')}
          </p>
        </div>
      )}
    </div>
  );

  // Creative Template
  const CreativeTemplate = () => (
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

  // Executive Template
  const ExecutiveTemplate = () => (
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

  // Technical Template
  const TechnicalTemplate = () => (
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

  // Academic Template
  const AcademicTemplate = () => (
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
  const TwoColumnTemplate = () => (
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
      </div>
    </div>
  );

  // Startup Template
  const StartupTemplate = () => (
    <div className="w-full break-before-auto break-after-auto bg-white text-black  relative px-8 py-10 shadow-lg">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 -mx-8 -mt-8 mb-6">
        <h1 className="text-3xl font-bold mb-2">{personalInfo.fullName || 'Your Name'}</h1>
        {targetJobTitle && <p className="text-emerald-100 font-medium">{targetJobTitle}</p>}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-emerald-100">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
        </div>
      </div>
      {summary && <div className="mb-6 break-inside-avoid mb-4"><h2 className="text-xl font-bold text-emerald-600 mb-2">About Me</h2><p className="text-sm leading-relaxed text-gray-700">{summary}</p></div>}
      {experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-emerald-600 mb-4">Experience</h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="elative pl-6 border-l-2 border-emerald-200 break-inside-avoid mb-4">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-emerald-500 rounded-full"></div>
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
      {education.length > 0 && <div className="mb-6"><h2 className="text-xl font-bold text-emerald-600 mb-3">Education</h2>{education.map((edu) => (<div key={edu.id} className="b-2 break-inside-avoid mb-4"><p className="font-bold text-gray-900">{edu.institution}</p><p className="text-sm text-gray-600">{edu.degree}{edu.field && ` in ${edu.field}`} • {edu.graduationDate}</p></div>))}</div>}
      {skills.length > 0 && <div><h2 className="text-xl font-bold text-emerald-600 mb-3">Skills</h2><div className="flex flex-wrap gap-2">{skills.map((skill) => (<span key={skill.id} className="text-sm bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-medium">{skill.name}</span>))}</div></div>}
    </div>
  );

  // Consultant Template
  const ConsultantTemplate = () => (
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
      {education.length > 0 && <div className="mb-6"><h2 className="text-lg font-serif font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">Education & Credentials</h2>{education.map((edu) => (<div key={edu.id} className="b-2 break-inside-avoid mb-4"><p className="font-bold text-gray-900">{edu.institution}</p><p className="text-sm text-gray-600">{edu.degree}{edu.field && ` in ${edu.field}`}</p></div>))}</div>}
      {skills.length > 0 && <div><h2 className="text-lg font-serif font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">Core Competencies</h2><div className="grid grid-cols-2 gap-2">{skills.map((skill) => (<div key={skill.id} className="flex items-center text-sm text-gray-700"><span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>{skill.name}</div>))}</div></div>}
    </div>
  );

  // Medical Template
  const MedicalTemplate = () => (
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
      {education.length > 0 && <div className="mb-6"><h2 className="text-lg font-bold text-cyan-700 mb-3 flex items-center"><span className="w-2 h-6 bg-cyan-500 mr-2 rounded"></span>Education & Training</h2>{education.map((edu) => (<div key={edu.id} className="b-3 border-l-4 border-cyan-200 pl-4 break-inside-avoid mb-4"><p className="font-bold text-gray-900">{edu.institution}</p><p className="text-sm text-gray-700">{edu.degree}{edu.field && ` in ${edu.field}`}</p><p className="text-xs text-gray-500">{edu.graduationDate}</p></div>))}</div>}
      {skills.length > 0 && <div><h2 className="text-lg font-bold text-cyan-700 mb-3 flex items-center"><span className="w-2 h-6 bg-cyan-500 mr-2 rounded"></span>Licenses & Skills</h2><div className="flex flex-wrap gap-2">{skills.map((skill) => (<span key={skill.id} className="text-sm bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full border border-cyan-200">{skill.name}</span>))}</div></div>}
    </div>
  );

  // Finance Template
  const FinanceTemplate = () => (
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

  return (
    <div className="bg-white shadow-sm">
      {template === 'classic' && <ClassicTemplate />}
      {template === 'modern' && <ModernTemplate />}
      {template === 'minimal' && <MinimalTemplate />}
      {template === 'creative' && <CreativeTemplate />}
      {template === 'executive' && <ExecutiveTemplate />}
      {template === 'technical' && <TechnicalTemplate />}
      {template === 'academic' && <AcademicTemplate />}
      {template === 'two-column' && <TwoColumnTemplate />}
      {template === 'startup' && <StartupTemplate />}
      {template === 'consultant' && <ConsultantTemplate />}
      {template === 'medical' && <MedicalTemplate />}
      {template === 'finance' && <FinanceTemplate />}
    </div>
  );
}
