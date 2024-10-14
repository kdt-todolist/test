import styled from "styled-components";
import Button from "./Button";

// 기본 모달 스타일
const StyledModal = styled.div`
  width: ${(props) => props.width || 400}px; /* 기본 너비 추가 */
  height: ${(props) => props.height || 300}px; /* 기본 높이 추가 */
  border-radius: 10px;
  background-color: #FFFFFF;
  position: relative; /* 닫기 버튼 위치를 위한 상대 위치 설정 */
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

const CloseButton = styled(Button)`
  position: absolute;
  top: 10px;
  right: 10px;
`;

function Modal({ children, isOpen, onClose, width, height }) {
  if (!isOpen) return null;

  return (
    <StyledBackdrop onClick={onClose}>
      <StyledModal width={width} height={height} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between w-full p-4">
          <p className="text-xl font-semibold">Modal</p>
          <CloseButton size="sm" color="red" onClick={onClose}>
            &#x2715; {/* Unicode X mark for the close button */}
          </CloseButton>
        </div>
        <div className="text-black text-center">
          {children}
        </div>
      </StyledModal>
    </StyledBackdrop>
  );
}

export default Modal;
