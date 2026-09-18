import api from './api';

export const collaborationService = {
  // Public
  getCollaborations: (params = {}) => api.get('/collaborations', { params }),
  getCollaborationBySlug: (slug) => api.get(`/collaborations/${slug}`),
  addComment: (id, commentData) => api.post(`/collaborations/${id}/comments`, commentData),

  // Admin
  getAdminCollaborations: (params = {}) => api.get('/collaborations/admin/all', { params }),
  createCollaboration: (data) => api.post('/collaborations', data),
  updateCollaboration: (id, data) => api.put(`/collaborations/${id}`, data),
  deleteCollaboration: (id) => api.delete(`/collaborations/${id}`),
  deleteComment: (id, commentId) => api.delete(`/collaborations/${id}/comments/${commentId}`),
  toggleCommentApproval: (id, commentId) => api.patch(`/collaborations/${id}/comments/${commentId}/toggle`),
};

export default collaborationService;
