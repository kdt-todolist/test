import React, { useState, useContext, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faX } from '@fortawesome/free-solid-svg-icons';
import { Task, SubTask, TaskContext } from '../../contexts/TaskContext';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const taskContext = useContext(TaskContext);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
  const [editingSubTaskId, setEditingSubTaskId] = useState<number | null>(null);
  const [editingSubTaskTitle, setEditingSubTaskTitle] = useState<string>('');
  const subTaskInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editingSubTaskId !== null && subTaskInputRef.current) {
      subTaskInputRef.current.focus();
    }
  }, [editingSubTaskId]);

  const handleTaskDelete = () => {
    if (!taskContext) return;
    taskContext.deleteTask(task.id);
  };

  const handleAddSubTask = () => {
    if (!taskContext) return;

    const newSubTask: SubTask = {
      id: Date.now(),
      title: newSubTaskTitle,
      completed: false,
    };

    taskContext.addSubTask(task.id, newSubTask);
    setNewSubTaskTitle('');
  };

  const startEditingSubTask = (subTask: SubTask) => {
    setEditingSubTaskId(subTask.id);
    setEditingSubTaskTitle(subTask.title);
  };

  const handleSubTaskUpdate = (subTask: SubTask) => {
    if (!taskContext) return;
    taskContext.updateSubTask(task.id, { ...subTask, title: editingSubTaskTitle });
    setEditingSubTaskId(null);
  };

  const handleSubTaskDelete = (subTaskId: number) => {
    if (!taskContext) return;
    taskContext.deleteSubTask(task.id, subTaskId);
  };

  const handleSubTaskBlur = (subTask: SubTask) => {
    handleSubTaskUpdate(subTask);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 group relative">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold break-words">{task.title}</h3>
      </div>
      <hr className='mt-2 mb-2' />
      <ul className="mb-4">
        {task.subTasks.map((subTask: SubTask) => (
          <li key={subTask.id} className="flex items-center justify-between mb-2 group">
            <div className="flex items-center">
            <input
              type="checkbox"
              checked={subTask.completed}
              onChange={() => {
                if (!taskContext) return;
                taskContext.updateSubTask(task.id, { ...subTask, completed: !subTask.completed });
              }}
              className="mr-2 w-6 h-6 rounded-full border-gray-300 text-blue-500 focus:ring-blue-500"
            />

              {editingSubTaskId === subTask.id ? (
                <input
                  type="text"
                  ref={subTaskInputRef}
                  value={editingSubTaskTitle}
                  onChange={(e) => setEditingSubTaskTitle(e.target.value)}
                  onBlur={() => handleSubTaskBlur(subTask)}
                  className="p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                />
              ) : (
                <span
                  onClick={() => startEditingSubTask(subTask)}
                  className={`break-words ${subTask.completed ? "line-through text-gray-500" : ""}`}
                >
                  {subTask.title}
                </span>
              )}
            </div>
            <button 
              onClick={() => handleSubTaskDelete(subTask.id)} 
              className="text-red-500 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FontAwesomeIcon icon={faX} />
            </button>
          </li>
        ))}
      </ul>

      <div className="flex justify-end">
        <div className='flex-grow'>
          <input
            type="text"
            placeholder="새 SubTask 제목"
            value={newSubTaskTitle}
            onChange={(e) => setNewSubTaskTitle(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className='ml-2'>
          <button 
            onClick={handleAddSubTask} 
            className="w-full h-full bg-blue-500 text-white px-2 py-2 rounded-lg shadow hover:bg-blue-600 transition flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faPlus} className="px-1 py-1" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default TaskCard;
