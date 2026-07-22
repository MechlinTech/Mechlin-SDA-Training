import apiService from "./ApiService";

class DashboardService {
  /**
   * Fetch complete dashboard data
   */
  async getDashboardMetrics() {
    try {
      // ----------------------------------
      // Fetch users only if authenticated
      // ----------------------------------
      let users = [];

      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          const usersResponse = await apiService.get("/users");

          users = Array.isArray(usersResponse.data)
            ? usersResponse.data
            : [];
        } catch (error) {
          console.warn("Unable to fetch users.", error);
        }
      }

      // ----------------------------------
      // Fetch products
      // ----------------------------------
      let products = [];

      try {
        const productsResponse = await apiService.get("/products");

        products = Array.isArray(productsResponse.data)
          ? productsResponse.data
          : [];
      } catch (error) {
        console.warn("Products endpoint unavailable.", error);
      }

      // ----------------------------------
      // Calculate dashboard metrics
      // ----------------------------------
      const totalRevenue = products.reduce(
        (sum, product) => sum + Number(product.price || 0),
        0
      );

      return {
        users: users.length,
        orders: products.length,
        revenue: Number(totalRevenue.toFixed(2)),
        growthRate: products.length > 0 ? 15.6 : 0,

        months: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
        ],

        // Placeholder values until historical analytics are implemented
        revenueHistory: [
          1200,
          1800,
          2500,
          3200,
          3900,
          Number(totalRevenue.toFixed(0)),
        ],

        // Placeholder until Posts API is implemented
        latestPosts: [],

        // Raw backend data for future dashboard widgets
        usersList: users,
        productsList: products,
      };
    } catch (error) {
      console.error("DashboardService Error:", error);

      // Safe fallback values
      return {
        users: 0,
        orders: 0,
        revenue: 0,
        growthRate: 0,

        months: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
        ],

        revenueHistory: [0, 0, 0, 0, 0, 0],

        latestPosts: [],
        usersList: [],
        productsList: [],
      };
    }
  }

  clearCache() {
    apiService.clearCache();
  }
}

const dashboardService = new DashboardService();

export default dashboardService;