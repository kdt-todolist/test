import { IoCloseCircleOutline } from "react-icons/io5";

const TaskModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  
  return (
    <div onClick={onClose} className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-lg p-20 relative ">
        <button onClick={onClose} className="absolute right-5 top-5 w-20px h-20px">
          <IoCloseCircleOutline />
        </button>
        {children}
      </div>
    </div>
  );
};

export default TaskModal;