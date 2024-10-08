import React from 'react';
import TaskDrawer from '../Task/TaskDrawer';

const Drawer: React.FC = () => {
  return (
    <aside className="w-72 bg-gray-100 p-4 border-r">
      <TaskDrawer />
    </aside>
  );
};

export default Drawer;
