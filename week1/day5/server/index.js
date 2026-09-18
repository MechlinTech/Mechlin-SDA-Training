const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const http = require('http');

const app = express();
app.use(cors());
app.use(express.json());

// Mock Data Generators
const generateData = (baseTotal) => ({
  total: baseTotal + Math.floor(Math.random() * 1000),
  change: (Math.random() * 10 - 5).toFixed(1),
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  values: Array.from({length: 7}, () => Math.floor(Math.random() * baseTotal / 5))
});

// REST API Endpoints
app.get('/api/revenue', (req, res) => res.json(generateData(40000)));
app.get('/api/users', (req, res) => res.json(generateData(8000)));
app.get('/api/orders', (req, res) => res.json(generateData(1200)));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  
  // Real-time data streaming
  const interval = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({
        type: 'dataUpdate',
        payload: { endpoint: '/api/revenue', data: generateData(40000) }
      }));
      ws.send(JSON.stringify({
        type: 'dataUpdate',
        payload: { endpoint: '/api/users', data: generateData(8000) }
      }));
      ws.send(JSON.stringify({
        type: 'dataUpdate',
        payload: { endpoint: '/api/orders', data: generateData(1200) }
      }));
    }
  }, 5000); // Push updates every 5 seconds

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.type === 'ping') ws.send(JSON.stringify({ type: 'pong' }));
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

server.listen(3000, () => {
  console.log('Mock Backend & WebSocket Server running on port 3000');
});
