import { DataManager } from "./DataManager";

const API_URL = "https://dummyjson.com";

class DashboardService extends DataManager {
  constructor() {
    super(API_URL);
  }

  /**
   * Fetch complete dashboard data
   */
  async getDashboardMetrics() {
    try {
      const [users, products, posts] = await Promise.all([
        this.get("/users"),
        this.get("/products"),
        this.get("/posts"),
      ]);

      const totalRevenue = products.products.reduce(
        (sum, product) => sum + product.price,
        0
      );

      return {
        users: users.total,
        orders: products.total,
        revenue: Number(totalRevenue.toFixed(2)),
        growthRate: 15.6,

        months: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
        ],

        revenueHistory: [
          1200,
          1800,
          2500,
          3200,
          3900,
          Number(totalRevenue.toFixed(0)),
        ],

        latestPosts: posts.posts.slice(0, 5),
      };
    } catch (error) {
      console.error("DashboardService Error:", error);
      throw error;
    }
  }
}

const dashboardService = new DashboardService();

export default dashboardService;