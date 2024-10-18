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

export const loadFromLocalStorage = (key) => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : [];
};

export const saveToLocalStorage = (key, data) => {
  if (!data || data.length === 0) return;
  localStorage.setItem(key, JSON.stringify(data));
};

export const mergeRoutines = (existingRoutines, newRoutines) => {
  // subTaskId가 겹치는 기존 루틴을 제외하고, 새로운 루틴을 추가
  const filteredExistingRoutines = existingRoutines.filter(
    (existingRoutine) => !newRoutines.some((newRoutine) => newRoutine.subTaskId === existingRoutine.subTaskId)
  );
  return [...filteredExistingRoutines, ...newRoutines];
};