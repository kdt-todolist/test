import React, { createContext, useState } from 'react';

export const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  // Task 추가
  const addTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
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

  // Task 순서 변경
  const updateTaskOrder = (reorderedTasks) => {
    setTasks(reorderedTasks);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTaskTitle,
        updateTaskCheck,
        deleteTask,
        addSubTask,
        updateSubTaskTitle,
        updateSubTaskCheck,
        deleteSubTask,
        updateTaskOrder
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
