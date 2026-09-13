import axios from 'axios';

// Create axios instance — Vite proxy handles /api -> http://localhost:5000
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nc_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('nc_token');
      localStorage.removeItem('nc_user');
      // Don't redirect here — let AuthContext handle it
    }
    return Promise.reject(error);
  }
);

// ---- Auth API ----
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
};

// ---- Doctor API ----
export const doctorAPI = {
  getAll: (params = {}) => api.get('/doctors', { params }),
  getById: (id) => api.get(`/doctors/${id}`),
  updateStatus: (data) => api.patch('/doctors/status', data),
};

// ---- Appointment API ----
export const appointmentAPI = {
  book: (data) => api.post('/appointments', data),
  getAll: (params = {}) => api.get('/appointments', { params }),
  updateStatus: (id, status) => api.patch(`/appointments/${id}/status`, { status }),
};

// ---- Chat API ----
export const chatAPI = {
  getConversations: () => api.get('/chat/conversations'),
  getMessages: (conversationId, params = {}) =>
    api.get(`/chat/conversations/${conversationId}/messages`, { params }),
  sendMessage: (conversationId, content) =>
    api.post(`/chat/conversations/${conversationId}/messages`, { content }),
};

// ---- MRI API ----
export const mriAPI = {
  /**
   * Analyze a medical scan.
   * - For image scans (Brain MRI, Breast Mammography, etc.): pass file as File object
   * - For Blood Report: pass bloodData as { wbc, rbc, hemoglobin, platelets, neutrophils, lymphocytes }
   */
  analyze: (scanType, file = null, bloodData = null) => {
    if (scanType === 'Blood Report' && bloodData) {
      // Blood reports send JSON with numeric values
      return api.post('/mri/analyze', { scanType, bloodData });
    }

    // Image-based scans — send file via FormData
    const formData = new FormData();
    formData.append('scanType', scanType);
    if (file) {
      formData.append('file', file);
    } else {
      // Fallback: no file, just scan type (will use mock)
      formData.append('fileName', `scan_${Date.now()}.dcm`);
    }
    return api.post('/mri/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getHistory: () => api.get('/mri/history'),

  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/mri/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default api;
