import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Xử lý khi token hết hạn dùng thử hoặc bị khoá
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const code = error.response?.data?.code;

        if (status === 402 && code === 'TRIAL_EXPIRED') {
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            // Lưu thông báo để hiển thị sau khi redirect
            sessionStorage.setItem('trialExpiredMessage', error.response.data.message || 'Thời gian dùng thử đã hết hạn');
            window.location.href = '/';
        }

        return Promise.reject(error);
    }
);
