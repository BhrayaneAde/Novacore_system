import apiClient from '../api/client';

export const departmentsService = {
  getAll: () => Promise.resolve({ data: [] }),
  getById: (id) => Promise.resolve({ data: null }),
  create: (data) => Promise.resolve({ data }),
  update: (id, data) => Promise.resolve({ data }),
  delete: (id) => Promise.resolve()
};