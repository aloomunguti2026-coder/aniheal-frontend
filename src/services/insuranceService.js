import api from './api';

export const insuranceService = {
  // Public
  getActivePlans: (species) => {
    const query = species ? `?species=${species}` : '';
    return api.get(`/insurance/plans${query}`);
  },
  getPlanByCode: (code) => api.get(`/insurance/plans/${code}`),
  submitSubscription: (data) => api.post('/insurance/subscribe', data),

  // Admin Plans
  getPlansAdmin: () => api.get('/admin/insurance/plans'),
  createPlan: (data) => api.post('/admin/insurance/plans', data),
  updatePlan: (id, data) => api.put(`/admin/insurance/plans/${id}`, data),
  togglePlanStatus: (id, isActive) => api.patch(`/admin/insurance/plans/${id}/status`, { isActive }),
  deletePlan: (id) => api.delete(`/admin/insurance/plans/${id}`),

  // Admin Subscriptions & Policies
  getSubscriptions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/admin/insurance/subscriptions${query ? `?${query}` : ''}`);
  },
  updateSubscriptionStatus: (id, data) => api.patch(`/admin/insurance/subscriptions/${id}`, data),
  convertSubscriptionToPolicy: (id) => api.post(`/admin/insurance/subscriptions/${id}/convert`),
  getPolicies: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/admin/insurance/policies${query ? `?${query}` : ''}`);
  },
  getInsuranceAnalytics: () => api.get('/admin/insurance/analytics'),
};

export default insuranceService;
