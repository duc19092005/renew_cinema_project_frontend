// src/api/authApi.ts
import axiosClient from './axiosClient';
import type {
  RegisterRequest,
  LoginRequest,
  ApiSuccessResponse,
  UserLoginData,
  LogoutResponse,
} from '../types/auth.types';

export const authApi = {
  regularRegister: async (data: RegisterRequest): Promise<ApiSuccessResponse> => {
    // URL cụ thể: /identity_access_/regular-register
    const response = await axiosClient.post<ApiSuccessResponse>(
      '/IdentityAccess/regular-register',
      data
    );
    return response.data;
  },
  regularLogin: async (data: LoginRequest): Promise<ApiSuccessResponse<UserLoginData>> => {
    const response = await axiosClient.post<ApiSuccessResponse<UserLoginData>>(
      '/IdentityAccess/regular-login',
      data
    );
    
    // Log response headers để debug cookie
    if (process.env.NODE_ENV === 'development') {
      console.log('Login response headers:', response.headers);
      console.log('Set-Cookie header:', response.headers['set-cookie']);
    }
    
    return response.data;
  },
  logout: async (): Promise<LogoutResponse> => {
    // URL: http://localhost:5032/api/v1/identity_access_/Logout
    const response = await axiosClient.post<LogoutResponse>('/IdentityAccess/Logout');
    return response.data;
  },
  getProfile: async (): Promise<ApiSuccessResponse<UserLoginData>> => {
    // URL: http://localhost:5032/api/v1/identity_access_/get-profile
    const response = await axiosClient.get<ApiSuccessResponse<UserLoginData>>(
      '/IdentityAccess/get-profile'
    );
    return response.data;
  },
};