import React from 'react';
import TaskPage from './pages/TaskPage';
import { TaskProvider } from './contexts/TaskContext';

function App() {
  return (
    <TaskProvider>
      <TaskPage />
    </TaskProvider>
  );
}

export default App;
