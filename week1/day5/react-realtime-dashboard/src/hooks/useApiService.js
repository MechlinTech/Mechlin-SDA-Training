import { useMemo } from 'react';
import ApiService from '../services/ApiService';

export function useApiService() {
  // Use useMemo to ensure we only create one instance of the service
  const apiService = useMemo(() => {
    // In a real app, this URL would come from environment variables
    return new ApiService('http://localhost:3000');
  }, []);

  return apiService;
}
