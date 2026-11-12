import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

// Request interceptor: attach JWT access token if present in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Let browser set multipart boundary if data is FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 token refresh automatically
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 Unauthorized and not already retried
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/login/') && !originalRequest.url.includes('/auth/register/')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'}/auth/token/refresh/`,
            { refresh: refreshToken }
          );

          const newAccessToken = res.data.access;
          localStorage.setItem('access_token', newAccessToken);
          if (res.data.refresh) {
            localStorage.setItem('refresh_token', res.data.refresh);
          }

          api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          return api(originalRequest);
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          if (window.location.pathname.startsWith('/citizen')) {
            window.location.href = '/login';
          }
          return Promise.reject(new Error('Session expired. Please log in again.'));
        } finally {
          isRefreshing = false;
        }
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        if (window.location.pathname.startsWith('/citizen')) {
          window.location.href = '/login';
        }
      }
    }

    // Format readable error message
    let errorMessage = 'An unexpected error occurred. Please try again.';
    if (error.response?.data) {
      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response.data.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (typeof error.response.data === 'object') {
        const errors = [];
        for (const [key, val] of Object.entries(error.response.data)) {
          const fieldMsg = Array.isArray(val) ? val.join(' ') : String(val);
          errors.push(`${key}: ${fieldMsg}`);
        }
        if (errors.length > 0) {
          errorMessage = errors.join(' | ');
        }
      }
    } else if (error.request) {
      errorMessage = 'Unable to reach CM Kerala backend server. Ensure Django server is running on port 8000.';
    }

    const customError = new Error(errorMessage);
    customError.response = error.response;
    return Promise.reject(customError);
  }
);

export default api;
