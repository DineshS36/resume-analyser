import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// AI API endpoints
export const generateBulletPoints = async (rawInput, targetJobTitle) => {
  try {
    const response = await api.post('/api/generate-bullet', {
      rawInput,
      targetJobTitle,
    });
    return response.data;
  } catch (error) {
    console.error('Error generating bullet points:', error);
    throw error;
  }
};

export const generateSummary = async (experiences, skills, targetJobTitle) => {
  try {
    const response = await api.post('/api/generate-summary', {
      experiences,
      skills,
      targetJobTitle,
    });
    return response.data;
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
};

export const analyzeResume = async (resumeData) => {
  try {
    const response = await api.post('/api/analyze-resume', resumeData);
    return response.data;
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw error;
  }
};

export const generateCoverLetter = async (personalInfo, targetJobTitle, summary, experiences, skills, tone = 'professional') => {
  try {
    const response = await api.post('/api/generate-cover-letter', {
      personalInfo,
      targetJobTitle,
      summary,
      experiences,
      skills,
      tone,
    });
    return response.data;
  } catch (error) {
    console.error('Error generating cover letter:', error);
    throw error;
  }
};

// Resume API endpoints

export const createResume = async (userId, title, templateId = 'classic') => {
  try {
    const response = await api.post('/api/resumes', {
      userId,
      title,
      templateId,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating resume:', error);
    throw error;
  }
};

export const getResume = async (id) => {
  try {
    const response = await api.get(`/api/resumes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching resume:', error);
    throw error;
  }
};

export const updateResume = async (id, data) => {
  try {
    const response = await api.put(`/api/resumes/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating resume:', error);
    throw error;
  }
};

export const addExperience = async (resumeId, experience) => {
  try {
    const response = await api.post(`/api/resumes/${resumeId}/experiences`, experience);
    return response.data;
  } catch (error) {
    console.error('Error adding experience:', error);
    throw error;
  }
};

export const updateExperience = async (resumeId, expId, experience) => {
  try {
    const response = await api.put(`/api/resumes/${resumeId}/experiences/${expId}`, experience);
    return response.data;
  } catch (error) {
    console.error('Error updating experience:', error);
    throw error;
  }
};

export const deleteExperience = async (resumeId, expId) => {
  try {
    const response = await api.delete(`/api/resumes/${resumeId}/experiences/${expId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting experience:', error);
    throw error;
  }
};

export const addEducation = async (resumeId, education) => {
  try {
    const response = await api.post(`/api/resumes/${resumeId}/educations`, education);
    return response.data;
  } catch (error) {
    console.error('Error adding education:', error);
    throw error;
  }
};

export const deleteEducation = async (resumeId, eduId) => {
  try {
    const response = await api.delete(`/api/resumes/${resumeId}/educations/${eduId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting education:', error);
    throw error;
  }
};

export const addSkill = async (resumeId, skill) => {
  try {
    const response = await api.post(`/api/resumes/${resumeId}/skills`, skill);
    return response.data;
  } catch (error) {
    console.error('Error adding skill:', error);
    throw error;
  }
};

export const deleteSkill = async (resumeId, skillId) => {
  try {
    const response = await api.delete(`/api/resumes/${resumeId}/skills/${skillId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting skill:', error);
    throw error;
  }
};

export default api;
