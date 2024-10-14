import React from 'react';
import Drawer from '../components/Common/Drawer';
import TaskDrawer from '../components/Task/TaskDrawer';
import TaskDashboard from '../components/Task/TaskDashboard';
import TaskModal from '../components/Task/TaskModal';

const TaskPage = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Drawer>
        <TaskDrawer /> {/* TaskDrawer가 Drawer의 너비에 맞춰짐 */}
      </Drawer>
      <TaskDashboard />
      <TaskModal />
    </div>
  );
};

export default TaskPage;
