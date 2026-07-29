import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DashboardProvider } from './context/DashboardContext';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DashboardProvider>
          <AppRoutes />
        </DashboardProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
