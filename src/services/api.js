export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export async function request(endpoint, options = {}) {
  const token = sessionStorage.getItem('auth_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  // If endpoint is a full URL, use it directly; otherwise prepend API_BASE_URL
  let url = endpoint.startsWith('http://') || endpoint.startsWith('https://')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (options.params && typeof options.params === 'object') {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const { params, ...fetchOptions } = options;

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && token) {
      // Clear expired session and broadcast session expiration
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_user');
      window.dispatchEvent(new CustomEvent('aniheal:session-expired'));
    }
    const error = new Error(data?.message || 'API request failed');
    error.status = response.status;
    error.data = data;
    error.response = { data, status: response.status };
    throw error;
  }

  return data;
}

export const api = {
  get: (url, options) => request(url, { ...options, method: 'GET' }),
  post: (url, body, options) => request(url, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (url, body, options) => request(url, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: (url, body, options) => request(url, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: (url, options) => request(url, { ...options, method: 'DELETE' }),
};

export default api;
