import api from './axios';

// ==========================================
// Authentication APIs
// ==========================================
export const authAPI = {
  register: (payload) => api.post('/auth/register/', payload),
  login: (credentials) => api.post('/auth/login/', credentials),
  logout: (refreshToken) => api.post('/auth/logout/', { refresh: refreshToken }),
  refreshToken: (refreshToken) => api.post('/auth/token/refresh/', { refresh: refreshToken }),
  getProfile: () => api.get('/auth/me/'),
};

// ==========================================
// Citizen Grievance APIs
// ==========================================
export const citizenGrievanceAPI = {
  getList: (params) => api.get('/citizen/grievances/', { params }),
  create: (formData) => api.post('/citizen/grievances/', formData),
  getDetail: (id) => api.get(`/citizen/grievances/${id}/`),
  submitFeedback: (id, payload) => api.post(`/citizen/grievances/${id}/feedback/`, payload),
};

// ==========================================
// Department Officer Grievance APIs
// ==========================================
export const officerGrievanceAPI = {
  getList: (params) => api.get('/officer/grievances/', { params }),
  getDetail: (id) => api.get(`/officer/grievances/${id}/`),
  addRemark: (id, payload) => api.post(`/officer/grievances/${id}/remarks/`, payload),
  submitReport: (id, formData) => api.post(`/officer/grievances/${id}/reports/`, formData),
};

// ==========================================
// CMO Administrator APIs
// ==========================================
export const cmoAPI = {
  // Executive Dashboard Analytics
  getStats: () => api.get('/cmo/stats/'),

  // Comprehensive Grievance Registry
  getGrievances: (params) => api.get('/cmo/grievances/', { params }),
  getGrievanceDetail: (id) => api.get(`/cmo/grievances/${id}/`),

  // Assign department and officer
  assignGrievance: (id, payload) => api.post(`/cmo/grievances/${id}/assign/`, payload),

  // Internal CMO audit remarks (confidential)
  addInternalRemark: (id, payload) => api.post(`/cmo/grievances/${id}/remarks/`, payload),

  // Escalate grievance
  escalateGrievance: (id, payload) => api.post(`/cmo/grievances/${id}/escalate/`, payload),

  // Four-Eyes Action Taken Report Review (Approve / Reject)
  reviewReport: (reportId, payload) => api.post(`/cmo/reports/${reportId}/review/`, payload),

  // Department Management
  getDepartments: (params) => api.get('/cmo/departments/', { params }),
  createDepartment: (payload) => api.post('/cmo/departments/', payload),
  updateDepartment: (id, payload) => api.patch(`/cmo/departments/${id}/`, payload),
  getDepartmentOfficers: (deptId) => api.get(`/cmo/departments/${deptId}/officers/`),
};

// ==========================================
// AI Assistant API (Gemini 3.6 Flash)
// ==========================================
export const aiAPI = {
  analyzeDraft: (payload) => api.post('/ai/analyze/', payload),
};

// ==========================================
// Public Department & Tracking APIs
// ==========================================
export const departmentAPI = {
  getAll: () => api.get('/departments/'),
  getById: (id) => api.get(`/departments/${id}/`),
};

export const grievanceAPI = {
  trackByRef: (referenceNumber) => api.get(`/grievances/track/?ref=${encodeURIComponent(referenceNumber)}`),
};

export const contactAPI = {
  submitEnquiry: (payload) => api.post('/public/contact/', payload),
};

// ==========================================
// Constants for choices
// ==========================================
export const KERALA_DISTRICTS = [
  'ALAPPUZHA',
  'ERNAKULAM',
  'IDUKKI',
  'KANNUR',
  'KASARAGOD',
  'KOLLAM',
  'KOTTAYAM',
  'KOZHIKODE',
  'MALAPPURAM',
  'PALAKKAD',
  'PATHANAMTHITTA',
  'THIRUVANANTHAPURAM',
  'THRISSUR',
  'WAYANAD',
];

export const GRIEVANCE_CATEGORIES = [
  'Revenue & Land Records',
  'Public Works & Infrastructure',
  'Health & Family Welfare',
  'Local Self Government',
  'Water Supply & Sanitation',
  'Electricity & Energy',
  'Education & Scholarships',
  'Civil Supplies & Ration',
  'Law & Order / Police',
  'Social Justice & Welfare',
  'Forest & Wildlife',
  'Agriculture & Farmers Welfare',
  'Transport & Motor Vehicles',
  'General Administration',
  'Other',
];

export const GRIEVANCE_STATUSES = [
  { value: 'SUBMITTED', label: 'Submitted', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'UNDER_REVIEW', label: 'Under Review', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { value: 'RESOLVED', label: 'Resolved', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'REOPENED', label: 'Reopened', color: 'bg-purple-50 text-purple-700 border-purple-200' },
];

export const GRIEVANCE_PRIORITIES = [
  { value: 'LOW', label: 'Low', color: 'bg-slate-100 text-slate-700' },
  { value: 'MEDIUM', label: 'Medium', color: 'bg-amber-100 text-amber-800' },
  { value: 'HIGH', label: 'High', color: 'bg-rose-100 text-rose-800 font-semibold' },
];
