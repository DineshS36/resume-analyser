const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET /api/resumes - Get all resumes for a user
router.get('/', async (req, res) => {
    try {
        const { userId } = req.query;
        
        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }
        
        const resumes = await prisma.resume.findMany({
            where: { userId },
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

// GET /api/resumes/:id - Get single resume
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
        
        res.json({ success: true, resume });
    } catch (error) {
        console.error('Get resume error:', error);
        res.status(500).json({ error: 'Failed to fetch resume' });
    }
});

// POST /api/resumes - Create new resume
router.post('/', async (req, res) => {
    try {
        const { userId, title, templateId = 'classic' } = req.body;
        
        if (!userId || !title) {
            return res.status(400).json({ 
                error: 'Missing required fields: userId and title' 
            });
        }
        
        const resume = await prisma.resume.create({
            data: {
                userId,
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
        const { expId } = req.params;
        const { company, role, location, startDate, endDate, description } = req.body;
        
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
        const { expId } = req.params;
        
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
        const { eduId } = req.params;
        
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
        const { skillId } = req.params;
        
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

