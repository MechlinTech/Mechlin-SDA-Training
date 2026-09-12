import { useEffect, useMemo } from 'react';
import WebSocketService from '../services/WebSocketService';

const useWebSocket = (url, options = {}) => {
    const wsService = useMemo(() => {
        if (!url) return null;

        return new WebSocketService(url, options);
    }, [url]);

    useEffect(() => {
        return () => {
            if (wsService) {
                wsService.disconnect();
            }
        };
    }, [wsService]);

    return wsService;
};

export default useWebSocket;