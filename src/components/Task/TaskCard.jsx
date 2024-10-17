import React, { useState, useContext, useEffect } from "react";
import { TaskContext } from "../../contexts/TaskContext";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaTrashAlt, FaPlusCircle, FaPencilAlt, FaArrowUp, FaArrowDown, FaPlus } from "react-icons/fa";
import { MdEventRepeat } from "react-icons/md";
import Button from "../Common/Button";
import InputCheck from "../Common/InputCheck";
import InputField from "../Common/InputField";
import Modal from '../Common/Modal';

function TaskCard({ task, dragHandleProps, openRoutineId, setOpenRoutineId }) {
  const { updateSubTaskCheck, updateSubTaskTitle, deleteSubTask, addSubTask, updateSubTaskOrder } = useContext(TaskContext);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentSubTaskId, setCurrentSubTaskId] = useState(null);
  const [isCompletedVisible, setIsCompletedVisible] = useState(true);
  const [selectedDaysMap, setSelectedDaysMap] = useState({});
  const [timeMap, setTimeMap] = useState({});
  const days = ["월", "화", "수", "목", "금", "토", "일"];

  // 루틴 박스가 닫힐 때 (openRoutineId가 null일 때) 선택된 요일과 시간을 초기화
  useEffect(() => {
    if (openRoutineId === null || currentSubTaskId) {
      setSelectedDaysMap((prev) => ({ ...prev, [currentSubTaskId]: [] }));
      setTimeMap((prev) => ({ ...prev, [currentSubTaskId]: '' }));
    }
  }, [openRoutineId, currentSubTaskId]);

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0'); // 두 자리로 맞춤
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleAddRoutine = (subTaskId) => {
    // 요일이 선택되지 않은 경우 알림
    if (!selectedDaysMap[subTaskId]?.length) {
      window.alert('요일을 선택해주세요.');
      return;
    }

    // 시간이 없으면 기본 값 00:00으로 설정
    const time = timeMap[subTaskId] || '00:00';
    const routine = {
      taskId: task.id,
      week: selectedDaysMap[subTaskId],
      resetTime: time,
    };

    console.log(routine);

    // 루틴 추가 후 루틴박스 닫기
    setOpenRoutineId(null);
  };

  const handleRoutineBox = (subTaskId) => {
    if (openRoutineId === subTaskId) {
      // 루틴 박스를 닫을 때 (이미 열려 있을 때)
      setOpenRoutineId(null);
    } else {
      setOpenRoutineId(subTaskId); // 루틴 박스 열기
      setCurrentSubTaskId(subTaskId); // 현재 서브 태스크 ID 설정
    }
  };

  const handleSubTaskDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedSubTasks = Array.from(task.subTasks);
    const [movedSubTask] = reorderedSubTasks.splice(result.source.index, 1);
    reorderedSubTasks.splice(result.destination.index, 0, movedSubTask);
    updateSubTaskOrder(task.id, reorderedSubTasks);
  };

  const toggleDay = (subTaskId, dayIndex) => {
    setSelectedDaysMap((prev) => {
      const currentDays = prev[subTaskId] || [];
      const updatedDays = currentDays.includes(dayIndex)
        ? currentDays.filter(d => d !== dayIndex)
        : [...currentDays, dayIndex];

      return { ...prev, [subTaskId]: updatedDays };
    });
  };

  const handleTimeChange = (subTaskId, time) => {
    setTimeMap((prev) => ({
      ...prev,
      [subTaskId]: time,
    }));
  };

  const handleAddSubTask = () => {
    if (inputValue.trim() === '') return;
    addSubTask(task.id, inputValue);
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

  // 완료된 서브태스크와 미완료된 서브태스크 분리
  const completedSubTasks = task.subTasks.filter(subTask => subTask.isChecked);
  const incompleteSubTasks = task.subTasks.filter(subTask => !subTask.isChecked);

  return (
    <>
      <div
        style={{ boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px' }}
        className="p-3 bg-white rounded-lg overflow-y-auto">
        {/* Only this part (header) will be draggable for task order */}
        <div {...dragHandleProps} className="flex justify-between rounded-lg items-center bg-blue-500 text-white p-3">
          <p className="text-2xl font-bold indent-1">{task.title}</p>
          <button
            className="rounded-full p-1 text-white bg-blue-500 hover:bg-blue-600"
            onClick={() => setOpen(true)}
          >
            <FaPlusCircle style={{ width: '24px', height: '24px' }} />
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
                            <p className="text-base font-semibold">{subTask.title}</p>
                          </div>
                          <div className="flex">
                            <Button
                              size="sm"
                              color="transparent"
                              onClick={() => {
                                setCurrentSubTaskId(subTask.id);
                                setInputValue(subTask.title);
                                setIsEditing(true);
                                setOpen(true);
                              }}
                            >
                              <FaPencilAlt style={{ color: '#000000', width: '16px', height: '16px' }} />
                            </Button>
                            <Button
                              size="sm"
                              color="transparent"
                              onClick={() => deleteSubTask(task.id, subTask.id)}
                            >
                              <FaTrashAlt style={{ color: '#000000', width: '16px', height: '16px' }} />
                            </Button>
                            <Button
                              size="sm"
                              color="transparent"
                              onClick={() => handleRoutineBox(subTask.id)}
                            >
                              <MdEventRepeat style={{ color: '#000000', width: '18px', height: '18px' }} />
                            </Button>
                          </div>
                        </div>
                        {openRoutineId === subTask.id && (
                          <div className="grid gap-2 items-center justify-between p-2">
                            {/* 시간 선택 */}
                            <div className="flex gap-2">
                              <input
                                type="time"
                                className="bg-transparent border rounded-lg p-2"
                                value={timeMap[subTask.id] || getCurrentTime()}
                                onChange={(e) => handleTimeChange(subTask.id, e.target.value)}
                              />
                              <Button
                                color="green"
                                onClick={() => handleAddRoutine(subTask.id)}
                              >
                                <FaPlus />
                              </Button>
                            </div>
                            {/* 날짜 선택 박스 */}
                            <div className="flex justify-start gap-1 flex-wrap">
                              {days.map((day, index) => (
                                <button
                                  key={index}
                                  className={`font-bold p-2 rounded-lg ${selectedDaysMap[subTask.id]?.includes(index) ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                                  onClick={() => toggleDay(subTask.id, index)}
                                >
                                  {day}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
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
                  <FaArrowDown style={{ width: '16px', height: '16px' }} />
                  :
                  <FaArrowUp style={{ width: '16px', height: '16px' }} />
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
                      <p className="text-base font-semibold text-gray-400">{subTask.title}</p>
                    </div>
                    <div className="pr-1">
                      <button
                        className="rounded-lg p-2 text-white bg-rose-600 hover:bg-rose-700"
                        onClick={() => deleteSubTask(task.id, subTask.id)}
                      >
                        <FaTrashAlt style={{ width: '16px', height: '16px' }} />
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
