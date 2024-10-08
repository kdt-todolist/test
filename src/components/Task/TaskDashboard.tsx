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

    const { source, destination } = result;

    // 전체 Task 배열을 복사
    const reorderedTasks = Array.from(taskContext.tasks);

    // 순서를 변경할 Task를 추출한 뒤, 원래 위치에서 제거하고 새로운 위치에 삽입
    const [movedTask] = reorderedTasks.splice(source.index, 1);
    reorderedTasks.splice(destination.index, 0, movedTask);

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
              style={{ minHeight: '100px' }}  // Droppable 영역이 최소 높이를 가집니다
            >
              {incompleteTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.5 : 1,  // 드래그 중에는 불투명도 변경
                        marginBottom: '10px',  // 카드 간격을 위한 여백 추가
                      }}
                    >
                      <TaskCard
                        task={task}
                        dragHandleProps={provided.dragHandleProps} // dragHandleProps를 TaskCard에 전달합니다.
                      />
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
