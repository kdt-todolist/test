import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';

export const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const { isAuthenticated, accessToken, user, setUser } = useContext(AuthContext);

  // 로컬스토리지 키를 가져오는 함수
  const getLocalStorageKey = () => {
    return isAuthenticated ? 'userTasks' : 'guestTasks'; // 로그인 상태와 user 값에 따라 키를 구분
  };

  const loadTasksFromLocalStorage = () => {
    const key = getLocalStorageKey();
    const storedTasks = localStorage.getItem(key);
    return storedTasks ? JSON.parse(storedTasks) : [];
  };

  const saveTasksToLocalStorage = (tasks) => {
    const key = getLocalStorageKey();
    if (key) {
      localStorage.setItem(key, JSON.stringify(tasks));
    }
  };

  const initTasksFromLocalStorage = () => {
    const key = getLocalStorageKey();
    if (key) {
      console.log("initTasksFromLocalStorage", key);
      localStorage.removeItem(key);
    }
  };

  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      if (!accessToken) return; // accessToken이 없는 경우 조기 종료

      // 서버로부터 전체 리스트를 가져옴
      const { data: serverLists } = await axios.get('http://localhost:1009/lists', {
        headers: {
          Authorization: `Bearer ${accessToken}`, // 올바른 토큰 전달
        },
      });

      // user_id를 가져와서 setUser로 설정
      const userId = serverLists[0]?.user_id;
      if (userId) {
        setUser(userId); // user 설정
      }

      // 서버 리스트를 로컬 데이터 구조로 변환 (subTask 포함)
      const formattedServerLists = await Promise.all(
        serverLists.map(async (serverList) => {
          const subTaskResponse = await axios.get(`http://localhost:1009/tasks/${serverList.id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`, // 올바른 토큰 전달
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

      console.log("formattedServerLists", formattedServerLists);
      setTasks(formattedServerLists); // 최종적으로 상태 업데이트
    } catch (error) {
      console.error("Error fetching tasks:", error); // 오류 처리
    }
  };

  const bulkTask = async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      const lists = loadTasksFromLocalStorage();

      const formattedLists = lists.map((list) => ({
        title: list.title,
        isVisible: list.isChecked,
      }));

      const taskBulkResponse = await axios.post(
        'http://localhost:1009/lists/bulk',
        {
          lists: formattedLists,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      await Promise.all(
        lists.map(async (list, index) => {
          await axios.post(
            'http://localhost:1009/tasks/bulk',
            {
              listId: taskBulkResponse.data.insertIds[index],
              tasks: list.subTasks.map((subTask) => ({
                content: subTask.title,
                done: subTask.isChecked,
              })),
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              },
            }
          );
        })
      );
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const addTask = async (addedTask) => {
    if (!isAuthenticated) {
      setTasks((prevTasks) => [...prevTasks, addedTask]);
    } else {
      try {
        const response = await axios.post(
          'http://localhost:1009/lists',
          {
            title: addedTask.title,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        );

        const newTask = {
          ...addedTask,
          id: response.data.insertId,
        };

        setTasks((prevTasks) => [...prevTasks, newTask]);
      } catch (error) {
        console.error('Error adding task:', error);
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
    if (isAuthenticated && accessToken) {
      console.log("isAuthenticated && accessToken", isAuthenticated, accessToken);
      fetchTasks(); // accessToken이 있을 때만 fetchTasks 호출
    } else {
      initTasksFromLocalStorage();
    }
  }, [isAuthenticated, accessToken]);

  useEffect(() => {
    const tasksFromLocalStorage = loadTasksFromLocalStorage();
    setTasks(tasksFromLocalStorage);

    // 로그아웃 이벤트 감지
    const handleLogout = () => {
      setTasks([]); // 로그아웃 시 상태 초기화
    };

    window.addEventListener('logout', handleLogout);

    return () => {
      window.removeEventListener('logout', handleLogout);
    };
  }, []);
  
  useEffect(() => {
    saveTasksToLocalStorage(tasks);
  }, [tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks, setTasks,
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
