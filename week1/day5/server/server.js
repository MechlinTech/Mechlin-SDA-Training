const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');

const app = express();
const PORT = 3001;
const WS_PORT = 3002;

app.use(cors());
app.use(express.json());

// Mock Data State to simulate a database returning the requested business metrics
let dataState = {
    revenue: { total: 154200, change: 12.5 },
    users: { total: 8430, change: 5.2 },
    orders: { total: 1250, change: -2.4 }
};

// --- REST API ENDPOINTS ---

app.get('/api/revenue', (req, res) => {
    res.json(dataState.revenue);
});

app.get('/api/users', (req, res) => {
    res.json(dataState.users);
});

app.get('/api/orders', (req, res) => {
    res.json(dataState.orders);
});

// Start Express Server
app.listen(PORT, () => {
    console.log(`[REST API] Server running on http://localhost:${PORT}`);
});

// --- WEBSOCKET SERVER ---
// The WebSocket server handles real-time bidirectional communication.
const wss = new WebSocketServer({ port: WS_PORT }, () => {
    console.log(`[WebSocket] Server running on ws://localhost:${WS_PORT}`);
});

wss.on('connection', (ws) => {
    console.log('[WebSocket] Client connected');

    // Handle incoming messages from the client
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            // Respond to heartbeat pings with a pong
            if (data.type === 'ping') {
                ws.send(JSON.stringify({ type: 'pong' }));
            }
        } catch (e) {
            console.error('Failed to parse WebSocket message', e);
        }
    });

    ws.on('close', () => {
        console.log('[WebSocket] Client disconnected');
    });
});

// Broadcast updates to simulate moving (live) data
// Every 3 seconds, we tweak the mock data slightly and push it to all connected sockets
setInterval(() => {
    const revenueDelta = (Math.random() * 2000) - 1000;
    const userDelta = Math.floor(Math.random() * 20) - 5;
    const orderDelta = Math.floor(Math.random() * 10) - 2;

    dataState.revenue.total += revenueDelta;
    dataState.revenue.change += (Math.random() * 0.4) - 0.2;

    dataState.users.total += userDelta;
    dataState.users.change += (Math.random() * 0.2) - 0.1;

    dataState.orders.total += orderDelta;
    dataState.orders.change += (Math.random() * 0.2) - 0.1;

    // The hook implementation expects payload.endpoint to match the API path it's managing
    const updatePayload = {
        revenue: {
            endpoint: '/api/revenue',
            data: {
                total: parseFloat(dataState.revenue.total.toFixed(2)),
                change: parseFloat(dataState.revenue.change.toFixed(2))
            }
        },
        users: {
            endpoint: '/api/users',
            data: {
                total: Math.max(0, dataState.users.total),
                change: parseFloat(dataState.users.change.toFixed(2))
            }
        },
        orders: {
            endpoint: '/api/orders',
            data: {
                total: Math.max(0, dataState.orders.total),
                change: parseFloat(dataState.orders.change.toFixed(2))
            }
        }
    };

    // Broadcast to all active clients
    wss.clients.forEach(client => {
        if (client.readyState === 1) { // 1 = OPEN
            client.send(JSON.stringify({ type: 'dataUpdate', payload: updatePayload.revenue }));
            client.send(JSON.stringify({ type: 'dataUpdate', payload: updatePayload.users }));
            client.send(JSON.stringify({ type: 'dataUpdate', payload: updatePayload.orders }));
        }
    });
}, 3000);
