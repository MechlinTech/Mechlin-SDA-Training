import React from 'react';
import { DataProvider } from './contexts/DataContext';
import { Dashboard } from './components/Dashboard';

function App() {
  return (
    <DataProvider>
      <Dashboard />
    </DataProvider>
  );
}

export default App;
