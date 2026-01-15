// src/utils/authHelpers.ts
// Helper functions để verify authentication với HttpOnly cookie

import axios from 'axios';
import { authApi } from '../api/authApi';
import type { ApiErrorResponse } from '../types/auth.types';

/**
 * Verify authentication bằng cách gọi API get-profile
 * Cookie HttpOnly sẽ tự động được gửi với request
 */
export const verifyAuth = async (): Promise<boolean> => {
  try {
    // Gọi API get-profile để verify token
    await authApi.getProfile();
    return true;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const data = error.response.data as ApiErrorResponse;
      if (data.statusCode === 401) {
        // Token không hợp lệ hoặc hết hạn
        return false;
      }
    }
    // Nếu không phải 401, có thể là lỗi network hoặc server
    // Trong trường hợp này, giả sử token vẫn hợp lệ
    return true;
  }
};

/**
 * Verify authentication và lấy user info từ API get-profile
 * Nếu chưa đăng nhập (401), sẽ return null để redirect về login
 */
export const verifyAuthAndGetUser = async (): Promise<{ userId: string; username: string; roles: string[] } | null> => {
  try {
    // Gọi API get-profile để lấy thông tin user và verify authentication
    const response = await authApi.getProfile();
    
    if (response.isSuccess && response.data) {
      // Cập nhật localStorage với thông tin mới nhất từ server
      localStorage.setItem('user_info', JSON.stringify(response.data));
      return response.data;
    }
    
    // Nếu không có data, xóa user info và return null
    localStorage.removeItem('user_info');
    return null;
  } catch (error) {
    // Xử lý lỗi 401 (chưa đăng nhập) hoặc các lỗi khác
    if (axios.isAxiosError(error) && error.response) {
      const data = error.response.data as ApiErrorResponse;
      if (data.statusCode === 401) {
        // Chưa đăng nhập hoặc token không hợp lệ
        localStorage.removeItem('user_info');
        return null;
      }
    }
    
    // Nếu là lỗi network hoặc lỗi khác, xóa user info để đảm bảo an toàn
    localStorage.removeItem('user_info');
    return null;
  }
};
