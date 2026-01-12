// src/api/axiosClient.ts
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5032/api/v1', // Base URL của Backend
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Quan trọng: gửi cookie để authentication
  timeout: 10000, // 10 giây
});

// Interceptor để log response headers (đặc biệt là Set-Cookie)
axiosClient.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      // Log Set-Cookie header nếu có
      const setCookieHeader = response.headers['set-cookie'];
      if (setCookieHeader) {
        console.log('Set-Cookie header from response:', setCookieHeader);
      } else {
        console.log('No Set-Cookie header in response');
        console.log('All response headers:', Object.keys(response.headers));
      }
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;