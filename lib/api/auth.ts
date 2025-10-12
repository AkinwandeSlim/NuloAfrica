/**
 * Authentication API Module
 * Handles all auth-related API calls to FastAPI backend
 */

import apiClient, { storage } from './client';

// Types
export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  user_type: 'tenant' | 'landlord';
  phone_number?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  access_token: string;
  token_type: string;
  message?: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  user_type: 'tenant' | 'landlord';
  trust_score: number;
  verification_status: string;
  created_at: string;
  tenant_profile?: TenantProfile;
  landlord_profile?: LandlordProfile;
}

export interface TenantProfile {
  budget: number | null;
  preferred_location: string | null;
  move_in_date: string | null;
  preferences: any;
  documents: any;
  profile_completion: number;
  onboarding_completed: boolean;
}

export interface LandlordProfile {
  guarantee_joined: boolean;
  guarantee_contribution: number;
}

// Auth API
export const authAPI = {
  /**
   * Register a new user
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/register', data);
    
    // Store token and user
    if (response.data.success) {
      storage.setToken(response.data.access_token);
      storage.setUser(response.data.user);
    }
    
    return response.data;
  },

  /**
   * Login user
   */
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/login', data);
    
    // Store token and user
    if (response.data.success) {
      storage.setToken(response.data.access_token);
      storage.setUser(response.data.user);
    }
    
    return response.data;
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/api/v1/auth/me');
    
    // Update stored user
    storage.setUser(response.data);
    
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/api/v1/auth/logout');
    } finally {
      // Clear storage regardless of API response
      storage.clear();
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!storage.getToken();
  },

  /**
   * Get stored user
   */
  getStoredUser: (): User | null => {
    return storage.getUser();
  },
};

export default authAPI;
