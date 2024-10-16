import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import styled from "styled-components";
import Modal from "./Modal";
import Button from "./Button";
import LoginFrom from "../Auth/LoginForm";

const StyledDrawer = styled.div`
  width: ${(p) => p.width}px;
  height: 100dvh;
  color: #FFFFFF;
  font-weight: 600;
  background-color: rgb(59 130 246);
  transition: all 0.3s;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
`;

function Drawer({ children }) {
  const [open, setOpen] = useState(true);
  const [login, setLogin] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // 창 크기에 맞춰 동적으로 너비를 설정
  const updateWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };

  // 창 크기 변경 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener('resize', updateWindowWidth);
    return () => window.removeEventListener('resize', updateWindowWidth);
  }, []);

  // Drawer 너비 설정: 창 너비에 비례하도록 설정
  const drawerWidth = open ? Math.max(windowWidth * 0.18, 300) : 70; // 창 너비의 30% 또는 최대 300px

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <StyledDrawer width={drawerWidth}>
        { open ? 
          <div className="flex justify-end p-2">
            <Button 
              size="md"
              color="transparent"
              onClick={() => setLogin(true)}
            >
              <FontAwesomeIcon icon={faRightToBracket} />
            </Button>
            <Button 
              size="md"
              color="transparent"
              onClick={toggleDrawer}
            >
              <FontAwesomeIcon icon={faBars} />
            </Button>
          </div>
        : 
          <div className="grid gap-5 p-2">
            <Button 
              size="md"
              color="transparent"
              onClick={toggleDrawer}
            >
              <FontAwesomeIcon icon={faBars} />
            </Button>
            <Button 
              size="md"
              color="transparent"
              onClick={() => setLogin(true)}
            >
              <FontAwesomeIcon icon={faRightToBracket} />
            </Button>
          </div>
        }
        
        {open && children}
      </StyledDrawer>
      <Modal 
        width={300}
        height={250}
        isOpen={login}
        onClose={() => setLogin(false)}
      >
        <LoginFrom />
      </Modal>
    </>
    
  );
}

export default Drawer;