import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (email, password) => {
    const form = new URLSearchParams();
    form.append('username', email);
    form.append('password', password);
    return api.post('/auth/login', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
  me: () => api.get('/auth/me'),
};

export const productsApi = {
  list: (params) => api.get('/products', { params }),
  categories: () => api.get('/products/categories'),
  get: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  remove: (id) => api.delete(`/products/${id}`),
};

export const ordersApi = {
  checkout: (data) => api.post('/orders/checkout', data),
  my: () => api.get('/orders/my'),
  get: (id) => api.get(`/orders/${id}`),
  list: (params) => api.get('/orders', { params }),
  review: (id, action) => api.patch(`/orders/${id}/review`, { action }),
};

export const adminApi = {
  stats: () => api.get('/admin/stats'),
  fraudEvents: () => api.get('/admin/fraud-events'),
  mlMetrics: () => api.get('/admin/ml-metrics'),
};

export default api;
