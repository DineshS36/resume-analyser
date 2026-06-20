const express = require('express');
const router = express.Router();
const multer = require('multer');
const verifyToken = require('../middleware/auth');
const { generateBulletPoints, generateProfessionalSummary, analyzeResume, generateCoverLetter, analyzeATS, parseResumePDF, enhanceBullet } = require('../services/geminiService');
const rateLimit = require('express-rate-limit');

// Implement strict AI rate limiting
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 AI requests per window
  message: { error: "Too many AI requests. Please try again later." }
});

// Configure multer for in-memory file uploads (no disk writes)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'), false);
  }
});

// POST /api/generate-bullet
// Accepts raw text and target job title, returns 3 optimized bullet point options
router.post('/generate-bullet', verifyToken, aiLimiter, async (req, res) => {
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

// POST /api/enhance-bullet
// Enhances a single bullet point using the STAR method
router.post('/enhance-bullet', verifyToken, aiLimiter, async (req, res) => {
    try {
        const { originalText, keywords } = req.body;
        
        if (!originalText) {
            return res.status(400).json({ 
                error: 'Missing required field: originalText' 
            });
        }
        
        const result = await enhanceBullet(originalText, keywords);
        
        res.json({
            success: true,
            enhancedBullet: result.enhancedBullet
        });
    } catch (error) {
        console.error('Enhance bullet error:', error);
        res.status(500).json({ 
            error: 'Failed to enhance bullet point',
            message: error.message 
        });
    }
});

// POST /api/generate-summary
// Accepts aggregated user data, returns professional summary
router.post('/generate-summary', verifyToken, aiLimiter, async (req, res) => {
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
router.post('/analyze-resume', verifyToken, aiLimiter, async (req, res) => {
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

// POST /analyze-ats
// Accepts full resume data and a job description, returns ATS match analysis
router.post('/analyze-ats', verifyToken, aiLimiter, async (req, res) => {
    try {
        const { resumeData, jobDescription } = req.body;
        
        if (!resumeData || !jobDescription) {
            return res.status(400).json({ 
                error: 'Missing required fields: resumeData and jobDescription' 
            });
        }
        
        const analysis = await analyzeATS(resumeData, jobDescription);
        
        res.json({
            success: true,
            analysis: analysis
        });
    } catch (error) {
        console.error('Analyze ATS error:', error);
        res.status(500).json({ 
            error: 'Failed to analyze ATS match',
            message: error.message 
        });
    }
});

// POST /api/generate-cover-letter
// Accepts resume data and generates a personalized cover letter
router.post('/generate-cover-letter', verifyToken, aiLimiter, async (req, res) => {
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

// POST /api/parse-pdf
// Accepts a PDF file upload, parses it with Gemini AI, and returns structured resume data
router.post('/parse-pdf', verifyToken, aiLimiter, upload.single('resume'), async (req, res) => {
    try {
        // Validate file was uploaded
        if (!req.file) {
            return res.status(400).json({
                error: 'No file uploaded. Please select a PDF file.'
            });
        }

        // Validate file type (double-check — multer fileFilter already handles this)
        if (req.file.mimetype !== 'application/pdf') {
            return res.status(400).json({
                error: 'Invalid file type. Only PDF files are accepted.'
            });
        }

        // Convert the in-memory buffer to base64 for the Gemini API
        const base64Data = req.file.buffer.toString('base64');

        // Call Gemini to parse the resume
        const parsedResume = await parseResumePDF(base64Data);

        res.json({
            success: true,
            data: parsedResume
        });
    } catch (error) {
        console.error('Parse PDF error:', error);

        // Handle multer-specific errors
        if (error instanceof multer.MulterError) {
            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    error: 'File too large. Maximum size is 5 MB.'
                });
            }
            return res.status(400).json({
                error: `Upload error: ${error.message}`
            });
        }

        res.status(500).json({
            error: 'Failed to parse resume PDF',
            message: error.message
        });
    }
});

module.exports = router;
