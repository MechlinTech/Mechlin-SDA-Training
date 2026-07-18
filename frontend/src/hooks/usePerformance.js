import { useEffect, useState } from "react";

function usePerformance() {
  const [fps, setFps] = useState("Good");

  useEffect(() => {
    const timer = setInterval(() => {
      setFps("Good");
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return fps;
}

export default usePerformance;