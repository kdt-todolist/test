import styled, { css } from "styled-components";

// 버튼 기본
const CustomButton = styled.button
`
  ${(p) => p.sizeStyle}
  ${(p) => p.borderStyle}
  ${(p) => p.colorStyle}

  margin: 0;
  border: none;
  cursor: pointer;
  font-family: "Noto Sans KR", sans-serif;
  color: var(--button-color, rgb(255 255 255));
  font-size: var(--button-font-size, 1rem);
  font-weight: var(--button-font-weight, 600);
  padding: var(--button-padding, 10px 20px);
  border-radius: var(--button-radius, 5px);
  background: var(--button-bg-color, rgb(59 130 246));

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
};
// 버튼 사이즈
const SIZES = {
  sm: css`
    --button-font-size: 0.75rem;
    --button-font-weight: 500;
    --button-padding: 5px 10px;
  `,
  md: css`
    --button-font-size: 1rem;
    --button-font-weight: 600;
    --button-padding: 10px 20px;
  `,
  lg: css`
    --button-font-size: 1.25rem;
    --button-font-weight: 700;
    --button-padding: 15px 30px;
  `
};

function Button(props) {
  const { children, size, color, border, onClick } = props;

  const sizeStyle = SIZES[size];
  const colorStyle = COLOR[color];
  const borderStyle = BORDER[border];

  return (
    <StyledButton 
      sizeStyle={sizeStyle}
      colorStyle={colorStyle}
      borderStyle={borderStyle}
      onClick={onClick}
    >
      {children}
    </StyledButton>
  );
}

export default Button;