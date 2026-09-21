const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, {
      "Content-Type": "application/json"
    });

    res.end(
      JSON.stringify({
        status: "healthy",
        timestamp: new Date().toISOString()
      })
    );

    return;
  }

  res.writeHead(200, {
    "Content-Type": "application/json"
  });

  res.end(
    JSON.stringify({
      message: "SDA Training Day 16 application",
      environment: process.env.NODE_ENV || "development"
    })
  );
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});