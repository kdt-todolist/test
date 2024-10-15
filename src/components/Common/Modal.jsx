import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import styled from "styled-components";
import Button from "./Button";

// 기본 모달 스타일
const StyledModal = styled.div`
  width: ${(props) => props.width || 400}px; /* 기본 너비 추가 */
  height: ${(props) => props.height || 300}px; /* 기본 높이 추가 */
  border-radius: 10px;
  background-color: #FFFFFF;
  
  display: flex;
  position: relative; /* 닫기 버튼 위치를 위한 상대 위치 설정 */
  flex-direction: column;
  align-items: center;
  justify-content: top;
  padding: 20px;
`;

const StyledBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
`;

function Modal({ children, isOpen, closeBtn, onClose, width, height }) {
  if (!isOpen) return null;

  return (
    <StyledBackdrop onClick={onClose}>
      
      <StyledModal width={width} height={height} onClick={(e) => e.stopPropagation()}>
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
        }}>
          { closeBtn ? <Button size="lg" color="x" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </Button> : null }
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          color: '#000000',
        }}>
          {children}
        </div>
      </StyledModal>

    </StyledBackdrop>
  );
}

export default Modal;
