const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Apply the auth middleware to ALL resume routes
router.use(verifyToken);

// GET /api/resumes/me - Fetch the user's resume data
router.get('/me', async (req, res) => {
    try {
        const resume = await prisma.resume.findUnique({
            where: { userId: req.user.id }
        });
        
        if (resume && resume.data) {
            res.json(resume.data);
        } else {
            res.json({});
        }
    } catch (error) {
        console.error('Get resume error:', error);
        res.status(500).json({ error: 'Failed to fetch resume' });
    }
});

// PUT /api/resumes/save - Auto-save the complete resumeData object
router.put('/save', async (req, res) => {
    try {
        const resumeData = req.body;
        
        const resume = await prisma.resume.upsert({
            where: { userId: req.user.id },
            update: { data: resumeData },
            create: { userId: req.user.id, data: resumeData }
        });

        res.status(200).json({ success: true, message: 'Resume saved to cloud' });
    } catch (error) {
        console.error('Save resume error:', error);
        res.status(500).json({ error: 'Failed to auto-save resume' });
    }
});

module.exports = router;
