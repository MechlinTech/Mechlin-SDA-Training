import { useEffect, useMemo, useCallback } from "react";
import WebSocketService from "../services/WebSocketService";

export function useWebSocket(url, options = {}) {
  const service = useMemo(() => {
    if (!url) {
      return null;
    }

    return new WebSocketService(url, options);
  }, [url]);

  useEffect(() => {
    if (!service) {
      return;
    }

    service.connect();

    return () => {
      service.disconnect();
    };
  }, [service]);

  const subscribe = useCallback(
    (eventType, callback) => {
      if (!service) {
        return () => {};
      }

      return service.subscribe(eventType, callback);
    },
    [service]
  );

  const send = useCallback(
    (message) => {
      service?.send(message);
    },
    [service]
  );

  const disconnect = useCallback(() => {
    service?.disconnect();
  }, [service]);

  const connect = useCallback(() => {
    service?.connect();
  }, [service]);

  const getConnectionState = useCallback(() => {
    return service?.getConnectionState() || "CLOSED";
  }, [service]);

  return {
    subscribe,
    send,
    connect,
    disconnect,
    getConnectionState,
  };
}

export default useWebSocket;