import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios request interceptor — automatically attach the JWT to every request
api.interceptors.request.use(
  (config) => {
    // Only runs in the browser (not during SSR)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('resume_builder_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Axios response interceptor — handle 401/403 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expired or invalid — only clear storage, don't redirect
      // (the AuthContext will handle the UI state)
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        // Only auto-clear on protected routes, not on login/signup
        if (currentPath !== '/login' && currentPath !== '/signup') {
          localStorage.removeItem('resume_builder_token');
          localStorage.removeItem('resume_builder_user');
        }
      }
    }
    return Promise.reject(error);
  }
);

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

export const enhanceBulletPoint = async (originalText, keywords = []) => {
  try {
    const response = await api.post('/api/enhance-bullet', {
      originalText,
      keywords,
    });
    return response.data;
  } catch (error) {
    console.error('Error enhancing bullet point:', error);
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

export const analyzeAtsMatch = async (resumeData, jobDescription) => {
  try {
    const response = await api.post('/api/analyze-ats', {
      resumeData,
      jobDescription
    });
    return response.data;
  } catch (error) {
    console.error('Error analyzing ATS match:', error);
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

export const parseResumePDF = async (file) => {
  try {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await api.post('/api/parse-pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error parsing resume PDF:', error);
    throw error;
  }
};


// Resume API endpoints

export const saveResumeToCloud = async (resumeData) => {
  try {
    const response = await api.put('/api/resumes/save', resumeData);
    return response.data;
  } catch (error) {
    console.error('Error auto-saving resume:', error);
    throw error;
  }
};

export const createResume = async (title, templateId = 'classic') => {
  try {
    const response = await api.post('/api/resumes', {
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

export const getResumes = async () => {
  try {
    const response = await api.get('/api/resumes');
    return response.data;
  } catch (error) {
    console.error('Error fetching resumes:', error);
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
