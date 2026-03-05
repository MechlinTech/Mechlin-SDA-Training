

class WebSocketService {
    constructor(url, options = {}) {
        this.url = url;
        this.options = {
            reconnectInterval: 5000,     // Wait 5 seconds before trying to reconnect
            maxReconnectAttempts: 10,    // Don't try forever to avoid draining phone batteries
            heartbeatInterval: 30000,    // Send a pulse every 30 seconds
            ...options
        };

        // Internal State
        this.ws = null;               // The actual WebSocket instance
        this.reconnectAttempts = 0;
        this.heartbeatTimer = null;   // The interval ID for the ping loop
        this.subscribers = new Map(); // Like a dictionary of { eventName: [callbacks] }
        this.messageQueue = [];       // Messages waiting to be sent
        this.isConnected = false;
    }

    connect() {
        try {
            this.ws = new WebSocket(this.url);
            this.setupEventListeners(); // Attach close/message/error hooks
        } catch (error) {
            console.error('WebSocket connection failed:', error);
            this.handleReconnect();
        }
    }

    setupEventListeners() {
        // 1. When the connection successfully opens
        this.ws.onopen = () => {
            console.log('[WebSocketService] Connected');
            this.isConnected = true;
            this.reconnectAttempts = 0; // Reset attempts on successful connection

            this.startHeartbeat();      // Start keeping the connection alive
            this.processMessageQueue(); // Flush any messages that queued while disconnected

            this.notifySubscribers('connected', null); // Tell UI we are green
        };

        // 2. When the server pushes data to us
        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handleMessage(data); // Route the message to whoever cares
            } catch (error) {
                console.error('Failed to parse WebSocket message:', error);
            }
        };

        // 3. When the connection drops (either cleanly or due to network error)
        this.ws.onclose = (event) => {
            console.log('[WebSocketService] Disconnected:', event.code, event.reason);
            this.isConnected = false;
            this.stopHeartbeat(); // Stop pinging, it's dead
            this.notifySubscribers('disconnected', { code: event.code, reason: event.reason });

            // If the close wasn't intentional by us, try to automatically reconnect
            if (!event.wasClean) {
                this.handleReconnect();
            }
        };

        // 4. Edge-case native errors
        this.ws.onerror = (error) => {
            console.error('[WebSocketService] error:', error);
            this.notifySubscribers('error', error);
        };
    }

    // Parses incoming data format: { type: 'something', payload: { ... } }
    handleMessage(data) {
        const { type, payload } = data;

        // If the server was just replying to our pulse, do nothing
        if (type === 'pong') {
            return;
        }

        // Let global listeners know a raw message arrived
        this.notifySubscribers('message', { type, payload });

        // Notify specific event listeners (e.g., someone waiting specifically for 'dataUpdate')
        if (this.subscribers.has(type)) {
            this.subscribers.get(type).forEach(callback => callback(payload));
        }
    }

    // Safe wrapper to push data to the server
    send(data) {
        if (this.isConnected && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        } else {
            console.warn('[WebSocketService] Offline. Queuing message.');
            this.messageQueue.push(data);
        }
    }

    // Allows React components to attach a listener (e.g., set connection status to yellow/green)
    subscribe(eventType, callback) {
        if (!this.subscribers.has(eventType)) {
            this.subscribers.set(eventType, new Set());
        }
        this.subscribers.get(eventType).add(callback);

        // Return a cleanup function so React's useEffect can easily detach it when unmounting
        return () => {
            if (this.subscribers.has(eventType)) {
                this.subscribers.get(eventType).delete(callback);
            }
        };
    }

    notifySubscribers(event, data) {
        if (this.subscribers.has(event)) {
            this.subscribers.get(event).forEach(callback => callback(data));
        }
    }

    // --- Heartbeat Logic ---
    startHeartbeat() {
        this.heartbeatTimer = setInterval(() => {
            if (this.isConnected) {
                this.send({ type: 'ping' }); // We expect a 'pong' back from server.js
            }
        }, this.options.heartbeatInterval);
    }

    stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }

    // Empty the backlog of unsent commands
    processMessageQueue() {
        while (this.messageQueue.length > 0 && this.isConnected) {
            const message = this.messageQueue.shift();
            this.send(message);
        }
    }

    // Auto-Recovery Strategy
    handleReconnect() {
        if (this.reconnectAttempts < this.options.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`[WebSocketService] Attempting to reconnect (${this.reconnectAttempts}/${this.options.maxReconnectAttempts})`);

            // Wait X seconds before actually invoking connect() again to prevent spamming
            setTimeout(() => {
                this.connect();
            }, this.options.reconnectInterval);
        } else {
            console.error('[WebSocketService] Max reconnection attempts reached. Gave up.');
            this.notifySubscribers('maxReconnectAttemptsReached', null);
        }
    }

    // Intentional tear down when app closes or logs out
    disconnect() {
        this.stopHeartbeat();
        if (this.ws) {
            this.ws.close(1000, 'Client disconnect'); // 1000 is the Normal Closure standard code
        }
        this.isConnected = false;
    }

    getConnectionState() {
        return {
            isConnected: this.isConnected,
            reconnectAttempts: this.reconnectAttempts,
            url: this.url
        };
    }
}

export default WebSocketService;
