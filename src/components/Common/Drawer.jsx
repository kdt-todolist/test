import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext"; // AuthContext에서 logout 함수 가져오기

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faBars, faDoorClosed, faDoorOpen } from '@fortawesome/free-solid-svg-icons';
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
  const { isAuthenticated, logout } = useContext(AuthContext); // 로그아웃 함수도 가져오기
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

  const handleAuthAction = () => {
    if (isAuthenticated) {
      // 로그아웃 처리
      logout(); // AuthContext에서 제공하는 로그아웃 함수 호출
    } else {
      // 로그인 모달 열기
      setLogin(true);
    }
  };
  
  return (
    <>
      <StyledDrawer width={drawerWidth}>
        { open ? 
          <div className="flex justify-between items-center p-2">
            <div className="items-left">
              <img src="/logo192.png" alt="logo" className="w-16 h-16 mx-4" />
            </div>
            <div className="flex space-x-0">
            <Button 
              size="md"
              color="transparent"
              onClick={handleAuthAction}
            >
              {isAuthenticated ?
              <div>
                <FontAwesomeIcon icon={faDoorOpen} />
                <FontAwesomeIcon icon={faArrowRight} />
                
              </div>
               : 
               <div>
                <FontAwesomeIcon icon={faArrowRight} />
                <FontAwesomeIcon
                    style={{
                      transform: 'rotateY(180deg)'
                    }}
                    icon={faDoorOpen} />
                  </div>
                  }

                </Button>
                <Button 
                  size="md"
                  color="transparent"
                  onClick={toggleDrawer}
                >
                  <FontAwesomeIcon icon={faBars} />
                </Button>
            </div>
          </div>
        : 
          <div className="grid gap-1">
            <Button 
              size="md"
              color="transparent"
              onClick={toggleDrawer}
            >
              <FontAwesomeIcon
              style={{
                padding: '9px'
              }}
              icon={faBars} />
            </Button>
            <Button 
              size="md"
              color="transparent"
              onClick={handleAuthAction}
            >
              {isAuthenticated ? (
                <span>
                  <FontAwesomeIcon icon={faDoorClosed} />
                  <FontAwesomeIcon icon={faArrowRight} />
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'left' }}>
                  <FontAwesomeIcon icon={faArrowRight} />
                  <FontAwesomeIcon
                  style={{
                    transform: 'rotateY(180deg)'
                  }}
                  icon={faDoorOpen} />
                </span>
              )}

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
