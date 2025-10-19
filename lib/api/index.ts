/**
 * API Module Index
 * Central export for all API modules
 */

export { default as apiClient, storage, getErrorMessage } from './client';
export { default as authAPI } from './auth';
export { default as propertiesAPI } from './properties';
export { default as applicationsAPI } from './applications';
export { default as favoritesAPI } from './favorites';
export { tenantsAPI } from './tenants';

// Re-export types
export type { RegisterData, LoginData, AuthResponse, User } from './auth';
export type { Property, PropertySearchParams, CreatePropertyData } from './properties';
export type { Application, CreateApplicationData } from './applications';
export type { Favorite } from './favorites';
export type { ProfileStatus, TenantProfile, CompleteProfileData } from './tenants';
