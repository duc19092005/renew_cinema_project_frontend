// src/utils/authHelpers.ts
// Helper functions để verify authentication với HttpOnly cookie

import axios from 'axios';
import { facilitiesApi } from '../api/facilitiesApi';
import type { ApiErrorResponse } from '../types/auth.types';
import { getUserInfoFromStorage } from './authUtils';

/**
 * Verify authentication bằng cách gọi API
 * Cookie HttpOnly sẽ tự động được gửi với request
 */
export const verifyAuth = async (): Promise<boolean> => {
  try {
    // Thử gọi một API endpoint để verify token
    // Sử dụng facilitiesApi.getCinemaList() vì nó yêu cầu authentication
    await facilitiesApi.getCinemaList();
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
 * Verify authentication và lấy user info
 */
export const verifyAuthAndGetUser = async (): Promise<{ userId: string; username: string; roles: string[] } | null> => {
  const userInfo = getUserInfoFromStorage();
  if (!userInfo) {
    return null;
  }

  // Verify token bằng cách gọi API
  const isValid = await verifyAuth();
  if (!isValid) {
    // Token không hợp lệ, xóa user info
    localStorage.removeItem('user_info');
    return null;
  }

  return userInfo;
};
