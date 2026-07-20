class WebSocketService {
    constructor() {
      this.socket = null;
      this.listeners = [];
      this.statusListeners = [];
      this.connectionStatus = "disconnected";
    }
  
    connect(url) {
      try {
        this.socket = new WebSocket(url);
  
        this.socket.onopen = () => {
          this.connectionStatus = "connected";
          this.notifyStatus();
        };
  
        this.socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          this.listeners.forEach((listener) => listener(data));
        };
  
        this.socket.onclose = () => {
          this.connectionStatus = "disconnected";
          this.notifyStatus();
        };
  
        this.socket.onerror = () => {
          this.connectionStatus = "error";
          this.notifyStatus();
        };
      } catch (error) {
        this.connectionStatus = "error";
        this.notifyStatus();
      }
    }
  
    disconnect() {
      if (this.socket) {
        this.socket.close();
      }
    }
  
    subscribe(callback) {
      this.listeners.push(callback);
  
      return () => {
        this.listeners = this.listeners.filter(
          (listener) => listener !== callback
        );
      };
    }
  
    subscribeStatus(callback) {
      this.statusListeners.push(callback);
  
      callback(this.connectionStatus);
  
      return () => {
        this.statusListeners = this.statusListeners.filter(
          (listener) => listener !== callback
        );
      };
    }
  
    notifyStatus() {
      this.statusListeners.forEach((listener) =>
        listener(this.connectionStatus)
      );
    }
  }
  
  export default new WebSocketService();