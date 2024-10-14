import styled, { css } from "styled-components";
import Button from "./Button";
import { Children } from "react";

const StyledDrawer = styled.div`
  width: ${(p) => p.width}px;
  height: 100vh;
  color: #FFFFFF;
  font-size: 24px;
  font-weight: 600;
  padding: 0px 12px;
  background-color: rgb(59 130 246);
  transition-duration: 0.5s;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
`;

function Drawer(props) {
  const { children, open, active } = props;

  let width;

  {open ? width = 240 : width = 70};

  return (
    <StyledDrawer width={width}>
      <div className="py-3 flex justify-end">
        <Button size="sm" color="indigo" onClick={active}>Open & Close</Button>
      </div>
      {children}
    </StyledDrawer>
  );
}

export default Drawer;