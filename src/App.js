import React from 'react';
import { TaskProvider } from './contexts/TaskContext';
import TaskPage from './pages/TaskPage';

function App() {
  return (
    <TaskProvider>
      <TaskPage />
    </TaskProvider>
  );
}

export default App;
