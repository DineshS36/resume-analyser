const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Apply the auth middleware to ALL resume routes
router.use(verifyToken);

// PUT /api/resumes/save - Auto-save the complete resumeData object
router.put('/save', async (req, res) => {
    try {
        const resumeData = req.body;
        
        // Find existing resume for this user or create a new one
        const existingResume = await prisma.resume.findFirst({
            where: { userId: req.user.id },
            orderBy: { updatedAt: 'desc' }
        });

        if (existingResume) {
            await prisma.resume.update({
                where: { id: existingResume.id },
                data: {
                    title: resumeData.targetJobTitle || 'My Resume',
                    summary: resumeData.summary || null,
                    templateId: resumeData.template || 'classic',
                    data: resumeData
                }
            });
        } else {
            await prisma.resume.create({
                data: {
                    userId: req.user.id,
                    title: resumeData.targetJobTitle || 'My Resume',
                    summary: resumeData.summary || null,
                    templateId: resumeData.template || 'classic',
                    data: resumeData
                }
            });
        }

        res.status(200).json({ success: true, message: 'Resume saved to cloud' });
    } catch (error) {
        console.error('Save resume error:', error);
        res.status(500).json({ error: 'Failed to auto-save resume' });
    }
});

// GET /api/resumes - Get all resumes for the authenticated user
router.get('/', async (req, res) => {
    try {
        // We get the user ID from the verified token, NOT from the client request
        const resumes = await prisma.resume.findMany({
            where: { userId: req.user.id },
            include: {
                experiences: true,
                educations: true,
                skills: true
            },
            orderBy: { updatedAt: 'desc' }
        });

        res.json({ success: true, resumes });
    } catch (error) {
        console.error('Get resumes error:', error);
        res.status(500).json({ error: 'Failed to fetch resumes' });
    }
});

// GET /api/resumes/:id - Get single resume (with ownership check)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const resume = await prisma.resume.findUnique({
            where: { id },
            include: {
                experiences: true,
                educations: true,
                skills: true,
                user: {
                    select: { email: true, fullName: true }
                }
            }
        });

        if (!resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }

        // Verify ownership — prevent IDOR
        if (resume.userId !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to access this resume' });
        }

        res.json({ success: true, resume });
    } catch (error) {
        console.error('Get resume error:', error);
        res.status(500).json({ error: 'Failed to fetch resume' });
    }
});

// POST /api/resumes - Create new resume
router.post('/', async (req, res) => {
    try {
        const { title, templateId = 'classic' } = req.body;

        if (!title) {
            return res.status(400).json({
                error: 'Missing required field: title'
            });
        }

        // userId comes exclusively from the token
        const resume = await prisma.resume.create({
            data: {
                userId: req.user.id,
                title,
                templateId
            },
            include: {
                experiences: true,
                educations: true,
                skills: true
            }
        });

        res.status(201).json({ success: true, resume });
    } catch (error) {
        console.error('Create resume error:', error);
        res.status(500).json({ error: 'Failed to create resume' });
    }
});

// PUT /api/resumes/:id - Update resume
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, summary, templateId } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        // Verify ownership first
        const existingResume = await prisma.resume.findUnique({
            where: { id }
        });

        if (!existingResume || existingResume.userId !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to modify this resume' });
        }

        const resume = await prisma.resume.update({
            where: { id },
            data: {
                title,
                summary,
                templateId
            },
            include: {
                experiences: true,
                educations: true,
                skills: true
            }
        });

        res.json({ success: true, resume });
    } catch (error) {
        console.error('Update resume error:', error);
        res.status(500).json({ error: 'Failed to update resume' });
    }
});

// DELETE /api/resumes/:id - Delete resume
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Verify ownership first
        const existingResume = await prisma.resume.findUnique({
            where: { id }
        });

        if (!existingResume || existingResume.userId !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to delete this resume' });
        }

        await prisma.resume.delete({
            where: { id }
        });

        res.json({ success: true, message: 'Resume deleted successfully' });
    } catch (error) {
        console.error('Delete resume error:', error);
        res.status(500).json({ error: 'Failed to delete resume' });
    }
});

// POST /api/resumes/:id/experiences - Add experience
router.post('/:id/experiences', async (req, res) => {
    try {
        const { id } = req.params;
        const { company, role, location, startDate, endDate, description } = req.body;

        if (!company || !role || !startDate) {
            return res.status(400).json({
                error: 'Missing required fields: company, role, and startDate'
            });
        }

        // Verify resume ownership
        const resume = await prisma.resume.findUnique({ where: { id } });
        if (!resume || resume.userId !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const experience = await prisma.experience.create({
            data: {
                resumeId: id,
                company,
                role,
                location,
                startDate,
                endDate,
                description
            }
        });

        res.status(201).json({ success: true, experience });
    } catch (error) {
        console.error('Add experience error:', error);
        res.status(500).json({ error: 'Failed to add experience' });
    }
});

// PUT /api/resumes/:id/experiences/:expId - Update experience
router.put('/:id/experiences/:expId', async (req, res) => {
    try {
        const { id, expId } = req.params;
        const { company, role, location, startDate, endDate, description } = req.body;

        // Verify resume ownership
        const resume = await prisma.resume.findUnique({ where: { id } });
        if (!resume || resume.userId !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const experience = await prisma.experience.update({
            where: { id: expId },
            data: {
                company,
                role,
                location,
                startDate,
                endDate,
                description
            }
        });

        res.json({ success: true, experience });
    } catch (error) {
        console.error('Update experience error:', error);
        res.status(500).json({ error: 'Failed to update experience' });
    }
});

// DELETE /api/resumes/:id/experiences/:expId - Delete experience
router.delete('/:id/experiences/:expId', async (req, res) => {
    try {
        const { id, expId } = req.params;

        // Verify resume ownership
        const resume = await prisma.resume.findUnique({ where: { id } });
        if (!resume || resume.userId !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await prisma.experience.delete({
            where: { id: expId }
        });

        res.json({ success: true, message: 'Experience deleted successfully' });
    } catch (error) {
        console.error('Delete experience error:', error);
        res.status(500).json({ error: 'Failed to delete experience' });
    }
});

// POST /api/resumes/:id/educations - Add education
router.post('/:id/educations', async (req, res) => {
    try {
        const { id } = req.params;
        const { institution, degree, field, graduationDate } = req.body;

        if (!institution || !degree) {
            return res.status(400).json({
                error: 'Missing required fields: institution and degree'
            });
        }

        // Verify resume ownership
        const resume = await prisma.resume.findUnique({ where: { id } });
        if (!resume || resume.userId !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const education = await prisma.education.create({
            data: {
                resumeId: id,
                institution,
                degree,
                field,
                graduationDate
            }
        });

        res.status(201).json({ success: true, education });
    } catch (error) {
        console.error('Add education error:', error);
        res.status(500).json({ error: 'Failed to add education' });
    }
});

// DELETE /api/resumes/:id/educations/:eduId - Delete education
router.delete('/:id/educations/:eduId', async (req, res) => {
    try {
        const { id, eduId } = req.params;

        // Verify resume ownership
        const resume = await prisma.resume.findUnique({ where: { id } });
        if (!resume || resume.userId !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const existingEducation = await prisma.education.findUnique({
            where: { id: eduId }
        });

        if (!existingEducation) {
            return res.status(404).json({ error: 'Education not found' });
        }

        await prisma.education.delete({
            where: { id: eduId }
        });

        res.json({ success: true, message: 'Education deleted successfully' });
    } catch (error) {
        console.error('Delete education error:', error);
        res.status(500).json({ error: 'Failed to delete education' });
    }
});

// POST /api/resumes/:id/skills - Add skill
router.post('/:id/skills', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, level = 'Intermediate' } = req.body;

        if (!name) {
            return res.status(400).json({
                error: 'Missing required field: name'
            });
        }

        // Verify resume ownership
        const resume = await prisma.resume.findUnique({ where: { id } });
        if (!resume || resume.userId !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const skill = await prisma.skill.create({
            data: {
                resumeId: id,
                name,
                level
            }
        });

        res.status(201).json({ success: true, skill });
    } catch (error) {
        console.error('Add skill error:', error);
        res.status(500).json({ error: 'Failed to add skill' });
    }
});

// DELETE /api/resumes/:id/skills/:skillId - Delete skill
router.delete('/:id/skills/:skillId', async (req, res) => {
    try {
        const { id, skillId } = req.params;

        // Verify resume ownership
        const resume = await prisma.resume.findUnique({ where: { id } });
        if (!resume || resume.userId !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const existingSkill = await prisma.skill.findUnique({
            where: { id: skillId }
        });

        if (!existingSkill) {
            return res.status(404).json({ error: 'Skill not found' });
        }

        await prisma.skill.delete({
            where: { id: skillId }
        });

        res.json({ success: true, message: 'Skill deleted successfully' });
    } catch (error) {
        console.error('Delete skill error:', error);
        res.status(500).json({ error: 'Failed to delete skill' });
    }
});

module.exports = router;
