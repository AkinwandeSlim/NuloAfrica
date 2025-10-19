/**
 * Favorites API Module
 * Handles all favorites-related API calls to FastAPI backend
 */

import apiClient from './client';

// Types
export interface Favorite {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
  property?: any;
}

export interface FavoritesResponse {
  success: boolean;
  favorites: Favorite[];
  total: number;
}

// Favorites API
export const favoritesAPI = {
  /**
   * Get user's favorite properties
   */
  getAll: async (): Promise<FavoritesResponse> => {
    const response = await apiClient.get<FavoritesResponse>('/api/v1/favorites');
    return response.data;
  },

  /**
   * Add property to favorites
   */
  add: async (propertyId: string): Promise<Favorite> => {
    const response = await apiClient.post<Favorite>('/api/v1/favorites', {
      property_id: propertyId,
    });
    return response.data;
  },

  /**
   * Remove property from favorites
   */
  remove: async (propertyId: string): Promise<void> => {
    await apiClient.delete(`/api/v1/favorites/${propertyId}`);
  },

  /**
   * Check if property is favorited
   */
  isFavorited: async (propertyId: string): Promise<boolean> => {
    try {
      const response = await favoritesAPI.getAll();
      return response.favorites.some(fav => fav.property_id === propertyId);
    } catch (error) {
      return false;
    }
  },
};

export default favoritesAPI;
