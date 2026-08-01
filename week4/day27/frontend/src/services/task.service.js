import api from "./api";

export const getTasks = (config) =>
  api.get("/tasks", config);

export const createTask = (data, config) =>
  api.post("/tasks", data, config);

export const updateTask = (id, data, config) =>
  api.put(`/tasks/${id}`, data, config);

export const deleteTask = (id, config) =>
  api.delete(`/tasks/${id}`, config);