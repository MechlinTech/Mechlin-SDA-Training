import React, { useEffect, useState } from 'react';

const ConnectionStatus = ({ status, onReconnect }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(null);

    useEffect(() => {
        if (status === 'connected') {
            setLastUpdate(new Date());
        }
    }, [status]);

    const getStatusInfo = () => {
        switch (status) {
            case 'connected':
                return {
                    icon: '🟢',
                    text: 'Connected',
                    color: '#10b981',
                    description:
                        'All services are connected and receiving real-time updates.'
                };

            case 'partial':
                return {
                    icon: '🟡',
                    text: 'Partial Connection',
                    color: '#f59e0b',
                    description:
                        'Some services are connected, while others may be experiencing issues.'
                };

            case 'disconnected':
                return {
                    icon: '🔴',
                    text: 'Disconnected',
                    color: '#ef4444',
                    description:
                        'No services are connected. Check your connection.'
                };

            default:
                return {
                    icon: '⚪',
                    text: 'Unknown',
                    color: '#6b7280',
                    description:
                        'Connection status is unknown.'
                };
        }
    };

    const statusInfo = getStatusInfo();

    return (
        <div className="connection-status">
            <button
                type="button"
                className="status-indicator"
                style={{ color: statusInfo.color }}
                onClick={() =>
                    setShowDetails((previous) => !previous)
                }
            >
                <span className="status-icon">
                    {statusInfo.icon}
                </span>

                <span className="status-text">
                    {statusInfo.text}
                </span>

                {lastUpdate && (
                    <span className="last-update">
                        Last update:{' '}
                        {lastUpdate.toLocaleTimeString()}
                    </span>
                )}
            </button>

            {showDetails && (
                <div className="status-details">
                    <p>{statusInfo.description}</p>

                    {status === 'disconnected' &&
                        onReconnect && (
                            <button
                                type="button"
                                onClick={onReconnect}
                                className="reconnect-btn"
                            >
                                Reconnect
                            </button>
                        )}
                </div>
            )}
        </div>
    );
};

export default ConnectionStatus;