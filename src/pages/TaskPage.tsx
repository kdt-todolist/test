import React from 'react';
import Header from '../components/Common/Header';
import Drawer from '../components/Common/Drawer';
import TaskDashboard from '../components/Task/TaskDashboard';

interface DashboardProps {
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
  isLoggedIn: boolean;
  openLoginModal: () => void;
  handleLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ isDrawerOpen, toggleDrawer, isLoggedIn, openLoginModal, handleLogout }) => {
  return (
    <div>
      <Header 
        toggleDrawer={toggleDrawer} 
        isLoggedIn={isLoggedIn} 
        openLoginModal={openLoginModal} 
        handleLogout={handleLogout}  
      />
      <div style={{ display: 'flex' }}>
        {isDrawerOpen && <Drawer />} {/* 드로어 안에 Task 추가 및 리스트 표시 */}
        <TaskDashboard />
      </div>
    </div>
  );
};

export default Dashboard;
