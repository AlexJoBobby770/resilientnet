import axios from 'axios';

/**
 * Axios instance pre-configured for the ResilientNet backend.
 *
 * Automatically attaches the JWT from localStorage to every
 * outgoing request as: Authorization: Bearer <token>
 *
 * Usage (in any component or service):
 *   import api from '../api';
 *   const { data } = await api.get('/api/households');
 *   const { data } = await api.post('/api/logs', payload);
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// ── Request Interceptor: attach JWT ──────────────────────
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response Interceptor: handle auth errors globally ────
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid — clear storage and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Only redirect if we're not already on the login page
            if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;