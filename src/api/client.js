import axios from 'axios';

// Configure default axios instance
const apiClient = axios.create({
    baseURL: '/api',
    withCredentials: true, // Important for sending cookies/session with requests cross-origin
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authAPI = {
    login: async (username, password) => {
        const response = await apiClient.post('/auth/login', { username, password });
        return response.data;
    },
    register: async (userData) => {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    },
    logout: async () => {
        const response = await apiClient.post('/auth/logout');
        return response.data;
    },
    checkSession: async () => {
        const response = await apiClient.get('/session/check');
        return response.data;
    }
};

export const dashboardAPI = {
    getSummary: async () => {
        const response = await apiClient.get('/dashboard/summary');
        return response.data;
    }
};

export const transactionsAPI = {
    getRecent: async () => {
        const response = await apiClient.get('/transactions/recent');
        return response.data;
    },
    getAll: async () => {
        const response = await apiClient.get('/transactions/all');
        return response.data;
    }
};

export const expensesAPI = {
    addExpense: async (sectionId, expenseData) => {
        const response = await apiClient.post(`/sections/${sectionId}/expenses`, expenseData);
        return response.data;
    },
    deleteExpense: async (expenseId) => {
        const response = await apiClient.delete(`/expenses/${expenseId}`);
        return response.data;
    }
};

export const salesAPI = {
    addSale: async (sectionId, saleData) => {
        const response = await apiClient.post(`/sections/${sectionId}/sales`, saleData);
        return response.data;
    },
    deleteSale: async (saleId) => {
        const response = await apiClient.delete(`/sales/${saleId}`);
        return response.data;
    }
};

export const userAPI = {
    getProfile: async () => {
        const response = await apiClient.get('/user/profile');
        return response.data;
    },
    updateProfile: async (profileData) => {
        const response = await apiClient.post('/user/update-profile', profileData);
        return response.data;
    }
};

export const aiAPI = {
    getSummary: async () => {
        const response = await apiClient.get('/ai/financial-summary');
        return response.data;
    },
    chat: async (message) => {
        const response = await apiClient.post('/ai/farmthozhan-chat', { message });
        return response.data;
    }
};

export const sectionsAPI = {
    getSections: async () => {
        const response = await apiClient.get('/sections');
        return response.data;
    },
    createSection: async (sectionData) => {
        const response = await apiClient.post('/sections', sectionData);
        return response.data;
    },
    getSectionDetails: async (id) => {
        const response = await apiClient.get(`/sections/${id}`);
        // Backend returns `{success: True, data: section}`, we map `data` to `section` for the UI
        return { ...response.data, section: response.data.data };
    },
    updateSection: async (id, sectionData) => {
        const response = await apiClient.put(`/sections/${id}`, sectionData);
        return response.data;
    },
    deleteSection: async (id) => {
        const response = await apiClient.delete(`/sections/${id}`);
        return response.data;
    },
    getExpenseTypes: async (id) => {
        const response = await apiClient.get(`/sections/${id}/expense-types`);
        return response.data;
    },
    addExpenseType: async (id, name, description) => {
        const response = await apiClient.post(`/sections/${id}/expense-types`, { name, description });
        return response.data;
    },
    deleteExpenseType: async (typeId) => {
        const response = await apiClient.delete(`/expense-types/${typeId}`);
        return response.data;
    },
    getSellTypes: async (id) => {
        const response = await apiClient.get(`/sections/${id}/sell-types`);
        return response.data;
    },
    addSellType: async (id, name, unit, description) => {
        const response = await apiClient.post(`/sections/${id}/sell-types`, { name, unit, description });
        return response.data;
    },
    deleteSellType: async (typeId) => {
        const response = await apiClient.delete(`/sell-types/${typeId}`);
        return response.data;
    }
};

export const reportsAPI = {
    generateReport: () => {
        // Trigger direct browser download
        window.location.href = '/api/reports/generate';
    }
};

export default apiClient;
