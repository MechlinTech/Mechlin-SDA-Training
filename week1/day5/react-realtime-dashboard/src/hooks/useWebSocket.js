import { useMemo, useEffect } from 'react';
import WebSocketService from '../services/WebSocketService';

export function useWebSocket(url = 'ws://localhost:3000') {
  // Use useMemo to ensure we only create one instance of the service
  const wsService = useMemo(() => {
    return new WebSocketService(url);
  }, [url]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      wsService.disconnect();
    };
  }, [wsService]);

  return wsService;
}
