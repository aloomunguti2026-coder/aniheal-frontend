import api from './api';

export const collaborationService = {
  // Public
  getCollaborations: async (params = {}) => {
    const response = await api.get('/collaborations', { params });
    return response.data;
  },

  getCollaborationBySlug: async (slug) => {
    const response = await api.get(`/collaborations/${slug}`);
    return response.data;
  },

  addComment: async (id, commentData) => {
    const response = await api.post(`/collaborations/${id}/comments`, commentData);
    return response.data;
  },

  // Admin
  getAdminCollaborations: async (params = {}) => {
    const response = await api.get('/collaborations/admin/all', { params });
    return response.data;
  },

  createCollaboration: async (data) => {
    const response = await api.post('/collaborations', data);
    return response.data;
  },

  updateCollaboration: async (id, data) => {
    const response = await api.put(`/collaborations/${id}`, data);
    return response.data;
  },

  deleteCollaboration: async (id) => {
    const response = await api.delete(`/collaborations/${id}`);
    return response.data;
  },

  deleteComment: async (id, commentId) => {
    const response = await api.delete(`/collaborations/${id}/comments/${commentId}`);
    return response.data;
  },

  toggleCommentApproval: async (id, commentId) => {
    const response = await api.patch(`/collaborations/${id}/comments/${commentId}/toggle`);
    return response.data;
  },
};

export default collaborationService;
