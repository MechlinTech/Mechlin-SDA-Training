import api from "./api";

export const getAnalytics = (config) =>
  api.get("/analytics", config);