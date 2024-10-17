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
    if (key === 'guestTasks') {
      if (tasks.length > 0) {
        localStorage.setItem(key, JSON.stringify(tasks));
        console.log("Updated guestTasks", tasks);
      }
    } else if (key) {
      // userTasks에 대해서는 덮어쓰기 가능
      localStorage.setItem(key, JSON.stringify(tasks));
      console.log(`saveTasksToLocalStorage ${key}`, tasks);
    }
  };

  const initTasksFromLocalStorage = () => {
    const key = getLocalStorageKey();
    if (key && key !== 'guestTasks') { // guestTasks는 삭제하지 않음
      console.log("initTasksFromLocalStorage", key);
      localStorage.removeItem(key);
    }
  };  

  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
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
    try {
      // 로컬스토리지에서 guestTasks를 가져옴
      const guestTasks = localStorage.getItem('guestTasks');
  
      console.log("bulk guestTasks", guestTasks);
  
      // guestTasks가 없거나 null인 경우 처리
      if (!guestTasks || guestTasks === 'null') {
        console.log('로컬스토리지에 guestTasks가 없습니다.');
        return;
      }
  
      // guestTasks를 JSON으로 파싱
      const parsedGuestTasks = JSON.parse(guestTasks);
  
      // 파싱된 데이터가 배열인지, 배열이 비어있는지 확인
      if (!Array.isArray(parsedGuestTasks) || parsedGuestTasks.length === 0) {
        console.log("업로드할 유효한 guestTasks가 없습니다.");
        return;
      }
  
      // 서버에 전송할 형식으로 데이터 변환
      const formattedLists = parsedGuestTasks.map((list) => ({
        title: list.title,
        isVisible: list.isChecked,
      }));
  
      // 서버로 리스트 데이터 전송
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
  
      const insertedListIds = taskBulkResponse.data.insertedIds;
  
      // 각 리스트에 대한 서브태스크 전송
      await Promise.all(
        parsedGuestTasks.map(async (list, index) => {
          const subTasks = list.subTasks.map((subTask) => ({
            content: subTask.title,
            done: subTask.isChecked,
          }));
  
          console.log("보내는 서브태스크:", subTasks);
  
          // 서브태스크가 있을 경우에만 서버로 전송
          if (subTasks && subTasks.length > 0) {
            await axios.post(
              'http://localhost:1009/tasks/bulk',
              {
                listId: insertedListIds[index],
                tasks: subTasks,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
              }
            );
          }
        })
      );
  
      // bulk 완료 후 guestTasks 초기화
      localStorage.removeItem('guestTasks');
      console.log('bulk 업로드 완료 후 guestTasks를 삭제했습니다.');
    } catch (error) {
      console.error('태스크 추가 중 오류 발생:', error);
    }
  };  

  const syncTasks = async () => {
    // 1. 로컬 스토리지에 있는 데이터를 서버로 전송
    await bulkTask();

    // 2. 서버로부터 최신 작업 리스트를 가져옴
    await fetchTasks();
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
      syncTasks();
    } else {
      initTasksFromLocalStorage();
    }
  }, [isAuthenticated, accessToken]);

  useEffect(() => {
    setTasks(loadTasksFromLocalStorage());

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
