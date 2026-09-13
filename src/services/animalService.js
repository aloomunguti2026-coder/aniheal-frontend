import api from './api';

export const animalService = {
  getAnimals: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/animals${query ? `?${query}` : ''}`);
  },
  getAnimalById: (id) => api.get(`/animals/${id}`),
  createAnimal: (data) => api.post('/animals', data),
  updateAnimal: (id, data) => api.put(`/animals/${id}`, data),

  getOwners: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/owners${query ? `?${query}` : ''}`);
  },
  getOwnerById: (id) => api.get(`/owners/${id}`),
  createOwner: (data) => api.post('/owners', data),
  updateOwner: (id, data) => api.put(`/owners/${id}`, data),
};

export default animalService;
