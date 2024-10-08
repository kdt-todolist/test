import React, { useContext, useState } from 'react';
import { TaskContext } from '../../contexts/TaskContext';
import TaskCard from './TaskCard';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TaskDashboard: React.FC = () => {
  const taskContext = useContext(TaskContext);
  const [showCompleted, setShowCompleted] = useState(false);

  if (!taskContext) return <div>Loading...</div>;

  const incompleteTasks = taskContext.tasks.filter(task => !task.completed);
  const completedTasks = taskContext.tasks.filter(task => task.completed);

  const handleDragEnd = (result: any) => {
    if (!result.destination || !taskContext) return;

    // 전체 Task 배열을 복사
    const reorderedTasks = Array.from(taskContext.tasks);

    // 순서를 변경할 Task를 추출한 뒤, 원래 위치에서 제거하고 새로운 위치에 삽입
    const [movedTask] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, movedTask);

    // TaskContext에서 순서가 변경된 Task 배열을 업데이트
    taskContext.updateTaskOrder(reorderedTasks);
  };

  return (
    <div className="flex-1 p-6">
      <h2 className="text-2xl font-semibold mb-6">대시보드</h2>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks" direction="vertical">
          {(provided) => (
            <div
              className="masonry grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ minHeight: '100px' }}
            >
              {incompleteTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.5 : 1,  // Change opacity while dragging
                        marginBottom: '10px',  // Add margin between cards
                      }}
                    >
                      <TaskCard key={task.id} task={task} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="mt-6">
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className="text-blue-500 hover:underline focus:outline-none"
        >
          {showCompleted ? '완료 항목 숨기기' : '완료 항목 보기'}
        </button>

        {showCompleted && (
          <div className="mt-4 masonry grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDashboard;
