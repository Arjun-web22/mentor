import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DashboardProvider } from './context/DashboardContext';
import { CollegeProvider } from './context/CollegeContext';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DashboardProvider>
          <CollegeProvider>
            <AppRoutes />
          </CollegeProvider>
        </DashboardProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
