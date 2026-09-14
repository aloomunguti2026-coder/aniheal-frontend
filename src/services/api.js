// Centralized API Configuration
const rawApiUrl = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000'
).trim().replace(/\/+$/, '');

// Root Backend URL (without /api suffix)
export const API_URL = rawApiUrl.endsWith('/api')
  ? rawApiUrl.slice(0, -4)
  : rawApiUrl;

// Base API URL (guaranteed to end with /api without trailing slash)
export const API_BASE_URL = `${API_URL}/api`;

/**
 * Universal API Request Handler
 * @param {string} endpoint - Relative path (e.g. '/public/services' or '/api/public/services') or absolute URL
 * @param {object} options - Fetch options (method, headers, body, etc.)
 */
export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('auth_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  // Construct absolute URL safely
  let url = endpoint;
  if (!endpoint.startsWith('http://') && !endpoint.startsWith('https://')) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    // Deduplicate /api prefix if already supplied in endpoint
    url = cleanEndpoint.startsWith('/api/') || cleanEndpoint === '/api'
      ? `${API_URL}${cleanEndpoint}`
      : `${API_BASE_URL}${cleanEndpoint}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const error = new Error(data?.message || `API request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (!err.status && err.name === 'TypeError') {
      // Network failure / CORS block / Offline
      const networkErr = new Error('Network error: Unable to communicate with the AniHeal API server. Please check your internet connection.');
      networkErr.isNetworkError = true;
      throw networkErr;
    }
    throw err;
  }
}

/**
 * File / Multipart Upload Request Handler
 */
export async function uploadRequest(endpoint, formData, options = {}) {
  const token = localStorage.getItem('auth_token');
  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  let url = endpoint;
  if (!endpoint.startsWith('http://') && !endpoint.startsWith('https://')) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    url = cleanEndpoint.startsWith('/api/') || cleanEndpoint === '/api'
      ? `${API_URL}${cleanEndpoint}`
      : `${API_BASE_URL}${cleanEndpoint}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const error = new Error(data?.message || `File upload failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (!err.status && err.name === 'TypeError') {
      const networkErr = new Error('Network error: Unable to upload media to the API server.');
      networkErr.isNetworkError = true;
      throw networkErr;
    }
    throw err;
  }
}

/**
 * Resolve Media URL (preserves absolute URLs e.g. Cloudinary, prepends API_URL for relative paths)
 */
export function getMediaUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  return `${API_URL}${url.startsWith('/') ? url : `/${url}`}`;
}

export const api = {
  get: (url, options) => request(url, { ...options, method: 'GET' }),
  post: (url, body, options) => request(url, { ...options, method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body) }),
  put: (url, body, options) => request(url, { ...options, method: 'PUT', body: body instanceof FormData ? body : JSON.stringify(body) }),
  patch: (url, body, options) => request(url, { ...options, method: 'PATCH', body: body instanceof FormData ? body : JSON.stringify(body) }),
  delete: (url, options) => request(url, { ...options, method: 'DELETE' }),
  upload: (url, formData, options) => uploadRequest(url, formData, options),
  getMediaUrl,
};

export default api;

