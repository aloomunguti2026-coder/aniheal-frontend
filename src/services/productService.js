import api from './api';

export const productService = {
  // Public
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/products${query ? `?${query}` : ''}`);
  },
  getProductBySlug: (slug) => api.get(`/products/${slug}`),
  submitOrder: (orderData) => api.post('/products/orders', orderData),

  // Admin Products
  getProductsAdmin: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/admin/products${query ? `?${query}` : ''}`);
  },
  getProductById: (id) => api.get(`/admin/products/${id}`),
  createProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  toggleProductStatus: (id, isActive) => api.patch(`/admin/products/${id}/status`, { isActive }),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),

  // Admin Inventory
  adjustStock: (data) => api.post('/admin/inventory/adjust', data),
  getInventoryHistory: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/admin/inventory/history${query ? `?${query}` : ''}`);
  },
  getLowStockAlerts: () => api.get('/admin/inventory/low-stock'),

  // Admin Orders & Sales
  getOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/admin/orders${query ? `?${query}` : ''}`);
  },
  updateOrderStatus: (id, data) => api.patch(`/admin/orders/${id}/status`, data),
  
  // Admin Payments & Revenue Recording
  recordPayment: (data) => api.post('/admin/payments', data),
  getPayments: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/admin/payments${query ? `?${query}` : ''}`);
  },
  getPaymentAnalytics: () => api.get('/admin/payments/analytics'),
};

export default productService;
