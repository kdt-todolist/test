import React from 'react';
import TaskPage from './pages/TaskPage';
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';

function App() {
  return (
    <AuthProvider>
    <TaskProvider>
      <TaskPage />
    </TaskProvider>
    </AuthProvider>
  );
}

export default App;
