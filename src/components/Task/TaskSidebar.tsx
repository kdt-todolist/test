import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

type TaskSidebarProps = {
  selectedList: string | null;
  setSelectedList: (listId: string) => void;
  selectedLists: string[];
  setSelectedLists: (listIds: string[]) => void;
  isOpen: boolean; // 드로어 열림 상태
};

export default function TaskSidebar({
  selectedList,
  setSelectedList,
  selectedLists,
  setSelectedLists,
  isOpen,
}: TaskSidebarProps) {
  const { taskLists, addTaskList, reorderTaskLists, editTaskList, deleteTaskList } = useTaskContext();
  const [newListName, setNewListName] = useState('');
  const [editListName, setEditListName] = useState('');
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [prevTaskListsLength, setPrevTaskListsLength] = useState(taskLists.length);

  const handleAddList = () => {
    if (newListName.trim()) {
      addTaskList(newListName);
      setNewListName('');
    } else {
      alert('목록 이름을 입력하세요.');
    }
  };

  const handleEditList = (listId: string) => {
    if (editListName.trim()) {
      editTaskList(listId, editListName);
      setEditingListId(null);
      setEditListName('');
    } else {
      alert('빈 내용으로 수정할 수 없습니다.');
    }
  };

  const handleListCheck = (listId: string) => {
    if (selectedLists.includes(listId)) {
      setSelectedLists(selectedLists.filter(id => id !== listId));
    } else {
      setSelectedLists([...selectedLists, listId]);
    }
  };

  // Handle drag end event
  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // If the item is dropped outside the list or not moved
    if (!destination || destination.index === source.index) return;

    reorderTaskLists(source.index, destination.index);
  };

  useEffect(() => {
    // 새로 목록이 추가된 경우
    if (taskLists.length > prevTaskListsLength) {
      const newListId = taskLists[taskLists.length - 1].id; // 마지막에 추가된 목록의 ID 추출

      // 새로운 목록을 체크 상태에 추가
      setSelectedLists([...selectedLists, newListId]);

      // 이전 목록 길이를 현재 목록 길이로 업데이트
      setPrevTaskListsLength(taskLists.length);
    }
  }, [taskLists, selectedLists, prevTaskListsLength]);

  return (
    <aside
      className={`fixed left-0 h-[calc(100%-56px)] w-64 bg-white p-4 border-r shadow-lg transform transition-transform duration-300 z-10 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <h2 className="font-bold text-lg mb-4">목록</h2>

      {/* DragDropContext for managing the drag and drop behavior */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sidebar-lists">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef} className="overflow-hidden">
              {taskLists.map((list, index) => (
                <Draggable key={list.id} draggableId={list.id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`relative group cursor-pointer mb-2 p-2 ${selectedList === list.id ? 'bg-blue-600 text-white' : ''}`}
                    >
                      {editingListId === list.id ? (
                        <div className="flex flex-wrap items-center">
                          <input
                            type="text"
                            value={editListName}
                            onChange={(e) => setEditListName(e.target.value)}
                            className="border p-1 flex-1 mb-2"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditList(list.id)}
                              className="bg-green-500 text-white p-1 rounded"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingListId(null)}
                              className="bg-gray-500 text-white p-1 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="relative flex items-center">
                          {/* 수정 및 삭제 버튼 */}
                          <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                            <button
                              onClick={() => {
                                setEditingListId(list.id);
                                setEditListName(list.name);
                              }}
                              className="text-blue-500 hover:text-blue-700 bg-white p-1 rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteTaskList(list.id)}
                              className="text-red-500 hover:text-red-700 bg-white p-1 rounded"
                            >
                              Delete
                            </button>
                          </div>

                          {/* 체크박스와 목록 텍스트 */}
                          <input
                            type="checkbox"
                            checked={selectedLists.includes(list.id)}
                            onChange={() => handleListCheck(list.id)}
                            className="mr-2 cursor-pointer w-6 h-6 accent-blue-500"
                            style={{
                              minWidth: '24px',
                              minHeight: '24px',
                              border: '2px solid #1e40af',
                              borderRadius: '0.25rem',
                              backgroundColor: '#ffffff',
                            }}
                          />
                          <span
                            style={{
                              maxWidth: 'calc(100% - 60px)', // 너비 제한
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: 'inline-block',
                            }}
                          >
                            {list.name}
                          </span>
                        </div>
                      )}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      {/* Input for adding new list */}
      <input
        type="text"
        value={newListName}
        onChange={(e) => setNewListName(e.target.value)}
        placeholder="새 목록 이름"
        className="border p-1 mb-2 w-full"
      />
      <button onClick={handleAddList} className="bg-blue-500 text-white p-2 rounded w-full">
        새 목록 추가
      </button>
    </aside>
  );
}
