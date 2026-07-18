import usePerformance from "../hooks/usePerformance";

function PerformanceMonitor() {

  const status = usePerformance();

  return (

    <div className="performance-card">

      <h3>⚡ Performance Monitor</h3>

      <div className="status">

        <span className="status-dot"></span>

        {status}

      </div>

    </div>

  );

}

export default PerformanceMonitor;