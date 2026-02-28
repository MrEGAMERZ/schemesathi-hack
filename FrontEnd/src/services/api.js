import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000,
});

// Response interceptor for uniform error handling
api.interceptors.response.use(
    (res) => res.data,
    (err) => {
        const message = err.response?.data?.error || err.message || 'Request failed';
        return Promise.reject(new Error(message));
    }
);

export const getSchemes = (params = {}) => api.get('/schemes', { params });
export const getSchemeById = (id) => api.get(`/schemes/${id}`);
export const checkEligibility = (data) => api.post('/eligibility-check', data);
export const recommend = (data) => api.post('/recommend', data);
export const simplify = (description) => api.post('/simplify', { description });
export const translate = (content, language) => api.post('/translate', { content, language });
export const generateFAQ = (description) => api.post('/generate-faq', { description });
export const chatbot = (query) => api.post('/chatbot', { query });

export default api;
