import { Dashboard } from './components/Dashboard'
import { DataProvider } from './contexts/DataContext'
import { ErrorBoundary } from './components/ErrorBoundary'

function App() {
  return (
    <DataProvider>
      <ErrorBoundary>
        <Dashboard />
      </ErrorBoundary>
    </DataProvider>
  )
}

export default App
