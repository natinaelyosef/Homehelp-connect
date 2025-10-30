export const API_URL = 'http://localhost:8000';

export interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  created_at: string;
  provider_id: number;
  image: string;
  rating: number;
  provider_name: string;
}

export interface ServiceCreate {
  title: string;
  description: string;
  price: number;
  image?: string;
}

export interface ServiceUpdate {
  title?: string;
  description?: string;
  price?: number;
  image?: string;
  is_active?: boolean;
}

export interface ServiceUpdate extends Partial<ServiceCreate> {}

// Helper function to get auth token
const getAuthToken = (): string => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return token;
};

export const getServices = async (): Promise<Service[]> => {
  const response = await fetch(`${API_URL}/services/`);
  if (!response.ok) {
    throw new Error('Failed to fetch services');
  }
  return await response.json();
};

export const createService = async (serviceData: {
  title: string;
  description: string;
  price: number;
  image: string;
  rating?: number;
}): Promise<Service> => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('Authentication token not found. Please log in.');
  }

  try {
    // First get the current user's provider ID
    const userResponse = await fetch(`${API_URL}/auth/validate/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!userResponse.ok) {
      throw new Error('Failed to validate user');
    }

    const userData = await userResponse.json();
    
    // Add provider information to service data
    const fullServiceData = {
      ...serviceData,
      provider_id: userData.user_id,
      provider_name: userData.full_name || 'Provider'
    };

    const response = await fetch(`${API_URL}/services/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(fullServiceData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to create service');
    }

    return await response.json();
  } catch (error) {
    console.error('Service creation error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to create service');
  }
};

export const getService = async (id: number): Promise<Service> => {
  const response = await fetch(`${API_URL}/services/${id}`);
  if (!response.ok) {
    throw new Error('Service not found');
  }
  return await response.json();
};

export async function getServicesByProvider(): Promise<Service[]> {
  const response = await api.get("/provider/services");
  return response.data;
}

export const updateService = async (id: number, serviceData: Partial<ServiceCreate>): Promise<Service> => {
  const token = getAuthToken();
  
  const response = await fetch(`${API_URL}/services/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(serviceData),
  });

  if (!response.ok) {
    throw new Error('Failed to update service');
  }

  return await response.json();
};

export const deleteService = async (id: number): Promise<void> => {
  const token = getAuthToken();
  
  const response = await fetch(`${API_URL}/services/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to delete service');
  }
};

// lib/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)



export default api
