
export function DashboardHeader({
  filters,
  onFilterChange,
  onRefresh,
  viewMode,
  onViewModeChange
}) {
  return (
    <header className="dashboard-header">
      <div>
        <h1>Advanced Dashboard</h1>
        <p>React Hooks & State Management</p>
      </div>

      <div className="dashboard-controls">
        <label>
          Date Range
          <select
            value={filters.dateRange}
            onChange={(e) =>
              onFilterChange('dateRange', e.target.value)
            }
          >
            <option value="7d">7 Days</option>
            <option value="30d">30 Days</option>
            <option value="90d">90 Days</option>
          </select>
        </label>

        <label>
          Category
          <select
            value={filters.category}
            onChange={(e) =>
              onFilterChange('category', e.target.value)
            }
          >
            <option value="all">All</option>
            <option value="sales">Sales</option>
            <option value="users">Users</option>
            <option value="orders">Orders</option>
          </select>
        </label>

        <button type="button" onClick={onRefresh}>
          Refresh
        </button>

        <button
          type="button"
          onClick={() =>
            onViewModeChange(
              viewMode === 'grid' ? 'list' : 'grid'
            )
          }
        >
          {viewMode === 'grid' ? 'List View' : 'Grid View'}
        </button>
      </div>
    </header>
  );
}