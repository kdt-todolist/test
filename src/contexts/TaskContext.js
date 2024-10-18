import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import {
  fetchTasksFromServer, bulkTaskToServer,
  addNewTaskToServer, updateTaskOnServer, deleteTaskFromServer,
  addSubTaskToServer, updateSubTaskOnServer, deleteSubTaskFromServer
} from '../api/taskApi';
import { loadTasksFromLocalStorage, saveTasksToLocalStorage } from '../utils/localStorageHelpers';
import { validateLength } from '../utils/validationHelpers';
  
const MAX_TITLE_LENGTH = 15;

export const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const { isAuthenticated, accessToken, user, setUser } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);

  // useCallback으로 syncTasks를 메모이제이션
  const syncTasks = useCallback(async () => {
    await bulkTaskToServer(accessToken);
    const fetchedTasks = await fetchTasksFromServer(accessToken, setUser);
    setTasks(fetchedTasks);
  }, [accessToken, setUser]);

  const addTask = async (addedTask) => {
    if (!validateLength(addedTask.title, MAX_TITLE_LENGTH, '목록 제목')) return;

    if (!isAuthenticated) {
      setTasks((prevTasks) => [...prevTasks, addedTask]);
    } else {
      const newTask = await addNewTaskToServer(addedTask, accessToken);
      setTasks((prevTasks) => [...prevTasks, newTask]);
    }
  };

  const updateTaskTitle = (taskId, newTitle) => {
    if (!validateLength(newTitle, MAX_TITLE_LENGTH, '목록 제목')) return;

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
    const taskToDelete = tasks.find(task => task.id === taskId);

    if (taskToDelete.subTasks && taskToDelete.subTasks.length > 0) {
      const userConfirmed = window.confirm(`이 목록에는 ${taskToDelete.subTasks.length} 개의 하위 항목이 있습니다.\n한 번 삭제된 목록과 할 일은 복구할 수 없습니다. 정말로 삭제하시겠습니까?`);
      if (!userConfirmed) {
        return;
      }
    }

    setTasks(tasks.filter(task => task.id !== taskId));

    if (isAuthenticated) {
      await deleteTaskFromServer(taskId, accessToken);
    }
  };

  const addSubTask = async (taskId, newTitle) => {
    if (!validateLength(newTitle, MAX_TITLE_LENGTH, '하위 항목 제목')) return;

    const addedSubTask = await addSubTaskToServer(taskId, newTitle, isAuthenticated, accessToken);
    setTasks(prevTasks => prevTasks.map(task => task.id === taskId ? { ...task, subTasks: [...task.subTasks, addedSubTask] } : task));
  };

  const updateSubTaskTitle = (taskId, subTaskId, newTitle) => {
    if (!validateLength(newTitle, MAX_TITLE_LENGTH, '하위 항목 제목')) return;

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
    }
  }, [isAuthenticated, accessToken, syncTasks]);

  useEffect(() => {
    setTasks(loadTasksFromLocalStorage(isAuthenticated, user));

    const handleLogout = () => setTasks([]);

    window.addEventListener('logout', handleLogout);

    return () => window.removeEventListener('logout', handleLogout);
  }, [isAuthenticated]);

  useEffect(() => {
    saveTasksToLocalStorage(tasks, isAuthenticated, user);
  }, [tasks, isAuthenticated]);

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