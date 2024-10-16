import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import TaskPage from './pages/TaskPage';

function App() {
  return (
    <Router>
    <AuthProvider><TaskProvider>
      <TaskPage />
    </TaskProvider></AuthProvider>
    </Router>
  );
}

export default App;
