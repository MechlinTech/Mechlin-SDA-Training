class ApiService {
  constructor() {
    this.baseURL =
      process.env.REACT_APP_API_URL || "http://localhost:3000/api/v1";

    this.token = localStorage.getItem("authToken");
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(this.token && {
          Authorization: `Bearer ${this.token}`
        }),
        ...(options.headers || {})
      }
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message || "Request failed"
        );
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  async login(credentials) {
    const response = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials)
    });

    if (response.data.accessToken) {
      this.token = response.data.accessToken;
      localStorage.setItem("authToken", this.token);
    }

    return response;
  }

  async logout() {
    this.token = null;
    localStorage.removeItem("authToken");
  }

  async getUsers(filters = {}) {
    const queryParams = new URLSearchParams(filters);

    return this.request(`/users?${queryParams}`);
  }

  async getUser(id) {
    return this.request(`/users/${id}`);
  }

  async updateUser(id, data) {
    return this.request(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  }

  async getProducts(filters = {}) {
    const queryParams = new URLSearchParams(filters);

    return this.request(`/products?${queryParams}`);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async getOrders(filters = {}) {
    const queryParams = new URLSearchParams(filters);

    return this.request(`/orders?${queryParams}`);
  }

  async createOrder(orderData) {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify(orderData)
    });
  }

  async getAnalytics(timeRange = "30d") {
    return this.request(
      `/analytics?timeRange=${timeRange}`
    );
  }
}

module.exports = new ApiService();