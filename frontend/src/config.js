const hostname = window.location.hostname === 'localhost' ? '127.0.0.1' : window.location.hostname;
export const API_BASE_URL = `http://${hostname}:5000/api`;
export const BASE_URL = `http://${hostname}:5000`;
