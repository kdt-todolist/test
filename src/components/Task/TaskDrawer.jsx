import { TaskContext } from '../../contexts/TaskContext'; // TaskContext 가져오기
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"; // react-beautiful-dnd 라이브러리 가져오기

import { FaTrashAlt } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { FaPlusCircle } from "react-icons/fa";
import { useState, useContext } from "react";
import Modal from "../Common/Modal";
import Button from "../Common/Button";
import InputCheck from "../Common/InputCheck";
import InputField from "../Common/InputField";

function TaskDrawer() {
  const { tasks, addTask, updateTaskTitle, updateTaskCheck, deleteTask, updateTaskOrder } = useContext(TaskContext); // TaskContext 사용
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(''); // 입력 값 상태
  const [isEditing, setIsEditing] = useState(false); // 편집 모드
  const [currentTaskId, setCurrentTaskId] = useState(null); // 현재 편집 중인 Task ID 저장

  // Task 추가 처리 함수
  const handleAddTask = () => {
    if (inputValue.trim() === '') return; // 빈 입력 방지

    const addedTask = { id: Date.now(), title: inputValue, isChecked: true, subTasks: [] }; // 새로운 Task 객체
    addTask(addedTask); // Task 추가
    setInputValue(''); // 입력 필드 초기화
    setOpen(false); // 모달 닫기
  };

  // Task 제목 수정 처리 함수
  const handleUpdateTaskTitle = () => {
    if (inputValue.trim() === '') return; // 빈 입력 방지

    updateTaskTitle(currentTaskId, inputValue); // Task 제목 업데이트
    setInputValue(''); // 입력 필드 초기화
    setIsEditing(false); // 편집 모드 해제
    setOpen(false); // 모달 닫기
  };

  const handleUpdateTaskCheck = (taskId, isChecked) => {
    updateTaskCheck(taskId, isChecked); // Task 체크 상태 업데이트
  };

  // Drag and Drop이 끝났을 때 호출되는 함수
  const handleDragEnd = (result) => {
    const { source, destination } = result;
    
    // 드래그를 시작했지만, 목적지에 두지 않은 경우 리턴
    if (!destination) return;

    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(source.index, 1); // 드래그된 요소 삭제
    reorderedTasks.splice(destination.index, 0, movedTask); // 목적지에 요소 추가

    updateTaskOrder(reorderedTasks); // Task 순서 업데이트
  };

  return (
    <>
      <div className="grid gap-y-3 mt-5 px-5">
        <button
          onClick={() => setOpen(true)} 
          className="flex items-center justify-center p-3 rounded-lg text-lg tracking-widest transition duration-300 ease-in-out
          bg-blue-600 hover:bg-blue-700"
        >
          <FaPlusCircle style={{ width: '24px', height: '24px', marginRight: '10px' }}/>
          새 목록 만들기
        </button>
        {/* Drag and Drop Context */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="task-list">
            {(provided) => (
              <div
                className="grid gap-3"
                // className="lists w-64"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex items-center justify-between p-3 rounded-lg tracking-widest transition duration-300 ease-in-out bg-blue-600 hover:bg-blue-700"
                      >
                        <div className="flex items-center">
                          <InputCheck
                            checked={task.isChecked} // 체크 상태 유지
                            onChange={() => handleUpdateTaskCheck(task.id, !task.isChecked)} // 체크 상태 변경
                          />
                          <p className="indent-3">
                            {task.title.length > 9 ? task.title.slice(0, 9) + '...' : task.title} {/* 제목 표시 */}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Button
                            size="sm"
                            color="transparent"
                            onClick={() => {
                              setCurrentTaskId(task.id); // 현재 Task ID 설정
                              setInputValue(task.title); // 입력 필드 값 설정
                              setIsEditing(true); // 편집 모드 활성화
                              setOpen(true); // 모달 열기
                            }}
                          >
                            <FaPencilAlt style={{ width: '18px', height: '18px' }}/>
                          </Button>
                          <Button 
                            size="sm"
                            color="transparent"
                            onClick={() => deleteTask(task.id)}
                          > {/* Task 삭제 */}
                            <FaTrashAlt style={{ width: '18px', height: '18px' }}/>
                          </Button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder} {/* Droppable 영역을 유지하기 위해 필요한 placeholder */}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Task 추가/수정 모달 */}
      <Modal
        width={400}
        height={250}
        isOpen={open} 
        closeBtn={false}
        onClose={() => setOpen(false)} 
      >
        <div className="grid gap-3">
          <div>
            <p className="text-lg indent-1 mb-2 tracking-wider">
              {isEditing ? "목록 수정하기" : "새 목록 만들기"}
            </p>
            <InputField
              placeholder="목록 이름 입력"
              value={inputValue} // 입력 필드 값
              onChange={(e) => setInputValue(e.target.value)} // 입력 필드 변경 처리
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  isEditing ? handleUpdateTaskTitle() : handleAddTask(); // 엔터 키로 Task 추가/수정
                }
              }}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              color="green"
              onClick={() => {
                isEditing ? handleUpdateTaskTitle() : handleAddTask(); // Task 추가 또는 수정
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

export default TaskDrawer;
