import { useState, useEffect, useCallback, useRef } from 'react';
import { useWebSocket } from './useWebSocket';
import { useApiService } from './useApiService';

export function useRealTimeData(endpoint, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const apiService = useApiService();
  const wsService = useWebSocket(options.wsUrl);
  const lastUpdateRef = useRef(null);

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const initialData = await apiService.get(endpoint);
        setData(initialData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [endpoint, apiService]);

  // WebSocket connection management
  useEffect(() => {
    if (options.enableRealTime) {
      wsService.connect();
    }

    return () => {
      if (options.enableRealTime) {
        wsService.disconnect();
      }
    };
  }, [options.enableRealTime, wsService]);

  // Handle WebSocket messages
  useEffect(() => {
    if (!options.enableRealTime) return;

    const handleMessage = (message) => {
      const { type, payload } = message;
      
      if (type === 'dataUpdate' && payload.endpoint === endpoint) {
        setData(prevData => ({
          ...prevData,
          ...payload.data
        }));
        lastUpdateRef.current = Date.now();
      }
    };

    const unsubscribe = wsService.subscribe('message', handleMessage);
    return unsubscribe;
  }, [endpoint, options.enableRealTime, wsService]);

  // Connection status
  useEffect(() => {
    const handleConnectionChange = (status) => {
      setIsConnected(status === 'connected');
    };

    const unsubscribe = wsService.subscribe('connected', handleConnectionChange);
    return unsubscribe;
  }, [wsService]);

  // Manual refresh
  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const freshData = await apiService.get(endpoint);
      setData(freshData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, apiService]);

  // Get last update time
  const getLastUpdate = useCallback(() => {
    return lastUpdateRef.current;
  }, []);

  return {
    data,
    loading,
    error,
    isConnected,
    refresh,
    getLastUpdate
  };
}