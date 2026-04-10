import api from './api';
export const applicationService = {
    async submitApplication(data) {
        const response = await api.post('/applications', data);
        return response.data;
    },
    async getMyApplication() {
        const response = await api.get('/applications/my-application');
        return response.data;
    },
    async getAllApplications(status) {
        const params = status && status !== 'ALL' ? { status } : {};
        const response = await api.get('/applications', { params });
        return response.data;
    },
    async updateApplicationStatus(id, status) {
        const response = await api.patch(`/applications/${id}/status`, { status });
        return response.data;
    },
    async getApplicationStats() {
        const response = await api.get('/applications/stats');
        return response.data;
    }
};
