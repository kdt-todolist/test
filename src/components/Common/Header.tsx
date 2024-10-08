import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCheckDouble, faSignInAlt, faSignOut, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

interface HeaderProps {
  toggleDrawer: () => void;
  isLoggedIn: boolean;
  openLoginModal: () => void;
  handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleDrawer, isLoggedIn, openLoginModal, handleLogout }) => {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow">
        <button onClick={toggleDrawer} className="text-lg">
            <FontAwesomeIcon icon={faBars} />
        </button>
        <div>
            <h1 className="text-2xl font-semibold">
                <FontAwesomeIcon icon={faCheckDouble} className='mr-2 text-blue-500'/>
                WDT
            </h1>
        </div>
      <div>
        {!isLoggedIn ? (
          <button onClick={openLoginModal} className="text-blue-500">
            <FontAwesomeIcon icon={faSignInAlt} />
          </button>
        ) : (
          <button onClick={handleLogout} className="text-red-500">
            <FontAwesomeIcon icon={faSignOutAlt} />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
