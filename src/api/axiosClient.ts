// src/api/axiosClient.ts
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5032/api/v1', // Base URL của Backend
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 giây
});

export default axiosClient;