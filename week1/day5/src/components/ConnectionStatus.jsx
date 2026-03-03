import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket';

export function ConnectionStatus({ status, onReconnect }) {
    const [showDetails, setShowDetails] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(null);

    // Actually giving the reconnect button life!
    const wsService = useWebSocket();

    useEffect(() => {
        if (status === 'connected') {
            setLastUpdate(new Date());
        }
    }, [status]);

    const handleForceReconnect = () => {
        wsService.disconnect();
        setTimeout(() => {
            wsService.connect();
        }, 500);
    };

    const getStatusInfo = () => {
        switch (status) {
            case 'connected':
                return {
                    icon: <Wifi size={16} color="#10b981" />,
                    text: 'Connected',
                    color: '#10b981',
                    description: 'Streaming real-time updates from Node.js Mock Server via WebSockets'
                };
            case 'partial':
                return {
                    icon: <AlertTriangle size={16} color="#f59e0b" />,
                    text: 'Partial',
                    color: '#f59e0b',
                    description: 'Some data streams are experiencing errors'
                };
            case 'disconnected':
                return {
                    icon: <WifiOff size={16} color="#ef4444" />,
                    text: 'Disconnected',
                    color: '#ef4444',
                    description: 'WebSocket down. Falling back to HTTP Polling or manual refresh.'
                };
            default:
                return {
                    icon: <AlertTriangle size={16} color="#6b7280" />,
                    text: 'Connecting...',
                    color: '#6b7280',
                    description: 'Establishing socket connection'
                };
        }
    };

    const statusInfo = getStatusInfo();

    return (
        <div className="connection-status" onMouseLeave={() => setShowDetails(false)}>
            <div
                className="status-indicator"
                style={{ borderColor: showDetails ? statusInfo.color : 'transparent' }}
                onMouseEnter={() => setShowDetails(true)}
            >
                {statusInfo.icon}
                <span className="status-text" style={{ color: statusInfo.color }}>{statusInfo.text}</span>
            </div>

            {showDetails && (
                <div className="status-details">
                    <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                        {statusInfo.description}
                    </p>
                    {lastUpdate && (
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
                            Last ping: {lastUpdate.toLocaleTimeString()}
                        </div>
                    )}
                    {status === 'disconnected' && (
                        <button
                            onClick={handleForceReconnect}
                            style={{
                                width: '100%', padding: '8px', borderRadius: '6px',
                                background: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer',
                                fontWeight: 600, transition: 'background 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.background = '#2563eb'}
                            onMouseOut={(e) => e.target.style.background = '#3b82f6'}
                        >
                            Force Reconnect
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
