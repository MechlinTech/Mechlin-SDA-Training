import { useEffect } from "react";
import websocketService from "../services/WebSocketService";

export function useWebSocket(onMessage) {
  useEffect(() => {
    // websocketService.connect("wss://echo.websocket.events");

    const unsubscribe =
      websocketService.subscribe(onMessage);

    return () => {
      unsubscribe();
    };
  }, [onMessage]);

  return websocketService;
}