import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ConfirmProvider } from './context/ConfirmContext';
import { ContentProvider, useContent } from './hooks/useContent';

function GlobalContentProvider({ children }) {
  const content = useContent();
  return <ContentProvider value={content}>{children}</ContentProvider>;
}

function App() {
  return (
    <AuthProvider>
      <ConfirmProvider>
        <GlobalContentProvider>
          <div className="app">
            <AppRoutes />
          </div>
        </GlobalContentProvider>
      </ConfirmProvider>
    </AuthProvider>
  );
}

export default App;
