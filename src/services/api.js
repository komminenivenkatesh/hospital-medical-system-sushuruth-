import axios from 'axios';

// In production, use the full backend URL; in dev, Vite proxy handles /api
const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
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
  getVerifications: (params = {}) => api.get('/doctors/verifications', { params }),
  verifyDoctor: (id, verificationStatus) => api.patch(`/doctors/${id}/verify`, { verificationStatus }),
  getMyPatients: () => api.get('/doctors/my/patients'),
  getMyDashboardStats: () => api.get('/doctors/my/dashboard-stats'),
  getMyProfile: () => api.get('/doctors/my/profile'),
  updateMyProfile: (data) => api.put('/doctors/my/profile', data),
  getMyAvailability: () => api.get('/doctors/my/availability'),
  updateMyAvailability: (data) => api.put('/doctors/my/availability', data),
};

// ---- Hospital API ----
export const hospitalAPI = {
  getAll: (params = {}) => api.get('/hospitals', { params }),
  getById: (id) => api.get(`/hospitals/${id}`),
  getVerifications: (params = {}) => api.get('/hospitals/verifications', { params }),
  verifyHospital: (id, verificationStatus) => api.patch(`/hospitals/${id}/verify`, { verificationStatus }),
  updateMyHospital: (data) => api.patch('/hospitals/me', data),
};

// ---- Health Records & Prescriptions API ----
export const healthAPI = {
  getSummary: () => api.get('/health/summary'),
  getPrescriptions: () => api.get('/health/prescriptions'),
  createPrescription: (data) => api.post('/health/prescriptions', data),
  getLabReports: () => api.get('/health/lab-reports'),
  createLabReport: (data) => api.post('/health/lab-reports', data),
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
  getOrCreate: (recipientId) => api.post('/chat/conversations', { recipientId }),
  getMessages: (conversationId, params = {}) =>
    api.get(`/chat/conversations/${conversationId}/messages`, { params }),
  sendMessage: (conversationId, content, senderType) =>
    api.post(`/chat/conversations/${conversationId}/messages`, { content, senderType }),
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

// ---- Payments API ----
export const paymentAPI = {
  getHistory: () => api.get('/payments/history'),
  createPayment: (data) => api.post('/payments', data),
  getDoctorEarnings: () => api.get('/payments/doctor/earnings'),
};

// ---- Family API ----
export const familyAPI = {
  getAll: () => api.get('/family'),
  add: (data) => api.post('/family', data),
  update: (id, data) => api.put(`/family/${id}`, data),
  delete: (id) => api.delete(`/family/${id}`),
};

// ---- Articles / Health Library API ----
export const articleAPI = {
  getAll: (params = {}) => api.get('/articles', { params }),
  getById: (id) => api.get(`/articles/${id}`),
};

// ---- Admin Intelligence API ----
export const adminAPI = {
  getOverview: () => api.get('/admin/overview'),
  getAnalytics: () => api.get('/admin/analytics'),
};

// ---- AI Assistant API ----
export const aiAPI = {
  getConversations: () => api.get('/ai/conversations'),
  getConversationById: (id) => api.get(`/ai/conversations/${id}`),
  sendMessage: (prompt, conversationId) => api.post('/ai/chat', { prompt, conversationId }),
  deleteConversation: (id) => api.delete(`/ai/conversations/${id}`),
};

export default api;
