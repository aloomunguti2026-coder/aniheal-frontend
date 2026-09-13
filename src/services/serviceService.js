import api from './api';

export const serviceService = {
  getAllServices: (category) => {
    const query = category && category !== 'all' ? `?category=${category}` : '';
    return api.get(`/services${query}`);
  },
  getServiceBySlug: (slug) => api.get(`/services/${slug}`),

  // Admin
  getAllServicesAdmin: () => api.get('/admin/services'),
  createService: (data) => api.post('/admin/services', data),
  updateService: (id, data) => api.put(`/admin/services/${id}`, data),
  deleteService: (id) => api.delete(`/admin/services/${id}`),
};

export default serviceService;
