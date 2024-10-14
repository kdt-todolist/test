import { BsPlusCircleDotted } from "react-icons/bs";
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
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

  return (
    <>
      <div className="w-96 h-96 m-4 p-2 bg-white shadow-md rounded-lg hover:shadow-gray-400 overflow-y-auto">
        {/* Only this part (header) will be draggable for task order */}
        <div {...dragHandleProps} className="flex justify-between items-center cursor-pointer p-2 rounded-t-lg">
          <h3 className="text-lg font-semibold">{task.text}</h3>
        </div>

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
                          onChange={() => updateSubTaskCheck(task.id, subTask.id, !subTask.isChecked)}
                        />
                        <p className="w-10/12">{subTask.text}</p>

                        <Button
                          className="ml-2 mr-2"
                          onClick={() => {
                            setCurrentSubTaskId(subTask.id);
                            setInputValue(subTask.text);
                            setIsEditing(true);
                            setOpen(true);
                          }}
                        >
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

      {/* Modal for adding or editing subtasks */}
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
            <Button
              color="green"
              onClick={() => {
                isEditing ? handleUpdateSubTaskTitle() : handleAddSubTask();
                setOpen(false);
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

export default TaskCard;
