import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ConfirmProvider } from './context/ConfirmContext';

function App() {
  return (
    <AuthProvider>
      <ConfirmProvider>
        <div className="app">
          <AppRoutes />
        </div>
      </ConfirmProvider>
    </AuthProvider>
  );
}

export default App;
