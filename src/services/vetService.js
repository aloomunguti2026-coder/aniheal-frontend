import api from './api';

export const vetService = {
  logDailyActivity: (data) => api.post('/vet/logs', data),
  getVetLogs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/vet/logs${query ? `?${query}` : ''}`);
  },
  getVetStats: () => api.get('/vet/stats'),
  createClinicalRecord: (data) => api.post('/vet/clinical-records', data),
  getClinicalHistory: (animalId) => api.get(`/vet/clinical-records/animal/${animalId}`),
  createVaccination: (data) => api.post('/vet/vaccinations', data),
  getUpcomingVaccinations: () => api.get('/vet/vaccinations/upcoming'),
};

export default vetService;
