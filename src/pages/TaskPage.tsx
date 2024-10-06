import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import TaskItem from '../components/Task/TaskItem';
import TaskHeader from '../components/Task/TaskHeader';
import TaskSidebar from '../components/Task/TaskSidebar';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Masonry from 'react-masonry-css';

export default function TasksPage() {
  const { taskLists, addTask, toggleComplete, editTask, deleteTask, reorderTasks, reorderTaskLists } = useTaskContext();
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [selectedLists, setSelectedLists] = useState<string[]>([]);  
  const [isOpen, setIsOpen] = useState(true);

  const handleAddTask = (listId: string) => {
    if (newTaskText.trim()) {
      addTask(listId, newTaskText);
      setNewTaskText('');
    }
  };

  const handleDragEnd = (result: any) => {
    const { source, destination, type } = result;

    if (!destination) return;

    if (type === 'list') {
      reorderTaskLists(source.index, destination.index);
    }

    if (type === 'task') {
      const listId = source.droppableId;
      reorderTasks(listId, source.index, destination.index);
    }
  };

  // Masonry breakpoints 설정
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      <TaskHeader isOpen={isOpen} toggleDrawer={toggleDrawer} />

      <div className="flex flex-1 overflow-hidden">
        <div
          className={`bg-white border-r shadow-md transition-transform duration-300`}
        >
          {isOpen && (
            <TaskSidebar
              isOpen={isOpen}
              selectedList={selectedList}
              setSelectedList={setSelectedList}
              selectedLists={selectedLists}
              setSelectedLists={setSelectedLists}
            />
          )}
        </div>

        <div
          className={`flex-1 p-4 overflow-y-auto mr-4 transition-all duration-300 ${
            isOpen ? 'ml-64' : 'ml-0'
          }`}
        >
          <h1 className="text-2xl font-bold mb-4">대시보드</h1>
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="all-lists" type="list" direction="horizontal">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="flex w-auto gap-4"
                    columnClassName="flex flex-col gap-4"
                  >
                    {taskLists
                      .filter(list => selectedLists.includes(list.id))
                      .map((list, index) => (
                        <Draggable key={list.id} draggableId={list.id} index={index}>
                          {(provided) => (
                            <div
                              {...provided.draggableProps}
                              ref={provided.innerRef}
                              className="mb-4 border rounded shadow-lg bg-white p-4"
                              style={{ breakInside: 'avoid' }}
                            >
                              <h2
                                className="text-xl font-bold mb-2"
                                {...provided.dragHandleProps}
                                style={{
                                  maxWidth: '100%',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: 'block',
                                }}
                              >
                                {list.name}
                              </h2>
                              
                              <Droppable droppableId={list.id} type="task">
                                {(provided) => (
                                  <ul
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="mb-4 space-y-2"
                                  >
                                    {list.tasks.map((task, taskIndex) => (
                                      <Draggable key={task.id} draggableId={task.id} index={taskIndex}>
                                        {(provided) => (
                                          <div
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            ref={provided.innerRef}
                                          >
                                            <TaskItem
                                              task={task}
                                              toggleComplete={() => toggleComplete(list.id, task.id)}
                                              editTask={(id, newText) => editTask(list.id, id, newText)}
                                              deleteTask={(id) => deleteTask(list.id, id)}
                                            />
                                          </div>
                                        )}
                                      </Draggable>
                                    ))}
                                    {provided.placeholder}
                                  </ul>
                                )}
                              </Droppable>

                              <div className="flex mt-2">
                                <input
                                  type="text"
                                  value={newTaskText}
                                  onChange={(e) => setNewTaskText(e.target.value)}
                                  placeholder="새 할 일 추가"
                                  className="flex-1 border p-2 mr-2"
                                />
                                <button
                                  onClick={() => handleAddTask(list.id)}
                                  className="bg-blue-500 text-white p-2 rounded"
                                >
                                  추가
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </Masonry>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}
