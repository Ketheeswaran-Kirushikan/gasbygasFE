export interface User {
  id: string;
  companyName?: string;
  email: string;
  contactNumber?: string;
  password: string;
  profileImage?: string;
  language: 'en' | 'ta' | 'si' | 'zh' | string;
  theme: 'light' | 'dark';
  businessRegistrationNumber?: string;
  businessCategory?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

export interface ProfileUpdateResponse {
  success: boolean;
  message: string;
  user?: User;
}

