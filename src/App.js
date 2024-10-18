import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import TaskPage from './pages/TaskPage';
import { RoutineProvider } from './contexts/RoutineContext';

function App() {
  return (
    <Router>
    <AuthProvider><TaskProvider><RoutineProvider>
      <TaskPage />
    </RoutineProvider></TaskProvider></AuthProvider>
    </Router>
  );
}

export default App;
