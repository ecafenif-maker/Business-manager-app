import axios from 'axios';

const api = axios.create({
    baseURL: '/api' // Proxied to /.netlify/functions/api in dev or prod
});

api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export default api;
