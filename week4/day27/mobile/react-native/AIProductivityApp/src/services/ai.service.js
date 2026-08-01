import api from "./api";

export const sendMessage = async (
  prompt,
  config
) => {
  const response = await api.post(
    "/ai/chat",
    {
      prompt,
    },
    config
  );

  return response.data;
};