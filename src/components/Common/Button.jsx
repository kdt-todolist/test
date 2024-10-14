import styled, { css } from "styled-components";

// 버튼 기본
const StyledButton = styled.button
`
  ${(p) => p.sizestyle}
  ${(p) => p.colorstyle}
  ${(p) => p.borderstyle}

  margin: 0;
  border: none;
  cursor: pointer;
  font-family: "Noto Sans KR", sans-serif;
  color: var(--button-color, rgb(255 255 255));
  font-size: var(--button-font-size, 16px);
  font-weight: var(--button-font-weight, 600);
  padding: var(--button-padding, 10px 20px);
  border-radius: var(--button-radius, 5px);
  background: var(--button-bg-color, rgb(59 130 246));
  box-shadow: var(--button-box-shadow, rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px);

  &:active, &:hover, &:focus {
    background: var(--button-hover-bg-color, rgb(29 78 216));
  }
`;
// 버튼 테두리
const BORDER = {
  pill: css`
    --button-radius: 999px;
  `,
}
// 버튼 색상
const COLOR = {
  red: css`
    --button-bg-color: rgb(239 68 68);
    --button-hover-bg-color: rgb(185 28 28);
  `,
  green: css`
    --button-bg-color: rgb(34 197 94);
    --button-hover-bg-color: rgb(21 128 61);
  `,
  yellow: css`
    --button-bg-color: rgb(234 179 8);
    --button-hover-bg-color: rgb(161 98 7);
  `,
  indigo: css`
    --button-bg-color: rgb(99 102 241);
    --button-hover-bg-color: rgb(67 56 202);
  `,
  violet: css`
    --button-bg-color: rgb(139 92 246);
    --button-hover-bg-color: rgb(109 40 217);
  `,
  gray: css`
    --button-bg-color: rgb(107 114 128);
    --button-hover-bg-color: rgb(55 65 81);
  `,
  transparent: css`
    --button-bg-color: transparent;
    --button-hover-bg-color: transparent;
    --button-box-shadow: none;
    --button-color: white;
  `,
  x: css`
    --button-bg-color: transparent;
    --button-hover-bg-color: transparent;
    --button-color: rgb(239 68 68);
    --button-hover-color: rgb(185 28 28);
    --button-box-shadow: none;
  `,
};
// 버튼 사이즈
const SIZES = {
  sm: css`
    --button-font-size: 12px;
    --button-font-weight: 600;
    --button-padding: 7.5px 10px;
  `,
  md: css`
    --button-font-size: 16px;
    --button-font-weight: 600;
    --button-padding: 10px 20px;
  `,
  lg: css`
    --button-font-size: 18px;
    --button-font-weight: 700;
    --button-padding: 15px 30px;
  `
};

function Button(props) {
  const { children, size, color, border, onClick } = props;

  const sizestyle = SIZES[size];
  const colorstyle = COLOR[color];
  const borderstyle = BORDER[border];

  return (
    <StyledButton 
      sizestyle={sizestyle}
      colorstyle={colorstyle}
      borderstyle={borderstyle}
      onClick={onClick}
    >
      {children}
    </StyledButton>
  );
}

export default Button;