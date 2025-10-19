/**
 * Applications API Module
 * Handles all application-related API calls to FastAPI backend
 */

import apiClient from './client';

// Types
export interface Application {
  id: string;
  property_id: string;
  tenant_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  personal_info: PersonalInfo;
  employment_info: EmploymentInfo;
  references: References;
  documents: Documents;
  additional_info: AdditionalInfo;
  created_at: string;
  updated_at: string;
  property?: any;
  tenant?: any;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  maritalStatus?: string;
  dependents?: string;
}

export interface EmploymentInfo {
  employmentStatus: string;
  employer?: string;
  jobTitle?: string;
  monthlyIncome?: string;
  employmentDuration?: string;
  previousEmployer?: string;
}

export interface References {
  reference1: {
    name: string;
    phone: string;
    relationship: string;
  };
  reference2?: {
    name: string;
    phone: string;
    relationship: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface Documents {
  idDocument: string;
  proofOfIncome: string;
  bankStatement?: string;
  employmentLetter?: string;
}

export interface AdditionalInfo {
  moveInDate: string;
  leaseDuration: string;
  pets: string;
  smoking: string;
  additionalInfo?: string;
}

export interface CreateApplicationData {
  property_id: string;
  personal_info: PersonalInfo;
  employment_info: EmploymentInfo;
  references: References;
  additional_info: AdditionalInfo;
}

export interface ApplicationsResponse {
  success: boolean;
  applications: Application[];
  total: number;
}

// Applications API
export const applicationsAPI = {
  /**
   * Submit new application
   */
  create: async (data: CreateApplicationData, documents: {
    idDocument: File;
    proofOfIncome: File;
    bankStatement?: File;
    employmentLetter?: File;
  }): Promise<Application> => {
    // Create FormData for file upload
    const formData = new FormData();
    
    // Append JSON data
    formData.append('property_id', data.property_id);
    formData.append('personal_info', JSON.stringify(data.personal_info));
    formData.append('employment_info', JSON.stringify(data.employment_info));
    formData.append('references', JSON.stringify(data.references));
    formData.append('additional_info', JSON.stringify(data.additional_info));
    
    // Append files
    formData.append('id_document', documents.idDocument);
    formData.append('proof_of_income', documents.proofOfIncome);
    if (documents.bankStatement) {
      formData.append('bank_statement', documents.bankStatement);
    }
    if (documents.employmentLetter) {
      formData.append('employment_letter', documents.employmentLetter);
    }
    
    const response = await apiClient.post<Application>('/api/v1/applications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  /**
   * Get user's applications
   */
  getMyApplications: async (): Promise<ApplicationsResponse> => {
    const response = await apiClient.get<ApplicationsResponse>('/api/v1/applications');
    return response.data;
  },

  /**
   * Get application by ID
   */
  getById: async (id: string): Promise<Application> => {
    const response = await apiClient.get<Application>(`/api/v1/applications/${id}`);
    return response.data;
  },

  /**
   * Approve application (landlord only)
   */
  approve: async (id: string): Promise<Application> => {
    const response = await apiClient.patch<Application>(`/api/v1/applications/${id}/approve`);
    return response.data;
  },

  /**
   * Reject application (landlord only)
   */
  reject: async (id: string, reason?: string): Promise<Application> => {
    const response = await apiClient.patch<Application>(`/api/v1/applications/${id}/reject`, {
      reason,
    });
    return response.data;
  },

  /**
   * Withdraw application (tenant only)
   */
  withdraw: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/applications/${id}`);
  },
};

export default applicationsAPI;
