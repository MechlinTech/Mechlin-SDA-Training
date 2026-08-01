import api from "./api";

export const chat = (message, config) =>
  api.post("/ai/chat", { message }, config);