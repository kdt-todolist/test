import React, { useState, useContext, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faX } from '@fortawesome/free-solid-svg-icons';
import { Task, SubTask, TaskContext } from '../../contexts/TaskContext';
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd';

interface TaskCardProps {
  task: Task;
  dragHandleProps?: any; // dragHandleProps를 선택적 속성으로 변경합니다.
}

const TaskCard: React.FC<TaskCardProps> = ({ task, dragHandleProps }) => {
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

  const handleSubTaskDragEnd = (result: any) => {
    if (!result.destination || !taskContext) return;

    const { source, destination } = result;

    // 순서를 변경할 SubTask를 추출한 뒤, 원래 위치에서 제거하고 새로운 위치에 삽입
    const reorderedSubTasks = Array.from(task.subTasks);
    const [movedSubTask] = reorderedSubTasks.splice(source.index, 1);
    reorderedSubTasks.splice(destination.index, 0, movedSubTask);

    // TaskContext에서 순서가 변경된 SubTask 배열을 업데이트
    taskContext.updateTask({
      ...task,
      subTasks: reorderedSubTasks,
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 group relative">
      {/* 카드 상단부 - Task 제목 영역 */}
      <div className="flex justify-between items-center mb-2" {...dragHandleProps}>
        <h3 className="text-lg font-semibold break-words">
          {task.title}
        </h3>
        <button
          onClick={handleTaskDelete}
          className="text-red-500 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <FontAwesomeIcon icon={faX} />
        </button>
      </div>
      <hr className="mt-2 mb-2" />

      {/* SubTask 추가 영역 */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="새 SubTask 제목"
            value={newSubTaskTitle}
            onChange={(e) => setNewSubTaskTitle(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="ml-2">
          <button
            onClick={handleAddSubTask}
            className="w-full h-full bg-blue-500 text-white px-2 py-2 rounded-lg shadow hover:bg-blue-600 transition flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faPlus} className="px-1 py-1" />
          </button>
        </div>
      </div>

      {/* SubTasks DragDropContext */}
      <DragDropContext onDragEnd={handleSubTaskDragEnd}>
        <Droppable droppableId={`subtasks-${task.id}`} type="subtask">
          {(provided) => (
            <ul className="mb-4" ref={provided.innerRef} {...provided.droppableProps}>
              {task.subTasks.map((subTask: SubTask, index) => (
                <Draggable key={subTask.id} draggableId={`subtask-${subTask.id}`} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex items-center justify-between mb-2 group"
                    >
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
                            className={`break-words ${subTask.completed ? 'line-through text-gray-500' : ''}`}
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
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TaskCard;
