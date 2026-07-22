import { useCallback } from "react";

import { useData } from "../contexts/DataContext";
import { useWebSocket } from "./useWebSocket";

export function useRealTimeData() {
  const { refreshDashboard } = useData();

  const handleMessage = useCallback(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  useWebSocket(handleMessage);
}