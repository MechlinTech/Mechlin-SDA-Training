import { useMemo } from "react";
import ApiService from "../services/ApiService";

const API_BASE_URL = "http://localhost:3000";

export function useApiService() {
  const apiService = useMemo(() => {
    return new ApiService(API_BASE_URL);
  }, []);

  return apiService;
}

export default useApiService;
