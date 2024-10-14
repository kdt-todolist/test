import { BsPlusCircleDotted } from "react-icons/bs";
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useState } from "react";
import Modal from '../Common/Modal';
import TaskCard from "./TaskCard";

function TaskDrawer() {
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
 
  const getInputValue = () => {
    if (inputValue.trim() === '') return; // 빈 입력 방지
  
    const newTask = { id: Date.now(), text: inputValue, isChecked: true}; // 고유 ID 추가
    setTasks([...tasks, newTask]); // 새 작업 추가
    setInputValue(''); // 입력란 초기화
    setOpen(false); // 모달 닫기
  };

  const handleMouseEnter = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].showButtons = true; // 버튼 보이기
    setTasks(updatedTasks);
  };

  const handleMouseLeave = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].showButtons = false; // 버튼 숨기기
    setTasks(updatedTasks);
  };

  const handleCheckbox = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].isChecked = !updatedTasks[index].isChecked; // 체크 상태 반전
    setTasks(updatedTasks); // 상태 업데이트
  };
  

  const updateTask = () => {
    // 작업 업데이트 로직
    if (inputValue.trim() === '') return; // 빈 입력 방지
    const updatedTasks = tasks.map((task) =>
      task.id === currentTaskId ? { ...task, text: inputValue } : task
    );
    setTasks(updatedTasks);
    setInputValue(''); // 입력란 초기화
    setIsEditing(false); // 편집 모드 종료
    setOpen(false); // 모달 닫기
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id)); // 해당 ID를 가진 작업 삭제
  };

  return (
    <>
      <div className="shadow-lg border-2 rounded-lg bg-gray-100">
        <p className="text-center text-lg font-semibold mt-2">목록</p>
        <button className="w-full h-8 mt-2 p-2 flex items-center hover:text-blue-600 hover:rounded-lg hover:bg-gray-200" onClick={() => setOpen(true)}>
          <BsPlusCircleDotted />
          <p className="ml-2">새 목록 만들기</p>
        </button>
        <div className="lists w-64">
          {tasks.map((task, index) => (
            <div key={task.id} className="h-8 mt-3 flex items-center hover:rounded-lg hover:bg-gray-200"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
            >
              <input type="checkbox" className="ml-2 mr-2" checked={task.isChecked} onChange={()=>handleCheckbox(index)} />
              <p className="w-10/12">{ (task.text.length > 10)? task.text.slice(0,10)+'...' : task.text}</p>
              {task.showButtons && ( // 버튼이 보일 조건
                <>
                  <button className="ml-2 mr-2"
                    onClick={() => {
                      setCurrentTaskId(task.id);
                      setInputValue(task.text); // 입력값 설정
                      setIsEditing(true); // 편집 모드 활성화
                      setOpen(true); // 모달 열기
                    }}>
                    <MdOutlineModeEdit />
                  </button>
                  <button onClick={() => deleteTask(task.id)}><RiDeleteBin5Line /></button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex"> 
        {tasks.map((task) => ( // 목록 추가될 때마다 taskCard 추가하기
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <div>
          <p className="font-semibold text-lg text-center mb-4">{isEditing ? '목록 수정하기' : '새 목록 만들기'}</p>
          <input
            className="border-2 mb-2"
            type="text"
            placeholder="목록 이름 입력"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                isEditing ? updateTask() : getInputValue();
              }
            }}
          />
          <div className="flex justify-around text-center">
            <button className="hover:font-semibold" onClick={() => setOpen(false)}>취소</button>
            <button className="hover:font-semibold hover:text-blue-600" onClick={() => {
              if (isEditing) {
                updateTask(); // 작업 업데이트 로직
              } else {
                getInputValue(); // 새 작업 추가
              }
              setOpen(false);
            }}>
              완료
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default TaskDrawer;
