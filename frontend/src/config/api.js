export const API_CONFIG = {
  BASE_URL: "http://localhost:3000/api",

  TIMEOUT: 10000,

  RETRY_ATTEMPTS: 3,

  RETRY_DELAY: 1000,

  CACHE_TTL: 5 * 60 * 1000
};

export const API_ENDPOINTS = {
  USERS: "/users",
  PRODUCTS: "/products",
  POSTS: "/posts",
  COMMENTS: "/comments",
  TODOS: "/todos"
};