import React, { createContext, useContext } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {

  const fetchData = async (endpoint) => {
    await new Promise(r => setTimeout(r, 500));

    const mockDB = {
      '/api/users': [120, 150, 200],
      '/api/revenue': [2000, 3000, 4500],
      '/api/orders': [50, 80, 120]
    };

    return mockDB[endpoint] || [];
  };

  const value = { fetchData };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useDataContext() {
  return useContext(DataContext);
}

export { DataContext };