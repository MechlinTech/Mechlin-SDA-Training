import { useEffect, useState } from "react";
import websocketService from "../services/WebSocketService";

function ConnectionStatus() {
  const [status, setStatus] = useState("disconnected");

  useEffect(() => {
    return websocketService.subscribeStatus(setStatus);
  }, []);

  const statusConfig = {
    connected: {
      color: "green",
      text: "🟢 Connected",
    },
    disconnected: {
      color: "orange",
      text: "🟠 Ready for Real-Time Updates",
    },
    error: {
      color: "red",
      text: "🔴 Connection Unavailable",
    },
  };

  const current =
    statusConfig[status] || statusConfig.disconnected;

  return (
    <div
      className="connection-status"
      style={{
        color: current.color,
        fontWeight: "bold",
        marginBottom: "1rem",
      }}
    >
      {current.text}
    </div>
  );
}

export default ConnectionStatus;