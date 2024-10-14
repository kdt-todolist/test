import React, { useContext, useState } from 'react';
import { TaskContext } from '../../contexts/TaskContext';
import TaskCard from './TaskCard';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TaskDashboard = () => {
  const { tasks, updateTaskOrder } = useContext(TaskContext);
  const [showCompleted, setShowCompleted] = useState(true); // To toggle between showing completed tasks

  // Filter only the checked (completed) tasks
  const completedTasks = tasks.filter(task => task.isChecked);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(source.index, 1);
    reorderedTasks.splice(destination.index, 0, movedTask);
    updateTaskOrder(reorderedTasks); // TaskContext의 updateTaskOrder로 순서 업데이트
  };

  return (
    <div className="flex-1 p-6">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable-tasks" direction="vertical">
          {(provided) => (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ minHeight: '100px' }}
            >
              {completedTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.5 : 1,
                        marginBottom: '10px',
                      }}
                    >
                      <TaskCard
                        task={task}
                        dragHandleProps={provided.dragHandleProps}
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
    </div>
  );
};

export default TaskDashboard;
