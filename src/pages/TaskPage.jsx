import React from 'react';
import Drawer from '../components/Common/Drawer';
import TaskDrawer from '../components/Task/TaskDrawer';
import TaskDashboard from '../components/Task/TaskDashboard';

const TaskPage = () => {
  return (
    <div className="flex min-w-full">
      <Drawer>
        <TaskDrawer /> {/* TaskDrawer가 Drawer의 너비에 맞춰짐 */}
      </Drawer>
      <TaskDashboard />
    </div>
  );
};

export default TaskPage;
