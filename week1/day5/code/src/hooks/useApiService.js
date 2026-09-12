import { useMemo } from 'react';
import ApiService from '../services/ApiService';

const useApiService = () => {
    const apiService = useMemo(() => {
        return new ApiService('', {
            retryAttempts: 3,
            retryDelay: 1000,
            timeout: 10000
        });
    }, []);

    return apiService;
};

export default useApiService;