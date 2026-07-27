function initializeSocket(io) {
    io.on("connection", (socket) => {
      console.log(`🔌 Client Connected: ${socket.id}`);
  
      socket.on("join", (room) => {
        socket.join(room);
  
        console.log(`${socket.id} joined room: ${room}`);
      });
  
      socket.on("user:update", (user) => {
        socket.broadcast.emit("user:updated", user);
      });
  
      socket.on("order:create", (order) => {
        socket.broadcast.emit("order:created", order);
      });
  
      socket.on("disconnect", () => {
        console.log(`❌ Client Disconnected: ${socket.id}`);
      });
    });
  }
  
  module.exports = initializeSocket;