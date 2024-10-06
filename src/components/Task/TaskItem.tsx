import React, { useState } from 'react';
import { Task } from '../../context/TaskContext';

type TaskItemProps = {
  task: Task;
  editTask: (id: string, newText: string) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
};

export default function TaskItem({ task, editTask, deleteTask, toggleComplete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(task.text);

  const handleSave = () => {
    if (newText.trim()) {
      editTask(task.id, newText);
      setIsEditing(false);
    } else {
      alert('빈 내용으로 수정할 수 없습니다.');
    }
  };

  return (
    <div className={`p-4 border rounded mb-2 ${task.completed ? 'bg-green-200' : 'bg-white'} relative group`}>
      {isEditing ? (
        <div className="flex flex-wrap items-center">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="border p-1 flex-1 mb-2"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white p-1 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white p-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 수정/삭제 버튼 (hover 시에만 표시) */}
          <div className="absolute top-0 right-0 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <button
              onClick={() => {
                setIsEditing(true);
                setNewText(task.text);
              }}
              className="text-blue-500 hover:text-blue-700 bg-white p-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-500 hover:text-red-700 bg-white p-1 rounded"
            >
              Delete
            </button>
          </div>
          
          {/* 체크박스와 텍스트 */}
          <div className="flex items-center">
            {/* 완료 체크박스 */}
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task.id)}
              className="mr-2 w-6 h-6 cursor-pointer accent-blue-500"
              style={{ minWidth: '24px', minHeight: '24px' }} // 크기 고정
            />
            <span className={task.completed ? 'line-through text-gray-500' : 'text-black'}
            style={{
                maxWidth: '100%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'inline-block',
              }}
            >
              {task.text}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
