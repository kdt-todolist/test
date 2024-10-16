import React, { createContext, useState, useEffect } from 'react';

export const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  // 로컬 스토리지에서 Task 데이터를 불러오는 함수
  const loadTasksFromLocalStorage = () => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  };

  const [tasks, setTasks] = useState(loadTasksFromLocalStorage());

  // 로컬 스토리지에 Task 데이터를 저장하는 함수
  const saveTasksToLocalStorage = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  // Task가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    saveTasksToLocalStorage(tasks);
  }, [tasks]);

  // Task 추가 (기본적으로 체크된 상태로 추가)
  const addTask = (newTask) => {
    const taskWithChecked = { ...newTask, isChecked: true }; // 기본적으로 체크된 상태로 추가
    setTasks((prevTasks) => [...prevTasks, taskWithChecked]);
  };

  // Task 제목 수정
  const updateTaskTitle = (taskId, newTitle) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, text: newTitle }  // 제목만 수정
        : task
    ));
  };

  // Task 체크 상태 수정
  const updateTaskCheck = (taskId, isChecked) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, isChecked }  // 체크 상태만 수정
        : task
    ));
  };

  // Task 삭제
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // SubTask 추가
  const addSubTask = (taskId, subTask) => {
    setTasks(
      tasks.map(task =>
        task.id === taskId
          ? { ...task, subTasks: [...(task.subTasks || []), subTask] }
          : task
      )
    );
  };

  // SubTask 제목 수정
  const updateSubTaskTitle = (taskId, subTaskId, newTitle) => {
    setTasks(
      tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              subTasks: task.subTasks.map(subTask =>
                subTask.id === subTaskId
                  ? { ...subTask, text: newTitle }  // SubTask 제목만 수정
                  : subTask
              ),
            }
          : task
      )
    );
  };

  // SubTask 체크 상태 수정
  const updateSubTaskCheck = (taskId, subTaskId, isChecked) => {
    setTasks(
      tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              subTasks: task.subTasks.map(subTask =>
                subTask.id === subTaskId
                  ? { ...subTask, isChecked }  // SubTask 체크 상태만 수정
                  : subTask
              ),
            }
          : task
      )
    );
  };

  // SubTask 삭제
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
  };

  // SubTask 순서 변경
  const updateSubTaskOrder = (taskId, reorderedSubTasks) => {
    setTasks(
      tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              subTasks: reorderedSubTasks,  // 새로운 순서로 SubTasks 업데이트
            }
          : task
      )
    );
  };

  // Task 순서 변경
  const updateTaskOrder = (reorderedTasks) => {
    setTasks(reorderedTasks);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
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
        updateSubTaskOrder  // SubTask 순서 변경 함수 제공
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
