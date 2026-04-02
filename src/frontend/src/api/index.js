import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.config?.url);
    console.error('Error details:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default {
  // Video endpoints
  uploadVideo: (formData) => api.post('/api/videos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  getVideos: () => api.get('/api/videos'),
  getVideo: (id) => api.get(`/api/videos/${id}`),
  getStreamUrl: (id) => api.get(`/api/stream/${id}`),
  incrementViews: (id) => api.post(`/api/videos/${id}/view`),
  incrementViewById: (id) => api.post(`/api/videos/view/${id}`),
  deleteVideo: (id) => api.delete(`/api/videos/${id}`),

  // Add other API endpoints as needed
};