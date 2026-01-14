import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

export interface Result<T = any> {
    code: number;
    message: string;
    data: T;
}

const service: AxiosInstance = axios.create({
    baseURL:  '/api/v1',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
});

service.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            // 后端使用 X-Token header
            config.headers['X-Token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

service.interceptors.response.use(
    (response: AxiosResponse) => {
        const res = response.data as Result;
        if (res.code === 200) {
            return res as any;
        } else {
            console.error('API Error:', res.message || 'Error', res);
            return Promise.reject(new Error(res.message || 'Error'));
        }
    },
    (error) => {
        console.error('Request Error:', error);
        console.error('Request URL:', error.config?.url);
        console.error('Request Method:', error.config?.method);
        console.error('Response Status:', error.response?.status);
        console.error('Response Data:', error.response?.data);
        console.error('Response Headers:', error.response?.headers);
        
        // 处理网络错误或HTTP错误
        if (error.response) {
            // 服务器返回了错误响应
            const status = error.response.status;
            const res = error.response.data;
            
            // 如果是 403，提供更详细的错误信息
            if (status === 403) {
                const message = res?.message || '访问被拒绝，请检查后端拦截器配置';
                console.error('403 Forbidden - 可能是拦截器配置问题');
                return Promise.reject(new Error(message));
            }
            
            const message = res?.message || error.response.statusText || '请求失败';
            return Promise.reject(new Error(message));
        } else if (error.request) {
            // 请求已发出但没有收到响应
            return Promise.reject(new Error('网络错误，请检查后端服务是否启动'));
        } else {
            // 其他错误
            return Promise.reject(error);
        }
    }
);

export default service;