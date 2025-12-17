import axios from 'axios';

const api = axios.create({
    baseURL: '/api' // Proxied to /.netlify/functions/api in dev or prod
});

// Removed interceptors as authentication is bypassed

export default api;
