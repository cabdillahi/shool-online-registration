import api from './api';
export const authService = {
    async login(data) {
        const response = await api.post('/auth/login', data);
        return response.data;
    },
    async register(data) {
        const response = await api.post('/auth/register', data);
        return response.data;
    },
    async getProfile() {
        const response = await api.get('/auth/profile');
        return response.data;
    },
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    getToken() {
        return localStorage.getItem('token');
    },
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    setAuth(token, user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    },
    isAuthenticated() {
        return !!this.getToken();
    }
};
