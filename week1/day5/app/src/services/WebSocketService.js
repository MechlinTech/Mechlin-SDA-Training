class WebSocketService {
  constructor(url, options = {}) {
    this.url = url;
    this.reconnectInterval = options.reconnectInterval || 5000;
    this.maxReconnectAttempts = options.maxReconnectAttempts || 10;
    this.heartbeatInterval = options.heartbeatInterval || 30000;

    this.ws = null;
    this.reconnectAttempts = 0;
    this.heartbeatTimer = null;
    this.subscribers = new Map();
    this.messageQueue = [];
    this.isConnected = false;
  }

  connect() {
    if (
      this.ws &&
      (this.ws.readyState === WebSocket.OPEN ||
        this.ws.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    try {
      this.ws = new WebSocket(this.url);
      this.setupEventListeners();
    } catch (error) {
      this.notifySubscribers("error", error);
      this.handleReconnect();
    }
  }

  setupEventListeners() {
    this.ws.onopen = () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;

      this.startHeartbeat();
      this.processMessageQueue();

      this.notifySubscribers("connected", {
        type: "connected",
      });
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
        this.notifySubscribers("error", error);
      }
    };

    this.ws.onclose = (event) => {
      const wasClean = event.wasClean;

      this.isConnected = false;
      this.stopHeartbeat();

      this.notifySubscribers("disconnected", {
        type: "disconnected",
        wasClean,
      });

      if (!wasClean) {
        this.handleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      this.notifySubscribers("error", error);
    };
  }

  handleMessage(message) {
    const { type, payload } = message;

    if (type === "pong") {
      return;
    }

    this.notifySubscribers("message", message);

    if (type) {
      this.notifySubscribers(type, payload);
    }
  }

  send(message) {
    const data = typeof message === "string" ? message : JSON.stringify(message);

    if (this.isConnected && this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    } else {
      this.messageQueue.push(data);
    }
  }

  subscribe(eventType, callback) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }

    this.subscribers.get(eventType).add(callback);

    return () => {
      const callbacks = this.subscribers.get(eventType);

      if (callbacks) {
        callbacks.delete(callback);

        if (callbacks.size === 0) {
          this.subscribers.delete(eventType);
        }
      }
    };
  }

  notifySubscribers(eventType, data) {
    const callbacks = this.subscribers.get(eventType);

    if (!callbacks) {
      return;
    }

    callbacks.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Subscriber error for "${eventType}":`, error);
      }
    });
  }

  startHeartbeat() {
    this.stopHeartbeat();

    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected) {
        this.send({
          type: "ping",
          timestamp: Date.now(),
        });
      }
    }, this.heartbeatInterval);
  }

  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  processMessageQueue() {
    while (this.messageQueue.length > 0 && this.isConnected) {
      const message = this.messageQueue.shift();

      try {
        this.ws.send(message);
      } catch (error) {
        console.error("Failed to send queued message:", error);
        this.messageQueue.unshift(message);
        break;
      }
    }
  }

  handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.notifySubscribers("error", {
        message: "Maximum reconnect attempts reached",
      });

      return;
    }

    this.reconnectAttempts += 1;

    setTimeout(() => {
      if (!this.isConnected) {
        this.connect();
      }
    }, this.reconnectInterval);
  }

  disconnect() {
    this.stopHeartbeat();

    if (this.ws) {
      this.ws.close(1000, "Client disconnected");
      this.ws = null;
    }

    this.isConnected = false;
    this.reconnectAttempts = 0;
  }

  getConnectionState() {
    if (!this.ws) {
      return "CLOSED";
    }

    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return "CONNECTING";

      case WebSocket.OPEN:
        return "OPEN";

      case WebSocket.CLOSING:
        return "CLOSING";

      case WebSocket.CLOSED:
      default:
        return "CLOSED";
    }
  }
}

export default WebSocketService;