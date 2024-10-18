import React, { createContext, useContext, useState, useEffect } from 'react';
import { getRoutinesFromServer, addNewRoutineToServer, updateRoutineOnServer, deleteRoutineFromServer } from '../api/routineApi';
import { AuthContext } from './AuthContext';
import { TaskContext } from './TaskContext';
import { loadFromLocalStorage, saveToLocalStorage, mergeRoutines } from '../utils/localStorageHelpers';

export const RoutineContext = createContext();

export const RoutineProvider = ({ children }) => {
  const { isAuthenticated, accessToken, user } = useContext(AuthContext);
  const { setTasks } = useContext(TaskContext);
  const [routines, setRoutines] = useState([]);

  const getRoutine = async (listId) => {
    if (!accessToken) return;
    try {
      const fetchedRoutines = await getRoutinesFromServer(listId, accessToken);
      setRoutines(fetchedRoutines);
    } catch (error) {
      console.error('Failed to load routines:', error);
    }
  };

  const addRoutine = async (subTaskId, week, resetTime) => {
    if (!accessToken) return;
    try {
      const newRoutine = await addNewRoutineToServer(subTaskId, week, resetTime, accessToken);
      setRoutines((prevRoutines) => [...prevRoutines, newRoutine]);

      setTasks((prevTasks) =>
        prevTasks.map((task) => ({
          ...task,
          subTasks: task.subTasks.map((subTask) =>
            subTask.id === subTaskId
              ? {
                  ...subTask,
                  isRoutine: true,
                  routineId: newRoutine.id,
                  routines: {
                    ...week,
                    resetTime: newRoutine.resetTime,
                  },
                }
              : subTask
          ),
        }))
      );
    } catch (error) {
      console.error('Failed to create routine:', error);
    }
  };

  const updateRoutine = async (routineId, week, resetTime) => {
    if (!accessToken) return;
    try {
      await updateRoutineOnServer(routineId, week, resetTime, accessToken);
      setRoutines((prevRoutines) =>
        prevRoutines.map((routine) =>
          routine.id === routineId ? { ...routine, week, resetTime } : routine
        )
      );

      setTasks((prevTasks) =>
        prevTasks.map((task) => ({
          ...task,
          subTasks: task.subTasks.map((subTask) =>
            subTask.routineId === routineId
              ? { ...subTask, routines: { ...subTask.routines, ...week, resetTime } }
              : subTask
          ),
        }))
      );
    } catch (error) {
      console.error('Failed to update routine:', error);
    }
  };

  const deleteRoutine = async (routineId, taskId) => {
    if (!accessToken) return;
    try {
      await deleteRoutineFromServer(routineId, taskId, accessToken);
      setRoutines((prevRoutines) => prevRoutines.filter((routine) => routine.id !== routineId));
      setTasks((prevTasks) =>
        prevTasks.map((task) => ({
          ...task,
          subTasks: task.subTasks.map((subTask) =>
            subTask.routineId === routineId
              ? { ...subTask, isRoutine: false, routines: null }
              : subTask
          ),
        }))
      );
    } catch (error) {
      console.error('Failed to delete routine:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      const existingRoutines = loadFromLocalStorage(`userRoutines_${user}`);
      const mergedRoutines = mergeRoutines(existingRoutines, routines);
      saveToLocalStorage(`userRoutines_${user}`, mergedRoutines);
    }
  }, [routines, isAuthenticated, user]);

  return (
    <RoutineContext.Provider value={{ routines, getRoutine, addRoutine, updateRoutine, deleteRoutine }}>
      {children}
    </RoutineContext.Provider>
  );
};
