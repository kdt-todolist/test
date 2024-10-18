import axios from 'axios';
import { handleAuthError } from '../utils/authHelpers';

export const polledRoutinesFromServer = async (listId, accessToken) => {
  try {
    const response = await axios.get(`http://localhost:1009/routines/${listId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const pooledRoutines = response.data.map((routine) => ({
      subTaskId: routine.id,
      listId: routine.list_id,
      isDone: routine.done,
    }));

    return pooledRoutines;
  } catch (error) {
    if (!handleAuthError(error)) return;
    throw error;
  }
};

export const addNewRoutineToServer = async (subTaskId, week, resetTime, accessToken) => {
  try {
    const response = await axios.post(
      'http://localhost:1009/routines',
      {
        taskId: subTaskId,
        week: week,
        resetTime: resetTime,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    const newRoutine = {
      id: response.data.insertId,
      subTaskId: subTaskId,
      week: week,
      resetTime: resetTime,
    }

    return newRoutine;

  } catch (error) {
    if (!handleAuthError(error)) { // error.response.status === 401 : 토큰 만료, 비로그인 상태
        return;
    }
    if (error.response.status === 500) {
        alert('이미 등록된 루틴이 존재합니다.');
        return;
    }
    throw error;
  }
};

export const updateRoutineOnServer = async (routineId, week, resetTime, accessToken) => {
  try {
    console.log('routineId', routineId);
    console.log('week', week);
    console.log('resetTime', resetTime);
    
    const response = await axios.put(
      `http://localhost:1009/routines/${routineId}`,
      {
        week: week,
        resetTime: resetTime,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (!handleAuthError(error)) return;
    throw error;
  }
};

export const deleteRoutineFromServer = async (routineId, taskId, accessToken) => {
  try {
    await axios.delete(`http://localhost:1009/routines/${routineId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        taskId: taskId,
      },
    });
  } catch (error) {
    if (!handleAuthError(error)) return;
    throw error;
  }
};