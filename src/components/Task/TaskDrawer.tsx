import React, { useContext, useState } from 'react';
import { TaskContext, Task } from '../../contexts/TaskContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faX } from '@fortawesome/free-solid-svg-icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TaskDrawer: React.FC = () => {
  const taskContext = useContext(TaskContext);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isEditingTaskId, setIsEditingTaskId] = useState<number | null>(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState('');

  const handleAddTask = () => {
    if (!taskContext) return;

    const newTask: Task = {
      id: Date.now(),
      title: newTaskTitle,
      completed: false,
      dueDate: new Date().toISOString().split('T')[0],
      subTasks: [],
    };

    taskContext.addTask(newTask);
    setNewTaskTitle(''); // 입력 필드 초기화
  };

  const handleEditTask = (task: Task) => {
    setIsEditingTaskId(task.id);
    setEditedTaskTitle(task.title);
  };

  const handleSaveTask = (task: Task) => {
    if (!taskContext) return;
    taskContext.updateTask({ ...task, title: editedTaskTitle });
    setIsEditingTaskId(null); // 편집 모드 종료
  };

  const handleDeleteTask = (taskId: number) => {
    if (!taskContext) return;
    taskContext.deleteTask(taskId);
  };

  // Drag end handler
  const handleDragEnd = (result: any) => {
    if (!result.destination || !taskContext) return;

    const reorderedTasks = Array.from(taskContext.tasks);
    const [movedTask] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, movedTask);

    // Update tasks order in the TaskContext (if you have an updateOrder function in the context)
    taskContext.updateTaskOrder(reorderedTasks);  // Add this function to update the order in your state.
  };

  if (!taskContext) return <div>Loading...</div>;

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Task 목록</h2>

      {/* Task 추가 폼 */}
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="새 태스크 제목"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="flex-grow p-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          onClick={handleAddTask}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
        >
            <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>

      {/* Task 리스트 드래그 앤 드롭 */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul
              className="space-y-2"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {taskContext.tasks.map((task: Task, index: number) => (
                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex items-center justify-between group bg-white p-2 rounded-md shadow"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => taskContext.updateTask({ ...task, completed: !task.completed })}
                          className="mr-2 w-6 h-6 rounded-full border-gray-300 text-blue-500 focus:ring-blue-500"
                        />
                        {isEditingTaskId === task.id ? (
                          <input
                            type="text"
                            value={editedTaskTitle}
                            onChange={(e) => setEditedTaskTitle(e.target.value)}
                            onBlur={() => handleSaveTask(task)}  // 포커스가 벗어나면 저장
                            autoFocus  // 텍스트 클릭 시 자동 포커싱
                            className="flex-grow p-2 border rounded-lg focus:outline-none"
                          />
                        ) : (
                          <span
                            onClick={() => handleEditTask(task)}  // 텍스트 클릭 시 편집 모드
                            className={`flex-grow ${task.completed ? "line-through text-gray-500" : ""}`}
                          >
                            {task.title}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
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
    </>
  );
};

export default TaskDrawer;
