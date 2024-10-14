import React, { createContext, useState } from 'react';

export const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  // 초기 더미 데이터
  const initialTasks = [
    {
      id: 1,
      text: "Shopping",
      isChecked: false,
      subTasks: [
        { id: 101, text: "Buy milk", isChecked: false },
        { id: 102, text: "Buy eggs", isChecked: true },
      ],
    },
    {
      id: 2,
      text: "Work",
      isChecked: false,
      subTasks: [
        { id: 201, text: "Finish report", isChecked: true },
        { id: 202, text: "Send email to client", isChecked: false },
      ],
    },
    {
      id: 3,
      text: "Workout",
      isChecked: true,
      subTasks: [
        { id: 301, text: "Morning run", isChecked: true },
        { id: 302, text: "Evening yoga", isChecked: false },
      ],
    }
  ];

  const [tasks, setTasks] = useState(initialTasks);

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
