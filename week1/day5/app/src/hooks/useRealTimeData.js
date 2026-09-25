/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef, useCallback } from "react";
import { useWebSocket } from "./useWebSocket";
import { useApiService } from "./useApiService";

export function useRealTimeData(endpoint, options = {}) {
  const {
    enableRealTime = true,
    websocketUrl = "ws://localhost:3000",
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const lastUpdateRef = useRef(null);

  const apiService = useApiService();

  const websocket = useWebSocket(
    enableRealTime ? websocketUrl : null,
    options
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiService.get(endpoint);
      setData(result);
      lastUpdateRef.current = new Date();
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [apiService, endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!enableRealTime) {
      return;
    }

    const unsubscribeMessage = websocket.subscribe(
      "message",
      (message) => {
        if (message.type !== "dataUpdate") {
          return;
        }

        const payload = message.payload;

        if (payload?.endpoint !== endpoint) {
          return;
        }

        setData((previousData) => ({
          ...(previousData || {}),
          ...(payload.data || {}),
        }));

        lastUpdateRef.current = new Date();
      }
    );

    const unsubscribeConnected = websocket.subscribe(
      "connected",
      () => {
        setIsConnected(true);
      }
    );

    const unsubscribeDisconnected = websocket.subscribe(
      "disconnected",
      () => {
        setIsConnected(false);
      }
    );

    const unsubscribeError = websocket.subscribe(
      "error",
      () => {
        setIsConnected(false);
      }
    );

    return () => {
      unsubscribeMessage();
      unsubscribeConnected();
      unsubscribeDisconnected();
      unsubscribeError();
    };
  }, [enableRealTime, endpoint, websocket]);

  const refresh = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  const getLastUpdate = useCallback(() => {
    return lastUpdateRef.current;
  }, []);

  return {
    data,
    loading,
    error,
    isConnected,
    refresh,
    getLastUpdate,
  };
}

export default useRealTimeData;
