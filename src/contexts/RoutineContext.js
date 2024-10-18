import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchRoutinesFromServer, addNewRoutineToServer,
  updateRoutineOnServer, deleteRoutine } from '../api/routineApi';
import { AuthContext } from './AuthContext';
import { TaskContext } from './TaskContext';

export const RoutineContext = createContext();

export const RoutineProvider = ({ children }) => {
  const { isAuthenticated, accessToken, user } = useContext(AuthContext);
  const { setTasks } = useContext(TaskContext);
  const [routines, setRoutines] = useState([]);

  const getRoutine = async (listId) => {
    if (!accessToken) return;
    try {
      const fetchedRoutines = await fetchRoutinesFromServer(listId, accessToken);
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
                    mon: newRoutine.mon,
                    tue: newRoutine.tue,
                    wed: newRoutine.wed,
                    thu: newRoutine.thu,
                    fri: newRoutine.fri,
                    sat: newRoutine.sat,
                    sun: newRoutine.sun,
                    resetTime: newRoutine.resetTime, // Add the new resetTime
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
          routine && routine.id === routineId ? { ...routine, week, resetTime } : routine
        )
      );
    } catch (error) {
      console.error('Failed to update routine:', error);
    }
  };

  const removeRoutine = async (routineId, taskId) => {
    if (!accessToken) return;
    try {
      await deleteRoutine(routineId, taskId, accessToken);
      setRoutines((prevRoutines) => prevRoutines.filter((routine) => routine.id !== routineId));
    } catch (error) {
      console.error('Failed to delete routine:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      const existingRoutines = JSON.parse(localStorage.getItem(`userRoutines_${user}`)) || [];
      const mergedRoutines = [
        ...existingRoutines,
        ...routines.filter(
          (newRoutine) => !existingRoutines.some((existingRoutine) => existingRoutine.id === newRoutine.id)
        ),
      ];
      localStorage.setItem(`userRoutines_${user}`, JSON.stringify(mergedRoutines));
    }
  }, [routines, isAuthenticated, user]);

  return (
    <RoutineContext.Provider
      value={{
        routines,
        getRoutine,
        addRoutine,
        updateRoutine,
        removeRoutine,
      }}
    >
      {children}
    </RoutineContext.Provider>
  );
};
