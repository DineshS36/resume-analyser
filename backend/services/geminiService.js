const { GoogleGenAI, Type } = require('@google/genai');

// ---------------------------------------------------------------------------
// Initialise the new Google GenAI client
// ---------------------------------------------------------------------------
let ai = null;

if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

const MODEL = 'gemini-3.1-flash-lite';

// ---------------------------------------------------------------------------
// System Prompts
// ---------------------------------------------------------------------------
const BULLET_SYSTEM_PROMPT = `You are an expert executive resume writer. Your goal is to take the user's raw job description and rewrite it into three distinct, highly professional bullet points. Use strong action verbs, emphasize quantifiable metrics, and ensure the tone is objective and ATS-friendly. Do not use buzzwords.`;

const SUMMARY_SYSTEM_PROMPT = `You are an expert executive resume writer. Create a compelling 3-4 sentence professional summary based on the user's experience, skills, and target job title. Focus on key achievements, years of experience, and core competencies. Make it ATS-friendly with relevant keywords. Return only the summary text without any additional formatting or explanations.`;

const ANALYZE_SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) specialist and professional resume reviewer. Analyze the provided resume data and return a detailed analysis.

Evaluate the resume on these criteria:
1. ATS_SCORE (0-100): How well the resume will perform with ATS systems
2. CONTENT_SCORE (0-100): Quality of the content (action verbs, metrics, achievements)
3. COMPLETENESS_SCORE (0-100): How complete the resume is (all sections filled, contact info present)
4. OVERALL_SCORE (0-100): Weighted average of above scores`;

const COVER_LETTER_SYSTEM_PROMPT = `You are a professional cover letter writer. Write a compelling, personalised cover letter. Keep it to 3-4 paragraphs. Use a professional but engaging tone. Do not include placeholder brackets — fill in real information from the provided data.`;

// ---------------------------------------------------------------------------
// 1. Generate Bullet Points  (Structured Output — JSON array of 3 strings)
// ---------------------------------------------------------------------------
async function generateBulletPoints(rawInput, targetJobTitle) {
  if (!ai) {
    return [
      "This is a sample bullet point. Please set up your Gemini API key in .env file to use AI enhancement.",
      "Another sample bullet point showing what AI can do.",
      "A third sample bullet point to demonstrate format."
    ];
  }

  try {
    const prompt = `${BULLET_SYSTEM_PROMPT}\n\nTarget Job Title: ${targetJobTitle}\nRaw Job Description: ${rawInput}\n\nGenerate 3 professional bullet points:`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bullets: {
              type: Type.ARRAY,
              description: 'Exactly 3 professional resume bullet points',
              items: { type: Type.STRING }
            }
          },
          required: ['bullets']
        }
      }
    });

    const parsed = JSON.parse(response.text);
    return parsed.bullets;
  } catch (error) {
    console.error('Error generating bullet points:', error);
    return [
      "This is a sample bullet point. Please check your API key configuration.",
      "Another sample bullet point.",
      "A third sample bullet point."
    ];
  }
}

// ---------------------------------------------------------------------------
// 2. Generate Professional Summary  (plain text response)
// ---------------------------------------------------------------------------
async function generateProfessionalSummary(userData) {
  if (!ai) {
    return "This is a sample professional summary. Please set up your Gemini API key in .env file to use AI enhancement. With AI, you can create compelling summaries tailored to your target role.";
  }

  try {
    const { experiences, skills, targetJobTitle } = userData;

    const experienceText = experiences.map(exp =>
      `${exp.role} at ${exp.company}: ${exp.description}`
    ).join('\n');

    const skillsText = Array.isArray(skills)
      ? skills.map(s => (typeof s === 'string' ? s : s.name)).join(', ')
      : '';

    const prompt = `${SUMMARY_SYSTEM_PROMPT}\n\nTarget Job Title: ${targetJobTitle}\n\nWork Experience:\n${experienceText}\n\nSkills: ${skillsText}\n\nProfessional Summary:`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error('Error generating summary:', error);
    return "This is a sample professional summary. Please check your API key configuration. With AI, you can create compelling summaries tailored to your target role.";
  }
}

// ---------------------------------------------------------------------------
// 3. Analyze Resume  (Structured Output with responseSchema)
// ---------------------------------------------------------------------------
async function analyzeResume(resumeData) {
  if (!ai) {
    return {
      overallScore: 75,
      atsScore: 70,
      contentScore: 75,
      completenessScore: 80,
      feedback: {
        strengths: [
          "Resume structure follows standard format",
          "Contact information is complete",
          "Professional summary is present"
        ],
        improvements: [
          "Add more quantifiable achievements with numbers/metrics",
          "Include more industry-specific keywords",
          "Expand on key responsibilities with action verbs"
        ],
        atsTips: [
          "Use standard section headers like 'Experience' and 'Education'",
          "Avoid tables, graphics, or unusual formatting"
        ],
        contentTips: [
          "Start bullet points with strong action verbs",
          "Include specific metrics (%, $, timeframes)"
        ]
      }
    };
  }

  try {
    const { personalInfo, experiences, education, skills, targetJobTitle } = resumeData;

    const resumeText = `
Target Job Title: ${targetJobTitle || 'Not specified'}
Name: ${personalInfo?.fullName || 'Not provided'}
Email: ${personalInfo?.email || 'Not provided'}
Phone: ${personalInfo?.phone || 'Not provided'}
Location: ${personalInfo?.location || 'Not provided'}
LinkedIn: ${personalInfo?.linkedin || 'Not provided'}
Summary: ${personalInfo?.summary || 'Not provided'}

Work Experience:
${experiences?.map(exp => `
- Role: ${exp.role || 'Not specified'}
  Company: ${exp.company || 'Not specified'}
  Duration: ${exp.startDate || 'N/A'} to ${exp.endDate || 'Present'}
  Description: ${exp.description || 'Not provided'}
`).join('\n') || 'No experience listed'}

Education:
${education?.map(edu => `
- Degree: ${edu.degree || 'Not specified'}
  Institution: ${edu.institution || 'Not specified'}
  Year: ${edu.year || edu.graduationDate || 'Not specified'}
`).join('\n') || 'No education listed'}

Skills: ${skills?.map(s => (typeof s === 'string' ? s : s.name)).join(', ') || 'No skills listed'}
`;

    const prompt = `${ANALYZE_SYSTEM_PROMPT}\n\nResume Data:\n${resumeText}\n\nProvide a thorough analysis:`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: {
              type: Type.INTEGER,
              description: 'Weighted overall resume score out of 100'
            },
            atsScore: {
              type: Type.INTEGER,
              description: 'ATS compatibility score out of 100'
            },
            contentScore: {
              type: Type.INTEGER,
              description: 'Content quality score out of 100'
            },
            completenessScore: {
              type: Type.INTEGER,
              description: 'Resume completeness score out of 100'
            },
            feedback: {
              type: Type.OBJECT,
              properties: {
                strengths: {
                  type: Type.ARRAY,
                  description: 'List of resume strengths (2-4 items)',
                  items: { type: Type.STRING }
                },
                improvements: {
                  type: Type.ARRAY,
                  description: 'List of suggested improvements (2-4 items)',
                  items: { type: Type.STRING }
                },
                atsTips: {
                  type: Type.ARRAY,
                  description: 'ATS-specific optimization tips (2-3 items)',
                  items: { type: Type.STRING }
                },
                contentTips: {
                  type: Type.ARRAY,
                  description: 'Content improvement tips (2-3 items)',
                  items: { type: Type.STRING }
                }
              },
              required: ['strengths', 'improvements', 'atsTips', 'contentTips']
            }
          },
          required: ['overallScore', 'atsScore', 'contentScore', 'completenessScore', 'feedback']
        }
      }
    });

    const analysis = JSON.parse(response.text);

    // Ensure the shape matches what the frontend expects
    return {
      overallScore: analysis.overallScore ?? 70,
      atsScore: analysis.atsScore ?? 70,
      contentScore: analysis.contentScore ?? 70,
      completenessScore: analysis.completenessScore ?? 70,
      feedback: {
        strengths: analysis.feedback?.strengths || [],
        improvements: analysis.feedback?.improvements || [],
        atsTips: analysis.feedback?.atsTips || [],
        contentTips: analysis.feedback?.contentTips || []
      }
    };
  } catch (error) {
    console.error('Error analyzing resume:', error);
    return {
      overallScore: 70,
      atsScore: 70,
      contentScore: 70,
      completenessScore: 70,
      feedback: {
        strengths: ["Resume structure is present"],
        improvements: ["Please check your API key configuration"],
        atsTips: ["Use standard section headers"],
        contentTips: ["Add specific metrics and achievements"]
      }
    };
  }
}

// ---------------------------------------------------------------------------
// 4. Generate Cover Letter  (plain text response)
// ---------------------------------------------------------------------------
async function generateCoverLetter(coverLetterData) {
  if (!ai) {
    return `Dear Hiring Manager,

I am writing to express my strong interest in the ${coverLetterData.targetJobTitle} position at your company.

(Note: Please set up your Gemini API key in .env file.)`;
  }

  try {
    const { personalInfo, targetJobTitle, summary, experiences, skills, tone } = coverLetterData;

    const experienceText = experiences?.map(exp =>
      `${exp.role} at ${exp.company}: ${exp.description || ''}`
    ).join('\n') || 'No experience provided';

    const skillsText = Array.isArray(skills)
      ? skills.map(s => (typeof s === 'string' ? s : s.name)).join(', ')
      : '';

    const prompt = `${COVER_LETTER_SYSTEM_PROMPT}

Tone: ${tone || 'professional'}
Candidate Name: ${personalInfo?.fullName || 'Not provided'}
Target Position: ${targetJobTitle}
Professional Summary: ${summary || 'Not provided'}

Work Experience:
${experienceText}

Skills: ${skillsText}

Write a cover letter for this candidate applying to the ${targetJobTitle} position:`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return `Error generating cover letter. Please check API key.`;
  }
}

// ---------------------------------------------------------------------------
// 5. Parse Resume PDF  (Multimodal — inlineData + Structured Output)
// ---------------------------------------------------------------------------
const PARSE_PDF_SYSTEM_PROMPT = `You are an expert resume parser. You will receive a PDF resume. Extract ALL information from it and return structured JSON. Be thorough — capture every detail including full name, contact info, work experiences, education, and skills. For dates, use the format as written in the resume (e.g., "Jan 2020", "2020-01", "January 2020"). If a field is not found in the resume, return an empty string or empty array as appropriate.`;

async function parseResumePDF(base64Data) {
  if (!ai) {
    return {
      personalInfo: {
        fullName: 'John Doe (Sample)',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, NY',
        linkedin: 'https://linkedin.com/in/johndoe',
        targetJobTitle: 'Software Engineer',
        summary: 'This is a sample parsed resume. Please set up your Gemini API key in the .env file to use real AI parsing.'
      },
      experience: [
        {
          company: 'Sample Company',
          role: 'Software Engineer',
          location: 'New York, NY',
          startDate: 'Jan 2022',
          endDate: 'Present',
          description: 'Developed and maintained web applications using React and Node.js.'
        }
      ],
      education: [
        {
          degree: 'Bachelor of Science in Computer Science',
          institution: 'Sample University',
          year: '2021',
          field: 'Computer Science'
        }
      ],
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL']
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            { text: PARSE_PDF_SYSTEM_PROMPT + '\n\nParse this resume PDF and extract all information:' },
            {
              inlineData: {
                mimeType: 'application/pdf',
                data: base64Data
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personalInfo: {
              type: Type.OBJECT,
              description: 'Personal and contact information extracted from the resume',
              properties: {
                fullName: { type: Type.STRING, description: 'Full name of the candidate' },
                email: { type: Type.STRING, description: 'Email address' },
                phone: { type: Type.STRING, description: 'Phone number' },
                location: { type: Type.STRING, description: 'City, State or full address' },
                linkedin: { type: Type.STRING, description: 'LinkedIn profile URL' },
                targetJobTitle: { type: Type.STRING, description: 'Current or most recent job title, or the title from the resume header' },
                summary: { type: Type.STRING, description: 'Professional summary or objective statement from the resume' }
              },
              required: ['fullName', 'email', 'phone', 'location', 'linkedin', 'targetJobTitle', 'summary']
            },
            experience: {
              type: Type.ARRAY,
              description: 'Work experience entries',
              items: {
                type: Type.OBJECT,
                properties: {
                  company: { type: Type.STRING, description: 'Company or organization name' },
                  role: { type: Type.STRING, description: 'Job title or role' },
                  location: { type: Type.STRING, description: 'Location of the job' },
                  startDate: { type: Type.STRING, description: 'Start date as written on the resume' },
                  endDate: { type: Type.STRING, description: 'End date as written, or "Present" if current' },
                  description: { type: Type.STRING, description: 'Full description including all bullet points, joined as a single text block' }
                },
                required: ['company', 'role', 'location', 'startDate', 'endDate', 'description']
              }
            },
            education: {
              type: Type.ARRAY,
              description: 'Education entries',
              items: {
                type: Type.OBJECT,
                properties: {
                  degree: { type: Type.STRING, description: 'Degree name (e.g., Bachelor of Science)' },
                  institution: { type: Type.STRING, description: 'University or institution name' },
                  year: { type: Type.STRING, description: 'Graduation year or date range' },
                  field: { type: Type.STRING, description: 'Field of study or major' }
                },
                required: ['degree', 'institution', 'year', 'field']
              }
            },
            skills: {
              type: Type.ARRAY,
              description: 'List of skills extracted from the resume',
              items: { type: Type.STRING }
            }
          },
          required: ['personalInfo', 'experience', 'education', 'skills']
        }
      }
    });

    const parsed = JSON.parse(response.text);

    // Normalise — ensure every expected field exists
    return {
      personalInfo: {
        fullName: parsed.personalInfo?.fullName || '',
        email: parsed.personalInfo?.email || '',
        phone: parsed.personalInfo?.phone || '',
        location: parsed.personalInfo?.location || '',
        linkedin: parsed.personalInfo?.linkedin || '',
        targetJobTitle: parsed.personalInfo?.targetJobTitle || '',
        summary: parsed.personalInfo?.summary || ''
      },
      experience: Array.isArray(parsed.experience) ? parsed.experience.map(exp => ({
        company: exp.company || '',
        role: exp.role || '',
        location: exp.location || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        description: exp.description || ''
      })) : [],
      education: Array.isArray(parsed.education) ? parsed.education.map(edu => ({
        degree: edu.degree || '',
        institution: edu.institution || '',
        year: edu.year || '',
        field: edu.field || ''
      })) : [],
      skills: Array.isArray(parsed.skills) ? parsed.skills : []
    };
  } catch (error) {
    console.error('Error parsing resume PDF:', error);
    throw new Error('Failed to parse resume PDF with AI. ' + error.message);
  }
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------
module.exports = {
  generateBulletPoints,
  generateProfessionalSummary,
  analyzeResume,
  generateCoverLetter,
  parseResumePDF
};

