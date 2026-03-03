import WebSocketService from '../services/WebSocketService';

// The port 3002 matches our Express WS server port in server.js
const wsServiceInstance = new WebSocketService('ws://localhost:3002');

export function useWebSocket() {
    return wsServiceInstance;
}
