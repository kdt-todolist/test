export type Task = {
    id: string;
    title: string;
    text: string;
    completed: boolean;
    category: 'personal' | 'work' | 'important';
    subtasks: SubTask[];
  };
  
  export type SubTask = {
    id: string;
    title: string;
    text: string;
    completed: boolean;
    category: 'personal' | 'work' | 'important';
  };
  