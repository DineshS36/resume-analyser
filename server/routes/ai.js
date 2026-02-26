const express = require('express');
const router = express.Router();
const { generateBulletPoints, generateProfessionalSummary, analyzeResume, generateCoverLetter } = require('../services/geminiService');


// POST /api/generate-bullet
// Accepts raw text and target job title, returns 3 optimized bullet point options
router.post('/generate-bullet', async (req, res) => {
    try {
        const { rawInput, targetJobTitle } = req.body;
        
        if (!rawInput || !targetJobTitle) {
            return res.status(400).json({ 
                error: 'Missing required fields: rawInput and targetJobTitle' 
            });
        }
        
        const bullets = await generateBulletPoints(rawInput, targetJobTitle);
        
        res.json({
            success: true,
            bullets: bullets
        });
    } catch (error) {
        console.error('Generate bullet error:', error);
        res.status(500).json({ 
            error: 'Failed to generate bullet points',
            message: error.message 
        });
    }
});

// POST /api/generate-summary
// Accepts aggregated user data, returns professional summary
router.post('/generate-summary', async (req, res) => {
    try {
        const { experiences, skills, targetJobTitle } = req.body;
        
        if (!experiences || !Array.isArray(experiences) || experiences.length === 0) {
            return res.status(400).json({ 
                error: 'Missing or invalid experiences array' 
            });
        }
        
        if (!targetJobTitle) {
            return res.status(400).json({ 
                error: 'Missing required field: targetJobTitle' 
            });
        }
        
        const userData = {
            experiences,
            skills: skills || [],
            targetJobTitle
        };
        
        const summary = await generateProfessionalSummary(userData);
        
        res.json({
            success: true,
            summary: summary
        });
    } catch (error) {
        console.error('Generate summary error:', error);
        res.status(500).json({ 
            error: 'Failed to generate summary',
            message: error.message 
        });
    }
});

// POST /api/analyze-resume
// Accepts full resume data, returns AI analysis with scores and feedback
router.post('/analyze-resume', async (req, res) => {
    try {
        const { personalInfo, experiences, education, skills, targetJobTitle } = req.body;
        
        if (!personalInfo || !experiences || !Array.isArray(experiences)) {
            return res.status(400).json({ 
                error: 'Missing required fields: personalInfo and experiences array' 
            });
        }
        
        const resumeData = {
            personalInfo,
            experiences,
            education: education || [],
            skills: skills || [],
            targetJobTitle: targetJobTitle || 'Not specified'
        };
        
        const analysis = await analyzeResume(resumeData);
        
        res.json({
            success: true,
            analysis: analysis
        });
    } catch (error) {
        console.error('Analyze resume error:', error);
        res.status(500).json({ 
            error: 'Failed to analyze resume',
            message: error.message 
        });
    }
});

// POST /api/generate-cover-letter
// Accepts resume data and generates a personalized cover letter
router.post('/generate-cover-letter', async (req, res) => {
    try {
        const { personalInfo, targetJobTitle, summary, experiences, skills, tone } = req.body;
        
        if (!personalInfo || !targetJobTitle) {
            return res.status(400).json({ 
                error: 'Missing required fields: personalInfo and targetJobTitle' 
            });
        }
        
        const coverLetterData = {
            personalInfo,
            targetJobTitle,
            summary: summary || '',
            experiences: experiences || [],
            skills: skills || [],
            tone: tone || 'professional'
        };
        
        const coverLetter = await generateCoverLetter(coverLetterData);
        
        res.json({
            success: true,
            coverLetter: coverLetter
        });
    } catch (error) {
        console.error('Generate cover letter error:', error);
        res.status(500).json({ 
            error: 'Failed to generate cover letter',
            message: error.message 
        });
    }
});

module.exports = router;
