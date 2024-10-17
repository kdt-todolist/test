import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { loadTasksFromLocalStorage, saveTasksToLocalStorage, initTasksFromLocalStorage } from '../utils/localStorageHelpers';
import { fetchTasksFromServer, bulkTaskToServer,
  addNewTaskToServer, updateTaskOnServer, deleteTaskFromServer,
  addSubTaskToServer, updateSubTaskOnServer, deleteSubTaskFromServer } from '../api/taskApi';

export const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const { isAuthenticated, accessToken, user, setUser } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);

  const syncTasks = async () => {
    await bulkTaskToServer(accessToken);
    const fetchedTasks = await fetchTasksFromServer(accessToken, setUser);
    setTasks(fetchedTasks);
  };

  const addTask = async (addedTask) => {
    if (!isAuthenticated) {
      setTasks((prevTasks) => [...prevTasks, addedTask]);
    } else {
      const newTask = await addNewTaskToServer(addedTask, accessToken);
      setTasks((prevTasks) => [...prevTasks, newTask]);
    }
  };

  const updateTaskTitle = (taskId, newTitle) => {
    setTasks(tasks.map(task => (task.id === taskId ? { ...task, title: newTitle } : task)));
    if (isAuthenticated) {
      updateTaskOnServer(taskId, newTitle, accessToken, tasks);
    }
  };

  const updateTaskCheck = (taskId, isChecked) => {
    setTasks(tasks.map(task => (task.id === taskId ? { ...task, isChecked } : task)));
    if (isAuthenticated) {
      updateTaskOnServer(taskId, isChecked, accessToken, tasks, true);
    }
  };

  const deleteTask = async (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    if (isAuthenticated) {
      await deleteTaskFromServer(taskId, accessToken);
    }
  };

  const addSubTask = async (taskId, newTitle) => {
    const addedSubTask = await addSubTaskToServer(taskId, newTitle, isAuthenticated, accessToken);
    setTasks(prevTasks => prevTasks.map(task => task.id === taskId ? { ...task, subTasks: [...task.subTasks, addedSubTask] } : task));
  };

  const updateSubTaskTitle = (taskId, subTaskId, newTitle) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, subTasks: task.subTasks.map(subTask => subTask.id === subTaskId ? { ...subTask, title: newTitle } : subTask) } : task));
    if (isAuthenticated) {
      updateSubTaskOnServer(subTaskId, newTitle, accessToken, tasks, taskId);
    }
  };

  const updateSubTaskCheck = (taskId, subTaskId, isChecked) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, subTasks: task.subTasks.map(subTask => subTask.id === subTaskId ? { ...subTask, isChecked } : subTask) } : task));
    if (isAuthenticated) {
      updateSubTaskOnServer(subTaskId, isChecked, accessToken, tasks, taskId, true);
    }
  };

  const deleteSubTask = async (taskId, subTaskId) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, subTasks: task.subTasks.filter(subTask => subTask.id !== subTaskId) } : task));
    if (isAuthenticated) {
      await deleteSubTaskFromServer(subTaskId, accessToken);
    }
  };

  const updateTaskOrder = (reorderedTasks) => {
    setTasks(reorderedTasks);
  };

  const updateSubTaskOrder = (taskId, reorderedSubTasks) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, subTasks: reorderedSubTasks } : task));
  };

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      syncTasks();
    } else {
      initTasksFromLocalStorage();
    }
  }, [isAuthenticated, accessToken]);

  useEffect(() => {
    setTasks(loadTasksFromLocalStorage(isAuthenticated));

    const handleLogout = () => setTasks([]);

    window.addEventListener('logout', handleLogout);

    return () => window.removeEventListener('logout', handleLogout);
  }, []);

  useEffect(() => {
    saveTasksToLocalStorage(tasks, isAuthenticated);
  }, [tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks, setTasks,
        addTask,
        updateTaskTitle,
        updateTaskCheck,
        deleteTask,
        addSubTask,
        updateSubTaskTitle,
        updateSubTaskCheck,
        deleteSubTask,
        updateTaskOrder,
        updateSubTaskOrder
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
