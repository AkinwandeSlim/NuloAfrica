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
    console.log('🔐 [AUTH API] Attempting login...');
    console.log('📧 [AUTH API] Email:', data.email);
    console.log('🌐 [AUTH API] API Base URL:', apiClient.defaults.baseURL);
    console.log('🎯 [AUTH API] Full URL:', `${apiClient.defaults.baseURL}/api/v1/auth/login`);
    
    try {
      const response = await apiClient.post<AuthResponse>('/api/v1/auth/login', data);
      
      console.log('✅ [AUTH API] Login response:', response.data);
      
      // Store token and user
      if (response.data.success) {
        storage.setToken(response.data.access_token);
        storage.setUser(response.data.user);
        console.log('💾 [AUTH API] Token and user stored');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ [AUTH API] Login failed');
      console.error('❌ [AUTH API] Full error object:', error);
      console.error('❌ [AUTH API] Error.response:', error.response);
      console.error('❌ [AUTH API] Error.request:', error.request);
      console.error('❌ [AUTH API] Error.message:', error.message);
      console.error('❌ [AUTH API] Error.config:', error.config);
      
      if (error.response) {
        // Server responded with error
        console.error('❌ [AUTH API] Response status:', error.response.status);
        console.error('❌ [AUTH API] Response data:', error.response.data);
        console.error('❌ [AUTH API] Response headers:', error.response.headers);
      } else if (error.request) {
        // Request made but no response
        console.error('❌ [AUTH API] No response received');
        console.error('❌ [AUTH API] Request:', error.request);
      } else {
        // Error setting up request
        console.error('❌ [AUTH API] Request setup error:', error.message);
      }
      
      throw error;
    }
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
