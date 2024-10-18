import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { TaskContext } from "../../contexts/TaskContext";
import { RoutineContext } from '../../contexts/RoutineContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaTrashAlt, FaPlusCircle, FaPencilAlt, FaPlus, FaCalendarCheck, FaEdit, FaArrowDown, FaArrowUp } from "react-icons/fa";
import { MdEventRepeat } from "react-icons/md";
import Button from "../Common/Button";
import InputCheck from "../Common/InputCheck";
import InputField from "../Common/InputField";
import Modal from '../Common/Modal';
import LoginFrom from '../Auth/LoginForm';
import { loadFromLocalStorage } from "../../utils/localStorageHelpers";

function TaskCard({ task, dragHandleProps, openRoutineId, setOpenRoutineId }) {
  const { isAuthenticated, user } = useContext(AuthContext);
  const { tasks, updateSubTaskCheck, updateSubTaskTitle, deleteSubTask, addSubTask, updateSubTaskOrder } = useContext(TaskContext);
  const { addRoutine, updateRoutine, deleteRoutine, getRoutine } = useContext(RoutineContext);

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentSubTaskId, setCurrentSubTaskId] = useState(null);
  const [isCompletedVisible, setIsCompletedVisible] = useState(true);
  const [selectedDaysMap, setSelectedDaysMap] = useState({});
  const [timeMap, setTimeMap] = useState({});
  const days = ["월", "화", "수", "목", "금", "토", "일"];
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleAddRoutine = async (subTaskId) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!selectedDaysMap[subTaskId]?.length) {
      window.alert('요일을 선택해주세요.');
      return;
    }

    const daysOfWeek = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const week = daysOfWeek.reduce((acc, day, index) => {
      acc[day] = selectedDaysMap[subTaskId].includes(index);
      return acc;
    }, {});

    const resetTime = timeMap[subTaskId] || '00:00';
    await addRoutine(subTaskId, week, resetTime);
    await getRoutine(task.id); // Fetch updated routine data immediately after addition
    setOpenRoutineId(null);
  };

  const handleUpdateRoutine = async (subTaskId) => {
    if (!selectedDaysMap[subTaskId]?.length) {
      window.alert('요일을 선택해주세요.');
      return;
    }

    const daysOfWeek = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const week = daysOfWeek.reduce((acc, day, index) => {
      acc[day] = selectedDaysMap[subTaskId].includes(index);
      return acc;
    }, {});

    const resetTime = timeMap[subTaskId] || '00:00';
    const storedRoutines = loadFromLocalStorage(`userRoutines_${user}`);
    const routineId = storedRoutines.find(routine => routine.subTaskId === subTaskId)?.id;

    if (routineId) {
      await updateRoutine(routineId, week, resetTime);
      await getRoutine(task.id);
      setOpenRoutineId(null);
    }
  };

  const handleDeleteRoutine = (subTaskId) => {
    const storedRoutines = loadFromLocalStorage(`userRoutines_${user}`);
    const routineId = storedRoutines.find(routine => routine.subTaskId === subTaskId)?.id;

    if (routineId) {
      deleteRoutine(routineId, task.id);
      // Reset selectedDaysMap and timeMap for the deleted routine
      setSelectedDaysMap((prev) => {
        const updatedDaysMap = { ...prev };
        delete updatedDaysMap[subTaskId]; // Remove the entry for the subTaskId
        return updatedDaysMap;
      });
      setTimeMap((prev) => {
        const updatedTimeMap = { ...prev };
        delete updatedTimeMap[subTaskId]; // Remove the time entry for the subTaskId
        return updatedTimeMap;
      });
      setOpenRoutineId(null);
    }
  };

  const handleRoutineBox = (subTaskId) => {
    if (openRoutineId === subTaskId) {
      setOpenRoutineId(null);
    } else {
      setOpenRoutineId(subTaskId);
      setCurrentSubTaskId(subTaskId);

      const storedTasks = loadFromLocalStorage(`userTasks_${user}`);
      const task = storedTasks.find(task => task.subTasks.some(subTask => subTask.id === subTaskId));

      if (task) {
        const subTask = task.subTasks.find(subTask => subTask.id === subTaskId);

        if (subTask?.isRoutine && subTask.routines) {
          const daysOfWeek = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
          const selectedDays = daysOfWeek
            .map((day, index) => (subTask.routines[day] ? index : null))
            .filter(index => index !== null);

          setSelectedDaysMap((prev) => ({ ...prev, [subTaskId]: selectedDays }));
          setTimeMap((prev) => ({ ...prev, [subTaskId]: subTask.routines.resetTime.split(':').slice(0, 2).join(':') }));
        }
      }
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
    setTimeMap((prev) => ({ ...prev, [subTaskId]: time }));
  };

  const handleAddSubTask = () => {
    if (!inputValue.trim()) return;
    addSubTask(task.id, inputValue);
    setInputValue('');
    setOpen(false);
  };

  const handleUpdateSubTaskTitle = () => {
    if (!inputValue.trim()) return;
    updateSubTaskTitle(task.id, currentSubTaskId, inputValue);
    setInputValue('');
    setIsEditing(false);
    setOpen(false);
  };

  const completedSubTasks = task.subTasks.filter(subTask => subTask.isChecked);
  const incompleteSubTasks = task.subTasks.filter(subTask => !subTask.isChecked);

  return (
    <>
      <div className="p-3 bg-white rounded-lg overflow-y-auto" style={{ boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px' }}>
        <div {...dragHandleProps} className="flex justify-between rounded-lg items-center bg-blue-500 text-white p-3">
          <p className="text-2xl font-bold indent-1">{task.title}</p>
          <button className="rounded-full p-1 text-white bg-blue-500 hover:bg-blue-600" onClick={() => setOpen(true)}>
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
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="my-3 rounded-lg hover:bg-gray-100"
                        style={{
                          ...provided.draggableProps.style,
                          opacity: snapshot.isDragging ? 0.5 : 1,
                          backgroundColor: openRoutineId === subTask.id ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                        }}>
                        <div className="flex justify-between p-2">
                          <div className="flex items-center gap-1">
                            <InputCheck shape="round" checked={subTask.isChecked} onChange={() => updateSubTaskCheck(task.id, subTask.id, !subTask.isChecked)} />
                            <p className="text-base font-semibold">{subTask.title}</p>
                          </div>
                          <div className="flex">
                            <Button size="sm" color="transparent" onClick={() => { setCurrentSubTaskId(subTask.id); setInputValue(subTask.title); setIsEditing(true); setOpen(true); }}>
                              <FaPencilAlt style={{ color: '#000000', width: '16px', height: '16px' }} />
                            </Button>
                            <Button size="sm" color="transparent" onClick={() => deleteSubTask(task.id, subTask.id)}>
                              <FaTrashAlt style={{ color: '#000000', width: '16px', height: '16px' }} />
                            </Button>
                            <Button size="sm" color="transparent" onClick={() => handleRoutineBox(subTask.id)}>
                              {subTask.isRoutine ? <FaCalendarCheck style={{ borderRadius: '20%', color: 'gray', width: '16px', height: '16px' }} /> : <MdEventRepeat style={{ color: '#000000', width: '18px', height: '18px' }} />}
                            </Button>
                          </div>
                        </div>

                        {openRoutineId === subTask.id && (
                          <div className="grid gap-2 items-center justify-between p-2">
                            <div className="flex gap-2">
                              <input type="time" className="bg-transparent border rounded-lg p-2" value={timeMap[subTask.id] || getCurrentTime()} onChange={(e) => handleTimeChange(subTask.id, e.target.value)} />
                              <Button size="sm" color={subTask.isRoutine ? "yellow" : "green"} onClick={() => subTask.isRoutine ? handleUpdateRoutine(subTask.id) : handleAddRoutine(subTask.id)}>
                                {subTask.isRoutine ? <FaEdit /> : <FaPlus />}
                              </Button>
                              {subTask.isRoutine && (
                                <Button size="sm" color="red" onClick={() => handleDeleteRoutine(subTask.id)}>
                                  <FaTrashAlt />
                                </Button>
                              )}
                            </div>
                            <div className="flex justify-start gap-1 flex-wrap">
                              {days.map((day, index) => (
                                <button key={index} className={`font-bold p-2 rounded-lg ${selectedDaysMap[subTask.id]?.includes(index) ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`} onClick={() => toggleDay(subTask.id, index)}>
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

        {completedSubTasks.length > 0 && (
          <div className="grid mt-2 p-2">
            <div className="flex justify-between items-center pr-1">
              <p className="text-xl font-bold">완료 항목</p>
              <button className="rounded-lg p-2 text-white bg-blue-500 hover:bg-blue-600" onClick={() => setIsCompletedVisible(!isCompletedVisible)}>
                {isCompletedVisible ? <FaArrowDown style={{ width: '16px', height: '16px' }} /> : <FaArrowUp style={{ width: '16px', height: '16px' }} />}
              </button>
            </div>
            {isCompletedVisible && (
              <div>
                {completedSubTasks.map((subTask, index) => (
                  <div key={subTask.id} className="flex justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <InputCheck shape="round" checked={subTask.isChecked} onChange={() => updateSubTaskCheck(task.id, subTask.id, !subTask.isChecked)} />
                      <p className="text-base font-semibold text-gray-400">{subTask.title}</p>
                    </div>
                    <div className="pr-1">
                      <button className="rounded-lg p-2 text-white bg-rose-600 hover:bg-rose-700" onClick={() => deleteSubTask(task.id, subTask.id)}>
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

      <Modal width={400} height={250} isOpen={open} closeBtn={true} onClose={() => setOpen(false)}>
        <div className="grid gap-3">
          <div>
            <p className="text-lg font-bold indent-1 mb-2">{isEditing ? '서브 태스크 수정하기' : '서브 태스크 추가하기'}</p>
            <InputField placeholder="서브 태스크 입력" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { isEditing ? handleUpdateSubTaskTitle() : handleAddSubTask(); } }} />
          </div>
          <div className="flex justify-end gap-3">
            <Button color="green" onClick={() => { isEditing ? handleUpdateSubTaskTitle() : handleAddSubTask(); setOpen(false); }}>완료</Button>
            <Button color="red" onClick={() => setOpen(false)}>취소</Button>
          </div>
        </div>
      </Modal>

      <Modal width={300} height={250} isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}>
        <LoginFrom placeholder="로그인 후 이용할 수 있는 서비스입니다." />
      </Modal>
    </>
  );
}

export default TaskCard;
