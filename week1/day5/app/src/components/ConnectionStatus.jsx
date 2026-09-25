/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

function ConnectionStatus({ status, onReconnect }) {
  const [showDetails, setShowDetails] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    if (status === "connected") {
      setLastUpdate(new Date());
    }
  }, [status]);

  const statusInfo = {
    connected: {
      label: "Connected",
      icon: "●",
      description: "Real-time connection is active.",
    },
    partial: {
      label: "Partial Connection",
      icon: "◐",
      description: "Some real-time connections are active.",
    },
    disconnected: {
      label: "Disconnected",
      icon: "○",
      description: "Real-time connection is unavailable.",
    },
    unknown: {
      label: "Unknown",
      icon: "?",
      description: "Connection status is currently unknown.",
    },
  };

  const currentStatus = statusInfo[status] || statusInfo.unknown;

  const handleToggleDetails = () => {
    setShowDetails((previous) => !previous);
  };

  return (
    <div className="connection-status-wrapper">
      <button
        type="button"
        className={`connection-status connection-status-${status}`}
        onClick={handleToggleDetails}
        aria-expanded={showDetails}
      >
        <span className="connection-status-icon">
          {currentStatus.icon}
        </span>

        <span>{currentStatus.label}</span>
      </button>

      {showDetails && (
        <div className="connection-status-details">
          <p>{currentStatus.description}</p>

          {lastUpdate && (
            <p>
              Last connected:{" "}
              {lastUpdate.toLocaleTimeString()}
            </p>
          )}

          {status === "disconnected" && (
            <button
              type="button"
              className="reconnect-button"
              onClick={onReconnect}
            >
              Reconnect
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ConnectionStatus;