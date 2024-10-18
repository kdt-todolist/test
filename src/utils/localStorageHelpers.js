export const loadTasksFromLocalStorage = (isAuthenticated, userId) => {
  const key = isAuthenticated ? `userTasks_${userId}` : 'guestTasks';
  const storedTasks = localStorage.getItem(key);
  return storedTasks ? JSON.parse(storedTasks) : [];
};

export const saveTasksToLocalStorage = (tasks, isAuthenticated, userId) => {
  const key = isAuthenticated ? `userTasks_${userId}` : 'guestTasks';
  if (!tasks || tasks.length === 0) return;
  localStorage.setItem(key, JSON.stringify(tasks));
};