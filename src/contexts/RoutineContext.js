import React, { createContext, useContext, useState, useEffect } from 'react';
import { polledRoutinesFromServer, addNewRoutineToServer,
  updateRoutineOnServer, deleteRoutineFromServer } from '../api/routineApi';
import { AuthContext } from './AuthContext';
import { TaskContext } from './TaskContext';
import { loadFromLocalStorage, saveToLocalStorage, mergeRoutines } from '../utils/localStorageHelpers';

export const RoutineContext = createContext();

export const RoutineProvider = ({ children }) => {
  const { isAuthenticated, accessToken, user } = useContext(AuthContext);
  const { tasks, setTasks } = useContext(TaskContext);
  const [routines, setRoutines] = useState([]);

  const getRoutine = async (listId) => {
    if (!accessToken) return;
    try {
      const fetchedRoutines = await polledRoutinesFromServer(listId, accessToken);
    } catch (error) {
      console.error('Failed to load routines:', error);
    }
  };

  const addRoutine = async (subTaskId, week, resetTime) => {
    if (!accessToken) return;
    try {
      const newRoutine = await addNewRoutineToServer(subTaskId, week, resetTime, accessToken);
      
      setRoutines((prevRoutines) =>
        prevRoutines.some((routine) => routine.subTaskId === subTaskId)
          ? prevRoutines.map((routine) =>
              routine.subTaskId === subTaskId ? newRoutine : routine
            )
          : [...prevRoutines, newRoutine]
      );  

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

  const pollRoutines = async (listId) => {
    if (!accessToken) return;

    try {
      const polledRoutines = await polledRoutinesFromServer(listId, accessToken);

      // 받은 데이터와 기존 데이터를 병합
      setTasks((prevTasks) => {
        return prevTasks.map((task) => ({
          ...task,
          subTasks: task.subTasks.map((subTask) => {
            const matchedRoutine = polledRoutines.find((routine) => routine.subTaskId === subTask.id);
            return matchedRoutine
              ? { ...subTask, isChecked: matchedRoutine.isDone === 1 } // isChecked를 isDone에 맞게 업데이트
              : subTask;
          }),
        }));
      });
    } catch (error) {
      console.error("Error polling routines:", error);
    }
  };

  const pollAllLists = async () => {
    try {
      // 모든 listId를 tasks에서 추출
      const storedTasks = loadFromLocalStorage(`userTasks_${user}`);
      const listIds = storedTasks.map((task) => task.id);

      console.log("Polling all lists:", listIds);
      
      // 각 listId에 대해 pollRoutines 실행
      await Promise.all(
        listIds.map(async (listId) => {
          await pollRoutines(listId);
        })
      );
    } catch (error) {
      console.error("Error polling all lists:", error);
    }
  };

  // 루틴 데이터를 1분마다 풀링하는 useEffect
  useEffect(() => {
    if (!isAuthenticated || !user || !accessToken) return;
  
    // 현재 시간과 다음 정각(1분이 끝나는 시각)까지의 차이를 계산
    const now = new Date();
    const timeUntilNextMinute = (60 - now.getSeconds()) * 1000; // 초 단위로 계산한 후 밀리초로 변환
  
    // 첫 풀링은 현재 시각과 다음 정각 사이에 맞춰 실행
    const timeoutId = setTimeout(() => {
      pollAllLists();
  
      // 그 후에는 정확히 1분마다 풀링 실행
      const intervalId = setInterval(() => {
        pollAllLists();
      }, 60000);
    }, timeUntilNextMinute); // 다음 정각까지 기다린 후 실행
  }, [isAuthenticated, user, accessToken]);

  return (
    <RoutineContext.Provider value={{ routines, getRoutine, addRoutine, updateRoutine, deleteRoutine }}>
      {children}
    </RoutineContext.Provider>
  );
};
