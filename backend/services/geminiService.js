const { GoogleGenAI, Type } = require('@google/genai');

// ---------------------------------------------------------------------------
// Initialise the new Google GenAI client
// ---------------------------------------------------------------------------
let ai = null;

if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

const MODEL = 'gemini-2.0-flash-lite';

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
// Exports
// ---------------------------------------------------------------------------
module.exports = {
  generateBulletPoints,
  generateProfessionalSummary,
  analyzeResume,
  generateCoverLetter
};
