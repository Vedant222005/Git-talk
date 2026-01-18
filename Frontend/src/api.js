import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true
});

export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const logout = () => API.post('/auth/logout');
export const saveMessage = (repoId, data) => API.post(`/chat/${repoId}/save`, data);
export const getHistory = (repoId) => API.get(`/chat/${repoId}/history`);

export default API;
