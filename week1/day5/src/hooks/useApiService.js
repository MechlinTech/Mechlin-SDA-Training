import ApiService from '../services/ApiService';

// Note: In development, vite proxy is routing `/api` to `localhost:3001`
const apiServiceInstance = new ApiService('');

export function useApiService() {
    return apiServiceInstance;
}
