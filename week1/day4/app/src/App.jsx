import { DataProvider } from './contexts/DataContext';
import { Dashboard } from './components/Dashboard';
import './App.css';

function App() {
  return (
    <DataProvider>
      <Dashboard />
    </DataProvider>
  );
}

export default App;