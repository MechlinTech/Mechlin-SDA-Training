import http from "http";
import { WebSocketServer } from "ws";

const PORT = 3000;

let dashboardData = {
  revenue: {
    value: 125000,
    change: 12.5,
    values: [82000, 91000, 97000, 108000, 115000, 125000],
  },
  users: {
    value: 8420,
    change: 8.4,
    values: [5200, 5900, 6400, 7100, 7800, 8420],
  },
  orders: {
    value: 3240,
    change: 15.2,
    values: [1800, 2100, 2350, 2670, 2940, 3240],
  },
};

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== "GET") {
    res.writeHead(405, {
      "Content-Type": "application/json",
    });

    res.end(JSON.stringify({
      error: "Method not allowed",
    }));

    return;
  }

  const routes = {
    "/api/revenue": dashboardData.revenue,
    "/api/users": dashboardData.users,
    "/api/orders": dashboardData.orders,
  };

  const data = routes[req.url];

  if (!data) {
    res.writeHead(404, {
      "Content-Type": "application/json",
    });

    res.end(JSON.stringify({
      error: "Endpoint not found",
    }));

    return;
  }

  res.writeHead(200, {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
  });

  res.end(JSON.stringify(data));
});

const wss = new WebSocketServer({
  server,
});

wss.on("connection", (socket) => {
  console.log("WebSocket client connected");

  socket.send(
    JSON.stringify({
      type: "connected",
      payload: {
        message: "Real-time connection established",
      },
    })
  );

  socket.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === "ping") {
        socket.send(
          JSON.stringify({
            type: "pong",
            payload: {
              timestamp: Date.now(),
            },
          })
        );
      }
    } catch (error) {
      console.error("Invalid WebSocket message:", error.message);
    }
  });

  socket.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});

function updateData() {
  dashboardData.revenue.value += Math.floor(Math.random() * 3000);
  dashboardData.users.value += Math.floor(Math.random() * 100);
  dashboardData.orders.value += Math.floor(Math.random() * 50);

  dashboardData.revenue.values.push(dashboardData.revenue.value);
  dashboardData.users.values.push(dashboardData.users.value);
  dashboardData.orders.values.push(dashboardData.orders.value);

  dashboardData.revenue.values =
    dashboardData.revenue.values.slice(-6);

  dashboardData.users.values =
    dashboardData.users.values.slice(-6);

  dashboardData.orders.values =
    dashboardData.orders.values.slice(-6);

  broadcastUpdate("/api/revenue", dashboardData.revenue);
  broadcastUpdate("/api/users", dashboardData.users);
  broadcastUpdate("/api/orders", dashboardData.orders);
}

function broadcastUpdate(endpoint, data) {
  const message = JSON.stringify({
    type: "dataUpdate",
    payload: {
      endpoint,
      data,
      timestamp: Date.now(),
    },
  });

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}

setInterval(updateData, 5000);

server.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
  console.log(`WebSocket server running at ws://localhost:${PORT}`);
});