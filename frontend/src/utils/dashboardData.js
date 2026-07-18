export function generateDashboardData(userCount) {
    return {
      users: userCount,
  
      revenue: Math.floor(Math.random() * 500000) + 100000,
  
      orders: Math.floor(Math.random() * 1000) + 100,
  
      growth: (Math.random() * 15 + 5).toFixed(1),
  
      revenueHistory: [
        120,
        150,
        180,
        170,
        220,
        250,
        Math.floor(Math.random() * 100) + 250,
      ],
  
      months: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
      ],
    };
  }