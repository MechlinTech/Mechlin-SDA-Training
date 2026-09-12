import {
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';
import useApiService from './useApiService';
import useWebSocket from './useWebSocket';

export function useRealTimeData(endpoint, options = {}) {
    const {
        enableRealTime = false,
        wsUrl = ''
    } = options;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const apiService = useApiService();
    const wsService = useWebSocket(wsUrl);

    const lastUpdateRef = useRef(null);

    useEffect(() => {
        let cancelled = false;

        const fetchInitialData = async () => {
            try {
                setLoading(true);

                const initialData =
                    await apiService.get(endpoint);

                if (!cancelled) {
                    setData(initialData);
                    setError(null);
                    lastUpdateRef.current = Date.now();
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.message || 'Failed to fetch data'
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchInitialData();

        return () => {
            cancelled = true;
        };
    }, [endpoint, apiService]);

    useEffect(() => {
        if (!enableRealTime || !wsService) {
            return;
        }

        wsService.connect();

        return () => {
            wsService.disconnect();
        };
    }, [enableRealTime, wsService]);

    useEffect(() => {
        if (!enableRealTime || !wsService) {
            return;
        }

        const handleMessage = (message) => {
            const { type, payload } = message;

            if (
                type === 'dataUpdate' &&
                payload?.endpoint === endpoint
            ) {
                setData((previousData) => ({
                    ...(previousData || {}),
                    ...(payload.data || {})
                }));

                lastUpdateRef.current = Date.now();
            }
        };

        const unsubscribe = wsService.subscribe(
            'message',
            handleMessage
        );

        return unsubscribe;
    }, [endpoint, enableRealTime, wsService]);

    useEffect(() => {
        if (!wsService) {
            setIsConnected(false);
            return;
        }

        const handleConnected = () => {
            setIsConnected(true);
        };

        const handleDisconnected = () => {
            setIsConnected(false);
        };

        const unsubscribeConnected = wsService.subscribe(
            'connected',
            handleConnected
        );

        const unsubscribeDisconnected = wsService.subscribe(
            'disconnected',
            handleDisconnected
        );

        return () => {
            unsubscribeConnected();
            unsubscribeDisconnected();
        };
    }, [wsService]);

    const refresh = useCallback(async () => {
        try {
            setLoading(true);

            const freshData =
                await apiService.get(endpoint, {
                    cache: false
                });

            setData(freshData);
            setError(null);
            lastUpdateRef.current = Date.now();
        } catch (err) {
            setError(
                err.message || 'Failed to refresh data'
            );
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