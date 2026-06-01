import React from 'react';
import { TaskProvider } from './context/TaskContext';
import DashboardPage from './pages/DashboardPage';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <TaskProvider>
      {/* Toast configurations aligned with our glassmorphic dark theme */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: 'rgba(30, 41, 59, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#f8fafc',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <DashboardPage />
    </TaskProvider>
  );
}

export default App;
