import styled from "styled-components";
import Button from "./Button";

// 기본 모달
const StyledModal = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  border-radius: 10px;
  background-color: #FFFFFF;
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
  place-items: center;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
`;

function Modal(props) {

  const { children, open, active, width, height } = props;

  return (
    <>
    {open ? 
      <StyledBackdrop> 
        <StyledModal width={width} height={height}>
          <div className="flex justify-between p-4">
            <p className="text-xl font-semibold">Modal</p>
            <Button size="sm" color="red" onClick={active}>X</Button>
          </div>
          {children}
        </StyledModal>
      </StyledBackdrop>
    : null}
    </>
    
  );
}

export default Modal;