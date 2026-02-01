import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
});

api.interceptors.request.use((config) => {
    // Skip token for auth routes to avoid interference from expired tokens
    const isAuthRoute = config.url?.includes('/token/') || config.url?.includes('/register/');

    if (!isAuthRoute) {
        // Only inject token if Authorization header is not already set (case-insensitive check)
        const hasAuthHeader = Object.keys(config.headers).some(
            key => key.toLowerCase() === 'authorization'
        );

        if (!hasAuthHeader) {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const response = await axios.post(`${api.defaults.baseURL}/token/refresh/`, {
                        refresh: refreshToken,
                    });
                    const { access } = response.data;
                    localStorage.setItem('token', access);
                    api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    return Promise.reject(refreshError);
                }
            } else {
                localStorage.removeItem('token');
            }
        }
        return Promise.reject(error);
    }
);

export default api;
