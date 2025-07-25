const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export function apiFetch(path, options) {
  return fetch(`${API_BASE_URL}${path}`, options);
}