import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN'
});

// Add auth token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const auth = {
    login: async (email: string, password: string) => {
        try {
            const response = await api.post('/auth/login', { email, password }, {
                withCredentials: true
            });
            // The token is set in httpOnly cookie by the backend
            // Just return the success response
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw new Error('Login failed. Please try again.');
        }
    },
    register: async (username: string, email: string, password: string) => {
        const response = await api.post('/auth/register', { username, email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            return response.data;
        }
        throw new Error(response.data.error || 'Registration failed');
    },
    logout: async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            localStorage.removeItem('token');
        }
    },
    getCurrentUser: async () => {
        return api.get('/auth/me');
    }
};