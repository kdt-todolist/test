import { BsPlusCircleDotted } from "react-icons/bs";
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useState, useContext } from "react";
import { TaskContext } from "../../contexts/TaskContext"; // TaskContext에서 필요한 메서드 가져오기
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'; // Drag and Drop을 위한 라이브러리 추가
import Button from "../Common/Button";
import InputCheck from "../Common/InputCheck";
import InputField from "../Common/InputField";
import Modal from '../Common/Modal';

function TaskCard({ task, dragHandleProps }) {
  const { updateSubTaskCheck, updateSubTaskTitle, deleteSubTask, addSubTask, updateSubTaskOrder } = useContext(TaskContext); // TaskContext에서 필요한 메서드 가져오기
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(''); // 서브 태스크 텍스트 입력 값
  const [isEditing, setIsEditing] = useState(false); // 서브 태스크 편집 모드
  const [currentSubTaskId, setCurrentSubTaskId] = useState(null); // 현재 편집 중인 서브 태스크 ID 저장

  // 서브 태스크 추가 처리 함수
  const handleAddSubTask = () => {
    if (inputValue.trim() === '') return; // 빈 입력 방지

    const newSubTask = { id: Date.now(), text: inputValue, isChecked: false };
    addSubTask(task.id, newSubTask); // TaskContext의 addSubTask 호출
    setInputValue(''); // 입력 값 초기화
    setOpen(false); // 모달 닫기
  };

  // 서브 태스크 제목 수정 처리 함수
  const handleUpdateSubTaskTitle = () => {
    if (inputValue.trim() === '') return;

    updateSubTaskTitle(task.id, currentSubTaskId, inputValue); // TaskContext의 updateSubTaskTitle 호출
    setInputValue(''); // 입력 값 초기화
    setIsEditing(false); // 편집 모드 종료
    setOpen(false); // 모달 닫기
  };

  // Drag and Drop 처리 함수
  const handleSubTaskDragEnd = (result) => {
    if (!result.destination) return;

    // 현재 task의 subTasks를 복사해서 순서를 변경
    const reorderedSubTasks = Array.from(task.subTasks);
    const [movedSubTask] = reorderedSubTasks.splice(result.source.index, 1);
    reorderedSubTasks.splice(result.destination.index, 0, movedSubTask);

    // 순서가 변경된 subTasks를 업데이트
    updateSubTaskOrder(task.id, reorderedSubTasks); // 순서 업데이트
  };

  return (
    <>
      <div {...dragHandleProps} className="w-96 h-96 m-4 p-2 bg-white shadow-md rounded-lg hover:shadow-gray-400 overflow-y-auto">
        <h3 className="text-lg font-semibold">{task.text}</h3>

        <Button className="w-40 h-8 mt-2 ml-2 text-blue-600 rounded-full flex items-center" onClick={() => setOpen(true)}>
          <BsPlusCircleDotted />
          <p className="ml-2">할 일 추가</p>
        </Button>

        <DragDropContext onDragEnd={handleSubTaskDragEnd}>
          <Droppable droppableId={`subtask-${task.id}`}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {task.subTasks?.map((subTask, index) => (
                  <Draggable key={subTask.id} draggableId={subTask.id.toString()} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex mt-3 hover:rounded-lg hover:bg-gray-100"
                        style={{
                          ...provided.draggableProps.style,
                          opacity: snapshot.isDragging ? 0.5 : 1,
                        }}
                      >
                        <InputCheck
                          shape="round"
                          checked={subTask.isChecked}
                          onChange={() => updateSubTaskCheck(task.id, subTask.id, !subTask.isChecked)} // 체크 상태 업데이트
                        />
                        <p className="w-10/12">{subTask.text}</p>

                        <Button 
                          className="ml-2 mr-2" 
                          onClick={() => {
                            setCurrentSubTaskId(subTask.id); // 현재 서브 태스크 ID 설정
                            setInputValue(subTask.text); // 입력 필드 값 설정
                            setIsEditing(true); // 편집 모드 활성화
                            setOpen(true); // 모달 열기
                          }}>
                          <MdOutlineModeEdit />
                        </Button>

                        <Button onClick={() => deleteSubTask(task.id, subTask.id)}><RiDeleteBin5Line /></Button>
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

      {/* 서브 태스크 추가 및 수정 모달 */}
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <div>
          <p className="font-semibold text-lg text-center mb-4">
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
          
          <div className="flex justify-around text-center">
            <Button color="green"
              onClick={() => {
              isEditing ? handleUpdateSubTaskTitle() : handleAddSubTask();
              setOpen(false);
            }}>
              완료
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default TaskCard;
