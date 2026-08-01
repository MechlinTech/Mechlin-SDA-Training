import api from "./api";

export const getTasks = async (config) => {
  const response = await api.get("/tasks", config);

  return response.data;
};

export const createTask = async (
  task,
  config
) => {
  const response = await api.post(
    "/tasks",
    task,
    config
  );

  return response.data;
};

export const updateTask = async (
  id,
  task,
  config
) => {
  const response = await api.put(
    `/tasks/${id}`,
    task,
    config
  );

  return response.data;
};

export const deleteTask = async (
  id,
  config
) => {
  const response = await api.delete(
    `/tasks/${id}`,
    config
  );

  return response.data;
};