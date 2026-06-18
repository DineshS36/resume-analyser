'use client';

const PDFGenerator = {
  generate: async (resumeData) => {
    // Dynamically import html2pdf.js only on client side
    const html2pdf = (await import('html2pdf.js')).default;
    
    // Create a temporary container for the resume
    const container = document.createElement('div');

    container.style.width = '210mm'; // A4 width
    container.style.minHeight = '297mm'; // A4 height
    container.style.background = 'white';
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    document.body.appendChild(container);

    // Generate the resume HTML based on template
    container.innerHTML = generateResumeHTML(resumeData);

    // Configure PDF options
    const opt = {
      margin: 0,
      filename: `${resumeData.personalInfo.fullName || 'Resume'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
      },
    };

    try {
      // Generate PDF
      await html2pdf().set(opt).from(container).save();
    } finally {
      // Clean up
      document.body.removeChild(container);
    }
  },
};

function generateResumeHTML(data) {
  const { personalInfo, targetJobTitle, summary, experiences, education, skills, template } = data;

  const formatDate = (dateStr) => dateStr || '';

  // Classic Template HTML
  const classicTemplate = () => `
    <div style="font-family: 'Times New Roman', Georgia, serif; padding: 40px; color: #1a1a1a; line-height: 1.6;">
      <div style="text-align: center; border-bottom: 2px solid #1a1a1a; padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="font-size: 28px; font-weight: bold; margin: 0 0 8px 0; color: #1a1a1a;">
          ${personalInfo.fullName || 'Your Name'}
        </h1>
        ${targetJobTitle ? `<p style="font-size: 16px; color: #4a4a4a; margin: 0 0 8px 0;">${targetJobTitle}</p>` : ''}
        <div style="font-size: 12px; color: #4a4a4a;">
          ${[
            personalInfo.email,
            personalInfo.phone,
            personalInfo.location,
            personalInfo.linkedin,
            personalInfo.website,
          ].filter(Boolean).join(' • ')}
        </div>
      </div>

      ${summary ? `
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px;">
            Professional Summary
          </h2>
          <p style="font-size: 12px; line-height: 1.6; margin: 0;">${summary}</p>
        </div>
      ` : ''}

      ${experiences.length > 0 ? `
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px;">
            Work Experience
          </h2>
          <div style="display: flex; flex-direction: column; gap: 20px;">
            ${experiences.map(exp => `
              <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px;">
                  <div>
                    <h3 style="font-size: 13px; font-weight: bold; margin: 0; color: #1a1a1a;">${exp.role}</h3>
                    <p style="font-size: 12px; color: #4a4a4a; margin: 2px 0 0 0;">${exp.company}</p>
                  </div>
                  <div style="text-align: right; font-size: 11px; color: #666;">
                    ${exp.location ? `<p style="margin: 0;">${exp.location}</p>` : ''}
                    <p style="margin: 0;">${formatDate(exp.startDate)} - ${exp.endDate || 'Present'}</p>
                  </div>
                </div>
                ${exp.aiOptimizedBullets?.length > 0 ? `
                  <ul style="margin: 8px 0 0 0; padding-left: 20px; font-size: 11px; line-height: 1.5; color: #333;">
                    ${exp.aiOptimizedBullets.map(bullet => `<li>${bullet}</li>`).join('')}
                  </ul>
                ` : exp.description ? `
                  <p style="font-size: 11px; color: #333; margin: 8px 0 0 0;">${exp.description}</p>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${education.length > 0 ? `
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px;">
            Education
          </h2>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${education.map(edu => `
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                  <h3 style="font-size: 13px; font-weight: bold; margin: 0; color: #1a1a1a;">${edu.institution}</h3>
                  <p style="font-size: 12px; color: #4a4a4a; margin: 2px 0 0 0;">
                    ${edu.degree}${edu.field ? ` in ${edu.field}` : ''}
                  </p>
                </div>
                <p style="font-size: 11px; color: #666; margin: 0;">${edu.graduationDate}</p>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${skills.length > 0 ? `
        <div>
          <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px;">
            Skills
          </h2>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${skills.map(skill => `
              <span style="font-size: 11px; background: #f3f4f6; padding: 4px 8px; border-radius: 3px; color: #333;">
                ${skill.name}
              </span>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;

  // Modern Template HTML
  const modernTemplate = () => `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a1a; line-height: 1.6;">
      <div style="background: #2563eb; color: white; padding: 30px 40px; margin: -40px -40px 30px -40px;">
        <h1 style="font-size: 28px; font-weight: bold; margin: 0 0 8px 0;">
          ${personalInfo.fullName || 'Your Name'}
        </h1>
        ${targetJobTitle ? `<p style="font-size: 16px; color: #dbeafe; margin: 0 0 12px 0;">${targetJobTitle}</p>` : ''}
        <div style="font-size: 12px; color: #bfdbfe; display: flex; flex-wrap: wrap; gap: 8px;">
          ${[
            personalInfo.email,
            personalInfo.phone,
            personalInfo.location,
            personalInfo.linkedin,
            personalInfo.website,
          ].filter(Boolean).join(' • ')}
        </div>
      </div>

      ${summary ? `
        <div style="margin-bottom: 25px; padding: 0 40px;">
          <h2 style="font-size: 14px; font-weight: bold; color: #2563eb; margin-bottom: 10px; display: flex; align-items: center;">
            <span style="width: 4px; height: 20px; background: #2563eb; margin-right: 8px; border-radius: 2px;"></span>
            Professional Summary
          </h2>
          <p style="font-size: 12px; line-height: 1.6; color: #4a4a4a; margin: 0;">${summary}</p>
        </div>
      ` : ''}

      ${experiences.length > 0 ? `
        <div style="margin-bottom: 25px; padding: 0 40px;">
          <h2 style="font-size: 14px; font-weight: bold; color: #2563eb; margin-bottom: 15px; display: flex; align-items: center;">
            <span style="width: 4px; height: 20px; background: #2563eb; margin-right: 8px; border-radius: 2px;"></span>
            Work Experience
          </h2>
          <div style="display: flex; flex-direction: column; gap: 20px;">
            ${experiences.map(exp => `
              <div style="border-left: 3px solid #bfdbfe; padding-left: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px;">
                  <div>
                    <h3 style="font-size: 13px; font-weight: bold; margin: 0; color: #1a1a1a;">${exp.role}</h3>
                    <p style="font-size: 12px; color: #2563eb; font-weight: 500; margin: 2px 0 0 0;">${exp.company}</p>
                  </div>
                  <div style="text-align: right; font-size: 11px; color: #666;">
                    ${exp.location ? `<p style="margin: 0;">${exp.location}</p>` : ''}
                    <p style="margin: 0;">${formatDate(exp.startDate)} - ${exp.endDate || 'Present'}</p>
                  </div>
                </div>
                ${exp.aiOptimizedBullets?.length > 0 ? `
                  <ul style="margin: 8px 0 0 0; padding-left: 18px; font-size: 11px; line-height: 1.5; color: #4a4a4a;">
                    ${exp.aiOptimizedBullets.map(bullet => `<li>${bullet}</li>`).join('')}
                  </ul>
                ` : exp.description ? `
                  <p style="font-size: 11px; color: #4a4a4a; margin: 8px 0 0 0;">${exp.description}</p>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${education.length > 0 ? `
        <div style="margin-bottom: 25px; padding: 0 40px;">
          <h2 style="font-size: 14px; font-weight: bold; color: #2563eb; margin-bottom: 15px; display: flex; align-items: center;">
            <span style="width: 4px; height: 20px; background: #2563eb; margin-right: 8px; border-radius: 2px;"></span>
            Education
          </h2>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${education.map(edu => `
              <div style="border-left: 3px solid #bfdbfe; padding-left: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div>
                    <h3 style="font-size: 13px; font-weight: bold; margin: 0; color: #1a1a1a;">${edu.institution}</h3>
                    <p style="font-size: 12px; color: #4a4a4a; margin: 2px 0 0 0;">
                      ${edu.degree}${edu.field ? ` in ${edu.field}` : ''}
                    </p>
                  </div>
                  <p style="font-size: 11px; color: #666; margin: 0;">${edu.graduationDate}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${skills.length > 0 ? `
        <div style="padding: 0 40px 40px 40px;">
          <h2 style="font-size: 14px; font-weight: bold; color: #2563eb; margin-bottom: 10px; display: flex; align-items: center;">
            <span style="width: 4px; height: 20px; background: #2563eb; margin-right: 8px; border-radius: 2px;"></span>
            Skills
          </h2>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${skills.map(skill => `
              <span style="font-size: 11px; background: #dbeafe; color: #1e40af; padding: 5px 12px; border-radius: 20px;">
                ${skill.name}
              </span>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;

  // Minimal Template HTML
  const minimalTemplate = () => `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #1a1a1a; line-height: 1.6; max-width: 500px; margin: 0 auto;">
      <div style="margin-bottom: 30px;">
        <h1 style="font-size: 32px; font-weight: 300; margin: 0 0 8px 0; color: #1a1a1a;">
          ${personalInfo.fullName || 'Your Name'}
        </h1>
        ${targetJobTitle ? `<p style="font-size: 16px; color: #666; margin: 0 0 12px 0;">${targetJobTitle}</p>` : ''}
        <div style="font-size: 11px; color: #999; line-height: 1.8;">
          ${personalInfo.email ? `<p style="margin: 0;">${personalInfo.email}</p>` : ''}
          ${personalInfo.phone ? `<p style="margin: 0;">${personalInfo.phone}</p>` : ''}
          ${personalInfo.location ? `<p style="margin: 0;">${personalInfo.location}</p>` : ''}
          ${personalInfo.linkedin ? `<p style="margin: 0;">${personalInfo.linkedin}</p>` : ''}
          ${personalInfo.website ? `<p style="margin: 0;">${personalInfo.website}</p>` : ''}
        </div>
      </div>

      ${summary ? `
        <div style="margin-bottom: 30px;">
          <p style="font-size: 12px; line-height: 1.7; color: #666; font-style: italic; margin: 0;">${summary}</p>
        </div>
      ` : ''}

      ${experiences.length > 0 ? `
        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 10px; font-weight: bold; color: #999; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px;">
            Experience
          </h2>
          <div style="display: flex; flex-direction: column; gap: 20px;">
            ${experiences.map(exp => `
              <div>
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 3px;">
                  <h3 style="font-size: 13px; font-weight: 500; margin: 0; color: #1a1a1a;">${exp.role}</h3>
                  <p style="font-size: 10px; color: #999; margin: 0;">
                    ${formatDate(exp.startDate)} - ${exp.endDate || 'Present'}
                  </p>
                </div>
                <p style="font-size: 12px; color: #666; margin: 0 0 8px 0;">${exp.company}</p>
                ${exp.aiOptimizedBullets?.length > 0 ? `
                  <ul style="margin: 0; padding-left: 18px; font-size: 11px; line-height: 1.6; color: #666;">
                    ${exp.aiOptimizedBullets.map(bullet => `<li>${bullet}</li>`).join('')}
                  </ul>
                ` : exp.description ? `
                  <p style="font-size: 11px; color: #666; margin: 0;">${exp.description}</p>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${education.length > 0 ? `
        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 10px; font-weight: bold; color: #999; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px;">
            Education
          </h2>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${education.map(edu => `
              <div>
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                  <h3 style="font-size: 13px; font-weight: 500; margin: 0; color: #1a1a1a;">${edu.institution}</h3>
                  <p style="font-size: 10px; color: #999; margin: 0;">${edu.graduationDate}</p>
                </div>
                <p style="font-size: 12px; color: #666; margin: 0;">
                  ${edu.degree}${edu.field ? ` in ${edu.field}` : ''}
                </p>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${skills.length > 0 ? `
        <div>
          <h2 style="font-size: 10px; font-weight: bold; color: #999; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">
            Skills
          </h2>
          <p style="font-size: 12px; color: #666; margin: 0; line-height: 1.8;">
            ${skills.map(s => s.name).join(' • ')}
          </p>
        </div>
      ` : ''}
    </div>
  `;

  switch (template) {
    case 'modern':
      return modernTemplate();
    case 'minimal':
      return minimalTemplate();
    case 'classic':
    default:
      return classicTemplate();
  }
}

export default PDFGenerator;
