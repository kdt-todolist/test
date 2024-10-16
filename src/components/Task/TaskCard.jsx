import { FaTrashAlt } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { FaPlusCircle } from "react-icons/fa";
import { MdEventRepeat } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";

import { useState, useContext } from "react";
import { TaskContext } from "../../contexts/TaskContext";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Button from "../Common/Button";
import InputCheck from "../Common/InputCheck";
import InputField from "../Common/InputField";
import Modal from '../Common/Modal';

function TaskCard({ task, dragHandleProps }) {
  const { updateSubTaskCheck, updateSubTaskTitle, deleteSubTask, addSubTask, updateSubTaskOrder } = useContext(TaskContext);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentSubTaskId, setCurrentSubTaskId] = useState(null);
  const [isCompletedVisible, setIsCompletedVisible] = useState(true);
  const [showRoutine, setShowRoutine] = useState(false);
  const [selectedDaysMap, setSelectedDaysMap] = useState({});
  const days = ["월", "화", "수", "목", "금", "토", "일"];

  const handleAddSubTask = () => {
    if (inputValue.trim() === '') return;

    const newSubTask = { id: Date.now(), text: inputValue, isChecked: false };
    addSubTask(task.id, newSubTask);
    setInputValue('');
    setOpen(false);
  };

  const handleUpdateSubTaskTitle = () => {
    if (inputValue.trim() === '') return;

    updateSubTaskTitle(task.id, currentSubTaskId, inputValue);
    setInputValue('');
    setIsEditing(false);
    setOpen(false);
  };

  const handleSubTaskDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedSubTasks = Array.from(task.subTasks);
    const [movedSubTask] = reorderedSubTasks.splice(result.source.index, 1);
    reorderedSubTasks.splice(result.destination.index, 0, movedSubTask);

    updateSubTaskOrder(task.id, reorderedSubTasks);
  };

  const toggleDay = (subTaskId, day) => {
    setSelectedDaysMap((prev) => {
      const currentDays = prev[subTaskId] || [];
      if (currentDays.includes(day)) {
        return { ...prev, [subTaskId]: currentDays.filter(d => d !== day) };
      } else {
        return { ...prev, [subTaskId]: [...currentDays, day] };
      }
    });
  };

  const handleRoutineBox = () => {
    setShowRoutine(!showRoutine);
  }


  // 완료된 서브 태스크와 미완료 서브 태스크 분리
  const completedSubTasks = task.subTasks.filter(subTask => subTask.isChecked);
  const incompleteSubTasks = task.subTasks.filter(subTask => !subTask.isChecked);

  return (
    <>
      <div 
        style={{boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px'}}
        className="p-3 bg-white rounded-lg overflow-y-auto">
        
        {/* Only this part (header) will be draggable for task order */}
        <div {...dragHandleProps} className="flex justify-between rounded-lg items-center bg-blue-500 text-white p-3">
          <p className="text-2xl font-bold indent-1">{task.text}</p>
          <button
            className="rounded-full p-1 text-white bg-blue-500 hover:bg-blue-600"
            onClick={() => setOpen(true)}
          >
            <FaPlusCircle style={{ width: '24px', height: '24px' }}/>
          </button>
        </div>

        <DragDropContext onDragEnd={handleSubTaskDragEnd}>
          <Droppable droppableId={`subtask-${task.id}`}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {incompleteSubTasks.map((subTask, index) => (
                  <Draggable key={subTask.id} draggableId={subTask.id.toString()} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="my-3 rounded-lg hover:bg-gray-100"
                        style={{
                          ...provided.draggableProps.style,
                          opacity: snapshot.isDragging ? 0.5 : 1,
                        }}
                      >
                        <div className="flex justify-between p-2">
                          <div className="flex items-center gap-1">
                            <InputCheck
                              shape="round"
                              checked={subTask.isChecked}
                              onChange={() => updateSubTaskCheck(task.id, subTask.id, !subTask.isChecked)}
                            />
                            <p className="text-base font-semibold">{subTask.text}</p>
                          </div>
                          <div className="flex">
                            <Button
                              size="sm"
                              color="transparent"
                              onClick={() => {
                                setCurrentSubTaskId(subTask.id);
                                setInputValue(subTask.text);
                                setIsEditing(true);
                                setOpen(true);
                              }}
                            >
                              <FaPencilAlt style={{ color: '#000000', width: '16px', height: '16px' }}/>
                            </Button>
                            <Button 
                              size="sm"
                              color="transparent"
                              onClick={() => deleteSubTask(task.id, subTask.id)}
                            >
                              <FaTrashAlt style={{ color: '#000000', width: '16px', height: '16px' }}/>
                            </Button>
                            <Button 
                              size="sm"
                              color="transparent"
                              onClick={() => handleRoutineBox()}
                            >
                              <MdEventRepeat style={{ color: '#000000', width: '18px', height: '18px' }}/>
                            </Button>
                          </div>
                        </div>
                        {/* 날짜 선택 박스 */}
                        { showRoutine ? 
                          <div className="flex justify-end gap-2 p-2">
                            {days.map((day) => (
                              <button
                                key={day}
                                className={`font-bold p-2 rounded-lg ${selectedDaysMap[subTask.id]?.includes(day) ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                                onClick={() => toggleDay(subTask.id, day)}
                              >
                                {day}
                              </button>
                            ))}
                          </div>
                        : null }
                      </div>

                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* 완료된 서브 태스크 섹션 */}
        {completedSubTasks.length > 0 && (
          <div className="grid mt-2 p-2">
            <div className="flex justify-between items-center pr-1">
              <p className="text-xl font-bold">완료 항목</p>
              <button
                className="rounded-lg p-2 text-white bg-blue-500 hover:bg-blue-600" 
                onClick={() => setIsCompletedVisible(!isCompletedVisible)}
              >
                {isCompletedVisible ? 
                  <FaArrowDown style={{ width: '16px', height: '16px'}} /> 
                :
                  <FaArrowUp style={{ width: '16px', height: '16px'}} />
                }
              </button>
            </div>
            
            {isCompletedVisible && (
              <div>
                {completedSubTasks.map((subTask, index) => (
                  <div key={subTask.id} className="flex justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <InputCheck
                        shape="round"
                        checked={subTask.isChecked}
                        onChange={() => updateSubTaskCheck(task.id, subTask.id, !subTask.isChecked)}
                      />
                      <p className="text-base font-semibold text-gray-400">{subTask.text}</p>
                    </div>
                    <div className="pr-1">
                      <button
                        className="rounded-lg p-2 text-white bg-rose-600 hover:bg-rose-700" 
                        onClick={() => deleteSubTask(task.id, subTask.id)}
                      >
                        <FaTrashAlt style={{ width: '16px', height: '16px' }}/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal for adding or editing subtasks */}
      <Modal
        width={400}
        height={250} 
        isOpen={open}
        closeBtn={true}
        onClose={() => setOpen(false)} 
      >
        <div className="grid gap-3">
          <div>
            <p className="text-lg font-bold indent-1 mb-2">
              {isEditing ? '서브 태스크 수정하기' : '서브 태스크 추가하기'}
            </p>
            <InputField
              placeholder="서브 태스크 입력"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  isEditing ? handleUpdateSubTaskTitle() : handleAddSubTask();
                }
              }}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              color="green"
              onClick={() => {
                isEditing ? handleUpdateSubTaskTitle() : handleAddSubTask();
                setOpen(false);
              }}
            >
              완료
            </Button>
            <Button
              color="red"
              onClick={() => setOpen(false)} 
            >
              취소
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default TaskCard;
