import { BsPlusCircleDotted } from "react-icons/bs";
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useState, useContext } from "react";
import { TaskContext } from '../../contexts/TaskContext'; // TaskContext 가져오기

import Modal from "../Common/Modal";
import Button from "../Common/Button";
import InputCheck from "../Common/InputCheck";
import InputField from "../Common/InputField";


function TaskDrawer() {
  const { tasks, addTask, updateTaskTitle, updateTaskCheck, deleteTask } = useContext(TaskContext); // TaskContext 사용
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(''); // 입력 값 상태
  const [isEditing, setIsEditing] = useState(false); // 편집 모드
  const [currentTaskId, setCurrentTaskId] = useState(null); // 현재 편집 중인 Task ID 저장

  // Task 추가 처리 함수
  const handleAddTask = () => {
    if (inputValue.trim() === '') return; // 빈 입력 방지

    const newTask = { id: Date.now(), text: inputValue, isChecked: false, subTasks: [] }; // 새로운 Task 객체
    addTask(newTask); // Task 추가
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

  return (
    <>
      <div>
        <button
          className="w-full h-8 mt-2 p-2 flex items-center hover:text-blue-600 hover:rounded-lg hover:bg-gray-200"
          onClick={() => setOpen(true)} // 모달 열기
        >
          <BsPlusCircleDotted />
          <p className="ml-2">새 목록 만들기</p>
        </button>

        <div className="lists w-64">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="h-8 mt-3 flex items-center hover:rounded-lg hover:bg-gray-200"
            >
              <InputCheck
                checked={task.isChecked} // 체크 상태 유지
                onChange={() => updateTaskCheck(task.id, !task.isChecked)} // 체크 상태 변경
              />
              <p className="w-10/12">
                {task.text.length > 10 ? task.text.slice(0, 10) + '...' : task.text} {/* 제목 표시 */}
              </p>
              <Button
                onClick={() => {
                  setCurrentTaskId(task.id); // 현재 Task ID 설정
                  setInputValue(task.text); // 입력 필드 값 설정
                  setIsEditing(true); // 편집 모드 활성화
                  setOpen(true); // 모달 열기
                }}
              >
                <MdOutlineModeEdit />
              </Button>
              <Button onClick={() => deleteTask(task.id)}> {/* Task 삭제 */}
                <RiDeleteBin5Line />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Task 추가/수정 모달 */}
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <div>
          <p className="font-semibold text-lg text-center mb-4">
            {isEditing ? '목록 수정하기' : '새 목록 만들기'}
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
          <div className="flex justify-around text-center">
            <Button color="red" onClick={() => setOpen(false)}>취소</Button> {/* 모달 닫기 */}
            <Button
              color="green"
              onClick={() => {
                isEditing ? handleUpdateTaskTitle() : handleAddTask(); // Task 추가 또는 수정
              }}
            >
              완료
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default TaskDrawer;
