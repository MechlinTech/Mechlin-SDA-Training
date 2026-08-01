import api from "./api";

export const getAnalytics = async (config) => {
  const response = await api.get(
    "/analytics",
    config
  );

  return response.data;
};