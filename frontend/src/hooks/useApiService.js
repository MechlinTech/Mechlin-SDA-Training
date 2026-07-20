import { useMemo } from "react";
import apiService from "../services/ApiService";

export function useApiService() {
  return useMemo(() => apiService, []);
}