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

const ATS_MATCH_SYSTEM_PROMPT = `Compare the provided resume data against the job description. Extract hard technical skills, tools, and exact industry keywords. Identify which keywords are present in the resume and which are missing. Provide a strict, objective match score (0-100) based strictly on the ratio of matched vs. missing keywords.`;

const ENHANCE_BULLET_SYSTEM_PROMPT = `Act as an elite executive resume writer. Rewrite the provided bullet point to be highly professional, impactful, and metric-driven using the STAR method (Situation, Task, Action, Result). It MUST remain a single sentence. Do not use first-person pronouns (I, me). If 'keywords' are provided, naturally integrate as many of them as logically possible without sounding robotic.`;

const INTERVIEW_PREP_SYSTEM_PROMPT = `Act as an elite technical recruiter. Analyze the provided resume data and the target job description (if provided). Generate 5 highly specific, challenging interview questions the candidate is likely to face. For each question, provide a brief, strategic 'Tip' on how to answer it effectively using the STAR method.`;

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
const crypto = require('crypto');

const PARSE_PDF_SYSTEM_PROMPT = `You are a strict, robotic data extraction pipeline. YOU MUST OBEY THESE TWO RULES:
1. NO INTERNAL MONOLOGUE. Do not reason, debate, or think out loud. Never use words like 'Wait', 'Done', 'Let me check', or 'Perfect'. Output ONLY the final extracted text directly from the resume.
2. STRICT CLASSIFICATION: Use the 'Follow the Money' rule. If the resume indicates the user worked for a company, had a job title (e.g., Intern, Developer), or was employed by an organization, it MUST go into the 'experience' array. If the entry is an app, website, GitHub repository, or academic build created independently (like 'ChatUp' or 'Roasting AI'), it MUST go into the 'projects' array.

ADDITIONAL RULES:
3. Dates MUST be in 'MMM YYYY' format (e.g., 'Jan 2021', 'Dec 2019'). If the position is current, use 'Present' for the end date.
4. Do NOT hallucinate data. If a field (like LinkedIn, phone, or a specific date) is missing from the PDF, return an empty string ''.
5. The job title (role) and company name MUST be explicitly separated into their own fields. Never combine them.
6. The degree name and institution name MUST be explicitly separated into their own fields.
7. Extract ALL skills mentioned anywhere in the resume.
8. For the professional summary, extract the existing summary/objective verbatim. If none exists, return an empty string — do NOT generate one.`;

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
          id: crypto.randomUUID(),
          company: 'Sample Company',
          role: 'Software Engineer',
          location: 'New York, NY',
          startDate: 'Jan 2022',
          endDate: 'Present',
          description: [
            'Developed and maintained web applications using React and Node.js.',
            'Implemented RESTful APIs serving 10,000+ daily requests.',
            'Reduced page load time by 40% through performance optimizations.'
          ],
          aiOptimizedBullets: []
        }
      ],
      education: [
        {
          id: crypto.randomUUID(),
          degree: 'Bachelor of Science',
          institution: 'Sample University',
          field: 'Computer Science',
          graduationDate: '2021'
        }
      ],
      projects: [
        {
          id: crypto.randomUUID(),
          projectName: 'Sample Project',
          techStack: 'React, Node.js',
          link: 'https://github.com/johndoe/sample',
          description: ['Built a sample project to demonstrate skills.']
        }
      ],
      skills: [
        { id: crypto.randomUUID(), name: 'JavaScript' },
        { id: crypto.randomUUID(), name: 'React' },
        { id: crypto.randomUUID(), name: 'Node.js' },
        { id: crypto.randomUUID(), name: 'Python' },
        { id: crypto.randomUUID(), name: 'SQL' }
      ]
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
        temperature: 0.1,
        topK: 1,
        topP: 0.1,
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
                linkedin: { type: Type.STRING, description: 'LinkedIn profile URL. Empty string if not found.' },
                personalWebsite: { type: Type.STRING, description: 'Extract any portfolio, GitHub, or personal website URLs. Exclude LinkedIn.' },
                targetJobTitle: { type: Type.STRING, description: 'The most recent or prominent job title from the resume' },
                summary: { type: Type.STRING, description: 'Professional summary or objective from the resume. Empty string if none exists.' }
              },
              required: ['fullName', 'email', 'phone', 'location', 'linkedin', 'targetJobTitle', 'summary']
            },
            experience: {
              type: Type.ARRAY,
              description: 'Work experience entries, ordered from most recent to oldest',
              items: {
                type: Type.OBJECT,
                properties: {
                  company: { type: Type.STRING, description: 'Company or organization name only' },
                  role: { type: Type.STRING, description: 'Job title or role only — never combined with company name' },
                  location: { type: Type.STRING, description: 'Location of the job. Empty string if not listed.' },
                  startDate: { type: Type.STRING, description: 'Start date in MMM YYYY format (e.g., Jan 2021)' },
                  endDate: { type: Type.STRING, description: 'End date in MMM YYYY format, or "Present" if current' },
                  description: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: 'Exact sentences from the resume, split into array items.'
                  }
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
                  degree: { type: Type.STRING, description: 'Degree name only (e.g., Bachelor of Science) — not combined with field' },
                  institution: { type: Type.STRING, description: 'University or institution name' },
                  field: { type: Type.STRING, description: 'Field of study or major' },
                  graduationDate: { type: Type.STRING, description: 'Graduation year or date in MMM YYYY format' }
                },
                required: ['degree', 'institution', 'field', 'graduationDate']
              }
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  projectName: { type: Type.STRING },
                  techStack: { type: Type.STRING, description: "Extract the programming languages and tools used." },
                  link: { type: Type.STRING, description: "Extract any GitHub or live URL specific to this project." },
                  description: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: 'Exact sentences from the resume, split into array items.'
                  }
                }
              }
            },
            skills: {
              type: Type.ARRAY,
              description: 'All skills mentioned in the resume as individual strings',
              items: { type: Type.STRING }
            }
          },
          required: ['personalInfo', 'experience', 'education', 'projects', 'skills']
        }
      }
    });

    const parsed = JSON.parse(response.text);

    // ---------------------------------------------------------------------------
    // Normalise + inject React-ready UUIDs for every array item
    // ---------------------------------------------------------------------------
    return {
      personalInfo: {
        fullName: parsed.personalInfo?.fullName || '',
        email: parsed.personalInfo?.email || '',
        phone: parsed.personalInfo?.phone || '',
        location: parsed.personalInfo?.location || '',
        linkedin: parsed.personalInfo?.linkedin || '',
        personalWebsite: parsed.personalInfo?.personalWebsite || '',
        targetJobTitle: parsed.personalInfo?.targetJobTitle || '',
        summary: parsed.personalInfo?.summary || ''
      },
      experience: Array.isArray(parsed.experience) ? parsed.experience.map(exp => ({
        id: crypto.randomUUID(),
        company: exp.company || '',
        role: exp.role || '',
        location: exp.location || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        description: Array.isArray(exp.description) ? exp.description : (typeof exp.description === 'string' ? [exp.description] : []),
        aiOptimizedBullets: []
      })) : [],
      education: Array.isArray(parsed.education) ? parsed.education.map(edu => ({
        id: crypto.randomUUID(),
        degree: edu.degree || '',
        institution: edu.institution || '',
        field: edu.field || '',
        graduationDate: edu.graduationDate || ''
      })) : [],
      projects: (parsed.projects || []).map(proj => ({
        id: crypto.randomUUID(),
        ...proj
      })),
      skills: Array.isArray(parsed.skills) ? parsed.skills.map(skill => ({
        id: crypto.randomUUID(),
        name: typeof skill === 'string' ? skill : String(skill)
      })) : []
    };
  } catch (error) {
    console.error('Error parsing resume PDF:', error);
    throw new Error('Failed to parse resume PDF with AI. ' + error.message);
  }
}

// ---------------------------------------------------------------------------
// 5. Analyze ATS Match
// ---------------------------------------------------------------------------
async function analyzeATS(resumeData, jobDescription) {
  if (!ai) {
    return {
      matchScore: 65,
      matchedKeywords: ["React", "Node.js", "JavaScript"],
      missingKeywords: ["TypeScript", "AWS", "Docker"],
      recommendations: [
        "Include TypeScript in your skills section and mention it in project descriptions.",
        "Highlight any cloud experience with AWS.",
        "Add Docker to your list of tools."
      ]
    };
  }

  try {
    const prompt = `${ATS_MATCH_SYSTEM_PROMPT}\n\nJob Description:\n${jobDescription}\n\nResume Data:\n${JSON.stringify(resumeData, null, 2)}\n\nAnalyze the ATS match:`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        temperature: 0.1,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchScore: { type: Type.INTEGER, description: "ATS compatibility score from 0 to 100" },
            matchedKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Keywords found in both the JD and the resume" },
            missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Crucial keywords in the JD missing from the resume" },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Actionable 1-sentence tips to improve the resume for this specific JD" }
          },
          required: ["matchScore", "matchedKeywords", "missingKeywords", "recommendations"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error('Error analyzing ATS match:', error);
    throw new Error('Failed to analyze ATS match with AI. ' + error.message);
  }
}

// ---------------------------------------------------------------------------
// 6. Enhance Bullet Point Inline
// ---------------------------------------------------------------------------
async function enhanceBullet(originalText, keywords = []) {
  if (!ai) {
    return { enhancedBullet: "Enhanced sample bullet (API key missing)." };
  }

  try {
    const keywordText = keywords && keywords.length > 0 ? `Keywords to include if possible: ${keywords.join(', ')}\n` : '';
    const prompt = `${ENHANCE_BULLET_SYSTEM_PROMPT}\n\n${keywordText}Original Bullet: ${originalText}\n\nEnhanced Bullet:`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            enhancedBullet: { type: Type.STRING, description: "The single-sentence rewritten bullet point." }
          },
          required: ["enhancedBullet"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error('Error enhancing bullet point:', error);
    throw new Error('Failed to enhance bullet point. ' + error.message);
  }
}

// ---------------------------------------------------------------------------
// 8. Generate Interview Questions
// ---------------------------------------------------------------------------
async function generateInterviewQuestions(resumeData, jobDescription) {
  if (!ai) {
    return [
      { question: "Can you tell me about yourself and your background?", tip: "Use the Present-Past-Future formula to structure your answer." },
      { question: "Describe a time you faced a difficult challenge at work.", tip: "Use the STAR method: Situation, Task, Action, Result." },
      { question: "What are your biggest strengths and weaknesses?", tip: "Choose a real weakness and explain what you are doing to overcome it." },
      { question: "Why do you want to work for our company?", tip: "Show you have done your research about the company's recent projects or values." },
      { question: "Where do you see yourself in 5 years?", tip: "Align your goals with the role you are applying for." }
    ];
  }

  try {
    const prompt = `${INTERVIEW_PREP_SYSTEM_PROMPT}\n\nResume Data: ${JSON.stringify(resumeData)}\nTarget Job Description: ${jobDescription || 'Not provided'}\n\nGenerate 5 challenging interview questions:`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          description: "List of 5 highly specific interview questions and tips",
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING, description: "The specific interview question" },
              tip: { type: Type.STRING, description: "A strategic tip on how to answer using the STAR method" }
            },
            required: ["question", "tip"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error('Error generating interview questions:', error);
    throw new Error('Failed to generate interview questions. ' + error.message);
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
  analyzeATS,
  parseResumePDF,
  enhanceBullet,
  generateInterviewQuestions
};
