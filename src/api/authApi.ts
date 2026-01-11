// src/api/authApi.ts
import axiosClient from './axiosClient';
import type { RegisterRequest, LoginRequest, ApiSuccessResponse, UserLoginData } from '../types/auth.types';
export const authApi = {
  regularRegister: async (data: RegisterRequest): Promise<ApiSuccessResponse> => {
    // URL cụ thể: /identity_access_/regular-register
    const response = await axiosClient.post<ApiSuccessResponse>(
      '/identity_access_/regular-register', 
      data
    );
    return response.data;
  },
  regularLogin: async (data: LoginRequest): Promise<ApiSuccessResponse<UserLoginData>> => {
    const response = await axiosClient.post<ApiSuccessResponse<UserLoginData>>(
      '/identity_access_/regular-login', 
      data
    );
    return response.data;
  },
};