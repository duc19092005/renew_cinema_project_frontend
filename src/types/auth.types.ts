// src/types/auth.types.ts

// DTO gửi đi (Request Body)
export interface RegisterRequest {
  userEmail: string;
  userPassword: string;
  userRepassword: string;
  userName: string;
  identityCode: string;
  phoneNumber: string;
  dateOfBirth: string; // ISO String format
}

// DTO lỗi trả về (Error Response)
export interface ApiErrorResponse {
  statusCode: number;
  errorCode: string;
  message: string;
  timestamp: string;
}

// DTO thành công (Success Response)
export interface ApiSuccessResponse<T = null> {
  isSuccess: boolean;
  message: string;
  data: T;
}

// ... Các type cũ giữ nguyên

// Request Body cho Login
export interface LoginRequest {
  email: string; // Backend dùng email để login
  password: string;
}

// Data trả về khi Login thành công
export interface UserLoginData {
  userId: string;
  username: string;
  roles: string[];
}