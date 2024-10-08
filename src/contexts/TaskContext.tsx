import React, { createContext, useState, ReactNode } from 'react';

export interface SubTask {
  id: number;
  title: string;
  completed: boolean;
}

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  dueDate: string;
  subTasks: SubTask[];
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: number) => void;
  addSubTask: (taskId: number, subTask: SubTask) => void;
  updateSubTask: (taskId: number, subTask: SubTask) => void;
  deleteSubTask: (taskId: number, subTaskId: number) => void;
  updateTaskOrder: (reorderedTasks: Task[]) => void;
}

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskContext = createContext<TaskContextType | null>(null);

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
  };

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const addSubTask = (taskId: number, subTask: SubTask) => {
    setTasks(
      tasks.map(task =>
        task.id === taskId
          ? { ...task, subTasks: [...task.subTasks, subTask] }
          : task
      )
    );
  };

  const updateSubTask = (taskId: number, updatedSubTask: SubTask) => {
    setTasks(
      tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              subTasks: task.subTasks.map(subTask =>
                subTask.id === updatedSubTask.id ? updatedSubTask : subTask
              ),
            }
          : task
      )
    );
  };

  const deleteSubTask = (taskId: number, subTaskId: number) => {
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

  const updateTaskOrder = (reorderedTasks: Task[]) => {
    setTasks(reorderedTasks);
  };
  

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        addSubTask,
        updateSubTask,
        deleteSubTask,
        updateTaskOrder
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
