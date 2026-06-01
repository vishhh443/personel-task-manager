import axios from 'axios';

// Create configured Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10s timeout
});

// Response interceptor to extract standard success/error wrapper formats automatically
api.interceptors.response.use(
  (response) => {
    // If successful and conforms to standard response, return the data wrapper
    if (response.data && response.data.success) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    // Standardize error message extraction
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    
    // We reject with the actual error message string so it's simple to display in toast alerts
    return Promise.reject(message);
  }
);

export default api;
