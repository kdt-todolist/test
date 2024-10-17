import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import { isVisible } from '@testing-library/user-event/dist/utils';

export const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const { isAuthenticated, accessToken } = useContext(AuthContext);
  
  const loadTasksFromLocalStorage = () => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  };

  const initialTasks = [];
  const [tasks, setTasks] = useState(loadTasksFromLocalStorage() || initialTasks);

  const saveTasksToLocalStorage = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const fetchTasks = async () => {
    try {
      // 1. 서버로부터 전체 리스트를 가져옴 (subTask는 포함되지 않음)
      const { data: serverLists } = await axios.get('http://localhost:1009/lists', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // 2. 서버 리스트를 로컬 데이터 구조로 변환 (subTask를 포함)
      const formattedServerLists = await Promise.all(
        serverLists.map(async (serverList) => {
          const subTaskResponse = await axios.get(`http://localhost:1009/tasks/${serverList.id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
  
          const serverSubTasks = subTaskResponse.data;
  
          return {
            id: serverList.id,
            title: serverList.title,
            isChecked: serverList.is_visible,
            isSyneced: true,
            subTasks: serverSubTasks.map((subTask) => ({
              id: subTask.id,
              title: subTask.content,
              isChecked: subTask.done,
            })),
          };
        })
      );

      setTasks(formattedServerLists);
    } catch (error) {
      console.error(error);
    }
  };

  const addTask = async (addedTask) => {
    if (!isAuthenticated) {
      setTasks((prevTasks) => [...prevTasks, addedTask]);
    }
    else {
      try {
        const response = await axios.post('http://localhost:1009/lists', {
          title: addedTask.title,  // title만 서버로 전송
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`  // 인증 토큰 설정
          }
        });

        console.log(response.data);
    
        // 응답에서 리스트 ID를 받아 추가 리스트에 대한 기본 값 설정
        const addedTask = {
          ...addedTask,
          id: response.data.insertId
        };

        console.log(addedTask);
    
        // 리스트 상태 업데이트
        setTasks((prevTasks) => [...prevTasks, addedTask]);
      } catch (error) {
        alert('리스트 추가 중 오류가 발생했습니다.');
      }
    }
  };

  const updateTaskTitle = (taskId, newTitle) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, title: newTitle }
        : task
    ));

    if (isAuthenticated) {
      axios.put(`http://localhost:1009/lists/${taskId}`, {
        title: newTitle,
        isVisible: tasks.find(task => task.id === taskId).isChecked,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
    }
  };

  const updateTaskCheck = (taskId, isChecked) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, isChecked }
        : task
    ));

    if (isAuthenticated) {
      axios.put(`http://localhost:1009/lists/${taskId}`, {
        title: tasks.find(task => task.id === taskId).title,
        isVisible: isChecked,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
    }
  };
  

  const deleteTask = (taskId) => {
    if (!isAuthenticated) {
      setTasks(tasks.filter(task => task.id !== taskId));
    } else {
      try {
        axios.delete(`http://localhost:1009/lists/${taskId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        setTasks(tasks.filter(task => task.id !== taskId));
      }
      catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const addSubTask = async (taskId, newTitle) => {
    const addedSubTask = {
      id: Date.now(), // 임시 ID
      title: newTitle,
      isChecked: false,
    };

    if (isAuthenticated) {
      try {
        const response = await axios.post(`http://localhost:1009/tasks`, {
          content: newTitle,
          listId: taskId,
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        addedSubTask.id = response.data.insertId; // 서버에서 반환된 insertId로 업데이트
      } catch (error) {
        console.error('Error adding subTask:', error);
        return; // 오류 발생 시 추가 작업 중지
      }
    }

    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              subTasks: [...task.subTasks, addedSubTask],
            }
          : task
      )
    );
  };

  const updateSubTaskTitle = (taskId, subTaskId, newTitle) => {
    setTasks(
      tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              subTasks: task.subTasks.map(subTask =>
                subTask.id === subTaskId
                  ? { ...subTask, title: newTitle }
                  : subTask
              ),
            }
          : task
      )
    );

    if (isAuthenticated) {
      axios.put(`http://localhost:1009/tasks/${subTaskId}`, {
        content: newTitle,
        done: tasks.find(task => task.id === taskId).subTasks.find(subTask => subTask.id === subTaskId).isChecked,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
    }

  };

  const updateSubTaskCheck = (taskId, subTaskId, isChecked) => {
    setTasks(
      tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              subTasks: task.subTasks.map(subTask =>
                subTask.id === subTaskId
                  ? { ...subTask, isChecked }
                  : subTask
              ),
            }
          : task
      )
    );

    if (isAuthenticated) {
      axios.put(`http://localhost:1009/tasks/${subTaskId}`, {
        content: tasks.find(task => task.id === taskId).subTasks.find(subTask => subTask.id === subTaskId).title,
        done: isChecked,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
    }
  };

  const deleteSubTask = (taskId, subTaskId) => {
    setTasks(
      tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              subTasks: task.subTasks.filter(subTask => subTask.id !== subTaskId),
            }
          : task
      )
    );

    if (isAuthenticated) {
      axios.delete(`http://localhost:1009/tasks/${subTaskId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
    }
  };

  const updateSubTaskOrder = (taskId, reorderedSubTasks) => {
    setTasks(
      tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              subTasks: reorderedSubTasks,
            }
          : task
      )
    );
  };

  const updateTaskOrder = (reorderedTasks) => {
    setTasks(reorderedTasks);
  };


  useEffect(() => {
    console.log("isAuthenticated", isAuthenticated);
    console.log("accessToken", accessToken);

    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated, accessToken]);

  useEffect(() => {
    saveTasksToLocalStorage(tasks);
  }, [tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        fetchTasks,
        setTasks,
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
