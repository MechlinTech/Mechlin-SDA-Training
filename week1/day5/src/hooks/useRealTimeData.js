import { useState, useEffect, useCallback, useRef } from 'react';
import { useWebSocket } from './useWebSocket';
import { useApiService } from './useApiService';

/*
  useRealTimeData.js
  ------------------
  This Custom Hook perfectly blends the initial API fetch (REST) with subsequent real-time WebSocket updates.
  
  How it works:
  1. On mount: It uses ApiService to fetch the initial data (e.g. current revenue) so the UI has immediate data.
  2. Subscribes to WebSockets: It listens to the central WebSocket manager for any 'dataUpdate' message targeting its `endpoint`.
  3. Seamless UI Updates: When a ping arrives from the server, it merges the UI state without needing to refresh the page.
*/
export function useRealTimeData(endpoint, options = {}) {
    // Typical State machinery for API loading
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    // We use our wrapper hooks which return singletons so all components share the same connection
    const apiService = useApiService();
    const wsService = useWebSocket();
    const lastUpdateRef = useRef(null); // Keep track of the exact timestamp of last push

    // INITIAL LOAD (REST API)
    // This useEffect runs once when the component mounts (or when endpoint changes)
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                // Call our cached fetch wrapper
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

    // WEBSOCKET CONNECT LIFECYCLE
    useEffect(() => {
        if (options.enableRealTime) {
            wsService.connect(); // Kickoff the connection if it's not already up
        }

        // React Cleanup Function (Runs when component unmounts)
        return () => {
            if (options.enableRealTime) {
                // wsService.disconnect(); // NOTE: If multiple components are using WS, you usually don't want a single component closing it!
                // We leave it connected here for simplicity of shared state, or manage refs. 
            }
        };
    }, [options.enableRealTime, wsService]);

    // HANDLE REAL-TIME MESSAGES
    useEffect(() => {
        if (!options.enableRealTime) return;

        // This block triggers whenever the WebSocket service says "I got a raw message"
        const handleMessage = (message) => {
            const { type, payload } = message;

            // If it's a 'dataUpdate' and matches OUR endpoint (e.g. '/api/users'), we update state!
            if (type === 'dataUpdate' && payload.endpoint === endpoint) {
                setData(prevData => ({
                    ...prevData,      // keep existing fields
                    ...payload.data   // overwrite with fresh server data
                }));
                lastUpdateRef.current = Date.now(); // Record the exact timestamp
            }
        };

        // Subscribing returns the cleanup/unsubscribe function
        const unsubscribe = wsService.subscribe('message', handleMessage);
        return unsubscribe; // Crucial to prevent duplicate listener memory leaks
    }, [endpoint, options.enableRealTime, wsService]);

    // MONITOR CONNECTION STATUS (Green / Yellow / Red LED Logic)
    useEffect(() => {
        const handleConnectionChange = (status) => {
            setIsConnected(status === 'connected');
        };

        // Listen specifically to the 'connected' broadcast. 
        // We should also look at 'disconnected' based on WebSocketService, but we handle status='connected' boolean here
        const unSubConnect = wsService.subscribe('connected', () => handleConnectionChange('connected'));
        const unSubDisconnect = wsService.subscribe('disconnected', () => handleConnectionChange('disconnected'));

        // Check initial state incase it was already green
        setIsConnected(wsService.isConnected);

        return () => {
            unSubConnect();
            unSubDisconnect();
        };
    }, [wsService]);

    // MANUAL REFRESH (Provides an escape hatch if WS fails and User clicks "Refresh")
    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            const freshData = await apiService.get(endpoint, { cache: false }); // Force bypass cache
            setData(freshData);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [endpoint, apiService]);

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
