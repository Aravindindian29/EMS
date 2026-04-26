import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });
        
        const { access } = response.data;
        localStorage.setItem('access_token', access);
        
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (data) => api.post('/auth/signup/', data),
  login: (data) => api.post('/auth/login/', data),
  passwordReset: (email) => api.post('/auth/password-reset/', { email }),
  passwordResetConfirm: (data) => api.post('/auth/password-reset/confirm/', data),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats/'),
};

export const employeeAPI = {
  getAll: (params) => api.get('/employees/', { params }),
  getOne: (id) => api.get(`/employees/${id}/`),
  create: (data) => api.post('/employees/', data),
  update: (id, data) => api.put(`/employees/${id}/`, data),
  delete: (id) => api.delete(`/employees/${id}/`),
  advancedSearch: (params) => api.get('/employees/advanced-search/', { params }),
  import: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/employees/import_employees/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  export: (params) => {
    const { format, ...otherParams } = params;
    return api.get('/employees/export/', { 
      params: { export_format: format, ...otherParams },
      responseType: 'blob'
    });
  },
};

export const teamAPI = {
  getAll: (params) => api.get('/teams/', { params }),
  getOne: (id) => api.get(`/teams/${id}/`),
  create: (data) => api.post('/teams/', data),
  update: (id, data) => api.put(`/teams/${id}/`, data),
  delete: (id) => api.delete(`/teams/${id}/`),
  export: () => api.get('/teams/export/', { responseType: 'blob' }),
};

export const exitTrendAPI = {
  get: (year) => api.get('/exit-trends/', { params: { year } }),
};

export const vpIndiaAPI = {
  getAll: (params) => api.get('/vp-india/', { params }),
  getOne: (id) => api.get(`/vp-india/${id}/`),
  create: (data) => api.post('/vp-india/', data),
  update: (id, data) => api.put(`/vp-india/${id}/`, data),
  delete: (id) => api.delete(`/vp-india/${id}/`),
};

export const reportingManagerAPI = {
  getAll: (params) => api.get('/reporting-managers/', { params }),
  getOne: (id) => api.get(`/reporting-managers/${id}/`),
  create: (data) => api.post('/reporting-managers/', data),
  update: (id, data) => api.put(`/reporting-managers/${id}/`, data),
  delete: (id) => api.delete(`/reporting-managers/${id}/`),
};

export default api;
