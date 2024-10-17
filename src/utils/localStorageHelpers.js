export const loadTasksFromLocalStorage = (isAuthenticated) => {
    const key = isAuthenticated ? 'userTasks' : 'guestTasks';
    const storedTasks = localStorage.getItem(key);
    return storedTasks ? JSON.parse(storedTasks) : [];
  };
  
  export const saveTasksToLocalStorage = (tasks, isAuthenticated) => {
    const key = isAuthenticated ? 'userTasks' : 'guestTasks';
    if (!tasks || tasks.length === 0) return;
    localStorage.setItem(key, JSON.stringify(tasks));
  };
  
  export const initTasksFromLocalStorage = () => {
    localStorage.removeItem('userTasks');
  };