import React, { useState } from 'react';
import Dashboard from './pages/TaskPage';
import Modal from './components/Common/Modal';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import { TaskProvider } from './contexts/TaskContext';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(true);
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setLoginModalOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const openSignupModal = () => {
    setLoginModalOpen(false);
    setSignupModalOpen(true);
  };

  const openLoginModal = () => {
    setSignupModalOpen(false);
    setLoginModalOpen(true);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <TaskProvider>
      <Dashboard 
        isDrawerOpen={isDrawerOpen} 
        toggleDrawer={toggleDrawer} 
        isLoggedIn={isLoggedIn}
        openLoginModal={openLoginModal}
        handleLogout={handleLogout}
      />
      
      {!isLoggedIn && isLoginModalOpen && (
        <Modal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)}>
          <LoginForm onLogin={handleLogin} onSignupClick={openSignupModal} />
        </Modal>
      )}
      {!isLoggedIn && isSignupModalOpen && (
        <Modal isOpen={isSignupModalOpen} onClose={() => setSignupModalOpen(false)}>
          <SignupForm onSignup={() => setSignupModalOpen(false)} onLoginClick={openLoginModal} />
        </Modal>
      )}
    </TaskProvider>
  );
};

export default App;
