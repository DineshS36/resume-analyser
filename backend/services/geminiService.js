const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;

if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

const BULLET_SYSTEM_PROMPT = `You are an expert executive resume writer. Your goal is to take the user's raw job description and rewrite it into three distinct, highly professional bullet points. Use strong action verbs, emphasize quantifiable metrics, and ensure the tone is objective and ATS-friendly. Do not use buzzwords. Return only the three bullet points in a JSON array format like: ["bullet 1", "bullet 2", "bullet 3"]`;

const SUMMARY_SYSTEM_PROMPT = `You are an expert executive resume writer. Create a compelling 3-4 sentence professional summary based on the user's experience, skills, and target job title. Focus on key achievements, years of experience, and core competencies. Make it ATS-friendly with relevant keywords. Return only the summary text without any additional formatting or explanations.`;

const ANALYZE_SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) specialist and professional resume reviewer. Analyze the provided resume data and return a detailed analysis in JSON format.

Evaluate the resume on these criteria:
1. ATS_SCORE (0-100): How well the resume will perform with ATS systems
   - Check for standard section headers (Experience, Education, Skills)
   - Look for relevant keywords based on target job title
   - Avoid graphics, tables, or unusual formatting
   - Use standard fonts and clear structure

2. CONTENT_SCORE (0-100): Quality of the content
   - Action verbs at start of bullet points
   - Quantifiable metrics and results (%, $, numbers)
   - Specific achievements vs generic descriptions
   - Professional tone and clarity

3. COMPLETENESS_SCORE (0-100): How complete the resume is
   - All required sections filled (personal info, experience, education, skills)
   - Contact information present
   - Professional summary quality
   - No empty or placeholder fields

4. OVERALL_SCORE (0-100): Weighted average of above scores

Return ONLY a JSON object in this exact format:
{
  "overallScore": number,
  "atsScore": number,
  "contentScore": number,
  "completenessScore": number,
  "feedback": {
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "improvements": ["improvement 1", "improvement 2", "improvement 3"],
    "atsTips": ["tip 1", "tip 2"],
    "contentTips": ["tip 1", "tip 2"]
  }
}`;


async function generateBulletPoints(rawInput, targetJobTitle) {
    if (!genAI) {
        return [
            "This is a sample bullet point. Please set up your Gemini API key in .env file to use AI enhancement.",
            "Another sample bullet point showing what AI can do.",
            "A third sample bullet point to demonstrate format."
        ];
    }
    
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        const prompt = `${BULLET_SYSTEM_PROMPT}\n\nTarget Job Title: ${targetJobTitle}\nRaw Job Description: ${rawInput}\n\nGenerate 3 professional bullet points:`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Parse JSON array from response
        try {
            const bullets = JSON.parse(text);
            return bullets;
        } catch (parseError) {
            // If JSON parsing fails, extract bullet points manually
            const lines = text.split('\n').filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'));
            return lines.length > 0 ? lines.map(l => l.replace(/^[-•]\s*/, '').trim()) : [text.trim()];
        }
    } catch (error) {
        console.error('Error generating bullet points:', error);
        return [
            "This is a sample bullet point. Please check your API key configuration.",
            "Another sample bullet point.",
            "A third sample bullet point."
        ];
    }
}

async function generateProfessionalSummary(userData) {
    if (!genAI) {
        return "This is a sample professional summary. Please set up your Gemini API key in .env file to use AI enhancement. With AI, you can create compelling summaries tailored to your target role.";
    }
    
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        const { experiences, skills, targetJobTitle } = userData;
        
        const experienceText = experiences.map(exp => 
            `${exp.role} at ${exp.company}: ${exp.description}`
        ).join('\n');
        
        const skillsText = skills.join(', ');
        
        const prompt = `${SUMMARY_SYSTEM_PROMPT}\n\nTarget Job Title: ${targetJobTitle}\n\nWork Experience:\n${experienceText}\n\nSkills: ${skillsText}\n\nProfessional Summary:`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error('Error generating summary:', error);
        return "This is a sample professional summary. Please check your API key configuration. With AI, you can create compelling summaries tailored to your target role.";
    }
}

async function analyzeResume(resumeData) {
    if (!genAI) {
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
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
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
  Year: ${edu.year || 'Not specified'}
`).join('\n') || 'No education listed'}

Skills: ${skills?.join(', ') || 'No skills listed'}
`;
        
        const prompt = `${ANALYZE_SYSTEM_PROMPT}\n\nResume Data:\n${resumeText}\n\nProvide analysis in JSON format:`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Extract JSON from response
        try {
            // Find JSON object in the response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const analysis = JSON.parse(jsonMatch[0]);
                return {
                    overallScore: analysis.overallScore || 70,
                    atsScore: analysis.atsScore || 70,
                    contentScore: analysis.contentScore || 70,
                    completenessScore: analysis.completenessScore || 70,
                    feedback: {
                        strengths: analysis.feedback?.strengths || [],
                        improvements: analysis.feedback?.improvements || [],
                        atsTips: analysis.feedback?.atsTips || [],
                        contentTips: analysis.feedback?.contentTips || []
                    }
                };
            }
        } catch (parseError) {
            console.error('Error parsing AI analysis:', parseError);
        }
        
        // Return default analysis if parsing fails
        return {
            overallScore: 70,
            atsScore: 70,
            contentScore: 70,
            completenessScore: 70,
            feedback: {
                strengths: ["Resume has basic structure in place"],
                improvements: ["Consider adding more specific achievements", "Include industry keywords"],
                atsTips: ["Use standard formatting", "Avoid graphics and tables"],
                contentTips: ["Add quantifiable results", "Use action verbs"]
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

async function generateCoverLetter(coverLetterData) {
    if (!genAI) {
        return `Dear Hiring Manager,

I am writing to express my strong interest in the ${coverLetterData.targetJobTitle} position at your company.

(Note: Please set up your Gemini API key in .env file.)`;
    }
    
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const { personalInfo, targetJobTitle } = coverLetterData;
        const prompt = `Write a professional cover letter for ${targetJobTitle} position. Candidate: ${personalInfo?.fullName || 'Not provided'}`;
        const result = await model.generateContent(prompt);
        return result.response.text().trim();
    } catch (error) {
        console.error('Error generating cover letter:', error);
        return `Error generating cover letter. Please check API key.`;
    }
}
module.exports = {
    generateBulletPoints,
    generateProfessionalSummary,
    analyzeResume,
    generateCoverLetter
};

