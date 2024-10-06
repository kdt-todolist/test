import React from 'react';
import { FaBars, FaCalendar, FaCheck, FaCog, FaPortrait, FaPrescriptionBottle, FaQuestionCircle, FaTasks } from 'react-icons/fa';

type HeaderProps = {
  isOpen: boolean;
  toggleDrawer: () => void;
};

export default function TaskHeader({ isOpen, toggleDrawer }: HeaderProps) {
  return (
    <header className="h-14 bg-gray-800 text-white flex items-center justify-between px-4 shadow">
      {/* 왼쪽 영역 (드로어 토글 버튼 및 타이틀) */}
      <div className="flex items-center space-x-4">
        {/* 드로어 토글 버튼 */}
        <button onClick={toggleDrawer} className="text-white p-2 rounded hover:bg-gray-700 focus:outline-none">
          <FaBars size={20} />
        </button>

        {/* 타이틀 (캘린더 아이콘 + 타이틀 텍스트) */}
        <div className="flex items-center space-x-2">
          <FaCheck size={24} className="text-blue-300" />
          <span className="font-semibold text-lg">WTD</span>
        </div>
      </div>

      {/* 중앙 영역 (메뉴 등) */}
      <div className="flex space-x-4">
      </div>

      {/* 오른쪽 영역 (설정, 도움말 아이콘 등) */}
      <div className="flex items-center space-x-4">
        {/* 각종 아이콘 */}
        <FaCog size={20} className="text-white cursor-pointer hover:text-gray-300" />
        <FaPortrait size={20} className="text-white cursor-pointer hover:text-gray-300" />
      </div>
    </header>
  );
}
