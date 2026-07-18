function Sidebar() {
    return (
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <ul>
            <li>
              <a href="#dashboard">📈 Dashboard</a>
            </li>
  
            <li>
              <a href="#users">👥 Users</a>
            </li>
  
            <li>
              <a href="#reports">📋 Reports</a>
            </li>
  
            <li>
              <a href="#analytics">📊 Analytics</a>
            </li>
  
            <li>
              <a href="#settings">⚙ Settings</a>
            </li>
          </ul>
        </nav>
      </aside>
    );
  }
  
  export default Sidebar;