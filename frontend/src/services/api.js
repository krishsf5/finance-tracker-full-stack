import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/update-profile', data),
  updatePassword: (data) => api.put('/auth/update-password', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
  deleteAccount: (password) => api.delete('/auth/delete-account', { data: { password } }),
};

// Transactions API
export const transactionsAPI = {
  getTransactions: (params) => api.get('/transactions', { params }),
  getTransaction: (id) => api.get(`/transactions/${id}`),
  createTransaction: (data) => api.post('/transactions', data),
  updateTransaction: (id, data) => api.put(`/transactions/${id}`, data),
  deleteTransaction: (id) => api.delete(`/transactions/${id}`),
  getStats: (params) => api.get('/transactions/stats', { params }),
  getCategoryBreakdown: (params) => api.get('/transactions/categories', { params }),
  getTrends: (params) => api.get('/transactions/trends', { params }),
};

// Budgets API
export const budgetsAPI = {
  getBudgets: (params) => api.get('/budgets', { params }),
  getBudget: (id) => api.get(`/budgets/${id}`),
  createBudget: (data) => api.post('/budgets', data),
  updateBudget: (id, data) => api.put(`/budgets/${id}`, data),
  deleteBudget: (id) => api.delete(`/budgets/${id}`),
  getPerformance: (id) => api.get(`/budgets/${id}/performance`),
};

// Goals API
export const goalsAPI = {
  getGoals: (params) => api.get('/goals', { params }),
  getGoal: (id) => api.get(`/goals/${id}`),
  createGoal: (data) => api.post('/goals', data),
  updateGoal: (id, data) => api.put(`/goals/${id}`, data),
  deleteGoal: (id) => api.delete(`/goals/${id}`),
  addContribution: (id, data) => api.post(`/goals/${id}/contribute`, data),
  getStats: () => api.get('/goals/stats'),
};

export default api;
