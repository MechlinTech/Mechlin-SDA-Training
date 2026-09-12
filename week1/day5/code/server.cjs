const WebSocket = require('ws');

const PORT = 8080;

const wss = new WebSocket.Server({
    port: PORT
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.send(
        JSON.stringify({
            type: 'connected',
            message: 'WebSocket connection established'
        })
    );

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message.toString());

            console.log('Received:', data);

            if (data.type === 'ping') {
                ws.send(
                    JSON.stringify({
                        type: 'pong'
                    })
                );
            }
        } catch (error) {
            console.error('Invalid message:', error.message);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error.message);
    });
});

// Send simulated real-time updates every 10 seconds
setInterval(() => {
    const updates = [
        {
            endpoint: '/api/revenue',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                values: [
                    12000,
                    18000,
                    24000,
                    31000,
                    39000,
                    Math.floor(47000 + Math.random() * 5000)
                ]
            }
        },
        {
            endpoint: '/api/users',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                values: [
                    120,
                    180,
                    250,
                    320,
                    410,
                    Math.floor(520 + Math.random() * 50)
                ]
            }
        },
        {
            endpoint: '/api/orders',
            data: {
                labels: [
                    'Completed',
                    'Pending',
                    'Cancelled',
                    'Returned'
                ],
                values: [
                    Math.floor(450 + Math.random() * 50),
                    120,
                    50,
                    30
                ]
            }
        }
    ];

    updates.forEach((update) => {
        const message = {
            type: 'dataUpdate',
            payload: update
        };

        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });

        console.log(
            `Real-time update sent for ${update.endpoint}`
        );
    });
}, 10000);