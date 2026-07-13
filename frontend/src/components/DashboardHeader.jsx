import { useData } from "../contexts/DataContext";

function DashboardHeader() {
  const { refreshDashboard } = useData();

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-brand">
          <h1>📊 Mechlin Dashboard</h1>
        </div>

        <ul className="nav-menu">
          <li><a href="#home">Home</a></li>
          <li><a href="#analytics">Analytics</a></li>
          <li><a href="#settings">Settings</a></li>
        </ul>

        <button
          onClick={refreshDashboard}
          className="refresh-btn"
        >
          🔄 Refresh Dashboard
        </button>
      </nav>
    </header>
  );
}

export default DashboardHeader;