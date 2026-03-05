import React from 'react';
import { DataProvider } from './contexts/DataContext';
import { Dashboard } from './components/Dashboard';
import './index.css';

function App() {
    return (
        <DataProvider>
            <div className="app-container">
                <header className="app-header">
                    <h1>Advanced React Dashboard</h1>
                </header>
                <main>
                    <Dashboard />
                </main>
            </div>
        </DataProvider>
    );
}

export default App;
