import React, { createContext, useContext, useState } from 'react';

export type Task = {
  id: string;
  text: string;
  completed: boolean;
};

export type TaskList = {
  id: string;
  name: string;
  tasks: Task[];
};

type TaskContextType = {
  taskLists: TaskList[];
  toggleComplete: (listId: string, taskId: string) => void;
  editTask: (listId: string, taskId: string, newText: string) => void;
  deleteTask: (listId: string, taskId: string) => void;
  addTask: (listId: string, text: string) => void;
  addTaskList: (name: string) => void;
  editTaskList: (listId: string, newName: string) => void; // 목록 이름 수정 함수
  deleteTaskList: (listId: string) => void; // 목록 삭제 함수
  reorderTasks: (listId: string, sourceIndex: number, destinationIndex: number) => void;
  reorderTaskLists: (sourceIndex: number, destinationIndex: number) => void;
};

const TaskContext = createContext<TaskContextType | null>(null);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTaskContext must be used within a TaskProvider');
  return context;
};

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [taskLists, setTaskLists] = useState<TaskList[]>([
    {
      id: '1',
      name: 'My Tasks',
      tasks: [
        { id: 'task-1', text: '할 일 1', completed: false },
        { id: 'task-2', text: '할 일 2', completed: false },
        { id: 'task-3', text: '할 일 3', completed: false },
      ],
    },
  ]);

  const toggleComplete = (listId: string, taskId: string) => {
    setTaskLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId
          ? {
              ...list,
              tasks: list.tasks.map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
              ),
            }
          : list
      )
    );
  };

  const editTask = (listId: string, taskId: string, newText: string) => {
    setTaskLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId
          ? {
              ...list,
              tasks: list.tasks.map((task) => (task.id === taskId ? { ...task, text: newText } : task)),
            }
          : list
      )
    );
  };

  const deleteTask = (listId: string, taskId: string) => {
    setTaskLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId
          ? { ...list, tasks: list.tasks.filter((task) => task.id !== taskId) }
          : list
      )
    );
  };

  const addTask = (listId: string, text: string) => {
    setTaskLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId
          ? {
              ...list,
              tasks: [...list.tasks, { id: `task-${Date.now()}`, text, completed: false }],
            }
          : list
      )
    );
  };

  const addTaskList = (name: string): string => {
    const newListId = `list-${Date.now()}`; // Generate a unique ID
    setTaskLists((prevLists) => [...prevLists, { id: newListId, name, tasks: [] }]);
    return newListId;
  };
  

  const editTaskList = (listId: string, newName: string) => {
    setTaskLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId
          ? {
              ...list,
              name: newName,
            }
          : list
      )
    );
  };

  const deleteTaskList = (listId: string) => {
    setTaskLists((prevLists) => prevLists.filter((list) => list.id !== listId));
  };

  const reorderTasks = (listId: string, sourceIndex: number, destinationIndex: number) => {
    setTaskLists((prevTaskLists) => {
      const listIndex = prevTaskLists.findIndex((list) => list.id === listId);
      if (listIndex < 0) return prevTaskLists;

      const tasks = Array.from(prevTaskLists[listIndex].tasks);
      const [movedTask] = tasks.splice(sourceIndex, 1);
      tasks.splice(destinationIndex, 0, movedTask);

      const updatedTaskLists = [...prevTaskLists];
      updatedTaskLists[listIndex] = {
        ...prevTaskLists[listIndex],
        tasks: tasks,
      };

      return updatedTaskLists;
    });
  };

  const reorderTaskLists = (sourceIndex: number, destinationIndex: number) => {
    setTaskLists((prevTaskLists) => {
      const reorderedTaskLists = Array.from(prevTaskLists);
      const [movedList] = reorderedTaskLists.splice(sourceIndex, 1);
      reorderedTaskLists.splice(destinationIndex, 0, movedList);

      return reorderedTaskLists;
    });
  };

  return (
    <TaskContext.Provider
      value={{
        taskLists,
        toggleComplete,
        editTask,
        deleteTask,
        addTask,
        addTaskList,
        editTaskList, // 추가된 목록 이름 수정 함수
        deleteTaskList, // 추가된 목록 삭제 함수
        reorderTasks,
        reorderTaskLists,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
